import React, { useState, useEffect, useCallback, useMemo } from 'react';

const NAV_IDS = ['hero', 'projects', 'experience', 'about', 'skills', 'contact'];

const Header = ({ siteCopy = {} }) => {
  const NAV_ITEMS = useMemo(
    () => [
      { id: 'hero', label: siteCopy.navIntro || 'Intro' },
      { id: 'projects', label: siteCopy.navProjects || 'Projects' },
      { id: 'experience', label: siteCopy.navExperience || 'Experience' },
      { id: 'about', label: siteCopy.navAbout || 'About' },
      { id: 'skills', label: siteCopy.navSkills || 'Skills' },
      { id: 'contact', label: siteCopy.navContact || 'Contact' },
    ],
    [siteCopy.navAbout, siteCopy.navSkills, siteCopy.navProjects, siteCopy.navExperience, siteCopy.navContact]
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const threshold = window.innerHeight * 0.35;
      let current = '';
      for (const id of NAV_IDS) {
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
    <>
      <header
        className={`fixed top-6 left-6 z-50 hidden md:block transition-all duration-300 ${
          isScrolled ? 'translate-y-0' : 'translate-y-0'
        }`}
      >
        <nav
          className="w-64 rounded-[28px] border backdrop-blur-xl px-4 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          style={{
            borderColor: 'rgba(var(--lime), 0.28)',
            backgroundColor: 'rgba(10, 8, 32, 0.82)',
          }}
          aria-label="Primary"
        >
          <div className="flex items-center gap-3 px-2 pb-4 mb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgb(var(--lime))' }} />
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Navigation</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map(({ id, label }) => {
              const active = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  aria-current={active ? 'true' : undefined}
                  className="relative flex items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 border"
                  style={{
                    color: active ? 'rgb(var(--lime))' : 'rgba(255,255,255,0.8)',
                    backgroundColor: active ? 'rgba(var(--lime), 0.08)' : 'rgba(255,255,255,0.02)',
                    borderColor: active ? 'rgba(var(--lime), 0.22)' : 'rgba(255,255,255,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = 'rgba(var(--lime), 0.18)';
                      e.currentTarget.style.color = 'rgb(var(--lime))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }
                  }}
                >
                  <span>{label}</span>
                  <span
                    className={`ml-3 h-2 w-2 rounded-full transition-all duration-200 ${active ? 'scale-100' : 'scale-0'}`}
                    style={{ backgroundColor: 'rgb(var(--lime))' }}
                  />
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <header
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          isScrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_24px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="relative flex items-center justify-end" aria-label="Primary">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'rgb(var(--lime))' }}
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
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="px-6 pb-6 pt-2 backdrop-blur-xl border-b flex flex-col gap-1"
          style={{
            backgroundColor: 'rgba(12, 10, 36, 0.92)',
            borderColor: 'rgba(var(--lime), 0.25)',
          }}
        >
          {NAV_ITEMS.map(({ id, label }) => {
            const active = activeId === id;
            return (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border"
                style={
                  active
                    ? {
                        backgroundColor: 'rgba(var(--lime), 0.15)',
                        color: 'rgb(var(--lime))',
                        borderColor: 'rgba(var(--lime), 0.4)',
                      }
                    : {
                        color: 'rgba(255,255,255,0.85)',
                        borderColor: 'transparent',
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
