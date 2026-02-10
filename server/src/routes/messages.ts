import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.put('/:messageId', authenticate, async (req: AuthRequest, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const messageDoc = await db.collection('messages').doc(messageId).get();

    if (!messageDoc.exists || messageDoc.data()?.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.collection('messages').doc(messageId).update({
      content,
      edited: true,
      updatedAt: new Date().toISOString()
    });

    const updated = await db.collection('messages').doc(messageId).get();
    const authorDoc = await db.collection('users').doc(updated.data()!.authorId).get();

    res.json({
      id: updated.id,
      ...updated.data(),
      author: { id: authorDoc.id, ...authorDoc.data() }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit message' });
  }
});

router.delete('/:messageId', authenticate, async (req: AuthRequest, res) => {
  const { messageId } = req.params;

  try {
    const messageDoc = await db.collection('messages').doc(messageId).get();

    if (!messageDoc.exists || messageDoc.data()?.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await db.collection('messages').doc(messageId).delete();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

router.post('/:messageId/reactions', authenticate, async (req: AuthRequest, res) => {
  const { messageId } = req.params;
  const { emoji } = req.body;

  try {
    const reactionRef = db.collection('messages').doc(messageId).collection('reactions').doc();
    const reactionData = {
      id: reactionRef.id,
      messageId,
      userId: req.userId!,
      emoji,
      createdAt: new Date().toISOString()
    };

    await reactionRef.set(reactionData);
    res.status(201).json(reactionData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

export default router;
