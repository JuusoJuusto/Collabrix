import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { channelAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, HashtagIcon, PlusIcon, FaceSmileIcon, GifIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface Message {
  id: string;
  content: string;
  channelId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  replyToId?: string;
  replyTo?: any;
  edited: boolean;
  createdAt: string;
  reactions?: { emoji: string; users: string[]; count: number }[];
  attachments?: any[];
  upvotes?: number;
  downvotes?: number;
  threadCount?: number;
  isPinned?: boolean;
}

export default function ChatArea() {
  const { currentChannel, messages, setMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👀'];

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

  // Get channel messages first before using them
  const channelMessages = messages[currentChannel?.id || ''] || [];

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

  const handleReaction = (messageId: string, emoji: string) => {
    // Add reaction logic here
    console.log('Reaction:', emoji, 'to message:', messageId);
    setShowReactions(null);
  };

  const handleUpvote = (messageId: string) => {
    // Upvote logic
    console.log('Upvote message:', messageId);
  };

  const handleDownvote = (messageId: string) => {
    // Downvote logic
    console.log('Downvote message:', messageId);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleStartThread = (messageId: string) => {
    // Thread logic
    console.log('Start thread for:', messageId);
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

  return (
    <div className="flex-1 flex flex-col bg-[#313338] relative">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#26272b] bg-[#313338] shadow-sm">
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
                        {/* Upvote/Downvote (Reddit style) */}
                        <div className="flex items-center gap-0.5 bg-[#2b2d31] rounded px-1">
                          <button
                            onClick={() => handleUpvote(message.id)}
                            className="p-1 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-[#23a559] transition"
                            title="Upvote"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="text-xs text-[#b5bac1] font-medium min-w-[20px] text-center">
                            {(message.upvotes || 0) - (message.downvotes || 0)}
                          </span>
                          <button
                            onClick={() => handleDownvote(message.id)}
                            className="p-1 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-[#f23f43] transition"
                            title="Downvote"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Quick Reactions (Discord style) */}
                        <div className="relative">
                          <button
                            onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                            className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                            title="Add reaction"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          {showReactions === message.id && (
                            <div className="absolute bottom-full mb-2 left-0 bg-[#2b2d31] rounded-lg shadow-xl p-2 flex gap-1 z-10 border border-[#404249]">
                              {quickReactions.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(message.id, emoji)}
                                  className="w-8 h-8 hover:bg-[#404249] rounded flex items-center justify-center text-lg transition transform hover:scale-125"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Thread (Slack style) */}
                        <button
                          onClick={() => handleStartThread(message.id)}
                          className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                          title="Start thread"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </button>

                        {/* Reply */}
                        <button
                          onClick={() => handleReply(message)}
                          className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                          title="Reply"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {/* Pin */}
                        <button
                          onClick={() => isPinned ? handleUnpinMessage(message.id) : handlePinMessage(message.id)}
                          className="p-1.5 hover:bg-[#404249] rounded text-[#b5bac1] hover:text-white transition"
                          title={isPinned ? "Unpin" : "Pin message"}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
                          </svg>
                        </button>

                        {/* More */}
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
      <div className="px-4 pb-6 pt-2">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="mb-2 px-4 py-2 bg-[#2b2d31] rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-[#b5bac1]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-[#b5bac1]">Replying to</span>
              <span className="text-white font-medium">{replyingTo.author.displayName}</span>
              <span className="text-[#949ba4] truncate max-w-xs">"{replyingTo.content}"</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-[#b5bac1] hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative">
          <div className={`flex items-center gap-3 px-4 py-3 bg-[#383a40] ${replyingTo ? 'rounded-b-lg' : 'rounded-lg'} hover:bg-[#40444b] transition-colors`}>
            <button
              type="button"
              className="text-[#b5bac1] hover:text-white transition flex-shrink-0"
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
            <div className="flex items-center gap-2 flex-shrink-0">
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
              {messageInput.trim() && (
                <button
                  type="submit"
                  className="ml-2 p-2 bg-[#5865f2] text-white rounded-full hover:bg-[#4752c4] transition-all transform hover:scale-105"
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
