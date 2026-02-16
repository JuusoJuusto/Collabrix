# Installer FAQ

## Why does building require admin?

**Short answer:** Windows security requires admin privileges to extract code signing tools.

**Long answer:** 
- electron-builder downloads code signing tools that contain symbolic links (Mac/Linux files)
- Windows needs admin rights to create symbolic links
- This only affects BUILDING the installer, not using it

## Can I share the installer with others?

**YES! Absolutely!**

Once you build `Collabrix-Setup-1.0.0.exe`, you can share it with ANYONE:

- Upload to Google Drive
- Upload to Dropbox  
- Upload to GitHub Releases
- Email it
- Put it on a USB drive
- Host it on your website

**Users DO NOT need admin to install!** They can install to:
- Their user folder (no admin needed)
- Program Files (admin needed, but optional)

The installer gives them a choice during installation.

## How to distribute:

### Option 1: GitHub Releases (Recommended)
1. Upload `Collabrix-Setup-1.0.0.exe` to GitHub Releases
2. Share the download link
3. Users get auto-updates!

### Option 2: Direct Download
1. Upload to Google Drive / Dropbox
2. Make it public
3. Share the link

### Option 3: Your Website
1. Host the .exe file
2. Add download button
3. Users download and install

## Installation for Users:

1. Download `Collabrix-Setup-1.0.0.exe`
2. Double-click to run
3. Choose installation location:
   - **User folder** (no admin) - Recommended
   - **Program Files** (needs admin)
4. Click Install
5. Done!

## Summary:

- **Building:** Needs admin (one time, only you)
- **Installing:** No admin needed (users can install to their folder)
- **Sharing:** YES! Share with everyone!
- **Updates:** Automatic for all users

You build it once with admin, then everyone can use it without admin!
