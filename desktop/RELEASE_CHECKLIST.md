# Collabrix Release Checklist

## ✅ YOUR INSTALLER IS READY!

Location: `dist/collabrix-desktop Setup 1.0.0.exe` (76 MB)

## How Auto-Update Works

**Users NEVER download anything manually!** Everything happens inside the app:

1. User opens Collabrix
2. App checks GitHub for updates (automatic)
3. If update exists, notification appears in app
4. User clicks "Download" (downloads in background)
5. User clicks "Restart Now" (installs and restarts)
6. Done! User has new version

**Just like Discord!**

## Release New Version (Step-by-Step)

### Step 1: Update Version Number

Edit `package.json`:
```json
"version": "1.1.0"
```

### Step 2: Build Installer

Double-click: `BUILD-INSTALLER-ADMIN.bat`

Wait 2-3 minutes. Creates:
- `dist/collabrix-desktop Setup 1.1.0.exe`

### Step 3: Generate Update File

Double-click: `generate-update-file.bat`

Creates:
- `dist/latest.yml`

### Step 4: Upload to GitHub

1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v1.1.0` (MUST match package.json!)
4. Title: `Collabrix v1.1.0`
5. Description:
   ```markdown
   ## What's New
   - Feature 1
   - Feature 2
   - Bug fixes
   
   ## Auto-Update
   Existing users will be notified automatically!
   ```
6. Upload files:
   - `collabrix-desktop Setup 1.1.0.exe`
   - `latest.yml`
7. Click "Publish release"

### Step 5: Done!

Users with v1.0.0 will see update notification automatically!

## First Release (v1.0.0)

For your first release:

1. Run: `generate-update-file.bat`
2. Upload to GitHub Releases:
   - `collabrix-desktop Setup 1.0.0.exe`
   - `latest.yml`
3. Tag: `v1.0.0`
4. Publish

Now users can install v1.0.0, and they'll get auto-updates for future versions!

## Testing Auto-Update

1. Install v1.0.0 on your computer
2. Create v1.1.0 and upload to GitHub
3. Open the installed v1.0.0 app
4. Wait 3 seconds
5. You should see: "🔄 Update Available"
6. Click "Download"
7. Click "Restart Now"
8. App updates to v1.1.0!

## Important Notes

- Tag MUST match version: `v1.0.0` = `"version": "1.0.0"`
- Both files MUST be uploaded: `.exe` and `latest.yml`
- Release must be published (not draft)
- Users need internet connection for updates

## Quick Reference

```bash
# Update version
Edit package.json → "version": "1.1.0"

# Build
Double-click: BUILD-INSTALLER-ADMIN.bat

# Generate update file
Double-click: generate-update-file.bat

# Upload to GitHub
- collabrix-desktop Setup 1.1.0.exe
- latest.yml
- Tag: v1.1.0
```

## Summary

✅ Installer built: `dist/collabrix-desktop Setup 1.0.0.exe`
✅ Auto-update system: Working
✅ Update notification: In-app (top-right)
✅ Update download: Automatic (background)
✅ Update install: One-click restart

**Users never leave the app to update!**
