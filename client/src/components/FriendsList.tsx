import { useState, useEffect } from 'react';
import { UserGroupIcon, CheckIcon, XMarkIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { dmAPI } from '../lib/api';

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND';
}

interface FriendRequest {
  id: string;
  from: Friend;
  createdAt: string;
}

interface DMConversation {
  id: string;
  otherUserId: string;
  lastMessage: string;
  lastMessageAt: number;
}

interface FriendsListProps {
  onOpenDM?: (userId: string) => void;
}

export default function FriendsList({ onOpenDM }: FriendsListProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add' | 'messages'>('online');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [dmConversations, setDmConversations] = useState<DMConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo
  useEffect(() => {
    setFriends([
      { id: '1', username: 'user1', displayName: 'User One', status: 'ONLINE' },
      { id: '2', username: 'user2', displayName: 'User Two', status: 'OFFLINE' },
      { id: '3', username: 'user3', displayName: 'User Three', status: 'IDLE' },
    ]);

    // Load DM conversations
    loadDMConversations();
  }, []);

  const loadDMConversations = async () => {
    try {
      const conversations = await dmAPI.getAll();
      setDmConversations(conversations);
    } catch (error) {
      console.error('Failed to load DM conversations:', error);
    }
  };

  const handleAddFriend = async () => {
    if (!searchQuery.trim()) return;
    alert(`Friend request sent to: ${searchQuery}`);
    setSearchQuery('');
  };

  const handleAcceptRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    alert('Friend request accepted!');
  };

  const handleRejectRequest = (requestId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleOpenDM = (userId: string) => {
    if (onOpenDM) {
      onOpenDM(userId);
    }
  };

  const filteredFriends = friends.filter(friend => {
    if (activeTab === 'online') return friend.status === 'ONLINE';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-discord-dark">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shadow-md border-b border-discord-darkest bg-[#313338]">
        <UserGroupIcon className="w-6 h-6 text-[#80848e] mr-3" />
        <h2 className="font-semibold text-white">Friends</h2>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-discord-darkest flex items-center gap-2 bg-[#2b2d31]">
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${activeTab === 'messages' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:text-white hover:bg-[#35373c]'}`}
        >
          Messages {dmConversations.length > 0 && `(${dmConversations.length})`}
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${activeTab === 'online' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:text-white hover:bg-[#35373c]'}`}
        >
          Online
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${activeTab === 'all' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:text-white hover:bg-[#35373c]'}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${activeTab === 'pending' ? 'bg-[#404249] text-white' : 'text-gray-400 hover:text-white hover:bg-[#35373c]'}`}
        >
          Pending {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition ${activeTab === 'add' ? 'bg-[#23a559] text-white' : 'bg-[#23a559]/20 text-[#23a559] hover:bg-[#23a559]/30'}`}
        >
          Add Friend
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'messages' ? (
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
              Direct Messages — {dmConversations.length}
            </h3>
            {dmConversations.length === 0 ? (
              <div className="text-center py-12">
                <ChatBubbleLeftIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No messages yet</p>
                <p className="text-sm text-gray-500 mt-1">Start a conversation with a friend!</p>
              </div>
            ) : (
              dmConversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => handleOpenDM(conversation.otherUserId)}
                  className="w-full flex items-center gap-3 p-3 bg-discord-darker rounded-lg hover:bg-discord-gray transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-white font-medium truncate">User {conversation.otherUserId.substring(0, 8)}</p>
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(conversation.lastMessageAt).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        ) : activeTab === 'add' ? (
          <div className="max-w-2xl">
            <h3 className="text-white font-semibold mb-2">Add Friend</h3>
            <p className="text-gray-400 text-sm mb-4">
              You can add friends with their username.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username#0000"
                className="flex-1 px-4 py-3 bg-discord-darkest text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
              />
              <button
                onClick={handleAddFriend}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Send Request
              </button>
            </div>
          </div>
        ) : activeTab === 'pending' ? (
          <div className="space-y-2">
            {pendingRequests.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No pending friend requests</p>
            ) : (
              pendingRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-discord-darker rounded-lg hover:bg-discord-gray transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                      {request.from.displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{request.from.displayName}</p>
                      <p className="text-sm text-gray-400">@{request.from.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                      title="Accept"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      title="Reject"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-gray-400 text-sm font-semibold uppercase mb-2">
              {activeTab === 'online' ? 'Online' : 'All Friends'} — {filteredFriends.length}
            </h3>
            {filteredFriends.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {activeTab === 'online' ? 'No friends online' : 'No friends yet'}
              </p>
            ) : (
              filteredFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-3 bg-discord-darker rounded-lg hover:bg-discord-gray transition group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {friend.avatar ? (
                          <img src={friend.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          friend.displayName.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-discord-darker ${
                        friend.status === 'ONLINE' ? 'bg-green-500' :
                        friend.status === 'IDLE' ? 'bg-yellow-500' :
                        friend.status === 'DND' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{friend.displayName}</p>
                      <p className="text-sm text-gray-400">
                        {friend.status === 'ONLINE' ? 'Online' :
                         friend.status === 'IDLE' ? 'Idle' :
                         friend.status === 'DND' ? 'Do Not Disturb' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => handleOpenDM(friend.id)}
                      className="p-2 bg-discord-gray text-white rounded hover:bg-discord-darkest transition" 
                      title="Message"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-discord-gray text-white rounded hover:bg-discord-darkest transition" title="More">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
