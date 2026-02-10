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
    const fromName = process.env.SMTP_FROM_NAME || 'EchoChat';
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
    subject: '🎉 Welcome to EchoChat!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #202225; color: #dcddde; line-height: 1.6; }
          .email-wrapper { background-color: #202225; padding: 40px 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #2f3136; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
          .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 8px; }
          .header p { color: #e3e5e8; font-size: 16px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 20px; }
          .message { color: #b9bbbe; font-size: 16px; margin-bottom: 20px; }
          .button-container { text-align: center; margin: 30px 0; }
          .button { display: inline-block; background-color: #5865f2; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 16px; transition: background-color 0.2s; }
          .button:hover { background-color: #4752c4; }
          .features { background-color: #202225; border-radius: 8px; padding: 24px; margin: 30px 0; }
          .features h3 { color: #ffffff; font-size: 18px; margin-bottom: 16px; }
          .feature-list { list-style: none; }
          .feature-list li { color: #b9bbbe; padding: 8px 0; padding-left: 28px; position: relative; }
          .feature-list li:before { content: "✓"; position: absolute; left: 0; color: #3ba55d; font-weight: bold; font-size: 18px; }
          .divider { height: 1px; background-color: #40444b; margin: 30px 0; }
          .footer { background-color: #202225; padding: 30px; text-align: center; color: #72767d; font-size: 14px; }
          .footer a { color: #00aff4; text-decoration: none; }
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
              <h1>💬 Welcome to EchoChat!</h1>
              <p>Your voice, amplified</p>
            </div>
            
            <div class="content">
              <div class="greeting">Hey ${username}! 👋</div>
              
              <p class="message">
                We're thrilled to have you join EchoChat! You're now part of a vibrant community where conversations flow naturally, friendships form instantly, and every voice matters.
              </p>
              
              <p class="message">
                To get started, please verify your email address by clicking the button below:
              </p>
              
              <div class="button-container">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              
              <div class="features">
                <h3>🚀 What you can do now:</h3>
                <ul class="feature-list">
                  <li>Create your own servers and invite friends</li>
                  <li>Join existing communities and start chatting</li>
                  <li>Customize your profile with avatar and bio</li>
                  <li>Send direct messages to other users</li>
                  <li>Set your status and let others know you're online</li>
                  <li>Enjoy real-time messaging with lightning-fast delivery</li>
                </ul>
              </div>
              
              <div class="divider"></div>
              
              <p class="message" style="font-size: 14px; color: #72767d;">
                <strong>🔒 Security tip:</strong> If you didn't create this account, you can safely ignore this email. Your security is our top priority.
              </p>
            </div>
            
            <div class="footer">
              <p>© 2024 EchoChat. All rights reserved.</p>
              <p style="margin-top: 10px;">This email was sent to <strong>${username}</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  twoFactorCode: (username: string, code: string) => ({
    subject: '🔐 Your EchoChat Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #202225; color: #dcddde; }
          .email-wrapper { background-color: #202225; padding: 40px 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #2f3136; border-radius: 8px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }
          .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; text-align: center; }
          .code-box { background-color: #202225; border: 2px solid #5865f2; border-radius: 8px; padding: 30px; margin: 30px 0; }
          .code { font-size: 48px; font-weight: 700; color: #5865f2; letter-spacing: 12px; font-family: 'Courier New', monospace; }
          .warning { background-color: #ed4245; padding: 20px; border-radius: 8px; margin: 30px 0; }
          .warning-title { color: #ffffff; font-weight: 600; margin-bottom: 8px; }
          .footer { background-color: #202225; padding: 30px; text-align: center; color: #72767d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <h1>🔐 Two-Factor Authentication</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 18px; color: #b9bbbe; margin-bottom: 20px;">Hey ${username}!</p>
              <p style="color: #b9bbbe; margin-bottom: 30px;">Here's your verification code:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p style="color: #b9bbbe; margin-bottom: 10px;">Enter this code in EchoChat to complete your login.</p>
              <p style="color: #72767d; font-size: 14px;"><strong>This code expires in 10 minutes.</strong></p>
              
              <div class="warning">
                <div class="warning-title">⚠️ Security Notice</div>
                <p style="color: #ffffff; font-size: 14px;">Never share this code with anyone. Our team will never ask for your verification code.</p>
              </div>
              
              <p style="color: #72767d; font-size: 14px;">If you didn't request this code, please secure your account immediately.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 EchoChat. All rights reserved.</p>
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
