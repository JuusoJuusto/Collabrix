import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Users, MessageSquare, Calendar, TrendingUp, Shield, Globe } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Collabrix</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-white/80 hover:text-white font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30">
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
              <Sparkles size={16} className="text-cyan-400" />
              <span className="text-sm text-white font-medium">The Future of Team Collaboration</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Collaborate
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Without Limits
              </span>
            </h1>
            
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              More than chat. A complete collaboration platform with AI-powered features, 
              smart organization, and seamless teamwork.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/download')}
                className="group px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105 flex items-center gap-3"
              >
                <Zap size={24} />
                Download for Windows
                <span className="text-sm opacity-80">v2.0.4</span>
              </button>
              <Link
                to="/login"
                className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all"
              >
                Open in Browser
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <Shield size={16} />
                Free Forever
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} />
                10,000+ Users
              </span>
              <span className="flex items-center gap-2">
                <Globe size={16} />
                Cross-Platform
              </span>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg">
                <MessageSquare size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Smart Messaging</h3>
              <p className="text-white/70 leading-relaxed">
                AI-powered message suggestions, smart replies, and context-aware conversations.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Analytics Dashboard</h3>
              <p className="text-white/70 leading-relaxed">
                Track engagement, activity trends, and team productivity with beautiful charts.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 shadow-lg">
                <Calendar size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Integrated Calendar</h3>
              <p className="text-white/70 leading-relaxed">
                Schedule events, set reminders, and sync with your favorite calendar apps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 px-6 bg-black/20 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4">What Makes Us Different</h2>
            <p className="text-xl text-white/70">Features you won't find anywhere else</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">AI Assistant</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Built-in AI that helps summarize conversations, suggest responses, translate messages, 
                    and even generate meeting notes automatically.
                  </p>
                  <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Smart Analytics</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    See who's most active, trending topics, peak activity times, and engagement metrics. 
                    Perfect for community managers and team leads.
                  </p>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">Beta</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Event Management</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Create events, send invites, track RSVPs, and get reminders. Integrates with 
                    Google Calendar, Outlook, and Apple Calendar.
                  </p>
                  <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Community Voting</h3>
                  <p className="text-white/80 leading-relaxed mb-4">
                    Reddit-style upvotes/downvotes on messages, polls, and community decisions. 
                    Let your community shape the conversation.
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Ready to Transform Your Team?
          </h2>
          <p className="text-2xl text-white/80 mb-12">
            Join thousands of teams already using Collabrix.
          </p>
          <button
            onClick={() => navigate('/download')}
            className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-cyan-500/50 hover:scale-105"
          >
            Get Started Free
          </button>
          <p className="text-white/60 mt-6">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white">Collabrix</div>
              <div className="text-xs text-white/60">by StudiOWL</div>
            </div>
          </div>
          <div className="text-sm text-white/60">
            © 2026 Collabrix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
