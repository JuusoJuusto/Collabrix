import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { serverAPI } from '../lib/api';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ServerList() {
  const { servers, currentServer, setCurrentServer, addServer, setServers } = useChatStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Optimistic update - add server immediately to UI
      const tempId = `temp-${Date.now()}`;
      const optimisticServer = {
        id: tempId,
        name: serverName,
        description: serverDescription || null,
        icon: null,
        ownerId: 'temp',
        channels: [
          { id: 'temp-1', name: 'general', type: 'TEXT' as const, position: 0 },
          { id: 'temp-2', name: 'General Voice', type: 'VOICE' as const, position: 1 }
        ],
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to UI immediately
      addServer(optimisticServer);
      setCurrentServer(optimisticServer);
      setShowCreateModal(false);
      setServerName('');
      setServerDescription('');
      setLoading(false);
      
      // Create in Firebase in background
      serverAPI.create({ 
        name: serverName,
        description: serverDescription || undefined
      }).then((realServer) => {
        // Replace temp server with real one
        const updatedServers = servers.map(s => 
          s.id === tempId ? realServer : s
        );
        setServers(updatedServers);
        setCurrentServer(realServer);
      }).catch((error: any) => {
        // Remove temp server on error
        const filteredServers = servers.filter(s => s.id !== tempId);
        setServers(filteredServers);
        setCurrentServer(null);
        setError(error.message || 'Failed to create server');
      });
      
    } catch (error: any) {
      setLoading(false);
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError(error.message || 'Failed to create server. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="w-18 bg-[#1a1a1a] flex flex-col items-center py-3 space-y-2 overflow-y-auto border-r border-[#2a2a2a]">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setCurrentServer(server)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition text-sm ${
              currentServer?.id === server.id
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-300 hover:bg-blue-600 hover:text-white'
            }`}
            title={server.name}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-full h-full rounded-full" />
            ) : (
              server.name.substring(0, 2).toUpperCase()
            )}
          </button>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 rounded-full bg-[#2a2a2a] text-green-500 hover:bg-green-600 hover:text-white transition flex items-center justify-center"
          title="Create Server"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => !loading && setShowCreateModal(false)}>
          <div className="bg-[#232323] rounded-xl border border-[#3a3a3a] p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Create Server</h2>
              <p className="text-gray-400 text-sm">Give your server a name and description</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateServer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Server Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="My Awesome Server"
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                  required
                  maxLength={100}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={serverDescription}
                  onChange={(e) => setServerDescription(e.target.value)}
                  placeholder="What's your server about?"
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] text-white text-sm rounded-lg border border-[#3a3a3a] focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 resize-none"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">{serverDescription.length}/500</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Server'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#2a2a2a] text-white text-sm rounded-lg font-medium hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
