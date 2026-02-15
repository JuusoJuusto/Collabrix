import { useState, useEffect } from 'react';
import { UserGroupIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

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

export default function FriendsList() {
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'pending' | 'add'>('online');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demo
  useEffect(() => {
    setFriends([
      { id: '1', username: 'user1', displayName: 'User One', status: 'ONLINE' },
      { id: '2', username: 'user2', displayName: 'User Two', status: 'OFFLINE' },
      { id: '3', username: 'user3', displayName: 'User Three', status: 'IDLE' },
    ]);
  }, []);

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

  const filteredFriends = friends.filter(friend => {
    if (activeTab === 'online') return friend.status === 'ONLINE';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-discord-dark">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shadow-md border-b border-discord-darkest">
        <UserGroupIcon className="w-6 h-6 text-gray-400 mr-3" />
        <h2 className="font-semibold text-white">Friends</h2>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-discord-darkest flex items-center gap-4">
        <button
          onClick={() => setActiveTab('online')}
          className={`px-3 py-1 rounded ${activeTab === 'online' ? 'bg-discord-gray text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Online
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded ${activeTab === 'all' ? 'bg-discord-gray text-white' : 'text-gray-400 hover:text-white'}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1 rounded ${activeTab === 'pending' ? 'bg-discord-gray text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Pending {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`px-3 py-1 rounded ${activeTab === 'add' ? 'bg-green-600 text-white' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}
        >
          Add Friend
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'add' ? (
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
                    <button className="p-2 bg-discord-gray text-white rounded hover:bg-discord-darkest transition" title="Message">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
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
