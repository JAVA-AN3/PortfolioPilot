import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, User, ArrowRight, LogIn } from "lucide-react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function that handles input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function for form submission login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
      );

      const token = response.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("username", formData.username);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Username or password is incorrect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white font-sans p-4">
      {/* Background decoration (optional subtil glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-gray-800 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-5 shadow-lg shadow-blue-900/40">
            P
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm">
            Sign in to access your portfolio analytics.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-6 text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Username
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600 text-sm"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Password
                </label>
                {/* Forgot Password mutat AICI - mult mai vizibil */}
                <Link
                    to="/forgot-password"
                    className="text-xs text-blue-500 hover:text-blue-400 hover:underline transition-colors"
                >
                    Forgot Password?
                </Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-600 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
                "Signing In..."
            ) : (
                <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </>
            )}
          </button>
        </form>

        {/* Divider & Register */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-white font-medium hover:text-blue-400 ml-1 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
