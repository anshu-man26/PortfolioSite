import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const inputBase =
  'w-full px-0 py-3 bg-transparent border-b-2 text-white text-lg focus:outline-none transition-colors font-light';
const labelBase =
  'block text-[11px] uppercase tracking-[0.28em] text-white/45 mb-2 font-mono';

const focusOn = (e) => (e.currentTarget.style.borderColor = '#C7FB6E');
const focusOff = (e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)');
const inputStyle = { borderColor: 'rgba(255,255,255,0.15)' };

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_REQUEST_RESET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_RESET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(3);
        setTimeout(() => onBackToLogin(), 2000);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_REQUEST_RESET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) setMessage('OTP resent successfully!');
      else setError(data.message);
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Stepper = () => (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="h-1 flex-1 transition-colors"
          style={{
            backgroundColor: step >= n ? '#C7FB6E' : 'rgba(255,255,255,0.10)',
          }}
        />
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h2 className="text-4xl font-extrabold text-white tracking-[-0.02em] mb-2">
        Forgot password<span style={{ color: '#C7FB6E' }}>.</span>
      </h2>
      <p className="text-white/55 text-sm mb-8">Enter your email — we'll send a one-time code.</p>

      <form onSubmit={handleRequestOTP} className="space-y-6">
        <div>
          <label htmlFor="email" className={labelBase}>Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputBase}
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
            placeholder="you@example.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
          style={{ backgroundColor: '#C7FB6E', color: '#0a0820', boxShadow: '0 10px 30px rgba(199,251,110,0.28)' }}
        >
          {loading ? 'Sending OTP…' : '↳ Send OTP'}
        </button>
      </form>

      <button
        onClick={onBackToLogin}
        className="mt-6 text-[11px] uppercase tracking-[0.25em] font-mono transition-colors"
        style={{ color: 'rgba(255,255,255,0.55)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#C7FB6E')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
      >
        ← Back to login
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-4xl font-extrabold text-white tracking-[-0.02em] mb-2">
        Verify code<span style={{ color: '#C7FB6E' }}>.</span>
      </h2>
      <p className="text-white/55 text-sm mb-8">
        We sent a 6-digit code to <span className="text-white/85">{email}</span>.
      </p>

      <form onSubmit={handleVerifyOTP} className="space-y-6">
        <div>
          <label htmlFor="otp" className={labelBase}>OTP Code</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-0 py-3 bg-transparent border-b-2 text-white text-2xl text-center tracking-[0.6em] font-mono focus:outline-none transition-colors"
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
            placeholder="000000"
            maxLength="6"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className={labelBase}>New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`${inputBase} tracking-widest`}
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
            placeholder="••••••••"
            minLength="6"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelBase}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${inputBase} tracking-widest`}
            style={inputStyle}
            onFocus={focusOn}
            onBlur={focusOff}
            placeholder="••••••••"
            minLength="6"
            required
          />
        </div>

        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <div
            className="text-sm font-mono px-3 py-2 border-l-2"
            style={{ color: '#FF6B8A', borderColor: '#FF6B8A', backgroundColor: 'rgba(255,107,138,0.06)' }}
          >
            Passwords do not match
          </div>
        )}

        <button
          type="submit"
          disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
          className="w-full py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
          style={{ backgroundColor: '#C7FB6E', color: '#0a0820', boxShadow: '0 10px 30px rgba(199,251,110,0.28)' }}
        >
          {loading ? 'Resetting…' : '↳ Reset password'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] font-mono">
        <button
          onClick={handleResendOTP}
          disabled={loading}
          style={{ color: '#C7FB6E' }}
          className="disabled:opacity-50 hover:underline"
        >
          {loading ? 'Sending…' : 'Resend code'}
        </button>
        <button
          onClick={() => setStep(1)}
          style={{ color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C7FB6E')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
        >
          ← Back
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <div
        className="w-16 h-16 mx-auto mb-6 flex items-center justify-center border-2"
        style={{ borderColor: '#C7FB6E', backgroundColor: 'rgba(199,251,110,0.10)' }}
      >
        <svg className="w-8 h-8" fill="none" stroke="#C7FB6E" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold text-white tracking-[-0.02em] mb-2">All set.</h2>
      <p className="text-white/55 text-sm">Redirecting to login…</p>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ backgroundColor: '#0a0820' }}
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <svg className="absolute -top-32 -right-32 w-[420px] h-[420px] opacity-50" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#4F35E6" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="120" stroke="#C7FB6E" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3 mb-6 text-[11px] uppercase tracking-[0.32em] font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span className="block w-8 h-px" style={{ backgroundColor: '#C7FB6E' }} />
          Account recovery
        </div>

        <Stepper />

        {error && (
          <div
            className="mb-6 text-sm font-mono px-3 py-2 border-l-2"
            style={{ color: '#FF6B8A', borderColor: '#FF6B8A', backgroundColor: 'rgba(255,107,138,0.06)' }}
          >
            {error}
          </div>
        )}
        {message && step !== 3 && (
          <div
            className="mb-6 text-sm font-mono px-3 py-2 border-l-2"
            style={{ color: '#C7FB6E', borderColor: '#C7FB6E', backgroundColor: 'rgba(199,251,110,0.06)' }}
          >
            {message}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default ForgotPassword;
