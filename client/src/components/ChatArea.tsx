import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { channelAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, HashtagIcon } from '@heroicons/react/24/solid';

export default function ChatArea() {
  const { currentChannel, messages, setMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentChannel) return;

    // Subscribe to real-time messages
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
      <div className="flex-1 flex items-center justify-center bg-discord-dark text-gray-400">
        <div className="text-center">
          <HashtagIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  const channelMessages = messages[currentChannel.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-discord-dark">
      <div className="h-12 px-4 flex items-center shadow-md border-b border-discord-darkest">
        <HashtagIcon className="w-5 h-5 text-gray-400 mr-2" />
        <h2 className="font-semibold text-white">{currentChannel.name}</h2>
        {currentChannel.topic && (
          <>
            <span className="mx-2 text-gray-600">|</span>
            <p className="text-sm text-gray-400">{currentChannel.topic}</p>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {channelMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          channelMessages.map((message) => (
            <div key={message.id} className="flex gap-3 hover:bg-discord-darker/30 px-2 py-1 rounded">
              <div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center text-white font-semibold flex-shrink-0">
                {message.author?.avatar ? (
                  <img src={message.author.avatar} alt="" className="w-full h-full rounded-full" />
                ) : (
                  message.author?.username?.substring(0, 2).toUpperCase() || '??'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-white">{message.author?.displayName || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                  </span>
                  {message.edited && (
                    <span className="text-xs text-gray-500">(edited)</span>
                  )}
                </div>
                <p className="text-gray-300 break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={handleTyping}
            placeholder={`Message #${currentChannel.name}`}
            className="flex-1 px-4 py-3 bg-discord-gray text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-discord-blurple"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="px-4 py-3 bg-discord-blurple text-white rounded-lg hover:bg-discord-blurple/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
