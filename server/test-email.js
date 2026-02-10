// Test script to verify SMTP email sending
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🧪 Testing SMTP Email Configuration...\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

console.log('📧 SMTP Configuration:');
console.log(`   Host: ${process.env.SMTP_HOST}`);
console.log(`   Port: ${process.env.SMTP_PORT}`);
console.log(`   User: ${process.env.SMTP_USER}`);
console.log(`   From: ${process.env.SMTP_FROM_EMAIL}\n`);

// Test connection
console.log('🔌 Testing SMTP connection...');
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection Failed!');
    console.log('   Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your Gmail App Password is correct');
    console.log('   2. Make sure 2-Step Verification is enabled');
    console.log('   3. Remove any spaces from the App Password');
    console.log('   4. Verify SMTP_USER matches SMTP_FROM_EMAIL');
    process.exit(1);
  } else {
    console.log('✅ SMTP Connection Successful!\n');
    
    // Send test email
    console.log('📨 Sending test email...');
    
    const testEmail = {
      from: `"${process.env.SMTP_FROM_NAME || 'Discord Alternative'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // Send to yourself
      subject: '🎉 Test Email from Discord Alternative',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #36393f; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #2f3136; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background-color: #3ba55d; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center; }
            .footer { text-align: center; padding: 20px; color: #b9bbbe; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 SMTP Test Successful!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>✅ Your email system is working perfectly!</strong>
              </div>
              <p>Congratulations! Your Discord Alternative can now send custom emails.</p>
              <p><strong>What's working:</strong></p>
              <ul>
                <li>✅ SMTP connection established</li>
                <li>✅ Email authentication successful</li>
                <li>✅ Email templates rendering correctly</li>
                <li>✅ Ready to send welcome emails, 2FA codes, and more!</li>
              </ul>
              <p>This test email was sent from your Discord Alternative server at ${new Date().toLocaleString()}.</p>
              <p><strong>Next steps:</strong></p>
              <ol>
                <li>Register a new user to test welcome emails</li>
                <li>Enable 2FA to test verification codes</li>
                <li>Customize email templates in server/src/lib/email.ts</li>
              </ol>
            </div>
            <div class="footer">
              <p>© 2024 Discord Alternative. All rights reserved.</p>
              <p>This is a test email from your SMTP configuration.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    transporter.sendMail(testEmail, (error, info) => {
      if (error) {
        console.log('❌ Failed to send test email!');
        console.log('   Error:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Sent to: ${process.env.SMTP_USER}\n`);
        console.log('🎉 All tests passed! Your SMTP is configured correctly.');
        console.log('📬 Check your inbox (and spam folder) for the test email.\n');
        process.exit(0);
      }
    });
  }
});
