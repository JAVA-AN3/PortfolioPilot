import React from 'react';

const StatCard = ({ title, value, trend, positive }) => {
  return (
    <div className="bg-dashboard-card p-6 rounded-2xl border border-gray-800 shadow-lg hover:border-gray-700 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-dashboard-muted text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

export default StatCard;