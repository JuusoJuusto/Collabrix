# 🚀 ULTIMATE UPDATE TEST - v2.0.0 → v2.0.1

## ✅ WHAT'S READY

### v2.0.0 - THE ULTIMATE VERSION (Install This First)
- Auto-checks for updates on EVERY startup (3 seconds after launch)
- Manual "🔄 Check Updates" button works
- Better console logging
- Forces update check (no dev mode skip)

### v2.0.1 - TEST VERSION (For Testing Updates)
- Same as v2.0.0 but version number is higher
- Use this to test if v2.0.0 sees the update

## 📦 FILES READY

Both versions built in `desktop/dist/`:
- `Collabrix-Setup-2.0.0.exe` + `latest.yml`
- `Collabrix-Setup-2.0.1.exe` + `latest.yml`

## 🎯 STEP-BY-STEP TEST

### STEP 1: Upload v2.0.0 to GitHub
1. Go to: https://github.com/JuusoJuusto/Collabrix/releases/new
2. Tag: `v2.0.0`
3. Title: `Collabrix v2.0.0 - Ultimate Version`
4. Upload from `desktop/dist/`:
   - Find the FIRST build files (v2.0.0)
   - Upload `Collabrix-Setup-2.0.0.exe`
   - Upload `latest.yml` (the one created with v2.0.0)
5. **Publish release**

### STEP 2: Install v2.0.0
1. Download `Collabrix-Setup-2.0.0.exe` from GitHub
2. Install it
3. Run the app

### STEP 3: Check Console
1. Press `F12` to open DevTools
2. Go to Console tab
3. You should see:
```
🚀 Auto-checking for updates on startup...
🔍 CHECKING FOR UPDATES...
📦 Current version: 2.0.0
🌐 Checking: https://github.com/JuusoJuusto/Collabrix/releases
ℹ️ App is up to date
Current version: 2.0.0
```

### STEP 4: Upload v2.0.1 to GitHub
1. Go to: https://github.com/JuusoJuusto/Collabrix/releases/new
2. Tag: `v2.0.1`
3. Title: `Collabrix v2.0.1 - Update Test`
4. Upload from `desktop/dist/`:
   - `Collabrix-Setup-2.0.1.exe`
   - `latest.yml` (the NEW one from v2.0.1 build)
5. **Publish release**

### STEP 5: Test Update
1. **Close and reopen** your v2.0.0 app
2. Wait 3 seconds
3. Check Console - you should see:
```
🚀 Auto-checking for updates on startup...
🔍 CHECKING FOR UPDATES...
📦 Current version: 2.0.0
✅ Update available: 2.0.1
```
4. **Purple notification should appear!**
5. Click "Download"
6. Click "🚀 Restart Now"
7. App updates to v2.0.1!

### STEP 6: Verify Update
1. App restarts
2. Check Console again
3. Should say: `📦 Current version: 2.0.1`
4. Should say: `ℹ️ App is up to date`

## 🔄 Manual Button Test

At any time, click the "🔄 Check Updates" button in titlebar.

Console will show:
```
🔍 CHECKING FOR UPDATES...
📦 Current version: 2.0.0
```

## 🐛 If It Still Doesn't Work

### Check These:

1. **Is v2.0.1 published on GitHub?**
   - Go to https://github.com/JuusoJuusto/Collabrix/releases
   - See if v2.0.1 is there

2. **Are BOTH files uploaded?**
   - `Collabrix-Setup-2.0.1.exe`
   - `latest.yml`

3. **Is the release published (not draft)?**

4. **Check Console for errors:**
   - Press F12
   - Look for red error messages

5. **Try manual check:**
   - In Console, type: `window.electronAPI.checkForUpdates()`
   - Press Enter

## 📝 Summary

1. Upload v2.0.0 → Install it
2. Upload v2.0.1 → Reopen v2.0.0 app
3. Wait 3 seconds → See update notification!
4. Download → Restart → Updated!

---

**v2.0.0 auto-checks EVERY TIME you open the app!**
