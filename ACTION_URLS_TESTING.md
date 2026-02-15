# Firebase Action URLs - Testing Guide

## ✅ Current Configuration

All Firebase action URLs are correctly configured to use `/auth/action`:

### 1. Email Verification (Registration)
**File:** `client/src/pages/Register.tsx` (Line 159-164)
```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/auth/action`,
  handleCodeInApp: false
};
await sendEmailVerification(user, actionCodeSettings);
```

### 2. Password Reset
**File:** `client/src/pages/ForgotPassword.tsx` (Line 18-21)
```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/auth/action`,
  handleCodeInApp: false
};
await sendPasswordResetEmail(auth, email, actionCodeSettings);
```

### 3. Action Handler
**File:** `client/src/pages/FirebaseAction.tsx`
**Route:** `/auth/action`

Handles all Firebase actions:
- ✅ `verifyEmail` - Email verification
- ✅ `resetPassword` - Password reset
- ✅ `recoverEmail` - Email recovery
- ✅ `verifyAndChangeEmail` - Email change verification

---

## 🧪 How to Test

### Test 1: Email Verification

1. **Register a new account:**
   - Go to: http://localhost:5173/register
   - Fill in all fields
   - Click "Register"

2. **Check email:**
   - Firebase sends verification email automatically
   - Email contains link like: `http://localhost:5173/auth/action?mode=verifyEmail&oobCode=...`

3. **Click verification link:**
   - Should redirect to `/auth/action`
   - Shows: "Email verified successfully!"
   - Auto-redirects to login after 3 seconds

4. **Login:**
   - Should work with verified email

### Test 2: Password Reset

1. **Go to forgot password:**
   - Go to: http://localhost:5173/forgot-password
   - Enter your email
   - Click "Send Reset Link"

2. **Check email:**
   - Firebase sends password reset email
   - Email contains link like: `http://localhost:5173/auth/action?mode=resetPassword&oobCode=...`

3. **Click reset link:**
   - Should redirect to `/auth/action`
   - Shows password reset form
   - Enter new password (min 8 characters)
   - Confirm password
   - Click "Reset Password"

4. **Verify:**
   - Shows: "Password reset successfully!"
   - Auto-redirects to login
   - Login with new password

### Test 3: Email Recovery

1. **Trigger email recovery** (if someone changes your email)
2. **Check email:**
   - Firebase sends recovery email
   - Email contains link like: `http://localhost:5173/auth/action?mode=recoverEmail&oobCode=...`

3. **Click recovery link:**
   - Should redirect to `/auth/action`
   - Shows: "Email recovered: your@email.com"
   - Auto-redirects to login

---

## 🔍 URL Structure

All Firebase action URLs follow this pattern:
```
https://your-domain.com/auth/action?mode=ACTION_TYPE&oobCode=CODE
```

**Parameters:**
- `mode` - Action type (verifyEmail, resetPassword, recoverEmail, verifyAndChangeEmail)
- `oobCode` - One-time code from Firebase
- `apiKey` - (optional) Firebase API key
- `lang` - (optional) Language code

**Examples:**
```
http://localhost:5173/auth/action?mode=verifyEmail&oobCode=ABC123...
http://localhost:5173/auth/action?mode=resetPassword&oobCode=XYZ789...
https://collabrix.vercel.app/auth/action?mode=verifyEmail&oobCode=ABC123...
```

---

## 🚀 Production Setup

### 1. Update Firebase Action URL Settings

Go to Firebase Console:
https://console.firebase.google.com/project/studiowl-3b22d/authentication/emails

**Email Templates:**
- Email address verification
- Password reset
- Email change verification

**Action URL:** Should be set to your production domain:
```
https://your-vercel-app.vercel.app/auth/action
```

### 2. Authorized Domains

Make sure your domain is authorized:
https://console.firebase.google.com/project/studiowl-3b22d/authentication/settings

Add:
- `localhost` (for development)
- `your-vercel-app.vercel.app` (for production)
- Your custom domain (if any)

---

## 🐛 Troubleshooting

### "Invalid action link" Error

**Causes:**
- Missing `mode` or `oobCode` parameter
- Link expired (links expire after 1 hour)
- Link already used

**Solution:**
- Request a new verification/reset email
- Check URL has both `mode` and `oobCode` parameters

### "This link has expired"

**Causes:**
- Link is older than 1 hour
- Link was already used

**Solution:**
- Request a new email
- Use the link within 1 hour

### Email Not Arriving

**Causes:**
- Email in spam folder
- Firebase email sending disabled
- Invalid email address

**Solution:**
- Check spam/junk folder
- Verify Firebase Authentication is enabled
- Check Firebase Console → Authentication → Templates

### Redirect Not Working

**Causes:**
- Route not configured in App.tsx
- Browser blocking redirect
- Invalid URL in actionCodeSettings

**Solution:**
- Verify route exists: `/auth/action`
- Check browser console for errors
- Verify `window.location.origin` is correct

---

## 📋 Checklist

### Development
- [x] Email verification URL configured
- [x] Password reset URL configured
- [x] Action handler route exists (`/auth/action`)
- [x] All action modes handled (verify, reset, recover, change)
- [x] Auto-redirect after success
- [x] Error handling for expired/invalid links

### Production
- [ ] Firebase authorized domains updated
- [ ] Action URL points to production domain
- [ ] Test email verification in production
- [ ] Test password reset in production
- [ ] Verify emails arrive (not in spam)
- [ ] Test all redirect flows

---

## 🎯 Summary

**Everything is already configured correctly!** ✅

The action URLs work as follows:

1. **User triggers action** (register, forgot password)
2. **Firebase sends email** with link to `/auth/action?mode=...&oobCode=...`
3. **User clicks link** → Opens `/auth/action` page
4. **FirebaseAction component** handles the action based on `mode`
5. **Success** → Shows message and redirects to login

**No changes needed** - the system is working as designed!

---

## 🔗 Related Files

- `client/src/pages/Register.tsx` - Email verification setup
- `client/src/pages/ForgotPassword.tsx` - Password reset setup
- `client/src/pages/FirebaseAction.tsx` - Action handler
- `client/src/App.tsx` - Route configuration

---

**Ready to test?** Register a new account and check your email for the verification link!
