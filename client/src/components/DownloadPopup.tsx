import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function DownloadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if running in Electron (desktop app)
    const isElectron = navigator.userAgent.toLowerCase().includes('electron');
    
    // Don't show popup in desktop app
    if (isElectron) return;
    
    // Check if user is on Windows
    const isWindows = navigator.platform.toLowerCase().includes('win');
    
    // Check if already dismissed
    const dismissed = localStorage.getItem('downloadPopupDismissed');
    
    // Show popup after 3 seconds if on Windows and not dismissed
    if (isWindows && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('downloadPopupDismissed', 'true');
  };

  const handleDownload = () => {
    navigate('/download');
    handleDismiss();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Get the Desktop App
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Better performance, voice chat, and notifications with our Windows app
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-lg"
              >
                Download Now
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-medium text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
