import { useEffect } from 'react';
import { serverAPI } from '../lib/api';
import { socketClient } from '../lib/socket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { auth } from '../lib/firebase';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import ChatArea from '../components/ChatArea';
import MemberList from '../components/MemberList';

export default function Home() {
  const { token, setToken } = useAuthStore();
  const { setServers, addMessage, updateMessage, deleteMessage } = useChatStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const newToken = await firebaseUser.getIdToken();
        setToken(newToken);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!token) return;

    const socket = socketClient.connect(token);

    socket.on('message:new', (message) => {
      addMessage(message);
    });

    socket.on('message:updated', (message) => {
      updateMessage(message);
    });

    socket.on('message:deleted', ({ messageId, channelId }) => {
      deleteMessage(messageId, channelId);
    });

    socket.on('user:status', ({ userId, status }) => {
      console.log(`User ${userId} is now ${status}`);
    });

    loadServers();

    return () => {
      socketClient.disconnect();
    };
  }, [token]);

  const loadServers = async () => {
    try {
      const data = await serverAPI.getAll();
      setServers(data);
    } catch (error) {
      console.error('Failed to load servers:', error);
    }
  };

  return (
    <div className="flex h-screen bg-discord-darkest">
      <ServerList />
      <ChannelList />
      <ChatArea />
      <MemberList />
    </div>
  );
}
