import nodemailer from 'nodemailer';

// Create reusable transporter with explicit Gmail configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER || 'juusojuusto112@gmail.com',
    pass: process.env.SMTP_PASS || 'zwlcbmlrxsrkutme'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error: any, success: any) => {
  if (error) {
    console.log('⚠️ SMTP connection error:', error.message);
    console.log('📧 SMTP Config:', {
      host: 'smtp.gmail.com',
      port: 587,
      user: process.env.SMTP_USER || 'juusojuusto112@gmail.com'
    });
  } else {
    console.log('✅ SMTP server ready to send emails');
    console.log('📧 Using:', process.env.SMTP_USER || 'juusojuusto112@gmail.com');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const fromName = process.env.SMTP_FROM_NAME || 'Collabrix';
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'juusojuusto112@gmail.com';
    
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    });

    console.log('✅ Email sent:', info.messageId);
    console.log('📧 To:', options.to);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Email send error:', error.message);
    console.error('📧 Full error:', error);
    return { success: false, error: error.message };
  }
};

// Email Templates
export const emailTemplates = {
  welcome: (username: string, verificationLink: string) => ({
    subject: '🎉 Welcome to Collabrix!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; line-height: 1.6; }
          .email-wrapper { background-color: #0f172a; padding: 40px 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: #e0e7ff; font-size: 16px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 20px; }
          .message { color: #cbd5e1; font-size: 16px; margin-bottom: 20px; line-height: 1.8; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; background-color: #6366f1; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
          .button:hover { background-color: #4f46e5; }
          .features { background-color: #0f172a; border-radius: 8px; padding: 24px; margin: 30px 0; }
          .features h3 { color: #ffffff; font-size: 18px; margin-bottom: 16px; }
          .feature-list { list-style: none; }
          .feature-list li { color: #cbd5e1; padding: 8px 0; padding-left: 28px; position: relative; }
          .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 18px; }
          .divider { height: 1px; background-color: #334155; margin: 30px 0; }
          .footer { background-color: #0f172a; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #6366f1; text-decoration: none; }
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .header { padding: 30px 20px; }
            .header h1 { font-size: 24px; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <h1>💬 Welcome to Collabrix!</h1>
              <p>Collaborate. Connect. Create.</p>
            </div>
            
            <div class="content">
              <div class="greeting">Hey ${username}! 👋</div>
              
              <p class="message">
                Welcome to Collabrix! You're now part of a modern collaboration platform where teams connect, communicate, and create together seamlessly.
              </p>
              
              <p class="message">
                To get started, please verify your email address:
              </p>
              
              <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              
              <div class="features">
                <h3>🚀 What you can do:</h3>
                <ul class="feature-list">
                  <li>Create workspaces and invite your team</li>
                  <li>Real-time messaging and collaboration</li>
                  <li>Customize your profile and preferences</li>
                  <li>Direct messaging with team members</li>
                  <li>Multi-language support (18 languages)</li>
                  <li>Secure and fast communication</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="message" style="font-size: 14px; color: #64748b;">
                <strong>🔒 Security:</strong> If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 Collabrix. All rights reserved.</p>
              <p style="margin-top: 10px;">This email was sent to <strong>${username}</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  twoFactorCode: (username: string, code: string) => ({
    subject: '🔐 Your Collabrix Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; }
          .email-wrapper { background-color: #0f172a; padding: 40px 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; text-align: center; }
          .code-box { background-color: #0f172a; border: 2px solid #6366f1; border-radius: 12px; padding: 30px; margin: 30px 0; }
          .code { font-size: 48px; font-weight: 700; color: #6366f1; letter-spacing: 12px; font-family: 'Courier New', monospace; }
          .warning { background-color: #dc2626; padding: 20px; border-radius: 8px; margin: 30px 0; }
          .warning-title { color: #ffffff; font-weight: 600; margin-bottom: 8px; }
          .footer { background-color: #0f172a; padding: 30px; text-align: center; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <h1>🔐 Two-Factor Authentication</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #cbd5e1; margin-bottom: 20px;">Hey ${username}!</p>
              <p style="color: #cbd5e1; margin-bottom: 30px;">Here's your verification code:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p style="color: #cbd5e1; margin-bottom: 10px;">Enter this code in Collabrix to complete your login.</p>
              <p style="color: #64748b; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>
              
              <div class="warning">
                <div class="warning-title">⚠️ Security Notice</div>
                <p style="color: #ffffff; font-size: 14px;">Never share this code with anyone. Our team will never ask for your verification code.</p>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">If you didn't request this code, please secure your account immediately.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 Collabrix. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (username: string, resetLink: string) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #36393f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #2f3136; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #5865f2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #b9bbbe; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hey ${username}!</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p><strong>This link expires in 1 hour.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2024 Discord Alternative. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  serverInvite: (username: string, serverName: string, inviterName: string, inviteLink: string) => ({
    subject: `${inviterName} invited you to join ${serverName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #36393f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #2f3136; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #3ba55d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
          .server-info { background-color: #202225; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #b9bbbe; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎮 Server Invitation</h1>
          </div>
          <div class="content">
            <h2>Hey ${username}!</h2>
            <p><strong>${inviterName}</strong> has invited you to join:</p>
            <div class="server-info">
              <h3 style="margin: 0; color: #5865f2;">${serverName}</h3>
            </div>
            <div style="text-align: center;">
              <a href="${inviteLink}" class="button">Join Server</a>
            </div>
            <p>Click the button above to accept the invitation and start chatting!</p>
          </div>
          <div class="footer">
            <p>© 2024 Discord Alternative. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  notification: (username: string, title: string, message: string, actionLink?: string) => ({
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #36393f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #2f3136; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #5865f2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #b9bbbe; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 ${title}</h1>
          </div>
          <div class="content">
            <h2>Hey ${username}!</h2>
            <p>${message}</p>
            ${actionLink ? `
              <div style="text-align: center;">
                <a href="${actionLink}" class="button">View Now</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>© 2024 Discord Alternative. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export default { sendEmail, emailTemplates };
