import React from 'react';

const Footer = () => (
  <footer
    className="relative mt-24 pt-12 pb-8 px-6 border-t"
    style={{
      borderColor: 'rgba(var(--lime), 0.15)',
      background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))',
    }}
  >
    <div className="absolute inset-x-0 -top-px h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(199,251,110,0.6), transparent)' }} />
    <div className="max-w-5xl mx-auto flex flex-col items-center gap-3 text-center">
      <div className="text-white/80 text-sm">
        &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
      </div>
      <div className="text-white/50 text-xs italic">
        Born in a merge conflict. Raised by broken builds. Now I code. 🗿
      </div>
      <div className="text-white/40 text-[11px] tracking-widest uppercase mt-2">
        Crafted with React + Tailwind
      </div>
    </div>
  </footer>
);

export default Footer;
