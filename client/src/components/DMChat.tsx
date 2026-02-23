import { useEffect, useState, useRef } from 'react';
import { dmAPI, userAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, ArrowLeftIcon, FaceSmileIcon } from '@heroicons/react/24/solid';

interface DMChatProps {
  userId: string;
  onBack: () => void;
}

export default function DMChat({ userId, onBack }: DMChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user info
    loadUserInfo();

    // Subscribe to messages
    const unsubscribe = dmAPI.subscribeToConversation(userId, (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserInfo = async () => {
    try {
      const user = await userAPI.getProfile(userId);
      setOtherUser(user);
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await dmAPI.send({
        receiverId: userId,
        content: messageInput.trim()
      });
      setMessageInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#313338]">
      {/* Header */}
      <div className="h-12 px-4 flex items-center gap-3 border-b border-[#26272b] bg-[#313338] shadow-sm">
        <button
          onClick={onBack}
          className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition"
          title="Back to Friends"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5865f2] to-[#7289da] flex items-center justify-center text-white text-xs font-semibold shadow-lg">
              {otherUser?.displayName?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#23a559] rounded-full border-2 border-[#313338]" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-[15px]">
              {otherUser?.displayName || 'User'}
            </h2>
            <p className="text-xs text-[#949ba4]">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
              <span className="text-2xl text-white font-bold">
                {otherUser?.displayName?.substring(0, 2).toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">
              {otherUser?.displayName || 'User'}
            </h3>
            <p className="text-[#b5bac1] text-sm">
              This is the beginning of your direct message history with {otherUser?.displayName || 'this user'}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showHeader = !prevMessage || 
                prevMessage.author?.id !== message.author?.id ||
                message.createdAt - prevMessage.createdAt > 300000;

              return (
                <div key={message.id} className={`group hover:bg-[#2e3035] px-4 py-0.5 -mx-4 ${showHeader ? 'mt-4' : ''}`}>
                  {showHeader ? (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                        {message.author?.avatar ? (
                          <img src={message.author.avatar} alt="" className="w-full h-full rounded-full" />
                        ) : (
                          message.author?.username?.substring(0, 2).toUpperCase() || '??'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="font-medium text-white text-[15px] hover:underline cursor-pointer">
                            {message.author?.displayName || 'Unknown'}
                          </span>
                          <span className="text-xs text-[#949ba4]">
                            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-[#dbdee1] text-[15px] leading-[1.375rem] break-words">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="w-10 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs text-[#949ba4] opacity-0 group-hover:opacity-100 transition">
                          {format(new Date(message.createdAt), 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#dbdee1] text-[15px] leading-[1.375rem] break-words">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-4 pb-6 pt-2">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-[#383a40] rounded-lg hover:bg-[#40444b] transition-colors">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message @${otherUser?.displayName || 'User'}`}
              className="flex-1 bg-transparent text-white text-[15px] placeholder-[#6d6f78] focus:outline-none"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                className="text-[#b5bac1] hover:text-white transition"
                title="Add emoji"
              >
                <FaceSmileIcon className="w-6 h-6" />
              </button>
              {messageInput.trim() && (
                <button
                  type="submit"
                  className="ml-2 p-2 bg-[#5865f2] text-white rounded-full hover:bg-[#4752c4] transition-all transform hover:scale-105 shadow-lg"
                  title="Send message"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
