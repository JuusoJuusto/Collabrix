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
    window.location.href = 'https://github.com/JuusoJuusto/Collabrix/releases/latest/download/Collabrix-Setup-2.0.3.exe';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition">
            <img src="/logo.png" alt="Collabrix" className="w-16 h-16" />
            <span className="text-3xl font-bold text-gray-900">Collabrix</span>
          </Link>
        </div>

        {/* Download Status */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-8 text-center">
          {!downloadStarted ? (
            <div>
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Starting download in {countdown}...
              </h2>
              <p className="text-gray-600">
                Your download will begin automatically
              </p>
            </div>
          ) : (
            <div>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Download Started!
              </h2>
              <p className="text-gray-600 mb-6">
                Check your downloads folder for Collabrix-Setup-2.0.3.exe
              </p>
              <button
                onClick={startDownload}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Download Again
              </button>
            </div>
          )}
        </div>

        {/* Installation Steps */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Installation Steps</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Run the installer</h4>
                <p className="text-sm text-gray-600">Double-click Collabrix-Setup-2.0.3.exe</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Follow the setup wizard</h4>
                <p className="text-sm text-gray-600">Choose your installation location</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Launch Collabrix</h4>
                <p className="text-sm text-gray-600">Sign in or create an account</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-8 text-center">
          <h4 className="font-semibold text-gray-900 mb-4">System Requirements</h4>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <span>✓ Windows 10 or later</span>
            <span>✓ 4GB RAM</span>
            <span>✓ 200MB disk space</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
