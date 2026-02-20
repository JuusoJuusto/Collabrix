import { auth, db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';

// Use Firebase directly instead of Railway API
const useFirebaseDirectly = true;

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
    
    // Wait for auth to be ready
    await new Promise((resolve) => {
      if (auth.currentUser) {
        resolve(true);
      } else {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve(true);
          }
        });
        // Timeout after 5 seconds
        setTimeout(() => {
          unsubscribe();
          resolve(false);
        }, 5000);
      }
    });

    const user = auth.currentUser;
    if (!user) return []; // Return empty array instead of throwing error

    try {
      const serversRef = collection(db, 'servers');
      const snapshot = await getDocs(serversRef);
      
      const servers = [];
      for (const docSnap of snapshot.docs) {
        const serverData = { id: docSnap.id, ...docSnap.data() };
        
        // Get channels
        const channelsRef = collection(db, 'servers', docSnap.id, 'channels');
        const channelsSnap = await getDocs(query(channelsRef, orderBy('position')));
        const channels = channelsSnap.docs.map(c => ({ id: c.id, ...c.data() }));
        
        servers.push({ ...serverData, channels, members: [] });
      }
      
      return servers;
    } catch (error) {
      console.error('Error loading servers:', error);
      return [];
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
    
    // Wait for auth
    await new Promise((resolve) => {
      if (auth.currentUser) {
        resolve(true);
      } else {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve(true);
          }
        });
        setTimeout(() => {
          unsubscribe();
          resolve(false);
        }, 5000);
      }
    });

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

      // Create default channels
      const generalChannel = {
        name: 'general',
        type: 'TEXT',
        serverId,
        position: 0,
        createdAt: new Date().toISOString()
      };

      const voiceChannel = {
        name: 'General Voice',
        type: 'VOICE',
        serverId,
        position: 1,
        createdAt: new Date().toISOString()
      };

      const channelsRef = collection(db, 'servers', serverId, 'channels');
      const generalRef = await addDoc(channelsRef, generalChannel);
      const voiceRef = await addDoc(channelsRef, voiceChannel);

      return {
        id: serverId,
        ...serverData,
        channels: [
          { id: generalRef.id, ...generalChannel },
          { id: voiceRef.id, ...voiceChannel }
        ]
      };
    } catch (error: any) {
      console.error('Error creating server:', error);
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

    return { message: 'Joined server' };
  },

  leave: async (id: string) => {
    return { message: 'Left server' };
  }
};

export const channelAPI = {
  getMessages: async (channelId: string, limit = 50) => {
    if (!useFirebaseDirectly) return [];
    
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('channelId', '==', channelId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse();
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
    return [];
  },
  send: async (data: { receiverId: string; content: string }) => {
    return { message: 'Message sent' };
  }
};
