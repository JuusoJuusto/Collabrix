import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverAPI } from '../lib/api';
import { socketClient } from '../lib/socket';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import ServerList from '../components/ServerList';
import ChannelList from '../components/ChannelList';
import ChatArea from '../components/ChatArea';
import MemberList from '../components/MemberList';
import FriendsList from '../components/FriendsList';
import VoiceChat from '../components/VoiceChat';
import LoadingScreen from '../components/LoadingScreen';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import UserSettings from '../components/UserSettings';

export default function Home() {
  const navigate = useNavigate();
  const { token, user, setToken, clearAuth } = useAuthStore();
  const { setServers, currentServer, addMessage, updateMessage, deleteMessage } = useChatStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const newToken = await firebaseUser.getIdToken();
          setToken(newToken);
        } catch (err) {
          // Token fetch failed
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
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
      // User status updated
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
      setError('');
    } catch (error: any) {
      // Don't show error if it's just a connection issue - user can still create servers
      if (!error.message?.includes('Failed to fetch')) {
        setError('Server connection issue. You can still create servers locally.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearAuth();
      socketClient.disconnect();
      navigate('/login');
    } catch (err) {
      // Logout error
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-discord-darkest">
      <ServerList />
      
      {/* Friends Button */}
      <div className="w-60 bg-discord-darker flex flex-col">
        <button
          onClick={() => setShowFriends(!showFriends)}
          className={`h-12 px-4 flex items-center gap-3 border-b border-discord-darkest hover:bg-discord-dark transition ${showFriends ? 'bg-discord-dark' : ''}`}
        >
          <UserGroupIcon className="w-5 h-5 text-gray-400" />
          <span className="text-white font-semibold">Friends</span>
        </button>
        <ChannelList />
      </div>

      {showFriends ? (
        <>
          <FriendsList />
          <div className="w-60 bg-discord-darker border-l border-discord-darkest p-4">
            <h3 className="text-gray-400 text-sm font-semibold uppercase mb-4">Active Now</h3>
            <p className="text-gray-500 text-sm text-center py-8">No one is active right now</p>
          </div>
        </>
      ) : currentServer ? (
        <>
          <ChatArea />
          <MemberList />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-discord-dark">
          <div className="text-center">
            <UserGroupIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Collabrix!</h2>
            <p className="text-gray-400 mb-6">Select a server or view your friends to get started</p>
            <button
              onClick={() => setShowFriends(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View Friends
            </button>
          </div>
        </div>
      )}

      {/* User Menu Bar */}
      <div className="fixed bottom-0 left-0 w-72 h-14 bg-discord-darker border-t border-discord-darkest flex items-center px-2 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.displayName?.substring(0, 2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">@{user?.username || 'user'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-discord-dark rounded transition"
            title="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-discord-dark rounded transition"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-yellow-200 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-yellow-400 hover:text-yellow-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Voice Chat */}
      <VoiceChat />
    </div>
  );
}
