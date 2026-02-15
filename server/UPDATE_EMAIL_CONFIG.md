# How to Fix Email Delivery Issue

## The Problem

Your email error shows: `DNS type 'a' lookup of smtp.host.com responded with code NXDOMAIN`

This is misleading - the real issue is your Gmail App Password is likely expired or invalid.

## Quick Fix (5 minutes)

### Step 1: Generate New Gmail App Password

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification"
   - Click "Get Started" and follow instructions

2. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in with: `juusojuusto112@gmail.com`
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "Collabrix Server"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Update Server Configuration

1. Open: `server/.env`

2. Replace the SMTP_PASS line:
   ```env
   SMTP_PASS=your_new_16_character_password_here
   ```
   (Remove spaces from the password)

3. Save the file

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd server
npm run dev
```

### Step 4: Test Email

Run the test script:
```bash
cd server
node test-email-simple.js
```

You should see:
```
✅ SMTP server is ready to send emails!
✅ Test email sent successfully!
```

### Step 5: Test Registration

1. Go to: http://localhost:5173
2. Register a new account
3. Check email: juusojuusto112@gmail.com
4. You should receive the welcome email!

---

## Alternative: Use SendGrid (If Gmail Doesn't Work)

If Gmail continues to have issues, use SendGrid (free tier):

### 1. Sign Up for SendGrid
- Go to: https://signup.sendgrid.com/
- Free tier: 100 emails/day

### 2. Get API Key
- Dashboard → Settings → API Keys
- Create API Key → Full Access
- Copy the key

### 3. Update server/.env
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
SMTP_FROM_NAME=Collabrix
SMTP_FROM_EMAIL=your_verified_sender@yourdomain.com
```

### 4. Verify Sender Email
- SendGrid → Settings → Sender Authentication
- Verify your email address

---

## Troubleshooting

### "Invalid login" error
- App password is wrong
- 2-Step Verification not enabled
- Generate new app password

### "Connection timeout" error
- Port 587 blocked by firewall
- Try port 465 with SMTP_SECURE=true
- Check antivirus/firewall settings

### "Authentication failed" error
- Wrong username or password
- Account locked by Google
- Try "Less secure app access" (not recommended)

### Still not working?
1. Check server console for detailed errors
2. Try sending from Gmail web interface to verify account works
3. Check if account has any security restrictions
4. Consider using SendGrid or another service

---

## Current Configuration

Your current setup:
```env
SMTP_HOST=smtp.gmail.com          ✅ Correct
SMTP_PORT=587                     ✅ Correct
SMTP_SECURE=false                 ✅ Correct
SMTP_USER=juusojuusto112@gmail.com ✅ Correct
SMTP_PASS=zwlcbmlrxsrkutme        ❌ Likely expired/invalid
```

**Action:** Generate new app password and update SMTP_PASS

---

## Testing Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] New App Password generated
- [ ] server/.env updated with new password
- [ ] Server restarted
- [ ] test-email-simple.js runs successfully
- [ ] Registration sends welcome email
- [ ] Email arrives in inbox

Once all checked, your email system is working! 🎉
