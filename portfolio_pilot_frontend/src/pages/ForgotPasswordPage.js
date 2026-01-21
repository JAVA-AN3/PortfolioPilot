import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6">Forgot Password?</h2>
        <p className="text-gray-400 text-center mb-8">Enter your email address and we'll send you a link to reset your password.</p>
        
        {message ? (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl text-center mb-6">
                {message}
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="you@example.com"
                />
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Send Reset Link"}
            </button>
            </form>
        )}

        <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-400 hover:text-white text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;