# Collabrix Desktop App - Setup Guide

## ✅ What's Been Created

A complete Electron desktop app that wraps your Collabrix web app into a native Windows/Mac/Linux application.

**Location:** `desktop/` folder

## 🚀 How to Build the .exe Installer

### Step 1: Add an Icon (Required)

1. Create or download a 512x512 PNG icon
2. Save it as `desktop/icon.png`
3. See `desktop/ICON_INSTRUCTIONS.txt` for details

### Step 2: Install Dependencies

```bash
cd desktop
npm install
```

This installs:
- Electron (desktop framework)
- Electron Builder (creates installers)

### Step 3: Build Windows Installer

**Option A: Use the batch file**
```bash
cd desktop
build-windows.bat
```

**Option B: Use npm command**
```bash
cd desktop
npm run build:win
```

### Step 4: Get Your Installer

Output location: `desktop/dist/Collabrix Setup 1.0.0.exe`

File size: ~150-200 MB (includes Chromium)

## 📦 What the Installer Does

1. User downloads `Collabrix Setup 1.0.0.exe`
2. Runs the installer
3. Chooses installation directory (default: `C:\Program Files\Collabrix`)
4. Creates desktop shortcut
5. Creates Start Menu entry
6. App launches and loads https://collabrixs.vercel.app

## 🎯 Features

- **Native Window:** Looks like a real desktop app
- **System Tray:** Minimize to tray (optional)
- **Auto-Start:** Start with Windows (optional)
- **Better Performance:** Faster than browser
- **Offline Detection:** Shows when disconnected
- **External Links:** Opens in default browser

## 🌍 Build for Other Platforms

### macOS (.dmg)
```bash
npm run build:mac
```
Output: `dist/Collabrix-1.0.0.dmg`

### Linux (.AppImage)
```bash
npm run build:linux
```
Output: `dist/Collabrix-1.0.0.AppImage`

## 📤 Distribution

### Option 1: GitHub Releases (Recommended)

1. Build all installers
2. Go to: https://github.com/JuusoJuusto/Collabrix/releases
3. Click "Create a new release"
4. Tag: `v1.0.0`
5. Upload installers
6. Publish

Download links will be:
```
https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-Setup-1.0.0.exe
```

### Option 2: Direct Download

Host the .exe on:
- Your own server
- Google Drive (public link)
- Dropbox (public link)
- OneDrive (public link)

### Option 3: Add to Website

Update owlapps to show download button:
```html
<a href="https://github.com/.../Collabrix-Setup-1.0.0.exe">
  Download for Windows
</a>
```

## 🔧 Customization

### Change App URL

Edit `desktop/main.js` line 23:
```javascript
mainWindow.loadURL('https://collabrixs.vercel.app');
```

### Change Window Size

Edit `desktop/main.js` lines 7-8:
```javascript
width: 1280,
height: 800,
```

### Change App Name

Edit `desktop/package.json`:
```json
"productName": "Collabrix",
```

## 🐛 Troubleshooting

### Build Fails

**Windows:**
```bash
npm install --global windows-build-tools
```

**macOS:**
```bash
xcode-select --install
```

### Icon Not Showing

- Ensure `icon.png` exists in `desktop/` folder
- Icon must be 512x512 PNG
- Rebuild after adding icon

### App Won't Start

Test in development mode:
```bash
npm start
```

Check console for errors.

## 📊 File Sizes

- **Windows .exe:** ~150-200 MB
- **macOS .dmg:** ~180-220 MB
- **Linux .AppImage:** ~150-180 MB

Large because includes Chromium browser engine.

## 🔄 Auto-Updates (Optional)

To enable auto-updates:

1. Uncomment lines in `main.js`
2. Configure GitHub releases in `package.json`
3. Rebuild

Users will get notifications when new versions are available.

## ✨ Next Steps

1. **Add icon:** Create `desktop/icon.png`
2. **Build installer:** Run `build-windows.bat`
3. **Test installer:** Install and test the app
4. **Upload to GitHub:** Create a release
5. **Share link:** Add download button to website

## 📞 Support

If you encounter issues:
1. Check `desktop/README.md` for detailed docs
2. Test with `npm start` first
3. Check Electron Builder docs: https://www.electron.build/

---

**Ready to build?**
```bash
cd desktop
build-windows.bat
```

Your .exe installer will be in `desktop/dist/` folder! 🎉
