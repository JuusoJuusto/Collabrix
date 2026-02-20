# Collabrix 💬

Modern real-time collaboration platform for gamers, teams, and communities. Built with React, Node.js, Socket.io, and Firebase.

## 🚀 Quick Start

### 1. Setup Environment Variables

Copy the example files and fill in your credentials:

```bash
# Client
cp client/.env.example client/.env

# Server
cp server/.env.example server/.env
```

### 2. Enable Firebase (REQUIRED)

**Enable Authentication:**
- Go to Firebase Console → Authentication
- Enable Email/Password and Google sign-in methods

**Create Firestore:**
- Go to Firebase Console → Firestore
- Create database in test mode
- Choose your preferred region

### 3. Start Servers

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Open: http://localhost:5173

## 📦 Deploy to Production

### Backend → Railway

1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Set root directory: `server`
4. Add environment variables from `server/.env.example`
5. Deploy!

### Frontend → Vercel

```bash
cd client
vercel --prod
```

Or use Vercel Dashboard:
1. New Project → Import from GitHub
2. Root directory: `client`
3. Add environment variables from `client/.env.example`
4. Deploy!

### Update Firebase

Add your production domain to Firebase:
- Firebase Console → Authentication → Settings
- Add your Vercel domain to "Authorized domains"

## ✨ Features

- 🔐 Email/Password & Google Sign-In
- 💬 Real-time messaging (Socket.io)
- 🎮 Built for gamers and teams
- 📧 Email notifications (Welcome, Password Reset)
- 👥 User profiles with avatars
- 🌐 Servers and channels
- 🎤 Voice chat (WebRTC)
- 📞 Direct messaging
- ✅ Email verification
- 🖥️ Desktop app with auto-updates

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, Zustand, Socket.io-client, Firebase Auth

**Backend:** Node.js, Express, TypeScript, Socket.io, Firebase Admin, Firestore, Nodemailer

**Desktop:** Electron, electron-updater

## 📁 Project Structure

```
Collabrix/
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
├── desktop/         # Electron desktop app
│   ├── main.js
│   ├── preload.js
│   └── package.json
└── package.json
```

## 🔧 Environment Variables

See `.env.example` files in `client/` and `server/` directories for required environment variables.

**Never commit your `.env` files to Git!**

## 🐛 Troubleshooting

**Firestore Error:**
- Disable ad blocker for localhost
- Or use incognito mode
- Or whitelist: firestore.googleapis.com

**Email Not Sending:**
- Check SMTP credentials in server/.env
- Verify 2-Step Verification is enabled for Gmail
- Check server logs for SMTP errors

**Login Not Working:**
- Enable Firebase Authentication first
- Create Firestore database
- Verify email before logging in

## 🎮 Desktop App

Build the desktop app:

```bash
cd desktop
npm install
npm run build:win
```

The installer will be in `desktop/dist/`

## 📄 License

Proprietary - All rights reserved. See LICENSE file.

## 🤝 Support

GitHub: https://github.com/JuusoJuusto/Collabrix
