import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import MyPortfolioPage from './pages/MyPortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Login*/}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/portfolio" element={<MyPortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;