import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Simple client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            // Send registration data to backend
            await axios.post('http://localhost:8080/api/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            // On success, redirect to login page
            navigate('/login', { state: { message: "Account created successfully! Please log in." } });
        } catch (err) {
            setError(err.response?.data || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="text-blue-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-gray-400 mt-2">Join Portfolio Pilot today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            required
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Register Now"}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;