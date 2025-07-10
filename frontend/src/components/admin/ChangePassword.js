import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

const ChangePassword = ({ onClose, token }) => {
  const [method, setMethod] = useState('current'); // 'current' or 'otp'
  const [step, setStep] = useState(1); // 1: choose method, 2: current password, 3: OTP, 4: new password
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
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
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setStep(3);
      } else {
        setError(data.message);
      }
    } catch (err) {
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
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
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('OTP resent successfully!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Choose Password Change Method</h3>
        <p className="text-gray-400">Select how you want to change your password</p>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => {
            setMethod('current');
            setStep(2);
          }}
          className="w-full p-4 border border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-900/20 transition-all duration-200 text-left bg-gray-800/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white">Current Password</h4>
              <p className="text-sm text-gray-400">Use your current password to change it</p>
            </div>
          </div>
        </button>
        
        <button
          onClick={() => {
            setMethod('otp');
            setStep(2);
          }}
          className="w-full p-4 border border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-900/20 transition-all duration-200 text-left bg-gray-800/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-white">Email OTP</h4>
              <p className="text-sm text-gray-400">Receive a one-time code via email</p>
            </div>
          </div>
        </button>
      </div>
      
      <button
        onClick={onClose}
        className="w-full text-gray-400 hover:text-gray-300 text-sm font-medium"
      >
        Cancel
      </button>
    </div>
  );

  const renderCurrentPasswordForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
        <p className="text-gray-400">Enter your current password and new password</p>
      </div>
      
      <form onSubmit={handleCurrentPasswordChange} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
            placeholder="Enter current password"
            required
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
            placeholder="Enter new password"
            minLength="6"
            required
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
            placeholder="Confirm new password"
            minLength="6"
            required
          />
        </div>
        
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-red-400 text-sm">Passwords do not match</p>
        )}
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
          
          <button
            type="button"
            onClick={() => setStep(1)}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-gray-800/50"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );

  const renderOTPForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Email OTP Verification</h3>
        <p className="text-gray-400">We'll send a 6-digit OTP to your email address</p>
      </div>
      
      {step === 2 && (
        <div className="text-center">
          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
          
          <button
            onClick={() => setStep(1)}
            className="w-full text-gray-400 hover:text-gray-300 text-sm font-medium mt-3"
          >
            Back
          </button>
        </div>
      )}
      
      {step === 3 && (
        <form onSubmit={handleOTPChange} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono tracking-widest bg-gray-800 text-white placeholder-gray-400"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
              placeholder="Enter new password"
              minLength="6"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-400"
              placeholder="Confirm new password"
              minLength="6"
              required
            />
          </div>
          
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-400 text-sm">Passwords do not match</p>
          )}
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 bg-gray-800/50"
            >
              Back
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full text-green-400 hover:text-green-300 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend OTP'}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Change Password</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 bg-green-900/50 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
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