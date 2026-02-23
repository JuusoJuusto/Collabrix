import { auth, db, realtimeDb } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { ref, push, onValue, off, query as rtQuery, orderByChild, limitToLast, get, set } from 'firebase/database';

// Use Firebase directly instead of Railway API
const useFirebaseDirectly = true;

// Cache for faster loading
const cache = {
  servers: null as any,
  lastFetch: 0,
  cacheDuration: 30000 // 30 seconds
};

async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

// Firebase direct operations
export const serverAPI = {
  getAll: async () => {
    if (!useFirebaseDirectly) return [];
    
    const user = auth.currentUser;
    if (!user) return []; // Return immediately if not authenticated

    // Return cached data if available and fresh
    if (cache.servers && Date.now() - cache.lastFetch < cache.cacheDuration) {
      return cache.servers;
    }

    try {
      const serversRef = collection(db, 'servers');
      const snapshot = await getDocs(serversRef);
      
      const servers = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const serverData = { id: docSnap.id, ...docSnap.data() };
          
          // Get channels in parallel
          const channelsRef = collection(db, 'servers', docSnap.id, 'channels');
          const channelsSnap = await getDocs(query(channelsRef, orderBy('position')));
          const channels = channelsSnap.docs.map(c => ({ id: c.id, ...c.data() }));
          
          return { ...serverData, channels, members: [] };
        })
      );
      
      // Cache the results
      cache.servers = servers;
      cache.lastFetch = Date.now();
      
      return servers;
    } catch (error) {
      return cache.servers || []; // Return cached data on error
    }
  },

  getOne: async (id: string) => {
    if (!useFirebaseDirectly) return null;
    
    const serverDoc = await getDoc(doc(db, 'servers', id));
    if (!serverDoc.exists()) throw new Error('Server not found');
    
    const channelsRef = collection(db, 'servers', id, 'channels');
    const channelsSnap = await getDocs(query(channelsRef, orderBy('position')));
    const channels = channelsSnap.docs.map(c => ({ id: c.id, ...c.data() }));
    
    return { id: serverDoc.id, ...serverDoc.data(), channels, members: [] };
  },

  create: async (data: { name: string; description?: string; icon?: string }) => {
    if (!useFirebaseDirectly) throw new Error('Server creation requires Firebase');
    
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    try {
      const serverData = {
        name: data.name,
        description: data.description || null,
        icon: data.icon || null,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const serverRef = await addDoc(collection(db, 'servers'), serverData);
      const serverId = serverRef.id;

      // Create default channels in parallel
      const channelsRef = collection(db, 'servers', serverId, 'channels');
      
      const [generalRef, voiceRef] = await Promise.all([
        addDoc(channelsRef, {
          name: 'general',
          type: 'TEXT',
          serverId,
          position: 0,
          createdAt: new Date().toISOString()
        }),
        addDoc(channelsRef, {
          name: 'General Voice',
          type: 'VOICE',
          serverId,
          position: 1,
          createdAt: new Date().toISOString()
        })
      ]);

      const newServer = {
        id: serverId,
        ...serverData,
        channels: [
          { id: generalRef.id, name: 'general', type: 'TEXT', serverId, position: 0 },
          { id: voiceRef.id, name: 'General Voice', type: 'VOICE', serverId, position: 1 }
        ],
        members: []
      };

      // Invalidate cache
      cache.servers = null;

      return newServer;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create server');
    }
  },

  join: async (id: string) => {
    if (!useFirebaseDirectly) return { message: 'Joined server' };
    
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const memberRef = doc(db, 'servers', id, 'members', user.uid);
    await setDoc(memberRef, {
      userId: user.uid,
      joinedAt: new Date().toISOString(),
      nickname: null
    });

    cache.servers = null; // Invalidate cache
    return { message: 'Joined server' };
  },

  leave: async (id: string) => {
    cache.servers = null; // Invalidate cache
    return { message: 'Left server' };
  }
};

