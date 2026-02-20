# 🚂 Railway Deployment Guide

## Current Issue

The Railway server at `echochat-production.up.railway.app` is returning 500 errors because it needs to be redeployed with the latest code.

## Quick Fix

Railway automatically deploys when you push to GitHub. Since we just pushed the latest code, Railway should automatically redeploy within 2-3 minutes.

### Check Deployment Status

1. Go to: https://railway.app/dashboard
2. Find your "echochat-production" project
3. Check the deployment logs
4. Wait for "Build successful" and "Deployment live"

## If Auto-Deploy Doesn't Work

### Manual Redeploy

1. Go to Railway dashboard
2. Click on your server service
3. Click "Deploy" → "Redeploy"
4. Wait 2-3 minutes for build to complete

## Environment Variables Required

Make sure these are set in Railway:

```
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://collabrixs.vercel.app

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# SMTP (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Collabrix
SMTP_FROM_EMAIL=your-email@gmail.com
```

## Verify Deployment

After deployment completes:

1. Check server is running:
   ```
   curl https://echochat-production.up.railway.app/
   ```

2. Test CORS:
   ```
   curl -H "Origin: https://collabrixs.vercel.app" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://echochat-production.up.railway.app/api/servers
   ```

3. Should see `Access-Control-Allow-Origin` header

## Common Issues

### 500 Error
- Server code has errors
- Check Railway logs for error messages
- Verify environment variables are set

### 401 Error (No token provided)
- User needs to login first
- This is normal before authentication

### CORS Error
- Check CORS_ORIGIN environment variable
- Should be: `https://collabrixs.vercel.app`

## Testing After Deploy

1. Open https://collabrixs.vercel.app
2. Register a new account
3. Verify email
4. Login
5. Create a server
6. Should work without errors!

## Railway Build Settings

Make sure these are configured:

- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

## Logs

To view logs:
1. Go to Railway dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for errors

Common log messages:
- ✅ `🚀 Server running on port 3001`
- ✅ `📡 WebSocket server ready`
- ✅ `🔥 Firebase initialized`
- ❌ `Error: ...` (check the error message)

## Success Indicators

When everything is working:
- No 500 errors in browser console
- Server creation works
- Chat messages send/receive
- WebSocket connects successfully

---

**The server will automatically redeploy when you push to GitHub!**

Just wait 2-3 minutes after pushing and everything should work.
