import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function Download() {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Start countdown
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
    // Trigger download
    window.location.href = 'https://github.com/JuusoJuusto/Collabrix/releases/latest/download/Collabrix-Setup-1.0.0.exe';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:opacity-80 transition">
            <img src="/logo.png" alt="Collabrix" className="w-16 h-16" />
            <span className="text-3xl font-bold text-white">Collabrix</span>
          </Link>
        </div>

        {/* Download Status */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8">
          {/* SmartScreen Tip */}
          {downloadStarted && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-yellow-200 font-semibold text-sm mb-1">💡 Quick Tip</p>
                  <p className="text-yellow-100 text-sm">
                    If Windows shows a security warning, click <strong>"More info"</strong> then <strong>"Run anyway"</strong> to install.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            {!downloadStarted ? (
              <>
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <ArrowDownTrayIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Starting Download...
                </h1>
                <p className="text-gray-400 text-lg">
                  Your download will begin in {countdown} second{countdown !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Download Started!
                </h1>
                <p className="text-gray-400 text-lg">
                  Collabrix-Setup-1.0.0.exe is downloading
                </p>
              </>
            )}
          </div>

          {downloadStarted && (
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-gray-400 text-center">
                If your download doesn't start automatically,{' '}
                <button
                  onClick={startDownload}
                  className="text-indigo-400 hover:text-indigo-300 underline"
                >
                  click here
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Installation Instructions */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Installation Instructions</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Locate the Downloaded File</h3>
                <p className="text-gray-400 text-sm">
                  Find <code className="bg-slate-900 px-2 py-1 rounded text-indigo-400">Collabrix-Setup-1.0.0.exe</code> in your Downloads folder
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Run the Installer</h3>
                <p className="text-gray-400 text-sm mb-3">
                  Double-click the file to start the installation
                </p>
              </div>
            </div>

            {/* Step 3 - Windows Defender */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Windows SmartScreen Warning</h3>
                <p className="text-gray-400 text-sm mb-3">
                  You may see a "Windows protected your PC" message. This is normal for new apps.
                </p>
                
                <div className="bg-slate-900 rounded-lg p-4 border border-yellow-500/30 mb-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-yellow-200 font-medium text-sm mb-2">To proceed:</p>
                      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Click "More info" on the warning</li>
                        <li>Click "Run anyway" button</li>
                        <li>The installer will start</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    <strong>Why this happens:</strong> Windows shows this for apps that aren't widely downloaded yet. Collabrix is safe and open-source.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Choose Installation Location</h3>
                <p className="text-gray-400 text-sm">
                  Select where to install Collabrix (default location is recommended)
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Complete Installation</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Click "Install" and wait for the installation to complete
                </p>
                <p className="text-gray-400 text-sm">
                  Collabrix will launch automatically when installation is finished
                </p>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-white font-semibold mb-3">System Requirements</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Operating System</p>
                <p className="text-white">Windows 10 or later</p>
              </div>
              <div>
                <p className="text-gray-400">Disk Space</p>
                <p className="text-white">200 MB available</p>
              </div>
              <div>
                <p className="text-gray-400">RAM</p>
                <p className="text-white">4 GB minimum</p>
              </div>
              <div>
                <p className="text-gray-400">Internet</p>
                <p className="text-white">Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">
            Need help? Having issues?
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition border border-slate-700"
            >
              Back to Home
            </Link>
            <a
              href="https://studiowl.vercel.app/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Get Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
