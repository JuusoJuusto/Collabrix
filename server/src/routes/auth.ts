import { Router } from 'express';
import { db } from '../lib/firebase.js';
import { sendEmail, emailTemplates } from '../lib/email.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Send welcome email after registration
router.post('/send-welcome-email', async (req, res) => {
  const { email, username, userId } = req.body;

  if (!email || !username || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Generate verification link (you can customize this)
    const verificationLink = `${process.env.CORS_ORIGIN}/verify-email?userId=${userId}`;
    
    const template = emailTemplates.welcome(username, verificationLink);
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (result.success) {
      res.json({ success: true, message: 'Welcome email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send email', details: result.error });
    }
  } catch (error: any) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

// Send 2FA code
router.post('/send-2fa-code', authenticate, async (req: AuthRequest, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing 2FA code' });
  }

  try {
    const userDoc = await db.collection('users').doc(req.userId!).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const template = emailTemplates.twoFactorCode(userData?.username || 'User', code);
    
    const result = await sendEmail({
      to: userData?.email,
      subject: template.subject,
      html: template.html
    });

    if (result.success) {
      res.json({ success: true, message: '2FA code sent' });
    } else {
      res.status(500).json({ error: 'Failed to send 2FA code', details: result.error });
    }
  } catch (error: any) {
    console.error('2FA email error:', error);
    res.status(500).json({ error: 'Failed to send 2FA code' });
  }
});

// Send password reset email
router.post('/send-password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find user by email
    const usersSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    
    if (usersSnapshot.empty) {
      // Don't reveal if user exists for security
      return res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
    }

    const userDoc = usersSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Generate reset token (you should implement proper token generation)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    
    // Store reset token in database with expiration
    await db.collection('users').doc(userDoc.id).update({
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 3600000).toISOString() // 1 hour
    });

    const template = emailTemplates.passwordReset(userData.username, resetLink);
    
    await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    });

    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
  } catch (error: any) {
    console.error('Password reset email error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

// Send server invite email
router.post('/send-server-invite', authenticate, async (req: AuthRequest, res) => {
  const { email, serverName, inviteCode } = req.body;

  if (!email || !serverName || !inviteCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const inviterDoc = await db.collection('users').doc(req.userId!).get();
    const inviterData = inviterDoc.data();
    
    const inviteLink = `${process.env.CORS_ORIGIN}/invite/${inviteCode}`;
    
    const template = emailTemplates.serverInvite(
      email.split('@')[0], // Use email prefix as username
      serverName,
      inviterData?.displayName || inviterData?.username || 'A user',
      inviteLink
    );
    
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html
    });

    if (result.success) {
      res.json({ success: true, message: 'Invite email sent' });
    } else {
      res.status(500).json({ error: 'Failed to send invite', details: result.error });
    }
  } catch (error: any) {
    console.error('Invite email error:', error);
    res.status(500).json({ error: 'Failed to send invite email' });
  }
});

// Send custom notification email
router.post('/send-notification', authenticate, async (req: AuthRequest, res) => {
  const { title, message, actionLink } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  try {
    const userDoc = await db.collection('users').doc(req.userId!).get();
    const userData = userDoc.data();
    
    const template = emailTemplates.notification(
      userData?.username || 'User',
      title,
      message,
      actionLink
    );
    
    const result = await sendEmail({
      to: userData?.email,
      subject: template.subject,
      html: template.html
    });

    if (result.success) {
      res.json({ success: true, message: 'Notification sent' });
    } else {
      res.status(500).json({ error: 'Failed to send notification', details: result.error });
    }
  } catch (error: any) {
    console.error('Notification email error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

export default router;
