import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin/dashboard';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center px-6"
      style={{ backgroundColor: '#0a0820' }}
    >
      {/* Memphis decoration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <svg className="absolute -top-32 -left-32 w-[480px] h-[480px] opacity-50" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#C7FB6E" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="120" stroke="#4F35E6" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="60" stroke="#C7FB6E" strokeWidth="1" />
        </svg>
        <svg className="absolute -bottom-24 -right-24 w-80 h-80 opacity-70" viewBox="0 0 200 200" fill="none">
          <polyline
            points="0,100 25,75 50,100 75,75 100,100 125,75 150,100 175,75 200,100"
            stroke="#C7FB6E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          className="absolute right-12 top-12 w-32 h-32 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(199,251,110,0.55) 1.5px, transparent 1.6px)',
            backgroundSize: '14px 14px',
          }}
        />
        <div className="absolute left-1/3 bottom-16 flex flex-col gap-2">
          <span className="block w-3 h-3 rotate-45" style={{ backgroundColor: '#4F35E6' }} />
          <span className="block w-3 h-3 rotate-45" style={{ backgroundColor: '#4F35E6' }} />
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 text-[11px] uppercase tracking-[0.32em] font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span className="block w-8 h-px" style={{ backgroundColor: '#C7FB6E' }} />
          Restricted area
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-[0.95] tracking-[-0.025em] mb-3">
          Admin{' '}
          <span style={{ color: '#C7FB6E' }}>console</span>
          <span className="text-white">.</span>
        </h1>
        <p className="text-white/55 text-sm mb-10 max-w-sm">
          Sign in to manage projects, features, and the public site.
        </p>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.28em] text-white/45 mb-2 font-mono">
              Email
            </label>
            <input
              type="text"
              className="w-full px-0 py-3 bg-transparent border-b-2 text-white text-lg focus:outline-none transition-colors font-light"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C7FB6E')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="username"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.28em] text-white/45 mb-2 font-mono">
              Password
            </label>
            <input
              type="password"
              className="w-full px-0 py-3 bg-transparent border-b-2 text-white text-lg focus:outline-none transition-colors tracking-widest font-light"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C7FB6E')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="text-sm font-mono px-3 py-2 border-l-2"
              style={{ color: '#FF6B8A', borderColor: '#FF6B8A', backgroundColor: 'rgba(255,107,138,0.06)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
            style={{
              backgroundColor: '#C7FB6E',
              color: '#0a0820',
              boxShadow: '0 10px 30px rgba(199,251,110,0.28)',
            }}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : '↳ Sign in'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/10 text-[11px] text-white/40 font-mono">
          Tip: type{' '}
          <span
            className="px-1.5 py-0.5 rounded-sm"
            style={{ color: '#C7FB6E', backgroundColor: 'rgba(199,251,110,0.10)' }}
          >
            hesoyam
          </span>{' '}
          on the home page to land here.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
