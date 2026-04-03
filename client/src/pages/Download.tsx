import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Download() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          startDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const startDownload = () => {
    setDownloadStarted(true);
    // Direct download from GitHub release v.1.0.0
    const downloadUrl = 'https://github.com/JuusoJuusto/Collabrix/releases/download/v.1.0.0/Collabrix-Setup-2.1.0.exe';
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Collabrix-Setup-2.1.0.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Animated Background - Same as Landing */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Collabrix" className="w-12 h-12 transform hover:scale-110 hover:rotate-12 transition-all duration-300 drop-shadow-lg" />
            <span className="text-2xl font-bold text-white">Collabrix</span>
          </Link>
          <Link to="/" className="px-6 py-2 text-white hover:text-indigo-400 transition-all duration-300 hover:scale-105">
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Download Status */}
          <div className="text-center mb-12 animate-slide-up">
            {!downloadStarted ? (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                <div className="text-8xl mb-6 animate-bounce">⏳</div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Starting download in {countdown}...
                </h2>
                <p className="text-xl text-slate-300">
                  Your download will begin automatically
                </p>
                <div className="mt-8 flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-200"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse animation-delay-400"></div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-green-500/50 rounded-3xl p-12 shadow-2xl shadow-green-500/20">
                <div className="text-8xl mb-6">✅</div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Download Started!
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Check your downloads folder for Collabrix-Setup-2.1.0.exe
                </p>
                <button
                  onClick={startDownload}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-lg transform hover:scale-105 hover:-translate-y-1 shadow-xl shadow-indigo-500/50"
                >
                  Download Again
                </button>
              </div>
            )}
          </div>

          {/* Installation Steps */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-10 mb-8 animate-fade-in animation-delay-400">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                📋
              </span>
              Installation Steps
            </h3>
            <div className="space-y-6">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg mb-1">Run the installer</h4>
                  <p className="text-slate-400">Double-click Collabrix-Setup-2.1.0.exe from your downloads folder</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg mb-1">Follow the setup wizard</h4>
                  <p className="text-slate-400">Choose your installation location and preferences</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg mb-1">Launch Collabrix</h4>
                  <p className="text-slate-400">Sign in with your account or create a new one to get started</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-10 animate-fade-in animation-delay-600">
            <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                💻
              </span>
              System Requirements
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Windows 10 or later</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>4GB RAM minimum</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>200MB disk space</span>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="mt-8 text-center text-slate-400 animate-fade-in animation-delay-800">
            <p className="text-sm">Version 2.1.0 • Released 2026 • Free Forever</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2026 StudiOWL. All rights reserved.</p>
          <p className="text-sm mt-2">Collabrix v2.1.0</p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
