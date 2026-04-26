import React from 'react';

const Footer = () => (
  <footer className="relative mt-24 pt-12 pb-8 px-6 border-t border-white/10 bg-gradient-to-b from-transparent to-black/60">
    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
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
