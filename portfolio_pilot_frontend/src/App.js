import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import MyPortfolioPage from './pages/MyPortfolioPage';
import MarketPage from './pages/MarketPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import SubscriptionPage from './pages/SubscriptionPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Login*/}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/portfolio" element={<MyPortfolioPage />} />

        <Route path="/market" element={<MarketPage />} />

        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/subscription" element={<SubscriptionPage />} />
      </Routes>
    </Router>
  );
}

export default App;