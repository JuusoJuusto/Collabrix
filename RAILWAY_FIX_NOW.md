# 🚨 RAILWAY SERVER IS DOWN - FIX NOW

## The Problem

Railway server at `echochat-production.up.railway.app` is returning 500 errors because:
1. Firebase Admin credentials are not configured
2. Server is crashing on startup

## Quick Fix (5 minutes)

### Step 1: Get Firebase Admin Credentials

1. Go to: https://console.firebase.google.com/project/studiowl-3b22d/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download the JSON file
4. Open it and copy these values:
   - `project_id`
   - `private_key` (the entire key including BEGIN and END lines)
   - `client_email`

### Step 2: Configure Railway Environment Variables

1. Go to: https://railway.app/dashboard
2. Find your "echochat-production" project
3. Click on the server service
4. Go to "Variables" tab
5. Add these variables:

```
FIREBASE_PROJECT_ID=studiowl-3b22d
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@studiowl-3b22d.iam.gserviceaccount.com
```

**IMPORTANT**: For `FIREBASE_PRIVATE_KEY`:
- Copy the ENTIRE private key from the JSON file
- Keep the `\n` characters (they represent newlines)
- Include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

### Step 3: Redeploy

1. After adding variables, Railway will automatically redeploy
2. Wait 2-3 minutes
3. Check logs for: `✅ Firebase Admin initialized`

## Alternative: Run Server Locally

If Railway is too complicated, run the server on your own computer:

### 1. Setup Environment

Create `server/.env`:
```
PORT=3001
NODE_ENV=development
CORS_ORIGIN=https://collabrixs.vercel.app

FIREBASE_PROJECT_ID=studiowl-3b22d
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@studiowl-3b22d.iam.gserviceaccount.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Collabrix
SMTP_FROM_EMAIL=your-email@gmail.com
```

### 2. Run Server

```bash
cd server
npm install
npm run dev
```

### 3. Update Client

Change API URL in `client/src/lib/api.ts`:
```typescript
const API_URL = 'http://localhost:3001/api';
```

### 4. Rebuild Desktop App

```bash
cd client
npm run build

cd ../desktop
npm run build:win
```

## Why This Happened

Railway needs Firebase Admin SDK credentials to:
- Verify user tokens
- Access Firestore database
- Create servers and channels

Without these credentials, the server crashes with 500 errors.

## Check If It's Working

After fixing Railway:

1. Open browser console (F12)
2. Go to https://collabrixs.vercel.app
3. Login
4. Try to create a server
5. Should see NO 500 errors

## Still Not Working?

Check Railway logs:
1. Go to Railway dashboard
2. Click on your service
3. Click "Logs"
4. Look for errors

Common errors:
- `Firebase Admin initialization failed` = Wrong credentials
- `ECONNREFUSED` = Can't connect to Firebase
- `Invalid private key` = Private key format is wrong

---

**The server MUST have Firebase credentials to work!**

Get them from Firebase Console and add to Railway now.
