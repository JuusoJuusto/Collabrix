import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { name, type, serverId, topic } = req.body;

  try {
    const channelRef = db.collection('servers').doc(serverId).collection('channels').doc();
    const channelData = {
      id: channelRef.id,
      name,
      type,
      serverId,
      topic: topic || null,
      position: 0,
      createdAt: new Date().toISOString()
    };

    await channelRef.set(channelData);
    res.status(201).json(channelData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

router.get('/:channelId/messages', authenticate, async (req: AuthRequest, res) => {
  const { channelId } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;

  try {
    const messagesSnapshot = await db
      .collection('messages')
      .where('channelId', '==', channelId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const messages = [];
    for (const doc of messagesSnapshot.docs) {
      const messageData = doc.data();
      const authorDoc = await db.collection('users').doc(messageData.authorId).get();
      
      messages.push({
        id: doc.id,
        ...messageData,
        author: authorDoc.exists ? { id: authorDoc.id, ...authorDoc.data() } : null
      });
    }

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
