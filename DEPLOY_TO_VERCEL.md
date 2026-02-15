# Deploy Updated Client to Vercel

## Quick Deploy

### Option 1: Using Vercel CLI (Recommended)

```bash
cd client
vercel --prod
```

That's it! Vercel will:
- Build your React app
- Deploy to production
- Show you the live URL

### Option 2: Using Git Push (If connected to GitHub)

```bash
# From project root
git add .
git commit -m "Fix: Birthday order now Day/Month/Year"
git push origin main
```

Vercel will automatically deploy when you push to your main branch.

### Option 3: Using Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Find your project
3. Click "Deployments"
4. Click "Redeploy" on the latest deployment
5. Or click "Deploy" → "Import Git Repository"

---

## First Time Setup (If Not Deployed Yet)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy Client

```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (or Y if you have one)
- What's your project's name? **collabrix-client** (or your choice)
- In which directory is your code located? **./** (current directory)
- Want to override settings? **N**

### 4. Deploy to Production

```bash
vercel --prod
```

---

## Environment Variables on Vercel

Make sure these are set in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add these:

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

**Important:** After adding/changing environment variables, you must redeploy!

---

## Update Backend CORS

After deploying to Vercel, update your backend to allow the new domain:

### 1. Get Your Vercel URL
After deployment, you'll get a URL like:
- `https://collabrix-client.vercel.app`
- Or your custom domain

### 2. Update Railway Environment Variables

Go to Railway dashboard and update:
```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Or if you have multiple domains:
```env
CORS_ORIGIN=https://your-vercel-app.vercel.app,http://localhost:5173
```

### 3. Update Firebase Authorized Domains

1. Go to: https://console.firebase.google.com/project/studiowl-3b22d/authentication/settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `your-vercel-app.vercel.app`
5. Save

---

## Verify Deployment

After deploying, test:

1. **Open your Vercel URL**
   - Should load the app

2. **Test Registration**
   - Birthday should show: Day / Month / Year ✅
   - Not: Month / Day / Year ❌

3. **Check Console**
   - No CORS errors
   - API calls work
   - WebSocket connects

4. **Test Login**
   - Should work with Firebase auth

---

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard:
```bash
# Or locally test the build:
cd client
npm run build
```

### CORS Errors

Update Railway `CORS_ORIGIN` to include your Vercel domain.

### Environment Variables Not Working

1. Check they're set in Vercel dashboard
2. Redeploy after adding variables
3. Variables must start with `VITE_` for Vite

### Firebase Auth Not Working

Add your Vercel domain to Firebase authorized domains.

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `collabrix.com`)
3. Follow DNS setup instructions
4. Update Firebase authorized domains
5. Update Railway CORS_ORIGIN

---

## Deployment Checklist

- [ ] Code changes committed
- [ ] `cd client` directory
- [ ] Run `vercel --prod`
- [ ] Deployment successful
- [ ] Test birthday order (Day/Month/Year)
- [ ] Update Railway CORS_ORIGIN
- [ ] Add domain to Firebase
- [ ] Test registration
- [ ] Test login
- [ ] Test real-time features

---

## Quick Commands Reference

```bash
# Deploy to production
cd client
vercel --prod

# Deploy to preview
cd client
vercel

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

---

**Ready to deploy?** Run:
```bash
cd client
vercel --prod
```

Your updated app with the correct birthday order will be live in ~2 minutes! 🚀
