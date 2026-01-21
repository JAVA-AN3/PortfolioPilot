import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Citim ?token=... din URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { 
          token, 
          newPassword: password 
      });
      
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password. Link might be expired.");
    }
  };

  if (!token) return <div className="text-white text-center mt-20">Invalid Link.</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Set New Password</h2>
        
        {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-center mb-6">
                {message}
            </div>
        )}

        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center mb-6">
                {error}
            </div>
        )}

        {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
            </div>
            
            <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
            >
                Reset Password
            </button>
            </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;