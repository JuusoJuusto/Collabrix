# Collabrix Desktop

Desktop application for Collabrix - Discord-style platform for gamers and communities.

## Features

- Native desktop experience
- System tray integration
- Auto-start on boot (optional)
- Native notifications
- Better performance than browser
- Offline detection

## Development

### Install Dependencies

```bash
cd desktop
npm install
```

### Run in Development

```bash
npm start
```

### Build Installer

#### Windows (.exe)
```bash
npm run build:win
```

Output: `dist/Collabrix Setup 1.0.0.exe`

#### macOS (.dmg)
```bash
npm run build:mac
```

Output: `dist/Collabrix-1.0.0.dmg`

#### Linux (.AppImage, .deb)
```bash
npm run build:linux
```

Output: 
- `dist/Collabrix-1.0.0.AppImage`
- `dist/collabrix_1.0.0_amd64.deb`

## Installation

### Windows

1. Download `Collabrix Setup 1.0.0.exe`
2. Run the installer
3. Choose installation directory
4. Click Install
5. Launch Collabrix from Start Menu or Desktop

### macOS

1. Download `Collabrix-1.0.0.dmg`
2. Open the DMG file
3. Drag Collabrix to Applications folder
4. Launch from Applications

### Linux

**AppImage:**
```bash
chmod +x Collabrix-1.0.0.AppImage
./Collabrix-1.0.0.AppImage
```

**Debian/Ubuntu:**
```bash
sudo dpkg -i collabrix_1.0.0_amd64.deb
```

## Distribution

### Upload to GitHub Releases

1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v1.0.0`
4. Title: `Collabrix Desktop v1.0.0`
5. Upload installers:
   - `Collabrix Setup 1.0.0.exe` (Windows)
   - `Collabrix-1.0.0.dmg` (macOS)
   - `Collabrix-1.0.0.AppImage` (Linux)
   - `collabrix_1.0.0_amd64.deb` (Debian/Ubuntu)
6. Publish release

### Download Links

Add to website:
```
Windows: https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-Setup-1.0.0.exe
macOS: https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-1.0.0.dmg
Linux: https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-1.0.0.AppImage
```

## Configuration

### Change App URL

Edit `main.js` line 23:
```javascript
mainWindow.loadURL('https://collabrixs.vercel.app');
```

### Change App Icon

Replace `icon.png` with your own icon (512x512 PNG recommended)

### Auto-Updates

Uncomment lines in `main.js`:
```javascript
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();
```

Then configure in `package.json`:
```json
"publish": {
  "provider": "github",
  "owner": "JuusoJuusto",
  "repo": "Collabrix"
}
```

## Troubleshooting

### Build Fails on Windows

Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

### Build Fails on macOS

Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### App Won't Start

Check console for errors:
```bash
npm start
```

### Icon Not Showing

- Ensure `icon.png` exists
- Icon should be 512x512 PNG
- Rebuild the app

## Tech Stack

- Electron 28
- Node.js
- Electron Builder

## License

MIT License - StudiOWL
