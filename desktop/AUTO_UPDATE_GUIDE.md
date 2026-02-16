# Collabrix Auto-Update System

## How It Works

The desktop app now has Discord-style auto-updates! When you release a new version, users will automatically get notified.

## Update Flow

1. **App starts** → Checks for updates after 3 seconds
2. **Update found** → Shows notification in top-right corner
3. **User clicks "Download"** → Downloads update in background
4. **Download complete** → Shows "Restart Now" button
5. **User clicks "Restart Now"** → Installs update and restarts app

## For Users

When an update is available, you'll see a notification like this:

```
🔄 Update Available
Version 1.1.0 is available
[Download] [Later]
```

Click "Download" to get the update. Once downloaded:

```
✅ Update Ready
Restart to install
[Restart Now] [Later]
```

Click "Restart Now" to install and restart the app.

## For Developers (You!)

### Step 1: Build New Version

1. Update version in `package.json`:
   ```json
   "version": "1.1.0"
   ```

2. Build the installer:
   ```bash
   Double-click: BUILD-INSTALLER-ADMIN.bat
   ```

3. This creates:
   - `dist/Collabrix-Setup-1.1.0.exe` (installer)
   - `dist/latest.yml` (update metadata)

### Step 2: Upload to GitHub Releases

1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v1.1.0` (must match package.json version!)
4. Title: `Collabrix v1.1.0`
5. Description: What's new in this version
6. Upload these files:
   - `Collabrix-Setup-1.1.0.exe`
   - `latest.yml`
7. Click "Publish release"

### Step 3: Users Get Notified

- Users with v1.0.0 will see update notification
- They download and install v1.1.0
- Done!

## Update Configuration

The app checks for updates from GitHub:
- Owner: `JuusoJuusto`
- Repo: `Collabrix`
- Provider: `github`

This is configured in `package.json`:
```json
"publish": {
  "provider": "github",
  "owner": "JuusoJuusto",
  "repo": "Collabrix"
}
```

## Testing Updates

### Test in Development

The app skips update checks in development mode to avoid errors.

### Test with Real Releases

1. Build v1.0.0 and install it
2. Build v1.1.0 and upload to GitHub
3. Open the installed v1.0.0 app
4. Wait 3 seconds
5. You should see the update notification!

## Update Files

When you build, electron-builder creates:

- `Collabrix-Setup-1.0.0.exe` - The installer
- `latest.yml` - Update metadata (version, file size, checksums)

Both files MUST be uploaded to GitHub Releases for auto-update to work.

## Troubleshooting

### Users don't see updates

- Check that `latest.yml` is uploaded to GitHub Releases
- Check that the release is published (not draft)
- Check that the tag matches the version (v1.1.0)

### Update download fails

- Check that the .exe file is uploaded to GitHub Releases
- Check that the file name matches what's in latest.yml

### Update notification doesn't appear

- Check that the app has internet connection
- Check that GitHub Releases is accessible
- Check browser console for errors

## Version Numbering

Use semantic versioning:
- `1.0.0` → `1.0.1` (bug fixes)
- `1.0.0` → `1.1.0` (new features)
- `1.0.0` → `2.0.0` (breaking changes)

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Build installer with BUILD-INSTALLER-ADMIN.bat
- [ ] Test the installer
- [ ] Create GitHub release with tag `v1.x.x`
- [ ] Upload `Collabrix-Setup-1.x.x.exe`
- [ ] Upload `latest.yml`
- [ ] Publish the release
- [ ] Test update notification on old version

## Example Release Notes

```markdown
# Collabrix v1.1.0

## What's New
- Added voice channel improvements
- Fixed login issues
- Improved performance

## Download
- Windows: Collabrix-Setup-1.1.0.exe

## Auto-Update
Existing users will be notified automatically!
```

## Summary

1. Change version in package.json
2. Build with BUILD-INSTALLER-ADMIN.bat
3. Upload .exe and latest.yml to GitHub Releases
4. Users get notified automatically!

Just like Discord! 🎉
