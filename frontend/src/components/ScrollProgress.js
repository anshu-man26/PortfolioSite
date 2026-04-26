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
        className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none"
      >
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgb(var(--indigo)), rgb(var(--lime)))',
            boxShadow: '0 0 12px rgba(199,251,110,0.6)',
          }}
        />
      </div>

      <button
        type="button"
        onClick={goTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full backdrop-blur-md border-2
                    flex items-center justify-center shadow-lg
                    transition-all duration-300 hover:scale-110
                    ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        style={{
          backgroundColor: 'rgba(var(--lime), 0.18)',
          borderColor: 'rgba(var(--lime), 0.55)',
          color: 'rgb(var(--lime))',
        }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
};

export default ScrollProgress;
