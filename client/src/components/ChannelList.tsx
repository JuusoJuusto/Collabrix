import { useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { HashtagIcon, SpeakerWaveIcon, Cog6ToothIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import ServerSettings from './ServerSettings';

export default function ChannelList() {
  const { currentServer, currentChannel, setCurrentChannel } = useChatStore();
  const { logout } = useAuthStore();
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);

  if (!currentServer) {
    return null;
  }

  const textChannels = currentServer.channels.filter((c) => c.type === 'TEXT');
  const voiceChannels = currentServer.channels.filter((c) => c.type === 'VOICE');

  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* Server Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] hover:bg-[#35373c] cursor-pointer relative" onClick={() => setShowServerMenu(!showServerMenu)}>
          <h2 className="font-semibold text-white text-[15px] truncate flex-1">{currentServer.name}</h2>
          <ChevronDownIcon className={`w-5 h-5 text-[#b5bac1] transition-transform ${showServerMenu ? 'rotate-180' : ''}`} />

          {/* Server Menu Dropdown */}
          {showServerMenu && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-[#111214] rounded shadow-xl border border-[#1e1f22] z-50" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  setShowServerSettings(true);
                  setShowServerMenu(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[#b5bac1] hover:bg-[#5865f2] hover:text-white transition text-sm"
              >
                <span>Server Settings</span>
                <Cog6ToothIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowServerMenu(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[#b5bac1] hover:bg-[#5865f2] hover:text-white transition text-sm"
              >
                <span>Create Channel</span>
                <PlusIcon className="w-4 h-4" />
              </button>
              <div className="h-px bg-[#1e1f22] my-1" />
              <button
                onClick={() => setShowServerMenu(false)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[#f23f43] hover:bg-[#f23f43] hover:text-white transition text-sm rounded-b"
              >
                <span>Leave Server</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {textChannels.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 mb-1 group">
                <h3 className="text-xs font-semibold text-[#949ba4] uppercase tracking-wide">
                  Text Channels
                </h3>
                <button className="opacity-0 group-hover:opacity-100 text-[#949ba4] hover:text-white transition" title="Create Channel">
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {textChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#35373c] transition group ${
                    currentChannel?.id === channel.id ? 'bg-[#404249] text-white' : 'text-[#949ba4]'
                  }`}
                >
                  <HashtagIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[15px] truncate">{channel.name}</span>
                  <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button className="p-0.5 hover:text-white" title="Invite">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </button>
                    <button className="p-0.5 hover:text-white" title="Settings">
                      <Cog6ToothIcon className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}

          {voiceChannels.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 mb-1 group">
                <h3 className="text-xs font-semibold text-[#949ba4] uppercase tracking-wide">
                  Voice Channels
                </h3>
                <button className="opacity-0 group-hover:opacity-100 text-[#949ba4] hover:text-white transition" title="Create Channel">
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {voiceChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-[#35373c] transition group ${
                    currentChannel?.id === channel.id ? 'bg-[#404249] text-white' : 'text-[#949ba4]'
                  }`}
                >
                  <SpeakerWaveIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[15px] truncate">{channel.name}</span>
                  <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    <button className="p-0.5 hover:text-white" title="Settings">
                      <Cog6ToothIcon className="w-4 h-4" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          )}
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
