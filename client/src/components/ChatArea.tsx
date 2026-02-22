import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { channelAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, HashtagIcon, PlusIcon, FaceSmileIcon, GifIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/solid';

export default function ChatArea() {
  const { currentChannel, messages, setMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+K: Quick search
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      // Ctrl+P: Show pinned messages
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowPinned(!showPinned);
      }
      // Ctrl+E: Show events
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setShowEvents(!showEvents);
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowPinned(false);
        setShowEvents(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSearch, showPinned, showEvents]);

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

  const handlePinMessage = (messageId: string) => {
    // Add to pinned messages
    const message = channelMessages.find(m => m.id === messageId);
    if (message && !pinnedMessages.find(p => p.id === messageId)) {
      setPinnedMessages([...pinnedMessages, { ...message, pinnedAt: new Date().toISOString() }]);
    }
  };

  const handleUnpinMessage = (messageId: string) => {
    setPinnedMessages(pinnedMessages.filter(p => p.id !== messageId));
  };

  const filteredMessages = searchQuery
    ? channelMessages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.author?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : channelMessages;

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#313338]">
        <div className="text-center">
          <HashtagIcon className="w-16 h-16 mx-auto mb-4 text-[#4e5058]" />
          <p className="text-[#b5bac1] text-sm font-medium">Select a channel to start chatting</p>
          <div className="mt-6 p-4 bg-[#2b2d31] rounded-lg max-w-sm">
            <p className="text-xs text-[#949ba4] mb-2">💡 Keyboard Shortcuts</p>
            <div className="space-y-1 text-xs text-[#b5bac1]">
              <div className="flex justify-between">
                <span>Quick Search</span>
                <kbd className="px-2 py-0.5 bg-[#1e1f22] rounded">Ctrl+K</kbd>
              </div>
              <div className="flex justify-between">
                <span>Pinned Messages</span>
                <kbd className="px-2 py-0.5 bg-[#1e1f22] rounded">Ctrl+P</kbd>
              </div>
              <div className="flex justify-between">
                <span>Events Calendar</span>
                <kbd className="px-2 py-0.5 bg-[#1e1f22] rounded">Ctrl+E</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const channelMessages = messages[currentChannel.id] || [];

  return (
    <div className="flex-1 flex flex-col bg-[#313338] relative">
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
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowEvents(!showEvents)}
            className={`p-2 rounded transition ${showEvents ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:text-white hover:bg-[#404249]'}`}
            title="Events Calendar (Ctrl+E)"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowPinned(!showPinned)}
            className={`p-2 rounded transition relative ${showPinned ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:text-white hover:bg-[#404249]'}`}
            title="Pinned Messages (Ctrl+P)"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
            </svg>
            {pinnedMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#f23f43] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pinnedMessages.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded transition ${showSearch ? 'bg-[#404249] text-white' : 'text-[#b5bac1] hover:text-white hover:bg-[#404249]'}`}
            title="Search Messages (Ctrl+K)"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-[#3f4147]" />
          <button className="p-2 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition" title="Notification Settings">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
          </button>
          <button className="p-2 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition" title="Members">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-4 py-3 bg-[#2b2d31] border-b border-[#26272b]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1f22] rounded">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#949ba4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 bg-transparent text-white text-sm placeholder-[#6d6f78] focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#949ba4] hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-[#949ba4] mt-2">
              Found {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* Pinned Messages Panel */}
      {showPinned && (
        <div className="px-4 py-3 bg-[#2b2d31] border-b border-[#26272b]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
              </svg>
              Pinned Messages ({pinnedMessages.length})
            </h3>
            <button onClick={() => setShowPinned(false)} className="text-[#949ba4] hover:text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {pinnedMessages.length === 0 ? (
            <p className="text-sm text-[#949ba4]">No pinned messages yet</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {pinnedMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 p-2 bg-[#1e1f22] rounded hover:bg-[#26272b] transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#949ba4]">{msg.author?.displayName}</p>
                    <p className="text-sm text-white truncate">{msg.content}</p>
                  </div>
                  <button
                    onClick={() => handleUnpinMessage(msg.id)}
                    className="text-[#949ba4] hover:text-[#f23f43] transition"
                    title="Unpin"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Calendar Panel */}
      {showEvents && (
        <div className="px-4 py-3 bg-[#2b2d31] border-b border-[#26272b]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Upcoming Events
            </h3>
            <button onClick={() => setShowEvents(false)} className="text-[#949ba4] hover:text-white">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-[#1e1f22] rounded">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-[#5865f2] rounded flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs text-white/70">FEB</span>
                  <span className="text-lg font-bold text-white">23</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">Game Night</h4>
                  <p className="text-xs text-[#949ba4]">Tomorrow at 8:00 PM</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="px-3 py-1 bg-[#23a559] text-white text-xs rounded hover:bg-[#1e8e4f] transition">
                      Interested
                    </button>
                    <span className="text-xs text-[#949ba4]">12 going</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full py-2 text-sm text-[#00a8fc] hover:underline">
              + Create Event
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            {searchQuery ? (
              <>
                <MagnifyingGlassIcon className="w-12 h-12 text-[#4e5058] mb-3" />
                <p className="text-[#b5bac1] text-sm">No messages found for "{searchQuery}"</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
                  <HashtagIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Welcome to #{currentChannel.name}!</h3>
                <p className="text-[#b5bac1] text-sm">This is the start of the #{currentChannel.name} channel.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => {
              const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
              const showHeader = !prevMessage || 
                prevMessage.author?.id !== message.author?.id ||
                new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 300000;

              const isPinned = pinnedMessages.some(p => p.id === message.id);

              return (
                <div key={message.id} className={`group hover:bg-[#2e3035] px-4 py-0.5 -mx-4 relative ${showHeader ? 'mt-4' : ''}`}>
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
                          {isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#5865f2]/20 text-[#5865f2] text-xs rounded">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
                              </svg>
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-[#dbdee1] text-[15px] leading-[1.375rem] break-words">{message.content}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <button
                          onClick={() => isPinned ? handleUnpinMessage(message.id) : handlePinMessage(message.id)}
                          className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                          title={isPinned ? "Unpin" : "Pin message"}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
                          </svg>
                        </button>
                        <button className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition" title="Reply">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition" title="More">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
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
                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <button
                          onClick={() => isPinned ? handleUnpinMessage(message.id) : handlePinMessage(message.id)}
                          className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                          title={isPinned ? "Unpin" : "Pin message"}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
                          </svg>
                        </button>
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
              onChange={(e) => setMessageInput(e.target.value)}
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
