import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Collabrix" className="w-10 h-10" />
            <span className="text-2xl font-bold text-gray-900">Collabrix</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Connect, Chat,<br />Collaborate
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The ultimate platform for gamers, teams, and communities. Voice, video, and text chat all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/download')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              Download for Windows
            </button>
            <Link
              to="/login"
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold text-lg transition-colors"
            >
              Open in Browser
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span>✓ Windows 10+</span>
            <span>✓ Free Forever</span>
            <span>✓ v2.0.3</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Text Chat</h3>
              <p className="text-gray-600">Organized channels for all your conversations</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Chat</h3>
              <p className="text-gray-600">Crystal clear voice communication</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Communities</h3>
              <p className="text-gray-600">Create and join servers with friends</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Download Collabrix and join thousands of users worldwide.
          </p>
          <button
            onClick={() => navigate('/download')}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-semibold text-lg transition-colors"
          >
            Download Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Collabrix" className="w-8 h-8" />
            <div>
              <div className="font-bold text-gray-900">Collabrix</div>
              <div className="text-xs text-gray-500">by StudiOWL</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            © 2026 Collabrix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
