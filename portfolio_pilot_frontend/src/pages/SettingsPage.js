import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TickerTape from '../components/TickerTape';
import { User, Shield, Lock, Mail, Save, AlertCircle, Edit2 } from 'lucide-react';

const SettingsPage = () => {
    const [user, setUser] = useState({ username: '', email: '' });
    const [newUsername, setNewUsername] = useState(''); // State for new username
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    // Fetch user info on load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                console.error("Failed to load user data", err);
            }
        };
        fetchUserData();
    }, []);

    // --- Update Profile Name ---
    const updateProfileName = async (e) => {
        e.preventDefault();
        if (!newUsername || newUsername === user.username) return;

        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put('http://localhost:8080/api/users/update-profile', 
                { newUsername }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            // If successful, log the user out to re-login with new username
            alert("Username changed successfully! Please log in again.");
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || "Error updating username" });
        } finally {
            setLoading(false);
        }
    };

    // --- Change Password ---
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put('http://localhost:8080/api/users/change-password', 
                { 
                    oldPassword: passwordData.currentPassword, 
                    newPassword: passwordData.newPassword 
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || "Failed to update password." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
            <Sidebar user={user} />
            <main className="flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
                <div className="flex-none w-full">
                    <TickerTape />
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="text-blue-500" size={32} /> Settings & Security
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">Manage your profile and account security.</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Profile Section */}
                        <div className="bg-dashboard-card rounded-2xl p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <User className="text-blue-500" size={20} /> User Profile
                            </h2>
                            <div className="space-y-6">
                                {/* Formular Editare Username */}
                                <form onSubmit={updateProfileName} className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Edit2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input 
                                                type="text" 
                                                placeholder={user.username}
                                                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
                                                onChange={(e) => setNewUsername(e.target.value)}
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={loading || !newUsername}
                                            className="bg-blue-600 px-6 rounded-xl text-white font-bold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                    <div className="mt-1 flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 text-gray-500 cursor-not-allowed">
                                        <Mail size={18} />
                                        <span>{user.email}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-1 italic">Email cannot be changed for security reasons.</p>
                                </div>
                            </div>
                        </div>

                        {/* Security Section (Change Password) */}
                        <div className="bg-dashboard-card rounded-2xl p-8 border border-gray-800 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Lock className="text-blue-500" size={20} /> Change Password
                            </h2>
                            
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm border ${
                                    message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                                }`}>
                                    <AlertCircle size={18} /> {message.text}
                                </div>
                            )}

                            <form onSubmit={updatePassword} className="space-y-4">
                                <input
                                    type="password"
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                                    required
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                                    required
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-blue-500 focus:outline-none transition-all"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? "Updating..." : "Update Password"}
                                    <Save size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;