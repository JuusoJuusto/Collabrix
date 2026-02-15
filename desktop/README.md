# Collabrix Desktop App

Windows desktop application for Collabrix.

## Quick Start

1. Add icon files: `icon.ico` and `icon.png` (see CREATE_ICON.txt)
2. Run `build-windows.bat`
3. Find installer in `dist/` folder

## Features

- Frameless window with custom title bar
- No menu bar (clean interface)
- Installs to Program Files
- Start Menu and Desktop shortcuts
- Appears in Windows Apps & Features

## Build Commands

```bash
npm install              # Install dependencies
npm start               # Run in development
build-windows.bat       # Build installer
build-portable.bat      # Build portable version
```

## Output

- Installer: `dist/Collabrix-Setup-1.0.0.exe`
- Portable: `dist/win-unpacked/Collabrix.exe`

## Requirements

- Node.js 16+
- Windows 10/11
- Icon files (icon.ico + icon.png)
