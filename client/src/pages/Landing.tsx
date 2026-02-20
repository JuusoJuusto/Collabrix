import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    window.open('https://github.com/JuusoJuusto/Collabrix/releases/latest', '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 z-50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <img src="/logo.png" alt="Collabrix" className="w-10 h-10 transform hover:scale-110 hover:rotate-12 transition-all duration-300 drop-shadow-lg" />
            <span className="text-2xl font-bold text-white">Collabrix</span>
          </div>
          <div className="flex items-center gap-4 animate-fade-in animation-delay-200">
            <Link to="/login" className="px-6 py-2 text-white hover:text-indigo-400 transition-all duration-300 hover:scale-105">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 font-medium shadow-lg shadow-indigo-500/50">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-block mb-4 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium animate-fade-in">
              ✨ Now Available for Windows
            </div>
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight animate-text-shimmer">
              Connect, Chat,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                Collaborate
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              The ultimate platform for gamers, teams, and communities. Voice, video, and text chat all in one place.
            </p>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animation-delay-400">
              <button
                onClick={handleDownload}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-lg flex items-center gap-3 shadow-2xl shadow-indigo-500/50 transform hover:scale-105 hover:-translate-y-1"
              >
                <svg className={`w-6 h-6 transition-transform ${isHovered ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download for Windows
              </button>
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-semibold text-lg transform hover:scale-105 hover:-translate-y-1 shadow-xl"
              >
                Open in Browser
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400 animate-fade-in animation-delay-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Windows 10+</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-indigo-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors duration-300">Real-time Chat</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Instant messaging with your team. Share files, reactions, and coordinate your next raid in real-time.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 animate-fade-in animation-delay-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-purple-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">Voice Channels</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Crystal-clear voice chat with low latency. Perfect for gaming sessions, team meetings, or just hanging out with friends.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 animate-fade-in animation-delay-400">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-pink-500/50">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">Communities</h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Create servers for your gaming clan, team, or community. Organize with channels, roles, and permissions.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 text-center animate-fade-in animation-delay-800">
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                Fast
              </div>
              <div className="text-slate-400">Lightning Speed</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                Secure
              </div>
              <div className="text-slate-400">End-to-End Encrypted</div>
            </div>
            <div className="transform hover:scale-110 transition-transform">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                Free
              </div>
              <div className="text-slate-400">Always Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2026 StudiOWL. All rights reserved.</p>
          <p className="text-sm mt-2">Collabrix v1.0.0</p>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes text-shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-text-shimmer { animation: text-shimmer 3s ease-in-out infinite; }
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
