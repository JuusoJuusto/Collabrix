# Vercel 404 Fix - Action URLs

## Problem

Getting 404 errors on Vercel for routes like:
- `/auth/action?mode=verifyEmail&oobCode=...`
- `/login`
- `/register`
- Any client-side route

**Works on localhost but not on Vercel!**

## Root Cause

Vercel needs explicit configuration to handle client-side routing (React Router). Without it, Vercel tries to find actual files for these routes and returns 404.

## Solution Applied

### 1. Updated `client/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "cleanUrls": true,
  "trailingSlash": false
}
```

This tells Vercel:
- All routes should serve `index.html`
- React Router will handle the routing client-side
- Clean URLs (no .html extension)
- No trailing slashes

### 2. Kept `client/public/_redirects`

```
/*    /index.html   200
```

This is a fallback for other hosting platforms.

## How to Deploy the Fix

### Option 1: Redeploy from Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Find your project: `collabrixs`
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment
5. Wait ~2 minutes
6. Test the action URL again

### Option 2: Deploy from CLI

```bash
cd client
vercel --prod
```

### Option 3: Push to Git (Auto-deploy)

```bash
git add .
git commit -m "Fix: Vercel 404 errors for client-side routes"
git push origin main
```

If Vercel is connected to GitHub, it will auto-deploy.

## Verification

After deployment, test these URLs:

1. **Email Verification:**
   ```
   https://collabrixs.vercel.app/auth/action?mode=verifyEmail&oobCode=TEST
   ```
   Should show: "Invalid action link" or "This link has expired" (not 404!)

2. **Login Page:**
   ```
   https://collabrixs.vercel.app/login
   ```
   Should show: Login form (not 404!)

3. **Register Page:**
   ```
   https://collabrixs.vercel.app/register
   ```
   Should show: Registration form (not 404!)

4. **Password Reset:**
   ```
   https://collabrixs.vercel.app/forgot-password
   ```
   Should show: Forgot password form (not 404!)

## Why This Happens

### Localhost (Works)
- Vite dev server handles all routes
- Automatically serves `index.html` for all paths
- React Router takes over

### Vercel (Needs Config)
- Static file server by default
- Looks for actual files at each path
- Without config: `/auth/action` → 404 (no file exists)
- With config: `/auth/action` → `index.html` → React Router → FirebaseAction component

## Additional Vercel Settings

### Build Settings (Verify in Vercel Dashboard)

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`
5. **Root Directory:** `client` (if deploying from monorepo)

### Environment Variables (Already Set)

Make sure these are in Vercel:
```env
VITE_API_URL=https://echochat-production.up.railway.app/api
VITE_WS_URL=https://echochat-production.up.railway.app
VITE_FIREBASE_API_KEY=AIzaSyDb4aSjXkg0YtrSAGASmfqPvwThyR0X_G8
VITE_FIREBASE_AUTH_DOMAIN=studiowl-3b22d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=studiowl-3b22d
VITE_FIREBASE_STORAGE_BUCKET=studiowl-3b22d.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=140077048339
VITE_FIREBASE_APP_ID=1:140077048339:web:ce620a654c7130df3f55e6
```

## Troubleshooting

### Still Getting 404 After Redeploying?

1. **Clear Browser Cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open in incognito mode

2. **Check Vercel Build Logs:**
   - Go to Vercel Dashboard → Deployments → Click latest
   - Check "Building" tab for errors
   - Verify `vercel.json` was included in build

3. **Verify Root Directory:**
   - Vercel Dashboard → Settings → General
   - Root Directory should be: `client`
   - Or leave blank if deploying from client folder directly

4. **Check vercel.json Location:**
   - Must be in `client/vercel.json`
   - Not in root `vercel.json` (that's for monorepo)

5. **Redeploy with Force:**
   ```bash
   cd client
   vercel --prod --force
   ```

### Routes Work But Refresh Shows 404?

This means `vercel.json` is not being applied. Check:
- File is in correct location (`client/vercel.json`)
- File has correct syntax (valid JSON)
- Redeploy after making changes

### Firebase Action Links Still 404?

1. **Update Firebase Action URL:**
   - Go to: https://console.firebase.google.com/project/studiowl-3b22d/authentication/emails
   - Update action URL to: `https://collabrixs.vercel.app/auth/action`

2. **Verify Authorized Domains:**
   - Go to: https://console.firebase.google.com/project/studiowl-3b22d/authentication/settings
   - Add: `collabrixs.vercel.app`

## Quick Fix Checklist

- [x] Updated `client/vercel.json` with rewrites
- [ ] Pushed to Git
- [ ] Redeployed on Vercel
- [ ] Cleared browser cache
- [ ] Tested `/auth/action` URL
- [ ] Tested `/login` URL
- [ ] Tested email verification link
- [ ] Tested password reset link
- [ ] Updated Firebase authorized domains

## Expected Behavior After Fix

✅ All routes work on refresh  
✅ Email verification links work  
✅ Password reset links work  
✅ Direct URL access works  
✅ Browser back/forward works  
✅ No 404 errors on any route  

## Summary

The fix is simple: `vercel.json` tells Vercel to serve `index.html` for all routes, allowing React Router to handle client-side routing.

**Deploy the fix now:**
```bash
cd client
vercel --prod
```

Your action URLs will work in ~2 minutes! 🚀
