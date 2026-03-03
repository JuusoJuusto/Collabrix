# 🚀 COLLABRIX COMPLETE FIX GUIDE

## What We're Fixing

1. ✅ Auto-update system (restart and update)
2. ✅ Simplify website design (like StudiOWL)
3. ✅ Build new EXE with version 2.0.3
4. ✅ Upload to GitHub Releases

---

## STEP 1: Fix Auto-Update System

### Update Version Number

The desktop app needs to be version **2.0.3** to match the update system.

**File**: `desktop/package.json`
- Change version from `1.0.0` to `2.0.3`

### Build the EXE

```bash
cd "Discord alternative (Beta)/desktop"
npm run build:win
```

This will create:
- `dist/Collabrix-Setup-2.0.3.exe` (installer)
- `dist/latest.yml` (update metadata)

---

## STEP 2: Upload to GitHub Releases

### Create GitHub Release

1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v2.0.3`
4. Title: `Collabrix v2.0.3 - Auto-Update Fix`
5. Description:
```
## What's New in v2.0.3

- ✅ Fixed auto-update system
- ✅ Improved restart functionality
- ✅ Better update notifications
- ✅ Simplified website design

## Download

Download the installer below and run it to install Collabrix.

The app will automatically check for updates on startup.
```

6. Upload files:
   - `Collabrix-Setup-2.0.3.exe`
   - `latest.yml`

7. Click "Publish release"

---

## STEP 3: Test Auto-Update

### Install v2.0.2 (Old Version)

1. Build v2.0.2 first (change version in package.json)
2. Install it
3. Run the app

### Test Update Flow

1. App should show "Update available" notification
2. Click "Download Update"
3. Progress bar should appear
4. Click "Restart and Install"
5. App should close, install update, and restart
6. Check version in settings (should be 2.0.3)

---

## STEP 4: Simplify Website

### New Clean Design (Like StudiOWL)

**Changes to make**:
- Remove animated blobs
- Remove complex gradients
- Use simple, clean layout
- White background with blue accents
- Clear typography
- Simple navigation

### Files to Update

1. `client/src/pages/Landing.tsx` - Simplify hero section
2. `client/src/pages/Download.tsx` - Clean download page
3. Remove unnecessary animations
4. Use simple hover effects only

---

## STEP 5: Deploy Everything

### Deploy Website

```bash
cd "Discord alternative (Beta)/client"
npm run build
```

Vercel will auto-deploy from GitHub.

### Upload Desktop App

1. Build EXE: `npm run build:win`
2. Upload to GitHub Releases
3. Test auto-update

---

## Quick Commands

### Build Desktop App
```bash
cd "Discord alternative (Beta)/desktop"
npm run build:win
```

### Build Website
```bash
cd "Discord alternative (Beta)/client"
npm run build
```

### Test Locally
```bash
cd "Discord alternative (Beta)/desktop"
npm start
```

---

## File Locations

### Desktop App
- **Installer**: `desktop/dist/Collabrix-Setup-2.0.3.exe`
- **Update File**: `desktop/dist/latest.yml`
- **Main Code**: `desktop/main.js`
- **Version**: `desktop/package.json`

### Website
- **Landing Page**: `client/src/pages/Landing.tsx`
- **Download Page**: `client/src/pages/Download.tsx`
- **Build Output**: `client/dist/`

---

## Expected Results

### Auto-Update System
- ✅ App checks for updates on startup
- ✅ "Check Updates" button works
- ✅ Download progress shows
- ✅ "Restart and Install" button works
- ✅ App restarts automatically
- ✅ New version installed

### Website
- ✅ Clean, simple design
- ✅ Fast loading
- ✅ Easy to navigate
- ✅ Clear download button
- ✅ Professional look

---

## Troubleshooting

### Update Not Working
- Check GitHub releases exist
- Verify version numbers match
- Check internet connection
- Look at console logs (F12)

### Build Fails
- Run `npm install` first
- Check Node.js version (16+)
- Delete `node_modules` and reinstall

### Website Not Deploying
- Check Vercel dashboard
- Verify build succeeds
- Check environment variables

---

**Ready to execute these steps!**
