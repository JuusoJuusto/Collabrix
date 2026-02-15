# Collabrix - Complete Setup Guide

## ✅ What's Working Now

### Web App (Vercel)
- **URL:** https://collabrixs.vercel.app
- **Status:** ✅ LIVE
- **Features:**
  - Email/Password registration
  - Google Sign-In
  - Email verification
  - Password reset
  - Real-time chat
  - Voice channels
  - Direct messaging

### Action URLs
- Email verification: ✅ Working
- Password reset: ✅ Working
- All routes: ✅ Working (no more 404!)

### Desktop App
- **Status:** Ready to build
- **Output:** Windows installer .exe
- **Features:**
  - Installs to Program Files
  - Start Menu shortcut
  - Desktop shortcut
  - Shows in Windows Apps

---

## 🚀 Build Desktop App

### Step 1: Create Icons

You need `icon.ico` and `icon.png` files:

1. Go to: https://www.icoconverter.com/
2. Upload any image (logo, emoji, etc.)
3. Download as .ico
4. Save as `icon.ico` in `desktop/` folder
5. Also save PNG version as `icon.png`

### Step 2: Build Installer

```bash
cd desktop
build-windows.bat
```

Wait 2-3 minutes...

### Step 3: Get Your Installer

Output: `desktop/dist/Collabrix-Setup-1.0.0.exe`

This installer will:
- Install to `C:\Program Files\Collabrix`
- Create Start Menu entry under "Collabrix"
- Create Desktop shortcut
- Add to Windows Apps & Features
- Allow users to uninstall normally

---

## 📦 Distribute the App

### Option 1: GitHub Releases (Recommended)

1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Collabrix v1.0.0`
5. Upload: `Collabrix-Setup-1.0.0.exe`
6. Publish

Download link will be:
```
https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-Setup-1.0.0.exe
```

### Option 2: Direct Download

Host on:
- Google Drive (public link)
- Dropbox (public link)
- Your own server

### Option 3: Add to Website

Update owlapps to show download button:
```html
<a href="https://github.com/.../Collabrix-Setup-1.0.0.exe" 
   class="download-button">
  Download for Windows
</a>
```

---

## 🎯 User Installation

1. Download `Collabrix-Setup-1.0.0.exe`
2. Run the installer
3. Choose installation directory (default: Program Files)
4. Click Install
5. Launch from Start Menu or Desktop
6. App opens and loads Collabrix
7. Login or Register
8. Start chatting!

---

## 🔧 How It Works

### Desktop App
- Built with Electron
- Wraps the web app (https://collabrixs.vercel.app)
- Native window with system integration
- Auto-updates (optional)

### Web App
- React + TypeScript + Vite
- Firebase Authentication
- Firestore Database
- Socket.io for real-time
- Deployed on Vercel

### Backend
- Node.js + Express
- Socket.io server
- Firebase Admin SDK
- Deployed on Railway

---

## ✨ Features

### Authentication
- ✅ Email/Password registration
- ✅ Google Sign-In
- ✅ Email verification
- ✅ Password reset
- ✅ Two-factor authentication (optional)

### Chat
- ✅ Real-time messaging
- ✅ Voice channels
- ✅ Direct messages
- ✅ Server & channel management
- ✅ Friend system

### Desktop
- ✅ Native window
- ✅ System tray integration
- ✅ Start Menu entry
- ✅ Desktop shortcut
- ✅ Proper installer/uninstaller

---

## 🐛 Troubleshooting

### Desktop App Won't Build

**Error:** "Cannot create symbolic link"
**Solution:** Run `build-portable.bat` instead (no admin needed)

**Error:** "electron-builder not found"
**Solution:** Run `npm install` in desktop folder first

### Desktop App Shows Error

**Error:** "Connection Error"
**Solution:** Check if https://collabrixs.vercel.app is accessible

### Installer Shows Warning

**Warning:** "Windows protected your PC"
**Solution:** This is normal for unsigned apps. Click "More info" → "Run anyway"

To remove warning: Get a code signing certificate ($$$)

---

## 📊 Project Structure

```
Collabrix/
├── client/              # React web app
│   ├── src/
│   ├── public/
│   └── dist/           # Built files (Vercel)
├── server/             # Node.js backend
│   └── src/
├── desktop/            # Electron app
│   ├── main.js
│   ├── preload.js
│   ├── package.json
│   ├── build-windows.bat
│   └── dist/          # Built installer
└── README.md
```

---

## 🎉 Summary

**Web App:** ✅ Live at https://collabrixs.vercel.app

**Desktop App:** ✅ Ready to build with `build-windows.bat`

**Features:** ✅ All working (auth, chat, voice, etc.)

**Distribution:** ✅ Ready for GitHub Releases

---

## 🚀 Next Steps

1. **Create icons** (icon.ico + icon.png)
2. **Build installer** (`build-windows.bat`)
3. **Test installer** (install and run)
4. **Upload to GitHub Releases**
5. **Share download link**
6. **Add to owlapps website**

**Everything is ready to go!** 🎊
