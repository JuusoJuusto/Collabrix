import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.patch('/me', authenticate, async (req: AuthRequest, res) => {
  const { displayName, bio, avatar, status } = req.body;

  try {
    const updates: any = { updatedAt: new Date().toISOString() };
    if (displayName) updates.displayName = displayName;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;
    if (status) updates.status = status;

    await db.collection('users').doc(req.userId!).update(updates);

    const userDoc = await db.collection('users').doc(req.userId!).get();
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/:userId', authenticate, async (req: AuthRequest, res) => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
