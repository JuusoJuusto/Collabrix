import { useChatStore } from '../store/chatStore';

export default function MemberList() {
  const { currentServer } = useChatStore();

  if (!currentServer) {
    return null;
  }

  const onlineMembers = currentServer.members.filter((m) => m.user.status === 'ONLINE');
  const offlineMembers = currentServer.members.filter((m) => m.user.status === 'OFFLINE');

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      ONLINE: 'bg-discord-green',
      IDLE: 'bg-yellow-500',
      DND: 'bg-red-500',
      OFFLINE: 'bg-gray-500'
    };
    return (
      <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-500'}`} />
    );
  };

  return (
    <div className="w-60 bg-discord-darker overflow-y-auto">
      <div className="p-4">
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Online — {onlineMembers.length}
            </h3>
            <div className="space-y-2">
              {onlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-discord-dark/50 cursor-pointer">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white text-xs font-semibold">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        member.user.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 border-2 border-discord-darker rounded-full">
                      <StatusIndicator status={member.user.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {member.nickname || member.user.displayName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Offline — {offlineMembers.length}
            </h3>
            <div className="space-y-2">
              {offlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-discord-dark/50 cursor-pointer opacity-50">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-discord-blurple flex items-center justify-center text-white text-xs font-semibold">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        member.user.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 border-2 border-discord-darker rounded-full">
                      <StatusIndicator status={member.user.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 truncate">
                      {member.nickname || member.user.displayName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
