import { Server, Socket } from 'socket.io';
import { auth, db } from '../lib/firebase.js';

interface AuthSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  io.use(async (socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      socket.userId = decodedToken.uid;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: AuthSocket) => {
    console.log(`User connected: ${socket.userId}`);

    try {
      // Use set with merge to create document if it doesn't exist
      await db.collection('users').doc(socket.userId!).set({
        status: 'ONLINE',
        lastSeen: new Date().toISOString()
      }, { merge: true });

      io.emit('user:status', { userId: socket.userId, status: 'ONLINE' });
    } catch (error) {
      console.error('Error updating user status:', error);
    }

    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    socket.on('message:send', async (data: { channelId: string; content: string; replyToId?: string }) => {
      try {
        const messageRef = db.collection('messages').doc();
        const messageData = {
          id: messageRef.id,
          content: data.content,
          channelId: data.channelId,
          authorId: socket.userId!,
          replyToId: data.replyToId || null,
          edited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await messageRef.set(messageData);

        const authorDoc = await db.collection('users').doc(socket.userId!).get();
        const message = {
          ...messageData,
          author: { id: authorDoc.id, ...authorDoc.data() }
        };

        io.to(`channel:${data.channelId}`).emit('message:new', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:edit', async (data: { messageId: string; content: string }) => {
      try {
        const messageDoc = await db.collection('messages').doc(data.messageId).get();

        if (!messageDoc.exists || messageDoc.data()?.authorId !== socket.userId) {
          return socket.emit('error', { message: 'Unauthorized' });
        }

        await db.collection('messages').doc(data.messageId).update({
          content: data.content,
          edited: true,
          updatedAt: new Date().toISOString()
        });

        const updated = await db.collection('messages').doc(data.messageId).get();
        const authorDoc = await db.collection('users').doc(socket.userId!).get();

        io.to(`channel:${messageDoc.data()!.channelId}`).emit('message:updated', {
          id: updated.id,
          ...updated.data(),
          author: { id: authorDoc.id, ...authorDoc.data() }
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    socket.on('message:delete', async (messageId: string) => {
      try {
        const messageDoc = await db.collection('messages').doc(messageId).get();

        if (!messageDoc.exists || messageDoc.data()?.authorId !== socket.userId) {
          return socket.emit('error', { message: 'Unauthorized' });
        }

        const channelId = messageDoc.data()!.channelId;
        await db.collection('messages').doc(messageId).delete();

        io.to(`channel:${channelId}`).emit('message:deleted', { messageId });
      } catch (error) {
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    socket.on('typing:start', (channelId: string) => {
      socket.to(`channel:${channelId}`).emit('typing:start', {
        userId: socket.userId,
        channelId
      });
    });

    socket.on('typing:stop', (channelId: string) => {
      socket.to(`channel:${channelId}`).emit('typing:stop', {
        userId: socket.userId,
        channelId
      });
    });

    socket.on('voice:join', (channelId: string) => {
      socket.join(`voice:${channelId}`);
      socket.to(`voice:${channelId}`).emit('voice:user-joined', {
        userId: socket.userId,
        channelId
      });
    });

    socket.on('voice:leave', (channelId: string) => {
      socket.leave(`voice:${channelId}`);
      socket.to(`voice:${channelId}`).emit('voice:user-left', {
        userId: socket.userId,
        channelId
      });
    });

    socket.on('voice:signal', (data: { to: string; signal: any }) => {
      io.to(data.to).emit('voice:signal', {
        from: socket.id,
        signal: data.signal
      });
    });

    socket.on('dm:send', async (data: { receiverId: string; content: string }) => {
      try {
        const dmRef = db.collection('directMessages').doc();
        const dmData = {
          id: dmRef.id,
          senderId: socket.userId!,
          receiverId: data.receiverId,
          content: data.content,
          participants: [socket.userId!, data.receiverId],
          read: false,
          createdAt: new Date().toISOString()
        };

        await dmRef.set(dmData);

        const senderDoc = await db.collection('users').doc(socket.userId!).get();
        const dm = {
          ...dmData,
          sender: { id: senderDoc.id, ...senderDoc.data() }
        };

        socket.emit('dm:new', dm);
        io.to(data.receiverId).emit('dm:new', dm);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send DM' });
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      try {
        await db.collection('users').doc(socket.userId!).set({
          status: 'OFFLINE',
          lastSeen: new Date().toISOString()
        }, { merge: true });

        io.emit('user:status', { userId: socket.userId, status: 'OFFLINE' });
      } catch (error) {
        console.error('Error updating user status on disconnect:', error);
      }
    });
  });
};
