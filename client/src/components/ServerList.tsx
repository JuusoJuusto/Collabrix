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
      
      addServer(optimisticServer);
      setCurrentServer(optimisticServer);
      setShowCreateModal(false);
      setServerName('');
      setServerDescription('');
      setLoading(false);
      
      serverAPI.create({ 
        name: serverName,
        description: serverDescription || undefined
      }).then((realServer) => {
        const updatedServers = servers.map(s => 
          s.id === tempId ? realServer : s
        );
        setServers(updatedServers);
        setCurrentServer(realServer);
      }).catch((error: any) => {
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
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 space-y-2 overflow-y-auto">
        {/* Home Button */}
        <button
          onClick={() => setCurrentServer(null)}
          className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center font-semibold transition-all duration-200 ${
            !currentServer
              ? 'bg-[#5865f2] text-white rounded-[16px]'
              : 'bg-[#313338] text-[#06c755] hover:bg-[#5865f2] hover:text-white'
          }`}
          title="Home"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </button>

        <div className="w-8 h-[2px] bg-[#35363c] rounded-full" />

        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setCurrentServer(server)}
            className={`relative w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center font-semibold transition-all duration-200 text-sm group ${
              currentServer?.id === server.id
                ? 'bg-[#5865f2] text-white rounded-[16px]'
                : 'bg-[#313338] text-[#dbdee1] hover:bg-[#5865f2] hover:text-white'
            }`}
            title={server.name}
          >
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-full h-full rounded-[24px] group-hover:rounded-[16px] transition-all duration-200" />
            ) : (
              server.name.substring(0, 2).toUpperCase()
            )}
            {currentServer?.id === server.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-10 bg-white rounded-r" />
            )}
          </button>
        ))}

        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] text-[#23a559] hover:bg-[#23a559] hover:text-white transition-all duration-200 flex items-center justify-center group"
          title="Add a Server"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => !loading && setShowCreateModal(false)}>
          <div className="bg-[#313338] rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Create a server</h2>
              <p className="text-[#b5bac1] text-sm mb-6">
                Your server is where you and your friends hang out. Make yours and start talking.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-[#f23f43]/10 border border-[#f23f43]/50 rounded">
                  <p className="text-[#f23f43] text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleCreateServer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">
                    Server Name <span className="text-[#f23f43]">*</span>
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="My Awesome Server"
                    className="w-full px-3 py-2.5 bg-[#1e1f22] text-white text-sm rounded border-none focus:outline-none focus:ring-1 focus:ring-[#00a8fc] placeholder-[#6d6f78]"
                    required
                    maxLength={100}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    placeholder="What's your server about?"
                    className="w-full px-3 py-2.5 bg-[#1e1f22] text-white text-sm rounded border-none focus:outline-none focus:ring-1 focus:ring-[#00a8fc] placeholder-[#6d6f78] resize-none"
                    rows={3}
                    maxLength={500}
                    disabled={loading}
                  />
                  <p className="text-xs text-[#949ba4] mt-1.5">{serverDescription.length}/500</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                    className="flex-1 py-3 text-white text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-[#5865f2] text-white text-sm rounded font-medium hover:bg-[#4752c4] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
