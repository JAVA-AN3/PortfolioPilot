import React from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';

// Putem lasa ActivityItem aici momentan sau il putem muta si pe el in components
const ActivityItem = ({ stock, action, amount }) => (
  <div className="flex justify-between items-center p-3 hover:bg-gray-800/50 rounded-lg transition">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
        {stock[0]}
      </div>
      <div>
        <p className="text-sm font-bold text-white">{stock}</p>
        <p className="text-xs text-gray-500">{action}</p>
      </div>
    </div>
    <span className={action === 'Bought' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{amount}</span>
  </div>
);

const DashboardPage = () => {
  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
      
      {/* Folosim Componenta Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-dashboard-main/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20">
            + New Investment
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Folosim Componenta StatCard */}
            <StatCard title="Total Balance" value="$12,450.00" trend="+15%" positive />
            <StatCard title="Total Profit" value="$3,200.50" trend="+5.2%" positive />
            <StatCard title="Best Performer" value="AAPL" trend="+2.4%" positive />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="lg:col-span-2 bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-white">Portfolio Growth</h3>
              <div className="w-full h-64 bg-dashboard-main/50 rounded-xl flex items-center justify-center border border-dashed border-gray-700 text-dashboard-muted">
                [ Chart Placeholder ]
              </div>
            </div>

            <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
              <div className="space-y-4">
                <ActivityItem stock="TSLA" action="Bought" amount="+$240" />
                <ActivityItem stock="BTC" action="Sold" amount="-$1,200" />
                <ActivityItem stock="NVDA" action="Bought" amount="+$560" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;