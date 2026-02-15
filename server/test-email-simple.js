const nodemailer = require('nodemailer');

// Test email configuration
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'juusojuusto112@gmail.com',
    pass: 'zwlcbmlrxsrkutme'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
console.log('🔍 Testing SMTP connection...');
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    console.log('\n📋 Configuration:');
    console.log('Host: smtp.gmail.com');
    console.log('Port: 587');
    console.log('User: juusojuusto112@gmail.com');
    console.log('\n💡 Possible issues:');
    console.log('1. Gmail App Password might be invalid or expired');
    console.log('2. "Less secure app access" might be disabled');
    console.log('3. 2-Step Verification might not be enabled');
    console.log('4. Network/firewall blocking SMTP port 587');
  } else {
    console.log('✅ SMTP server is ready to send emails!');
    console.log('📧 Using: juusojuusto112@gmail.com');
    
    // Try sending a test email
    console.log('\n📤 Sending test email...');
    transporter.sendMail({
      from: '"Collabrix Test" <juusojuusto112@gmail.com>',
      to: 'juusojuusto112@gmail.com',
      subject: '✅ Test Email from Collabrix',
      html: '<h1>Success!</h1><p>Your email configuration is working correctly.</p>'
    }, (err, info) => {
      if (err) {
        console.log('❌ Failed to send test email:', err.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    });
  }
});
