import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { channelAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, HashtagIcon, PlusIcon, FaceSmileIcon, PaperClipIcon, GifIcon } from '@heroicons/react/24/solid';

export default function ChatArea() {
  const { currentChannel, messages, setMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentChannel) return;

    const unsubscribe = channelAPI.subscribeToMessages(currentChannel.id, (newMessages) => {
      setMessages(currentChannel.id, newMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [currentChannel?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[currentChannel?.id || '']]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChannel) return;

    try {
      await channelAPI.sendMessage(currentChannel.id, messageInput.trim());
      setMessageInput('');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (error) {
      // Message send failed
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#313338]">
        <div className="text-center">
          <HashtagIcon className="w-16 h-16 mx-auto mb-4 text-[#4e5058]" />
          <p className="text-[#b5bac1] text-sm font-medium">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  const channelMessages = messages[currentChannel.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-[#313338]">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#26272b] bg-[#313338]">
        <div className="flex items-center gap-2">
          <HashtagIcon className="w-5 h-5 text-[#80848e]" />
          <h2 className="font-semibold text-white text-[15px]">{currentChannel.name}</h2>
          {currentChannel.topic && (
            <>
              <div className="w-px h-5 bg-[#3f4147]" />
              <p className="text-sm text-[#b5bac1]">{currentChannel.topic}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[#b5bac1] hover:text-white transition" title="Threads">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5.43 21.12c.35.18.75.04.93-.31l1.19-2.37c.18-.35.04-.75-.31-.93-.35-.18-.75-.04-.93.31l-1.19 2.37c-.18.35-.04.75.31.93zM17 4H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H7V6h10v10z"/>
            </svg>
          </button>
          <button className="text-[#b5bac1] hover:text-white transition" title="Notification Settings">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
          </button>
          <button className="text-[#b5bac1] hover:text-white transition" title="Pinned Messages">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
            </svg>
          </button>
          <button className="text-[#b5bac1] hover:text-white transition" title="Members">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </button>
          <div className="w-px h-6 bg-[#3f4147]" />
          <button className="text-[#b5bac1] hover:text-white transition" title="Search">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {channelMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
              <HashtagIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">Welcome to #{currentChannel.name}!</h3>
            <p className="text-[#b5bac1] text-sm">This is the start of the #{currentChannel.name} channel.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {channelMessages.map((message, index) => {
              const prevMessage = index > 0 ? channelMessages[index - 1] : null;
              const showHeader = !prevMessage || 
                prevMessage.author?.id !== message.author?.id ||
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000;

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
      <div className="px-4 pb-6">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#383a40] rounded-lg">
            <button
              type="button"
              className="text-[#b5bac1] hover:text-white transition"
              title="Add attachment"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={handleTyping}
              placeholder={`Message #${currentChannel.name}`}
              className="flex-1 bg-transparent text-white text-[15px] placeholder-[#6d6f78] focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[#b5bac1] hover:text-white transition"
                title="Add GIF"
              >
                <GifIcon className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-[#b5bac1] hover:text-white transition"
                title="Add emoji"
              >
                <FaceSmileIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
