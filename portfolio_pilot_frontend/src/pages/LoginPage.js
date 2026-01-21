import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import axios from 'axios';
import { Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function that handles input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function for form submission login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      // 1. We send the login data to the backend
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);

      // 2. If it worker we will get back the JWT token
      const token = response.data;

      // 3. We save the token in browser storage 
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('username', formData.username);

      // 4. Redirect to Dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError('Username or password is incorrect. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-dashboard-main text-dashboard-text font-sans">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-dashboard-card p-8 rounded-2xl border border-gray-800 shadow-2xl animate-fade-in-up">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
            P
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-dashboard-muted mt-2">Enter your credentials to access your portfolio</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <User size={18} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-dashboard-main border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-600"
                placeholder="Ex: InvestorNr1"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-dashboard-main border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-white placeholder-gray-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </button>

        </form>

      <p className="text-center text-sm text-gray-500 mt-6">
  Don't have an account?{' '}
  <Link to="/register" className="text-blue-400 cursor-pointer hover:underline">
    Create one
  </Link>
</p>
      </div>
    </div>
  );
};

export default LoginPage;