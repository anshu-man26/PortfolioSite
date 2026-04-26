import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCheatCode from '../hooks/useCheatCode';

// Change this to whatever you want.
const SECRET = 'hesoyam';

const CheatCode = () => {
  const navigate = useNavigate();
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = useCallback(() => {
    if (unlocking) return;
    setUnlocking(true);
    // brief pause so the user sees the flash before the route change
    setTimeout(() => navigate('/admin/dashboard'), 950);
  }, [navigate, unlocking]);

  useCheatCode(SECRET, handleUnlock);

  if (!unlocking) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div
        className="absolute inset-0 animate-fade-in-up"
        style={{
          background:
            'radial-gradient(closest-side, rgba(199,251,110,0.30), rgba(79,53,230,0.25) 50%, transparent 75%)',
        }}
      />
      <div
        className="relative px-7 py-3.5 rounded-full font-mono tracking-[0.25em] text-sm uppercase animate-fade-in-up"
        style={{
          backgroundColor: 'rgb(var(--ink))',
          color: 'rgb(var(--lime))',
          border: '2px solid rgb(var(--lime))',
          boxShadow:
            '0 0 0 6px rgba(199,251,110,0.15), 0 0 50px rgba(199,251,110,0.55), 0 12px 30px rgba(79,53,230,0.45)',
        }}
      >
        ▸ Cheat activated
      </div>
    </div>
  );
};

export default CheatCode;
