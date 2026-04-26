import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const inputBase =
  'w-full px-0 py-3 bg-transparent border-b-2 text-white text-lg focus:outline-none transition-colors font-light';
const labelBase =
  'block text-[11px] uppercase tracking-[0.28em] text-white/45 mb-2 font-mono';

const focusOn = (e) => (e.currentTarget.style.borderColor = '#C7FB6E');
const focusOff = (e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)');
const inputStyle = { borderColor: 'rgba(255,255,255,0.15)' };

const primaryBtnStyle = {
  backgroundColor: '#C7FB6E',
  color: '#0a0820',
  boxShadow: '0 10px 30px rgba(199,251,110,0.28)',
};

const ChangePassword = ({ onClose, token }) => {
  const [method, setMethod] = useState('current');
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCurrentPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_CHANGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(onClose, 1500);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_REQUEST_CHANGE_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_CHANGE_WITH_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(onClose, 1500);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_REQUEST_CHANGE_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  const MethodCard = ({ id, title, blurb, accent, onClick }) => {
    const active = method === id;
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full p-5 text-left border-2 transition-colors"
        style={{
          borderColor: active ? accent : 'rgba(255,255,255,0.10)',
          backgroundColor: active ? 'rgba(199,251,110,0.06)' : 'transparent',
        }}
      >
        <div className="flex items-baseline justify-between">
          <h4 className="font-bold text-white text-lg tracking-tight">{title}</h4>
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono" style={{ color: accent }}>
            {active ? 'selected' : 'choose'}
          </span>
        </div>
        <p className="text-sm text-white/55 mt-1">{blurb}</p>
      </button>
    );
  };

  const renderMethodSelection = () => (
    <div className="space-y-5">
      <p className="text-white/55 text-sm">How would you like to verify?</p>

      <div className="space-y-3">
        <MethodCard
          id="current"
          title="Current password"
          blurb="Use your existing password to authorize the change."
          accent="#C7FB6E"
          onClick={() => {
            setMethod('current');
            setStep(2);
          }}
        />
        <MethodCard
          id="otp"
          title="Email OTP"
          blurb="Receive a 6-digit code by email — useful if you forgot your current password."
          accent="#7DD3FC"
          onClick={() => {
            setMethod('otp');
            setStep(2);
          }}
        />
      </div>
    </div>
  );

  const renderCurrentPasswordForm = () => (
    <form onSubmit={handleCurrentPasswordChange} className="space-y-6">
      <div>
        <label className={labelBase}>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={`${inputBase} tracking-widest`}
          style={inputStyle}
          onFocus={focusOn}
          onBlur={focusOff}
          placeholder="••••••••"
          required
        />
      </div>
      <div>
        <label className={labelBase}>New Password</label>
        <input
          type="password"
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
        <label className={labelBase}>Confirm New Password</label>
        <input
          type="password"
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

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
          className="flex-1 py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
          style={primaryBtnStyle}
        >
          {loading ? 'Changing…' : '↳ Change password'}
        </button>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-5 py-4 text-[11px] uppercase tracking-[0.25em] font-mono border-2"
          style={{ color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.15)' }}
        >
          ← Back
        </button>
      </div>
    </form>
  );

  const renderOTPForm = () => (
    <div className="space-y-6">
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-white/55 text-sm">We'll send a 6-digit OTP to your email address.</p>
          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
            style={primaryBtnStyle}
          >
            {loading ? 'Sending OTP…' : '↳ Send OTP'}
          </button>
          <button
            onClick={() => setStep(1)}
            className="text-[11px] uppercase tracking-[0.25em] font-mono"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            ← Back
          </button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleOTPChange} className="space-y-6">
          <div>
            <label className={labelBase}>OTP Code</label>
            <input
              type="text"
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
            <label className={labelBase}>New Password</label>
            <input
              type="password"
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
            <label className={labelBase}>Confirm New Password</label>
            <input
              type="password"
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
              className="flex-1 py-4 font-bold uppercase tracking-[0.20em] text-sm transition-all duration-200 disabled:opacity-50 hover:-translate-y-0.5"
              style={primaryBtnStyle}
            >
              {loading ? 'Changing…' : '↳ Change password'}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-4 text-[11px] uppercase tracking-[0.25em] font-mono border-2"
              style={{ color: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.15)' }}
            >
              ← Back
            </button>
          </div>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="text-[11px] uppercase tracking-[0.25em] font-mono disabled:opacity-50 hover:underline"
            style={{ color: '#C7FB6E' }}
          >
            {loading ? 'Sending…' : 'Resend OTP'}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10, 8, 32, 0.85)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto border-2"
        style={{ backgroundColor: '#0f0d2a', borderColor: 'rgba(199,251,110,0.20)' }}
      >
        <div className="p-7">
          <div className="flex items-start justify-between mb-7">
            <div>
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] font-mono mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <span className="block w-6 h-px" style={{ backgroundColor: '#C7FB6E' }} />
                Security
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-[-0.02em]">
                Change password<span style={{ color: '#C7FB6E' }}>.</span>
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-white/50 hover:text-white p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div
              className="mb-5 text-sm font-mono px-3 py-2 border-l-2"
              style={{ color: '#FF6B8A', borderColor: '#FF6B8A', backgroundColor: 'rgba(255,107,138,0.06)' }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className="mb-5 text-sm font-mono px-3 py-2 border-l-2"
              style={{ color: '#C7FB6E', borderColor: '#C7FB6E', backgroundColor: 'rgba(199,251,110,0.06)' }}
            >
              {message}
            </div>
          )}

          {step === 1 && renderMethodSelection()}
          {step === 2 && method === 'current' && renderCurrentPasswordForm()}
          {step === 2 && method === 'otp' && renderOTPForm()}
          {step === 3 && renderOTPForm()}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
