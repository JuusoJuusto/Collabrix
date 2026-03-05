import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { channelAPI } from '../lib/api';
import { format } from 'date-fns';
import { PaperAirplaneIcon, HashtagIcon, PlusIcon, FaceSmileIcon, GifIcon, MagnifyingGlassIcon, CalendarIcon, BoltIcon, SparklesIcon, FireIcon, HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

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
    status?: 'online' | 'away' | 'busy' | 'offline';
    customStatus?: string;
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
  isImportant?: boolean;
  mood?: 'happy' | 'sad' | 'excited' | 'angry' | 'neutral';
}

export default function ChatArea() {
  const { currentChannel, messages, setMessages } = useChatStore();
  const [messageInput, setMessageInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinned, setShowPinned] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [pinnedMessages, setPinnedMessages] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});
  const [messageMood, setMessageMood] = useState<'happy' | 'sad' | 'excited' | 'angry' | 'neutral'>('neutral');
  const [isImportant, setIsImportant] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👀', '💯', '✨'];
  const moodEmojis = {
    happy: '😊',
    sad: '😢',
    excited: '🎉',
    angry: '😠',
    neutral: '😐'
  };

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
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setShowSearch(!showSearch);
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setShowPinned(!showPinned);
      }
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setShowEvents(!showEvents);
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        setIsImportant(!isImportant);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowPinned(false);
        setShowEvents(false);
        setShowAIAssistant(false);
        setShowPoll(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSearch, showPinned, showEvents, isImportant, showAIAssistant, showPoll]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChannel) return;

    try {
      const messageData = {
        content: messageInput.trim(),
        mood: messageMood,
        isImportant,
        replyToId: replyingTo?.id
      };
      
      await channelAPI.sendMessage(currentChannel.id, messageData);
      setMessageInput('');
      setReplyingTo(null);
      setMessageMood('neutral');
      setIsImportant(false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await channelAPI.addReaction(currentChannel?.id || '', messageId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleUpvote = async (messageId: string) => {
    try {
      await channelAPI.upvoteMessage(currentChannel?.id || '', messageId);
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const handleDownvote = async (messageId: string) => {
    try {
      await channelAPI.downvoteMessage(currentChannel?.id || '', messageId);
    } catch (error) {
      console.error('Failed to downvote:', error);
    }
  };

  const handlePinMessage = async (messageId: string) => {
    try {
      await channelAPI.pinMessage(currentChannel?.id || '', messageId);
    } catch (error) {
      console.error('Failed to pin message:', error);
    }
  };

  const handleCreatePoll = async () => {
    if (!currentChannel || pollOptions.filter(o => o.trim()).length < 2) return;
    
    try {
      await channelAPI.createPoll(currentChannel.id, {
        question: messageInput,
        options: pollOptions.filter(o => o.trim())
      });
      setMessageInput('');
      setPollOptions(['', '']);
      setShowPoll(false);
    } catch (error) {
      console.error('Failed to create poll:', error);
    }
  };

  const channelMessages = messages[currentChannel?.id || ''] || [];
  const filteredMessages = searchQuery
    ? channelMessages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : channelMessages;

  if (!currentChannel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <SparklesIcon className="w-20 h-20 text-blue-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Collabrix</h2>
          <p className="text-gray-400">Select a channel to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="h-14 border-b border-gray-700/50 flex items-center justify-between px-4 bg-gray-800/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <HashtagIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">{currentChannel.name}</h2>
            {currentChannel.description && (
              <p className="text-xs text-gray-400">{currentChannel.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Search (Ctrl+K)"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowPinned(!showPinned)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Pinned Messages (Ctrl+P)"
          >
            <FireIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Events (Ctrl+E)"
          >
            <CalendarIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="AI Assistant"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 bg-gray-800/50 border-b border-gray-700/50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      )}

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-500/30">
          <div className="flex items-start gap-3">
            <SparklesIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-300 mb-3">Ask me anything about this conversation or get suggestions!</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors">
                  Summarize Chat
                </button>
                <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm text-white transition-colors">
                  Suggest Reply
                </button>
                <button className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 rounded-lg text-sm text-white transition-colors">
                  Translate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`group flex gap-3 hover:bg-gray-800/30 p-3 rounded-xl transition-all ${
              message.isImportant ? 'bg-yellow-900/20 border-l-4 border-yellow-500' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {message.author.displayName[0]}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white">{message.author.displayName}</span>
                {message.mood && message.mood !== 'neutral' && (
                  <span className="text-lg" title={`Mood: ${message.mood}`}>
                    {moodEmojis[message.mood]}
                  </span>
                )}
                {message.isImportant && (
                  <BoltIcon className="w-4 h-4 text-yellow-500" title="Important" />
                )}
                <span className="text-xs text-gray-500">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </span>
                {message.edited && (
                  <span className="text-xs text-gray-500">(edited)</span>
                )}
              </div>
              
              {message.replyTo && (
                <div className="mb-2 pl-3 border-l-2 border-gray-600 text-sm text-gray-400">
                  <span className="font-semibold">{message.replyTo.author.displayName}</span>: {message.replyTo.content.substring(0, 50)}...
                </div>
              )}
              
              <p className="text-gray-200 break-words">{message.content}</p>
              
              {/* Reactions */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReaction(message.id, reaction.emoji)}
                      className="px-2 py-1 bg-gray-700/50 hover:bg-gray-700 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-gray-300">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Message Actions */}
              <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setReplyingTo(message)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                  title="Reply"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowReactions(message.id)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                  title="Add Reaction"
                >
                  <FaceSmileIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUpvote(message.id)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition-colors"
                  title="Upvote"
                >
                  👍 {message.upvotes || 0}
                </button>
                <button
                  onClick={() => handleDownvote(message.id)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors"
                  title="Downvote"
                >
                  👎 {message.downvotes || 0}
                </button>
                <button
                  onClick={() => handlePinMessage(message.id)}
                  className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-yellow-400 transition-colors"
                  title="Pin Message"
                >
                  📌
                </button>
              </div>
              
              {/* Quick Reactions Popup */}
              {showReactions === message.id && (
                <div className="flex gap-1 mt-2 p-2 bg-gray-700 rounded-lg">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleReaction(message.id, emoji);
                        setShowReactions(null);
                      }}
                      className="p-2 hover:bg-gray-600 rounded transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers[currentChannel.id]?.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-400">
          {typingUsers[currentChannel.id].join(', ')} {typingUsers[currentChannel.id].length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Replying to</span>
            <span className="text-white font-semibold">{replyingTo.author.displayName}</span>
            <span className="text-gray-400">{replyingTo.content.substring(0, 50)}...</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Poll Creator */}
      {showPoll && (
        <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700/50">
          <h3 className="text-white font-semibold mb-2">Create Poll</h3>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Poll question..."
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          {pollOptions.map((option, idx) => (
            <input
              key={idx}
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...pollOptions];
                newOptions[idx] = e.target.value;
                setPollOptions(newOptions);
              }}
              placeholder={`Option ${idx + 1}`}
              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
          ))}
          <div className="flex gap-2">
            <button
              onClick={() => setPollOptions([...pollOptions, ''])}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
            >
              Add Option
            </button>
            <button
              onClick={handleCreatePoll}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors"
            >
              Create Poll
            </button>
            <button
              onClick={() => setShowPoll(false)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          {/* Mood & Important Toggles */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Mood:</span>
            {Object.entries(moodEmojis).map(([mood, emoji]) => (
              <button
                key={mood}
                type="button"
                onClick={() => setMessageMood(mood as any)}
                className={`p-1.5 rounded-lg transition-colors ${
                  messageMood === mood ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title={mood}
              >
                {emoji}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsImportant(!isImportant)}
              className={`ml-auto p-1.5 rounded-lg transition-colors ${
                isImportant ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Mark as Important (Ctrl+I)"
            >
              <BoltIcon className="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
              title="Add Attachment"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${currentChannel.name}`}
              className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
              title="Create Poll"
            >
              📊
            </button>
            
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-gray-300"
              title="Emoji"
            >
              <FaceSmileIcon className="w-5 h-5" />
            </button>
            
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-white"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
