# CREATE GITHUB RELEASE FOR v1.0.1

## CRITICAL: Do this NOW to enable auto-updates!

### Step 1: Go to GitHub Releases
https://github.com/JuusoJuusto/Collabrix/releases/new

### Step 2: Fill in the form

**Tag:** `v1.0.1`

**Title:** `Collabrix v1.0.1 - Voice Chat & Fixes`

**Description:**
```markdown
## ✨ What's New in v1.0.1

### 🎤 Voice Chat (Beta)
- Join voice channels with one click
- Mute/unmute microphone
- Deafen audio controls
- See connected participants

### 🦉 Bigger Logo
- Owl logo is now larger and more visible
- Blue color with glow effect

### 🔓 Google Login Fixed
- Google OAuth popups now work properly
- No more "Popup blocked" errors

### 📦 Easier Installation
- Users can install without admin privileges
- Installs to user folder by default

## 📥 Download

**New Users:** Download and install `Collabrix-Setup-1.0.1.exe`

**Existing Users (v1.0.0):** Open the app and you'll see an update notification!

## 🐛 Bug Fixes
- Fixed popup blocking for Google authentication
- Fixed icon size in titlebar
- Improved window controls
```

### Step 3: Upload Files

Drag and drop these 2 files from `desktop/dist/`:
1. ✅ `Collabrix-Setup-1.0.1.exe` (76.4 MB)
2. ✅ `latest.yml` (346 bytes)

**BOTH FILES ARE REQUIRED FOR AUTO-UPDATE TO WORK!**

### Step 4: Publish

Click "Publish release" (NOT "Save as draft")

### Step 5: Test Auto-Update

1. Install v1.0.0 if you haven't
2. Open the app
3. Wait 3 seconds
4. You should see: "🔄 Update Available - Version 1.0.1"
5. Click "Download"
6. Click "Restart Now"
7. App updates to v1.0.1!

## Files Location

The files are in:
```
Discord alternative (Beta)/desktop/dist/
├── Collabrix-Setup-1.0.1.exe  ← Upload this
└── latest.yml                  ← Upload this
```

## What Happens After Publishing

- Users with v1.0.0 will see update notification automatically
- They click "Download" → downloads in background
- They click "Restart Now" → installs and restarts
- Done! They have v1.0.1

**Just like Discord!**
