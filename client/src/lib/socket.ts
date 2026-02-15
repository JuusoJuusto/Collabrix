import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3001', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }

  joinChannel(channelId: string) {
    this.emit('channel:join', channelId);
  }

  leaveChannel(channelId: string) {
    this.emit('channel:leave', channelId);
  }

  sendMessage(channelId: string, content: string, replyToId?: string) {
    this.emit('message:send', { channelId, content, replyToId });
  }

  editMessage(messageId: string, content: string) {
    this.emit('message:edit', { messageId, content });
  }

  deleteMessage(messageId: string) {
    this.emit('message:delete', messageId);
  }

  startTyping(channelId: string) {
    this.emit('typing:start', channelId);
  }

  stopTyping(channelId: string) {
    this.emit('typing:stop', channelId);
  }

  joinVoice(channelId: string) {
    this.emit('voice:join', channelId);
  }

  leaveVoice(channelId: string) {
    this.emit('voice:leave', channelId);
  }

  sendVoiceSignal(to: string, signal: any) {
    this.emit('voice:signal', { to, signal });
  }

  sendDM(receiverId: string, content: string) {
    this.emit('dm:send', { receiverId, content });
  }
}

export const socketClient = new SocketClient();
