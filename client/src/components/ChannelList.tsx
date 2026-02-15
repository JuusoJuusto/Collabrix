import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { HashtagIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';

export default function ChannelList() {
  const { currentServer, currentChannel, setCurrentChannel } = useChatStore();
  const { logout } = useAuthStore();

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
    <div className="w-60 bg-discord-darker flex flex-col">
      <div className="h-12 px-4 flex items-center shadow-md border-b border-discord-darkest">
        <h2 className="font-semibold text-white truncate">{currentServer.name}</h2>
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
  );
}
