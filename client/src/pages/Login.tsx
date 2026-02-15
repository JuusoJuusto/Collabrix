import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let email = loginInput;

      // Check if input is email, username, or phone
      if (!loginInput.includes('@')) {
        try {
          let userQuery;
          
          if (loginInput.startsWith('+') || /^\d+$/.test(loginInput)) {
            const phoneNumber = loginInput.startsWith('+') ? loginInput : `+${loginInput}`;
            userQuery = query(collection(db, 'users'), where('phoneNumber', '==', phoneNumber));
          } else {
            userQuery = query(collection(db, 'users'), where('username', '==', loginInput));
          }

          const querySnapshot = await getDocs(userQuery);
          
          if (querySnapshot.empty) {
            setError('User not found. Please check your credentials.');
            setLoading(false);
            return;
          }

          email = querySnapshot.docs[0].data().email;
        } catch (firestoreError) {
          // If Firestore is blocked, try direct email login
          console.warn('Firestore blocked, trying direct login');
          if (!loginInput.includes('@')) {
            setError('Please use your email address to login.');
            setLoading(false);
            return;
          }
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        try {
          await sendEmailVerification(user);
        } catch (e) {
          console.warn('Could not send verification email');
        }
        setLoading(false);
        return;
      }

      // Try to get user data from Firestore, fallback to Firebase Auth
      let userData: any = {
        email: user.email!,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        status: 'ONLINE'
      };

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          userData = {
            email: firestoreData.email,
            username: firestoreData.username,
            displayName: firestoreData.displayName,
            status: 'ONLINE'
          };
          
          // Check 2FA
          if (firestoreData.twoFactorEnabled && !showTwoFactor) {
            setShowTwoFactor(true);
            setLoading(false);
            return;
          }

          if (showTwoFactor && (!twoFactorCode || twoFactorCode.length !== 6)) {
            setError('Please enter a valid 6-digit code');
            setLoading(false);
            return;
          }

          // Update status
          await updateDoc(doc(db, 'users', user.uid), {
            status: 'ONLINE',
            lastSeen: new Date().toISOString()
          });
        }
      } catch (firestoreError) {
        console.warn('Firestore blocked, using Firebase Auth data only');
      }

      const token = await user.getIdToken();

      setAuth({
        id: user.uid,
        ...userData
      }, token);

      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Try to create/update user in Firestore
      let userData: any = {
        email: user.email!,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        status: 'ONLINE'
      };

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            id: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            countryCode: '+1',
            country: 'US',
            username: user.email?.split('@')[0] || 'user',
            displayName: user.displayName || 'User',
            birthday: '',
            location: '',
            language: 'en',
            avatar: user.photoURL,
            bio: null,
            status: 'ONLINE',
            emailVerified: user.emailVerified,
            phoneVerified: false,
            twoFactorEnabled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } else {
          await updateDoc(userDocRef, {
            status: 'ONLINE',
            lastSeen: new Date().toISOString()
          });
          
          const firestoreData = userDoc.data();
          userData = {
            email: firestoreData.email,
            username: firestoreData.username,
            displayName: firestoreData.displayName,
            status: 'ONLINE'
          };
        }
      } catch (firestoreError) {
        console.warn('Firestore blocked, using Google account data only');
      }

      setAuth({
        id: user.uid,
        ...userData
      }, token);

      navigate('/');
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to Collabrix</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!showTwoFactor ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
                    placeholder="Enter your email or username"
                    required
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder-slate-500"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                  Two-Factor Authentication
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Enter the 6-digit code from your authenticator
                </p>
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 mt-3 block mx-auto transition"
                >
                  ← Back to login
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{showTwoFactor ? 'Verify & Sign In' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {!showTwoFactor && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>

              <div className="mt-6 text-center space-y-3">
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
                    Sign up
                  </Link>
                </p>

                <Link to="/forgot-password" className="text-sm text-slate-400 hover:text-slate-300 block transition">
                  Forgot your password?
                </Link>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 Collabrix. Secure collaboration platform.
        </p>
      </div>
    </div>
  );
}
