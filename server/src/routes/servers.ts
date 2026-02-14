import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  const { name, description, icon } = req.body;

  try {
    const serverRef = db.collection('servers').doc();
    const serverId = serverRef.id;

    const serverData = {
      id: serverId,
      name,
      description: description || null,
      icon: icon || null,
      ownerId: req.userId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await serverRef.set(serverData);

    // Add owner as member
    await db.collection('servers').doc(serverId).collection('members').doc(req.userId!).set({
      userId: req.userId!,
      joinedAt: new Date().toISOString(),
      nickname: null
    });

    // Create default channels
    const generalChannel = {
      id: db.collection('servers').doc(serverId).collection('channels').doc().id,
      name: 'general',
      type: 'TEXT',
      serverId,
      position: 0,
      createdAt: new Date().toISOString()
    };

    const voiceChannel = {
      id: db.collection('servers').doc(serverId).collection('channels').doc().id,
      name: 'General Voice',
      type: 'VOICE',
      serverId,
      position: 1,
      createdAt: new Date().toISOString()
    };

    await db.collection('servers').doc(serverId).collection('channels').doc(generalChannel.id).set(generalChannel);
    await db.collection('servers').doc(serverId).collection('channels').doc(voiceChannel.id).set(voiceChannel);

    res.status(201).json({ ...serverData, channels: [generalChannel, voiceChannel] });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const serversSnapshot = await db.collection('servers').get();
    const servers = [];

    for (const doc of serversSnapshot.docs) {
      const memberDoc = await db.collection('servers').doc(doc.id).collection('members').doc(req.userId!).get();
      
      if (memberDoc.exists) {
        const channelsSnapshot = await db.collection('servers').doc(doc.id).collection('channels').orderBy('position').get();
        const channels = channelsSnapshot.docs.map((c: any) => ({ id: c.id, ...c.data() }));

        const membersSnapshot = await db.collection('servers').doc(doc.id).collection('members').get();
        const members = [];
        
        for (const memberDoc of membersSnapshot.docs) {
          const userDoc = await db.collection('users').doc(memberDoc.id).get();
          if (userDoc.exists) {
            members.push({
              id: memberDoc.id,
              ...memberDoc.data(),
              user: { id: userDoc.id, ...userDoc.data() }
            });
          }
        }

        servers.push({
          id: doc.id,
          ...doc.data(),
          channels,
          members
        });
      }
    }

    res.json(servers);
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

router.get('/:serverId', authenticate, async (req: AuthRequest, res) => {
  const { serverId } = req.params;

  try {
    const serverDoc = await db.collection('servers').doc(serverId).get();
    
    if (!serverDoc.exists) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const memberDoc = await db.collection('servers').doc(serverId).collection('members').doc(req.userId!).get();
    
    if (!memberDoc.exists) {
      return res.status(403).json({ error: 'Not a member of this server' });
    }

    const channelsSnapshot = await db.collection('servers').doc(serverId).collection('channels').orderBy('position').get();
    const channels = channelsSnapshot.docs.map((c: any) => ({ id: c.id, ...c.data() }));

    const membersSnapshot = await db.collection('servers').doc(serverId).collection('members').get();
    const members = [];
    
    for (const memberDoc of membersSnapshot.docs) {
      const userDoc = await db.collection('users').doc(memberDoc.id).get();
      if (userDoc.exists) {
        members.push({
          id: memberDoc.id,
          ...memberDoc.data(),
          user: { id: userDoc.id, ...userDoc.data() }
        });
      }
    }

    res.json({
      id: serverDoc.id,
      ...serverDoc.data(),
      channels,
      members
    });
  } catch (error) {
    console.error('Get server error:', error);
    res.status(500).json({ error: 'Failed to fetch server' });
  }
});

router.post('/:serverId/join', authenticate, async (req: AuthRequest, res) => {
  const { serverId } = req.params;

  try {
    await db.collection('servers').doc(serverId).collection('members').doc(req.userId!).set({
      userId: req.userId!,
      joinedAt: new Date().toISOString(),
      nickname: null
    });

    res.status(201).json({ message: 'Joined server' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join server' });
  }
});

router.delete('/:serverId/leave', authenticate, async (req: AuthRequest, res) => {
  const { serverId } = req.params;

  try {
    await db.collection('servers').doc(serverId).collection('members').doc(req.userId!).delete();
    res.json({ message: 'Left server' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave server' });
  }
});

export default router;
