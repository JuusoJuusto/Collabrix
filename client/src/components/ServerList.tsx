import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { serverAPI } from '../lib/api';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ServerList() {
  const { servers, currentServer, setCurrentServer, addServer } = useChatStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serverName, setServerName] = useState('');
  const [serverDescription, setServerDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('🏗️ Creating server:', serverName);
      const data = await serverAPI.create({ 
        name: serverName,
        description: serverDescription || undefined
      });
      console.log('✅ Server created:', data);
      addServer(data);
      setCurrentServer(data);
      setShowCreateModal(false);
      setServerName('');
      setServerDescription('');
    } catch (error: any) {
      console.error('❌ Failed to create server:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Cannot connect to server. Make sure the backend is running at: ' + (import.meta.env.VITE_API_URL || 'http://localhost:3001'));
      } else {
        setError(error.message || 'Failed to create server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-18 bg-discord-darkest flex flex-col items-center py-3 space-y-2 overflow-y-auto">
        {servers.map((server) => (
          <button
            key={server.id}
            onClick={() => setCurrentServer(server)}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition ${
              currentServer?.id === server.id
                ? 'bg-discord-blurple text-white'
                : 'bg-discord-dark text-gray-300 hover:bg-discord-blurple hover:text-white'
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
          className="w-12 h-12 rounded-full bg-discord-dark text-discord-green hover:bg-discord-green hover:text-white transition flex items-center justify-center"
          title="Create Server"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => !loading && setShowCreateModal(false)}>
          <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Server</h2>
              <p className="text-slate-400 text-sm">Give your server a personality with a name and description</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateServer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Server Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  placeholder="My Awesome Server"
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                  required
                  maxLength={100}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={serverDescription}
                  onChange={(e) => setServerDescription(e.target.value)}
                  placeholder="What's your server about?"
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500 resize-none"
                  rows={3}
                  maxLength={500}
                  disabled={loading}
                />
                <p className="text-xs text-slate-500 mt-1">{serverDescription.length}/500</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                  className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
