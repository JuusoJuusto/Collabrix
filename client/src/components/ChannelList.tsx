import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { HashtagIcon, SpeakerWaveIcon, Cog6ToothIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ServerSettings from './ServerSettings';

export default function ChannelList() {
  const { currentServer, currentChannel, setCurrentChannel } = useChatStore();
  const { logout } = useAuthStore();
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);

  if (!currentServer) {
    return (
      <div className="w-60 bg-discord-darker flex items-center justify-center text-gray-400">
        Select a server
      </div>
    );
  }

  const textChannels = currentServer.channels.filter((c) => c.type === 'TEXT');
  const voiceChannels = currentServer.channels.filter((c) => c.type === 'VOICE');

  return (
    <>
      <div className="w-60 bg-discord-darker flex flex-col">
        <div className="h-12 px-4 flex items-center justify-between shadow-md border-b border-discord-darkest relative">
          <h2 className="font-semibold text-white truncate flex-1">{currentServer.name}</h2>
          <button
            onClick={() => setShowServerMenu(!showServerMenu)}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <ChevronDownIcon className="w-5 h-5" />
          </button>

          {/* Server Menu Dropdown */}
          {showServerMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 mx-2 bg-slate-900 rounded-lg shadow-xl border border-slate-700 z-50">
              <button
                onClick={() => {
                  setShowServerSettings(true);
                  setShowServerMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition rounded-t-lg"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Server Settings</span>
              </button>
              <button
                onClick={() => setShowServerMenu(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-slate-800 hover:text-white transition"
              >
                <HashtagIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Create Channel</span>
              </button>
              <button
                onClick={() => setShowServerMenu(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition rounded-b-lg border-t border-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Leave Server</span>
              </button>
            </div>
          )}
        </div>

      <div className="flex-1 overflow-y-auto p-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase mb-1">
              Text Channels
            </h3>
            {textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-dark/50 transition ${
                  currentChannel?.id === channel.id ? 'bg-discord-dark/70 text-white' : 'text-gray-400'
                }`}
              >
                <HashtagIcon className="w-5 h-5" />
                <span className="text-sm">{channel.name}</span>
              </button>
            ))}
          </div>
        )}

        {voiceChannels.length > 0 && (
          <div>
            <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase mb-1">
              Voice Channels
            </h3>
            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setCurrentChannel(channel)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-discord-dark/50 transition ${
                  currentChannel?.id === channel.id ? 'bg-discord-dark/70 text-white' : 'text-gray-400'
                }`}
              >
                <SpeakerWaveIcon className="w-5 h-5" />
                <span className="text-sm">{channel.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-14 bg-discord-darkest px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white text-sm font-semibold">
            {useAuthStore.getState().user?.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">
              {useAuthStore.getState().user?.displayName}
            </p>
            <p className="text-xs text-gray-400 truncate">
              #{useAuthStore.getState().user?.username}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-white text-xs"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Server Settings Modal */}
    {showServerSettings && (
      <ServerSettings
        server={currentServer}
        onClose={() => setShowServerSettings(false)}
      />
    )}
  </>
  );
}
