# 🚀 BUILD AND UPLOAD COLLABRIX v2.0.3

## ✅ WHAT'S BEEN FIXED

1. **Version updated** to 2.0.3 in `desktop/package.json`
2. **Website simplified** - Clean design like StudiOWL
3. **Landing page** - Simple, professional layout
4. **Download page** - Clear instructions and steps
5. **Auto-update system** - Ready to work with GitHub Releases

---

## 📦 BUILD THE EXE NOW

### Step 1: Open Terminal in Desktop Folder

```bash
cd "Discord alternative (Beta)/desktop"
```

### Step 2: Install Dependencies (if needed)

```bash
npm install
```

### Step 3: Build the Installer

```bash
npm run build:win
```

This will create:
- `dist/Collabrix-Setup-2.0.3.exe` (76-80 MB)
- `dist/latest.yml` (update metadata)

---

## 📤 UPLOAD TO GITHUB

### Step 1: Go to GitHub Releases

https://github.com/JuusoJuusto/Collabrix/releases

### Step 2: Create New Release

1. Click "Draft a new release"
2. **Tag**: `v2.0.3`
3. **Title**: `Collabrix v2.0.3 - Simplified & Fixed`
4. **Description**:

```markdown
## 🎉 What's New in v2.0.3

### ✨ New Features
- Simplified website design (clean and professional)
- Improved download experience
- Better installation instructions

### 🔧 Fixes
- Fixed auto-update system
- Improved restart functionality
- Better update notifications
- Cleaner UI throughout

### 📥 Download

Download the installer below and run it to install Collabrix.

**System Requirements:**
- Windows 10 or later
- 4GB RAM minimum
- 200MB disk space

The app will automatically check for updates on startup.

### 🐛 Known Issues
- Voice chat is UI-only (WebRTC not implemented yet)
- Server creation requires backend to be running

---

**Full Changelog**: https://github.com/JuusoJuusto/Collabrix/compare/v2.0.2...v2.0.3
```

### Step 3: Upload Files

Drag and drop these files:
- `Collabrix-Setup-2.0.3.exe`
- `latest.yml`

### Step 4: Publish

Click "Publish release"

---

## 🧪 TEST THE AUTO-UPDATE

### Option 1: Test with Old Version

1. Build v2.0.2 (change version in package.json to 2.0.2)
2. Install it
3. Run the app
4. It should detect v2.0.3 is available
5. Click "Download Update"
6. Click "Restart and Install"
7. App should update to v2.0.3

### Option 2: Test "Check Updates" Button

1. Install v2.0.3
2. Open the app
3. Go to Settings
4. Click "Check for Updates"
5. Should say "You're up to date!"

---

## 🌐 DEPLOY WEBSITE

### Automatic Deployment

The website will auto-deploy when you push to GitHub:

```bash
cd "Discord alternative (Beta)"
git add .
git commit -m "✨ Simplify website design + v2.0.3 update"
git push origin main
```

Vercel will automatically build and deploy.

### Manual Build (Optional)

```bash
cd "Discord alternative (Beta)/client"
npm run build
```

---

## 📋 CHECKLIST

Before uploading to GitHub:

- [ ] Version is 2.0.3 in `desktop/package.json`
- [ ] EXE file built successfully
- [ ] `latest.yml` file exists
- [ ] Website looks good (test locally)
- [ ] Download link updated to v2.0.3

After uploading:

- [ ] GitHub release created
- [ ] Files uploaded
- [ ] Release published
- [ ] Download link works
- [ ] Auto-update tested

---

## 🎯 EXPECTED RESULTS

### Website
- ✅ Clean, simple design
- ✅ Fast loading
- ✅ Clear download button
- ✅ Professional look
- ✅ Mobile responsive

### Desktop App
- ✅ Version 2.0.3
- ✅ Auto-update works
- ✅ "Check Updates" button works
- ✅ Download progress shows
- ✅ Restart and install works

### Auto-Update Flow
1. User opens app
2. App checks GitHub for updates
3. If new version found, shows notification
4. User clicks "Download Update"
5. Progress bar shows download
6. User clicks "Restart and Install"
7. App closes, installs update, restarts
8. New version running!

---

## 🔗 IMPORTANT LINKS

- **GitHub Repo**: https://github.com/JuusoJuusto/Collabrix
- **Releases**: https://github.com/JuusoJuusto/Collabrix/releases
- **Website**: https://collabrixs.vercel.app
- **Download**: https://collabrixs.vercel.app/download

---

## 🆘 TROUBLESHOOTING

### Build Fails
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
npm run build:win
```

### Update Not Working
- Make sure GitHub release is published (not draft)
- Check version numbers match
- Verify `latest.yml` is uploaded
- Check internet connection

### Website Not Updating
- Push changes to GitHub
- Check Vercel dashboard
- Verify build succeeds
- Clear browser cache

---

**Ready to build and upload! 🚀**

Run these commands:
```bash
cd "Discord alternative (Beta)/desktop"
npm run build:win
```

Then upload the files from `dist/` folder to GitHub Releases!
