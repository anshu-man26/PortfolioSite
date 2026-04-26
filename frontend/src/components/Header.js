import React, { useState, useEffect, useCallback } from 'react';
import portfolioIcon from '../assets/portfolio.png';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // figure out which section is roughly in view
      const threshold = window.innerHeight * 0.35;
      let current = '';
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom >= threshold) {
          current = id;
          break;
        }
      }
      setActiveId(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close mobile menu when viewport widens past the breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // close on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const headerHeight = 80;
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  const navLinkBase =
    'relative text-sm font-light transition-colors duration-200 px-1 py-1';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="relative flex items-center justify-center md:justify-center" aria-label="Primary">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden ring-1 ring-white/15 hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/20"
          >
            <img
              src={portfolioIcon}
              alt=""
              aria-hidden="true"
              className="w-5 h-5 object-contain"
            />
          </button>

          <div className="hidden md:flex items-center gap-8 px-6 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            {NAV_ITEMS.map(({ id, label }) => {
              const active = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  aria-current={active ? 'true' : undefined}
                  className={`${navLinkBase} ${active ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {label}
                  <span
                    className={`pointer-events-none absolute left-0 -bottom-1 h-px bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 ${
                      active ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 pt-2 bg-black/85 backdrop-blur-xl border-b border-white/10 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label }) => {
            const active = activeId === id;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`text-left px-4 py-3 rounded-xl text-base font-light transition-all duration-200 ${
                  active
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
