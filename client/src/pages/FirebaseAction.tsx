import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset, checkActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function FirebaseAction() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [actionCode, setActionCode] = useState('');

  useEffect(() => {
    const handleAction = async () => {
      const actionMode = searchParams.get('mode');
      const code = searchParams.get('oobCode');

      console.log('Action mode:', actionMode);
      console.log('Code:', code ? 'present' : 'missing');

      if (!code || !actionMode) {
        setStatus('error');
        setMessage('Invalid action link. Please check your email and try again.');
        return;
      }

      setMode(actionMode);
      setActionCode(code);

      try {
        switch (actionMode) {
          case 'verifyEmail':
            console.log('Verifying email...');
            await applyActionCode(auth, code);
            setStatus('success');
            setMessage('Email verified successfully! You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
            break;

          case 'resetPassword':
            console.log('Verifying password reset code...');
            await verifyPasswordResetCode(auth, code);
            setStatus('success');
            setMessage('Please enter your new password');
            break;

          case 'recoverEmail':
            const info = await checkActionCode(auth, code);
            await applyActionCode(auth, code);
            setStatus('success');
            setMessage(`Email recovered: ${info.data.email}`);
            setTimeout(() => navigate('/login'), 3000);
            break;

          case 'verifyAndChangeEmail':
            await applyActionCode(auth, code);
            setStatus('success');
            setMessage('Email address changed successfully!');
            setTimeout(() => navigate('/login'), 3000);
            break;

          default:
            setStatus('error');
            setMessage('Unknown action type');
        }
      } catch (error: any) {
        console.error('Action error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setStatus('error');
        if (error.code === 'auth/invalid-action-code') {
          setMessage('This link is invalid or has already been used.');
        } else if (error.code === 'auth/expired-action-code') {
          setMessage('This link has expired. Please request a new one.');
        } else if (error.message && error.message.includes('sessionStorage')) {
          setMessage('Browser storage error. Please enable cookies and try again in a regular browser window (not incognito).');
        } else {
          setMessage(`An error occurred: ${error.message || 'Please try again.'}`);
        }
      }
    };

    handleAction();
  }, [searchParams, navigate]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPass) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setStatus('success');
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setStatus('error');
      if (error.code === 'auth/weak-password') {
        setMessage('Password is too weak');
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
              status === 'loading' ? 'bg-indigo-600' :
              status === 'success' ? 'bg-green-600' :
              'bg-red-600'
            }`}>
              {status === 'loading' && (
                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {status === 'success' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {status === 'loading' ? 'Processing...' :
               status === 'success' && mode === 'resetPassword' && !message.includes('successfully') ? 'Reset Password' :
               status === 'success' ? 'Success!' :
               'Error'}
            </h1>
          </div>

          {mode === 'resetPassword' && status === 'success' && !message.includes('successfully') ? (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <p className="text-slate-300 text-center mb-6">{message}</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <div className={`p-4 rounded-lg ${
              status === 'success' ? 'bg-green-500/10 border border-green-500/50' :
              status === 'error' ? 'bg-red-500/10 border border-red-500/50' :
              'bg-indigo-500/10 border border-indigo-500/50'
            }`}>
              <p className={`text-center ${
                status === 'success' ? 'text-green-200' :
                status === 'error' ? 'text-red-200' :
                'text-indigo-200'
              }`}>
                {message}
              </p>
            </div>
          )}

          {status !== 'loading' && (
            <button
              onClick={() => navigate('/login')}
              className="w-full mt-6 py-2 text-slate-400 hover:text-white transition"
            >
              Back to Login
            </button>
          )}
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 Collabrix. Secure collaboration platform.
        </p>
      </div>
    </div>
  );
}
