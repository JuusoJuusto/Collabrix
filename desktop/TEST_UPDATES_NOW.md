# TEST UPDATES RIGHT NOW

## Step 1: Check GitHub Releases

Go to: https://github.com/JuusoJuusto/Collabrix/releases

**Do you see these releases?**
- ✅ v1.0.1 (with Collabrix-Setup-1.0.1.exe and latest.yml)
- ✅ v1.0.2 (with Collabrix-Setup-1.0.2.exe and latest.yml)  
- ✅ v1.0.3 (with Collabrix-Setup-1.0.3.exe and latest.yml)

**If v1.0.3 is NOT there:**
1. Go to: https://github.com/JuusoJuusto/Collabrix/releases/new
2. Tag: `v1.0.3`
3. Title: `v1.0.3 - Manual Update Check`
4. Upload from `desktop/dist/`:
   - Collabrix-Setup-1.0.3.exe
   - latest.yml
5. Click "Publish release"

## Step 2: Open Desktop App

**IMPORTANT:** Open the DESKTOP APP (Collabrix.exe), NOT the website!

The desktop app is in:
- `desktop/dist/win-unpacked/Collabrix.exe` (if you built it)
- OR wherever you installed it

## Step 3: Open DevTools

Press `F12` or `Ctrl+Shift+I`

Click the "Console" tab

## Step 4: Check for Updates

Click the blue "🔄 Check Updates" button in the titlebar

## Step 5: Watch Console

You should see:
```
⏰ Starting update check...
🔍 Checking for updates...
Current version: 1.0.1 (or 1.0.2)
Checking GitHub: JuusoJuusto/Collabrix
🔍 Checking for update...
✅ Update available: 1.0.3
```

## Step 6: See Notification

A purple gradient notification should appear in the top-right!

## If You Don't See It:

### Check Console for Errors:

**Error: "net::ERR_INTERNET_DISCONNECTED"**
→ Check your internet connection

**Error: "404 Not Found"**
→ v1.0.3 is not uploaded to GitHub yet

**Error: "No update available"**
→ You're already on v1.0.3 or newer

**No errors, but no notification:**
→ Check if `window.electronAPI` exists in console
→ Type: `window.electronAPI` and press Enter

## Quick Test:

In the Console tab, type:
```javascript
window.electronAPI.checkForUpdates()
```

This manually triggers the update check.

---

**The update system WORKS - it just needs v1.0.3 on GitHub!**
