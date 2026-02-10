# EchoChat 💬

Real-time chat platform with Discord-like features. Built with React, Node.js, Socket.io, and Firebase.

## 🚀 Quick Start

### 1. Enable Firebase (REQUIRED - 2 minutes)

**Enable Authentication:**
- Go to: https://console.firebase.google.com/project/studiowl-3b22d/authentication
- Click "Get started" → "Email/Password" → Toggle ON → Save
- Click "Google" → Toggle ON → Support email: juusojuusto112@gmail.com → Save

**Create Firestore:**
- Go to: https://console.firebase.google.com/project/studiowl-3b22d/firestore
- Click "Create database" → "Start in test mode" → Choose region: europe-west1 → Enable

### 2. Start Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Open: http://localhost:5173

### 3. Test Registration

1. Register a new account
2. Check email: juusojuusto112@gmail.com
3. Verify email (click Firebase link)
4. Login and start chatting!

## 📦 Deploy to Production

### Backend → Railway

1. Go to: https://railway.app
2. Sign up with GitHub
3. New Project → Deploy from GitHub → Select EchoChat
4. Add environment variables:

```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
FIREBASE_PROJECT_ID=studiowl-3b22d
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studiowl-3b22d.iam.gserviceaccount.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=juusojuusto112@gmail.com
SMTP_PASS=zwlcbmlrxsrkutme
SMTP_FROM_NAME=EchoChat
SMTP_FROM_EMAIL=juusojuusto112@gmail.com
```

5. Set root directory: `server`
6. Deploy!

### Frontend → Vercel

```bash
cd client
vercel --prod
```

Or use Vercel Dashboard:
1. Go to: https://vercel.com
2. New Project → Import EchoChat
3. Root directory: `client`
4. Add environment variables (same as client/.env)
5. Update `VITE_API_URL` to Railway URL
6. Deploy!

### Update Firebase

Add Vercel domain to Firebase:
- Go to: https://console.firebase.google.com/project/studiowl-3b22d/authentication/settings
- Scroll to "Authorized domains"
- Add: your-app.vercel.app

## ✨ Features

- 🔐 Email/Password, Google, Apple Sign-In
- 💬 Real-time messaging (Socket.io)
- 🌍 18 languages supported
- 📧 Email notifications (Welcome, 2FA, Password Reset)
- 👥 User profiles with avatars
- 🌐 Servers and channels
- 📞 Direct messaging
- ✅ Email verification
- 🔒 Two-factor authentication

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, Zustand, Socket.io-client, Firebase Auth

**Backend:** Node.js, Express, TypeScript, Socket.io, Firebase Admin, Firestore, Nodemailer

## 📁 Project Structure

```
EchoChat/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── store/
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── middleware/
│   │   └── socket/
│   └── package.json
└── package.json
```

## 🔧 Environment Variables

**Client (.env):**
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_FIREBASE_API_KEY=AIzaSyDb4aSjXkg0YtrSAGASmfqPvwThyR0X_G8
VITE_FIREBASE_AUTH_DOMAIN=studiowl-3b22d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studiowl-3b22d
VITE_FIREBASE_STORAGE_BUCKET=studiowl-3b22d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=140077048339
VITE_FIREBASE_APP_ID=1:140077048339:web:ce620a654c7130df3f55e6
```

**Server (.env):**
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=studiowl-3b22d
FIREBASE_PRIVATE_KEY="your_private_key"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@studiowl-3b22d.iam.gserviceaccount.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=juusojuusto112@gmail.com
SMTP_PASS=zwlcbmlrxsrkutme
SMTP_FROM_NAME=EchoChat
SMTP_FROM_EMAIL=juusojuusto112@gmail.com
```

## 🐛 Troubleshooting

**Firestore Error (ERR_BLOCKED_BY_CLIENT):**
- Disable ad blocker for localhost
- Or use incognito mode
- Or whitelist: firestore.googleapis.com

**Email Not Sending:**
- Check Gmail App Password is correct
- Verify 2-Step Verification is enabled
- Check server logs for SMTP errors

**Login Not Working:**
- Enable Firebase Authentication first
- Create Firestore database
- Verify email before logging in

## 📄 License

MIT License

## 🤝 Support

GitHub: https://github.com/JuusoJuusto/EchoChat
