import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      setProgress(pct);
      setShowTop(scrolled > 500);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        onClick={goTop}
        aria-label="Back to top"
        className={`fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                    text-white flex items-center justify-center shadow-lg
                    transition-all duration-300 hover:bg-white/20 hover:scale-110
                    ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
};

export default ScrollProgress;
