# TEST AUTO-UPDATE - v1.0.3

## ✨ What's New in v1.0.3

### 🔄 Manual Update Check Button
- Blue "🔄 Check Updates" button in titlebar
- Click it anytime to check for updates
- Shows "⏳ Checking..." while checking

### 🐛 Better Debugging
- Console logs show what's happening
- See update check progress
- Error messages if something fails

## 📦 Files Ready

Location: `desktop/dist/`
- `Collabrix-Setup-1.0.3.exe` (76.4 MB)
- `latest.yml` (346 bytes)

## 🚀 TO TEST:

### 1. Upload v1.0.3 to GitHub
https://github.com/JuusoJuusto/Collabrix/releases/new

- Tag: `v1.0.3`
- Title: `Collabrix v1.0.3 - Manual Update Check`
- Upload both files
- Publish!

### 2. Test Auto-Update

**Option A: Automatic (wait 5 seconds)**
1. Open v1.0.1 or v1.0.2
2. Wait 5 seconds
3. Should see purple notification

**Option B: Manual (instant)**
1. Open v1.0.1 or v1.0.2
2. Click "🔄 Check Updates" button in titlebar
3. Should see purple notification immediately

### 3. Check Console

Open DevTools (Ctrl+Shift+I) to see:
```
🔍 Checking for updates...
Current version: 1.0.1
Checking GitHub: JuusoJuusto/Collabrix
✅ Update available: 1.0.3
```

## 🎯 What Should Happen

1. Purple gradient notification appears
2. Shows "Update Available - Version 1.0.3"
3. Click "Download" → downloads in background
4. Click "🚀 Restart Now" → installs and restarts
5. App is now v1.0.3!

## 🐛 If It Doesn't Work

Check console for errors:
- ❌ Network error → Check internet
- ❌ GitHub error → Check if release is published
- ❌ No update found → Check version numbers

---

**Upload to GitHub and test now!**
