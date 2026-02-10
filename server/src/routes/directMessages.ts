import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const dmsSnapshot = await db
      .collection('directMessages')
      .where('participants', 'array-contains', req.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const dms = [];
    for (const doc of dmsSnapshot.docs) {
      const dmData = doc.data();
      const senderDoc = await db.collection('users').doc(dmData.senderId).get();
      
      dms.push({
        id: doc.id,
        ...dmData,
        sender: senderDoc.exists ? { id: senderDoc.id, ...senderDoc.data() } : null
      });
    }

    res.json(dms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch DMs' });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { receiverId, content } = req.body;

  try {
    const dmRef = db.collection('directMessages').doc();
    const dmData = {
      id: dmRef.id,
      senderId: req.userId!,
      receiverId,
      content,
      participants: [req.userId!, receiverId],
      read: false,
      createdAt: new Date().toISOString()
    };

    await dmRef.set(dmData);

    const senderDoc = await db.collection('users').doc(req.userId!).get();
    res.status(201).json({
      ...dmData,
      sender: { id: senderDoc.id, ...senderDoc.data() }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send DM' });
  }
});

export default router;