export const channelAPI = {
  getMessages: async (channelId: string, limit = 50) => {
    if (!useFirebaseDirectly) return [];
    
    try {
      // Use Realtime Database for messages
      const messagesRef = ref(realtimeDb, `messages/${channelId}`);
      const messagesQuery = rtQuery(messagesRef, orderByChild('createdAt'), limitToLast(limit));
      
      const snapshot = await get(messagesQuery);
      const messages: any[] = [];
      
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return messages;
    } catch (error) {
      return [];
    }
  },

  // Subscribe to real-time messages
  subscribeToMessages: (channelId: string, callback: (messages: any[]) => void) => {
    const messagesRef = ref(realtimeDb, `messages/${channelId}`);
    const messagesQuery = rtQuery(messagesRef, orderByChild('createdAt'), limitToLast(50));
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(messages);
    });
    
    return () => off(messagesRef);
  },

  sendMessage: async (channelId: string, content: string) => {
    if (!useFirebaseDirectly) throw new Error('Message sending requires Firebase');
    
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const messagesRef = ref(realtimeDb, `messages/${channelId}`);
    const newMessageRef = push(messagesRef);
    
    const message = {
      content,
      channelId,
      author: {
        id: user.uid,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        avatar: user.photoURL || null
      },
      createdAt: Date.now(),
      edited: false
    };

    // Write to Realtime Database
    await set(newMessageRef, message);
    return { id: newMessageRef.key, ...message };
  },

  create: async (data: { name: string; type: string; serverId: string; topic?: string }) => {
    if (!useFirebaseDirectly) throw new Error('Channel creation requires Firebase');
    
    const channelData = {
      ...data,
      position: 0,
      createdAt: new Date().toISOString()
    };

    const channelsRef = collection(db, 'servers', data.serverId, 'channels');
    const channelRef = await addDoc(channelsRef, channelData);

    return { id: channelRef.id, ...channelData };
  }
};

export const messageAPI = {
  edit: async (messageId: string, content: string) => {
    return { message: 'Message edited' };
  },
  delete: async (messageId: string) => {
    return { message: 'Message deleted' };
  },
  addReaction: async (messageId: string, emoji: string) => {
    return { message: 'Reaction added' };
  }
};

export const userAPI = {
  getProfile: async (userId: string) => {
    if (!useFirebaseDirectly) return null;
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    
    return { id: userDoc.id, ...userDoc.data() };
  },
  
  updateProfile: async (data: { displayName?: string; bio?: string; avatar?: string; status?: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { message: 'Profile updated' };
  }
};

export const dmAPI = {
  getAll: async () => {
    if (!useFirebaseDirectly) return [];
    
    const user = auth.currentUser;
    if (!user) return [];

    try {
      // Get DMs from Realtime Database
      const dmsRef = ref(realtimeDb, `directMessages/${user.uid}`);
      const snapshot = await get(dmsRef);
      
      const conversations: any[] = [];
      snapshot.forEach((childSnapshot) => {
        conversations.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return conversations;
    } catch (error) {
      return [];
    }
  },

  // Subscribe to real-time DMs
  subscribeToDMs: (userId: string, callback: (messages: any[]) => void) => {
    const dmsRef = ref(realtimeDb, `directMessages/${userId}`);
    
    const unsubscribe = onValue(dmsRef, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(messages);
    });
    
    return () => off(dmsRef);
  },

  // Get messages for a specific DM conversation
  getMessages: async (otherUserId: string, limit = 50) => {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const conversationId = [user.uid, otherUserId].sort().join('_');
      const messagesRef = ref(realtimeDb, `dmMessages/${conversationId}`);
      const messagesQuery = rtQuery(messagesRef, orderByChild('createdAt'), limitToLast(limit));
      
      const snapshot = await get(messagesQuery);
      const messages: any[] = [];
      
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return messages;
    } catch (error) {
      return [];
    }
  },

  // Subscribe to messages in a DM conversation
  subscribeToConversation: (otherUserId: string, callback: (messages: any[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const conversationId = [user.uid, otherUserId].sort().join('_');
    const messagesRef = ref(realtimeDb, `dmMessages/${conversationId}`);
    const messagesQuery = rtQuery(messagesRef, orderByChild('createdAt'), limitToLast(50));
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      callback(messages);
    });
    
    return () => off(messagesRef);
  },

  send: async (data: { receiverId: string; content: string }) => {
    if (!useFirebaseDirectly) throw new Error('DM sending requires Firebase');
    
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const conversationId = [user.uid, data.receiverId].sort().join('_');
    const messagesRef = ref(realtimeDb, `dmMessages/${conversationId}`);
    const newMessageRef = push(messagesRef);
    
    const message = {
      content: data.content,
      senderId: user.uid,
      receiverId: data.receiverId,
      author: {
        id: user.uid,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        avatar: user.photoURL || null
      },
      createdAt: Date.now(),
      read: false
    };

    // Write to Realtime Database
    await set(newMessageRef, message);

    // Update conversation metadata for both users
    const conversationData = {
      lastMessage: data.content,
      lastMessageAt: Date.now(),
      participants: [user.uid, data.receiverId]
    };

    await set(ref(realtimeDb, `directMessages/${user.uid}/${data.receiverId}`), {
      ...conversationData,
      otherUserId: data.receiverId
    });

    await set(ref(realtimeDb, `directMessages/${data.receiverId}/${user.uid}`), {
      ...conversationData,
      otherUserId: user.uid
    });

    return { id: newMessageRef.key, ...message };
  }
};
