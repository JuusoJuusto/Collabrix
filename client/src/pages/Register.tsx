import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

const countries = [
  { code: '+1', name: 'United States', flag: '🇺🇸', country: 'US' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', country: 'CA' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', country: 'GB' },
  { code: '+358', name: 'Finland', flag: '🇫🇮', country: 'FI' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', country: 'SE' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', country: 'NO' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', country: 'DK' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', country: 'DE' },
  { code: '+33', name: 'France', flag: '🇫🇷', country: 'FR' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', country: 'ES' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', country: 'IT' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', country: 'NL' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', country: 'BE' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', country: 'CH' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', country: 'AT' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', country: 'PT' },
  { code: '+48', name: 'Poland', flag: '🇵🇱', country: 'PL' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', country: 'RU' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', country: 'JP' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', country: 'KR' },
  { code: '+86', name: 'China', flag: '🇨🇳', country: 'CN' },
  { code: '+91', name: 'India', flag: '🇮🇳', country: 'IN' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', country: 'AU' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', country: 'NZ' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', country: 'BR' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', country: 'MX' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', country: 'ZA' },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fi', name: 'Suomi (Finnish)', flag: '🇫🇮' },
  { code: 'sv', name: 'Svenska (Swedish)', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk (Norwegian)', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk (Danish)', flag: '🇩🇰' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands (Dutch)', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski (Polish)', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
];

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    countryCode: '+358',
    country: 'FI',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    location: '',
    language: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.country === e.target.value);
    if (selectedCountry) {
      setFormData({
        ...formData,
        country: selectedCountry.country,
        countryCode: selectedCountry.code
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const age = validateAge(formData.birthday);
    if (age < 13) {
      setError('You must be at least 13 years old to register');
      setLoading(false);
      return;
    }

    const fullPhoneNumber = formData.countryCode + formData.phoneNumber;
    if (!fullPhoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number');
      setLoading(false);
      return;
    }

    try {
      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      setVerificationSent(true);

      const token = await user.getIdToken();

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: formData.email,
        phoneNumber: fullPhoneNumber,
        countryCode: formData.countryCode,
        country: formData.country,
        username: formData.username,
        displayName: formData.displayName,
        birthday: formData.birthday,
        location: formData.location,
        language: formData.language,
        avatar: null,
        bio: null,
        status: 'ONLINE',
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const userData = {
        id: user.uid,
        email: formData.email,
        username: formData.username,
        displayName: formData.displayName,
        phoneNumber: fullPhoneNumber,
        birthday: formData.birthday,
        location: formData.location,
        language: formData.language,
        country: formData.country,
        status: 'ONLINE' as const
      };

      setAuth(userData, token);
      
      // Send welcome email via backend
      try {
        await fetch('http://localhost:3001/api/auth/send-welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
            userId: user.uid
          })
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't block registration if email fails
      }
      
      // Show verification message
      alert('✅ Account created! Please check your email to verify your account before logging in.');
      
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Create/update user document
      await setDoc(doc(db, 'users', user.uid), {
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
      }, { merge: true });

      const userData = {
        id: user.uid,
        email: user.email!,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        status: 'ONLINE' as const
      };

      setAuth(userData, token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Create/update user document
      await setDoc(doc(db, 'users', user.uid), {
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
      }, { merge: true });

      const userData = {
        id: user.uid,
        email: user.email!,
        username: user.email?.split('@')[0] || 'user',
        displayName: user.displayName || 'User',
        status: 'ONLINE' as const
      };

      setAuth(userData, token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Apple sign-in failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-discord-darkest p-4">
      <div className="w-full max-w-2xl p-8 bg-discord-darker rounded-lg shadow-xl my-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Join the conversation</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {verificationSent && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded text-green-200 text-sm">
            ✅ Verification email sent! Check your inbox.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                placeholder="cooluser123"
                required
                pattern="[a-zA-Z0-9_]{3,32}"
                title="3-32 characters, letters, numbers, and underscores only"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
              placeholder="Cool User"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={handleCountryChange}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                required
              >
                {countries.map((country) => (
                  <option key={country.country} value={country.country}>
                    {country.flag} {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.countryCode}
                  readOnly
                  className="w-20 px-2 py-2 bg-discord-gray text-white rounded text-center font-mono"
                />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                  placeholder="1234567890"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Country code auto-filled</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birthday <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                required
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">Must be 13+</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                required
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location / City (Optional)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
              placeholder="Helsinki, Finland"
            />
            <p className="text-xs text-gray-500 mt-1">Where do you live?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 bg-discord-dark text-white rounded focus:outline-none focus:ring-2 focus:ring-discord-blurple"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-discord-blurple text-white rounded font-medium hover:bg-discord-blurple/90 disabled:opacity-50 transition"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-discord-darker text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={handleGoogleSignIn}
              className="py-3 bg-white text-gray-800 rounded font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              onClick={handleAppleSignIn}
              className="py-3 bg-black text-white rounded font-medium hover:bg-gray-900 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-discord-blurple hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-4 text-center text-gray-500 text-xs">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
