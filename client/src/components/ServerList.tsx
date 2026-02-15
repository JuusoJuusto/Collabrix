import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { serverAPI } from '../lib/api';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ServerList() {
  const { servers, currentServer, setCurrentServer, addServer } = useChatStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [serverName, setServerName] = useState('');

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await serverAPI.create({ name: serverName });
      addServer(data);
      setShowCreateModal(false);
      setServerName('');
    } catch (error) {
      console.error('Failed to create server:', error);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-discord-darker p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold text-white mb-4">Create Server</h2>
            <form onSubmit={handleCreateServer}>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="Server Name"
                className="w-full px-4 py-2 bg-discord-dark text-white rounded mb-4 focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-discord-blurple text-white rounded hover:bg-discord-blurple/90"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-discord-gray text-white rounded hover:bg-discord-gray/90"
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
