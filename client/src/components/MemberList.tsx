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
      ONLINE: 'bg-[#23a559]',
      IDLE: 'bg-[#f0b232]',
      DND: 'bg-[#f23f43]',
      OFFLINE: 'bg-[#80848e]'
    };
    return (
      <div className={`w-2.5 h-2.5 rounded-full ${colors[status as keyof typeof colors] || 'bg-[#80848e]'}`} />
    );
  };

  return (
    <div className="w-60 bg-[#2b2d31] overflow-y-auto border-l border-[#1e1f22]">
      <div className="p-4">
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#949ba4] uppercase mb-2 px-2">
              Online — {onlineMembers.length}
            </h3>
            <div className="space-y-1">
              {onlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer group">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-semibold">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        member.user.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#2b2d31] rounded-full p-0.5">
                      <StatusIndicator status={member.user.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#f2f3f5] font-medium truncate group-hover:text-white">
                      {member.nickname || member.user.displayName}
                    </p>
                    <p className="text-xs text-[#949ba4] truncate">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-[#949ba4] uppercase mb-2 px-2">
              Offline — {offlineMembers.length}
            </h3>
            <div className="space-y-1">
              {offlineMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer group opacity-40 hover:opacity-100 transition">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-semibold">
                      {member.user.avatar ? (
                        <img src={member.user.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        member.user.username.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#2b2d31] rounded-full p-0.5">
                      <StatusIndicator status={member.user.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#949ba4] font-medium truncate group-hover:text-[#dbdee1]">
                      {member.nickname || member.user.displayName}
                    </p>
                    <p className="text-xs text-[#80848e] truncate">Offline</p>
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
