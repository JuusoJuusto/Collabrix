# 🚀 COLLABRIX AUTO-UPDATE TEST GUIDE v2.0.3

## ✅ WHAT'S NEW IN v2.0.3
- Fixed auto-updater feed URL configuration
- Enhanced update check logging
- Improved "Check Updates" button functionality
- Better error handling for update checks
- Owl logo displayed prominently (32x32)
- Gradient titlebar with better styling

---

## 📋 STEP-BY-STEP UPDATE TEST

### STEP 1: Upload v2.0.0 to GitHub (Base Version)
1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v2.0.0`
4. Title: `Collabrix v2.0.0 - Base Version`
5. Upload these files from `desktop/dist/`:
   - `Collabrix-Setup-2.0.0.exe` (if you have it)
   - `latest.yml` (from v2.0.0 build)
6. Click "Publish release"

### STEP 2: Install v2.0.0
1. Download `Collabrix-Setup-2.0.0.exe` from GitHub
2. Run the installer
3. Launch Collabrix
4. Open DevTools (F12) to see console logs
5. You should see:
   ```
   🚀 Auto-checking for updates on startup...
   📦 Current version: 2.0.0
   🌐 Checking: https://github.com/JuusoJuusto/Collabrix/releases
   📍 Feed URL: [GitHub feed URL]
   ℹ️ App is up to date
   ```

### STEP 3: Upload v2.0.3 to GitHub (Update Version)
1. Go to: https://github.com/JuusoJuusto/Collabrix/releases
2. Click "Create a new release"
3. Tag: `v2.0.3`
4. Title: `Collabrix v2.0.3 - Update Test`
5. Upload these files from `desktop/dist/`:
   - `Collabrix-Setup-2.0.3.exe` ✅ (READY NOW)
   - `latest.yml` ✅ (READY NOW)
6. Click "Publish release"

### STEP 4: Test Auto-Update
1. Open Collabrix v2.0.0 (installed in Step 2)
2. Wait 3 seconds after launch
3. Check console (F12) - you should see:
   ```
   🚀 Auto-checking for updates on startup...
   🔍 Checking for update...
   ✅ Update available: 2.0.3
   ```
4. A purple notification should appear in top-right corner
5. Click "Download" button
6. Watch download progress in console
7. When done, click "Restart Now"
8. App should restart with v2.0.3

### STEP 5: Test Manual Update Check
1. In v2.0.0, click "🔄 Check Updates" button in titlebar
2. Button should change to "⏳ Checking..."
3. Console should show update check logs
4. Update notification should appear if v2.0.3 is available

---

## 🔍 TROUBLESHOOTING

### "Check Updates" Button Does Nothing
**SOLUTION**: 
- Open DevTools (F12) and check console for errors
- Make sure GitHub releases are public
- Verify `latest.yml` is uploaded with the .exe file
- Check that version in `latest.yml` matches the release tag

### No Update Notification Appears
**POSSIBLE CAUSES**:
1. Already on latest version
2. GitHub release not published yet (draft mode)
3. `latest.yml` file missing or incorrect
4. Network/firewall blocking GitHub

**CHECK**:
- Console logs (F12) for error messages
- GitHub release is published (not draft)
- Both .exe and latest.yml are uploaded

### Update Download Fails
**SOLUTION**:
- Check internet connection
- Verify .exe file is uploaded to GitHub release
- Check console for specific error messages

---

## 📁 FILES READY FOR v2.0.3

Location: `Discord alternative (Beta)/desktop/dist/`

✅ `Collabrix-Setup-2.0.3.exe` - Installer (ready to upload)
✅ `latest.yml` - Update metadata (ready to upload)

---

## 🎯 EXPECTED BEHAVIOR

### On App Startup:
1. Wait 3 seconds
2. Auto-check for updates
3. If update available → show notification
4. If up-to-date → log to console only

### When Clicking "Check Updates":
1. Button text changes to "⏳ Checking..."
2. Check GitHub for updates
3. Show notification if available
4. Button returns to "🔄 Check Updates" after 3 seconds

### Update Notification:
- Purple gradient background
- Shows version number
- "Download" button → downloads update
- "Later" button → dismisses notification
- After download → "Restart Now" button appears

---

## 📝 CONSOLE LOGS TO EXPECT

### Successful Update Check:
```
🚀 Auto-checking for updates on startup...
📦 Current version: 2.0.0
🌐 Checking: https://github.com/JuusoJuusto/Collabrix/releases
📍 Feed URL: https://github.com/JuusoJuusto/Collabrix
🔍 Checking for update...
✅ Update available: 2.0.3
Release date: [date]
```

### No Update Available:
```
🚀 Auto-checking for updates on startup...
📦 Current version: 2.0.3
🌐 Checking: https://github.com/JuusoJuusto/Collabrix/releases
🔍 Checking for update...
ℹ️ App is up to date
Current version: 2.0.3
```

### Update Error:
```
🚀 Auto-checking for updates on startup...
❌ Update check error: [error message]
Error details: [details]
```

---

## 🎉 SUCCESS CRITERIA

✅ v2.0.0 installs successfully
✅ Auto-check runs 3 seconds after launch
✅ Update notification appears when v2.0.3 is available
✅ "Check Updates" button triggers manual check
✅ Download progress shows in notification
✅ "Restart Now" installs update
✅ App restarts with v2.0.3

---

## 🚨 IMPORTANT NOTES

1. **GitHub Releases Must Be Public** - Private repos need authentication
2. **Both Files Required** - Upload both .exe AND latest.yml
3. **Version Must Match** - Tag version must match package.json version
4. **Wait for GitHub** - Can take 1-2 minutes for release to be available
5. **Check Console** - Always open DevTools (F12) to see what's happening

---

## 📞 NEXT STEPS

1. ✅ Build v2.0.3 complete
2. ⏳ Upload v2.0.0 to GitHub (if you have it)
3. ⏳ Install v2.0.0 locally
4. ⏳ Upload v2.0.3 to GitHub
5. ⏳ Test update from v2.0.0 → v2.0.3
6. ⏳ Verify "Check Updates" button works

---

**Files are ready in:** `Discord alternative (Beta)/desktop/dist/`
- `Collabrix-Setup-2.0.3.exe`
- `latest.yml`

**Upload to:** https://github.com/JuusoJuusto/Collabrix/releases/new
