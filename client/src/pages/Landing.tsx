import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Collabrix</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-white hover:text-indigo-400 transition">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              Connect, Chat,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Collaborate
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              The modern platform for teams and communities. Voice, video, and text chat all in one place.
            </p>
            
            {/* Download Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/JuusoJuusto/Collabrix/releases/download/v1.0.0/Collabrix-Setup-1.0.0.exe"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold text-lg flex items-center gap-3 shadow-lg shadow-indigo-500/50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download for Windows
              </a>
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition font-semibold text-lg"
              >
                Open in Browser
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-4">Windows 10 or later • Free Download • v1.0.0</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Chat</h3>
              <p className="text-slate-400">
                Instant messaging with your team. Share files, reactions, and stay connected in real-time.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Voice Channels</h3>
              <p className="text-slate-400">
                Crystal-clear voice chat with low latency. Perfect for gaming, meetings, or hanging out.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <div className="w-14 h-14 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Communities</h3>
              <p className="text-slate-400">
                Create servers for your team, friends, or community. Organize with channels and roles.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">Fast</div>
              <div className="text-slate-400">Lightning Speed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Secure</div>
              <div className="text-slate-400">End-to-End Encrypted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">Free</div>
              <div className="text-slate-400">Always Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>© 2026 StudiOWL. All rights reserved.</p>
          <p className="text-sm mt-2">Collabrix v1.0.0</p>
        </div>
      </footer>
    </div>
  );
}
