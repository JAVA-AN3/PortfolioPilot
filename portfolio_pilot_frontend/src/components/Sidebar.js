import React from 'react';
import { LayoutDashboard, Wallet, LineChart, Settings, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper component updated to handle clicks
const SidebarItem = ({ icon, text, active, onClick }) => (
  <div 
    onClick={onClick} // Add click handler
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
    {icon}
    <span className="font-medium">{text}</span>
  </div>
);

const Sidebar = () => {
  const location = useLocation(); // Gets current URL
  const navigate = useNavigate(); // Allows us to change URL

  return (
    <aside className="w-64 bg-dashboard-card flex flex-col border-r border-gray-800 hidden md:flex h-full">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white">
          P
        </div>
        <h1 className="text-xl font-bold tracking-wide text-white">PortfolioPilot</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {/* Dashboard Link */}
        <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            text="Dashboard" 
            active={location.pathname === '/dashboard'} 
            onClick={() => navigate('/dashboard')}
        />
        
        {/* Portfolio Link */}
        <SidebarItem 
            icon={<Wallet size={20} />} 
            text="My Portfolio" 
            active={location.pathname === '/portfolio'} 
            onClick={() => navigate('/portfolio')}
        />
        
        <SidebarItem icon={<LineChart size={20} />} text="Market" />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-dashboard-accent">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Investitorul Nr1</p>
            <p className="text-xs text-dashboard-muted">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;