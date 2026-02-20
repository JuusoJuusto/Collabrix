import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-pulse">
          <img src="/logo.png" alt="Collabrix" className="w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Collabrix</h1>
        
        {/* Loading bar */}
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <p className="text-gray-400 text-sm">Loading{dots}</p>
      </div>
    </div>
  );
}
