import { useEffect, useRef } from 'react';

/**
 * Listen for a typed code anywhere on the page (outside input fields).
 * Buffer is rolling — the last N keystrokes — so user doesn't have to start clean.
 */
export default function useCheatCode(code, onMatch) {
  const buffer = useRef('');

  useEffect(() => {
    if (!code) return;
    const target = code.toLowerCase();

    const onKeyDown = (e) => {
      // Ignore typing inside form fields so the admin login still works
      const node = e.target;
      const tag = node?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || node?.isContentEditable) return;

      if (e.key === 'Escape') {
        buffer.current = '';
        return;
      }

      if (e.key.length !== 1) return;

      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-target.length);
      if (buffer.current === target) {
        buffer.current = '';
        onMatch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [code, onMatch]);
}
