import { create } from 'zustand';

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
  reactions?: any[];
  attachments?: any[];
}

interface Channel {
  id: string;
  name: string;
  type: 'TEXT' | 'VOICE' | 'CATEGORY';
  topic?: string;
  serverId: string;
}

interface Server {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
  channels: Channel[];
  members: any[];
}

interface ChatState {
  servers: Server[];
  currentServer: Server | null;
  currentChannel: Channel | null;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;
  
  setServers: (servers: Server[]) => void;
  addServer: (server: Server) => void;
  setCurrentServer: (server: Server | null) => void;
  setCurrentChannel: (channel: Channel | null) => void;
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (message: Message) => void;
  deleteMessage: (messageId: string, channelId: string) => void;
  addTypingUser: (channelId: string, userId: string) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  servers: [],
  currentServer: null,
  currentChannel: null,
  messages: {},
  typingUsers: {},

  setServers: (servers) => set({ servers }),
  
  addServer: (server) => set((state) => ({
    servers: [...state.servers, server]
  })),

  setCurrentServer: (server) => set({ currentServer: server }),
  
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  
  setMessages: (channelId, messages) => set((state) => ({
    messages: { ...state.messages, [channelId]: messages }
  })),
  
  addMessage: (message) => set((state) => ({
    messages: {
      ...state.messages,
      [message.channelId]: [
        ...(state.messages[message.channelId] || []),
        message
      ]
    }
  })),
  
  updateMessage: (message) => set((state) => ({
    messages: {
      ...state.messages,
      [message.channelId]: state.messages[message.channelId]?.map((m) =>
        m.id === message.id ? message : m
      ) || []
    }
  })),
  
  deleteMessage: (messageId, channelId) => set((state) => ({
    messages: {
      ...state.messages,
      [channelId]: state.messages[channelId]?.filter((m) => m.id !== messageId) || []
    }
  })),

  addTypingUser: (channelId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [channelId]: [...(state.typingUsers[channelId] || []), userId]
    }
  })),

  removeTypingUser: (channelId, userId) => set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [channelId]: (state.typingUsers[channelId] || []).filter((id) => id !== userId)
    }
  }))
}));
