import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * A horizontal scrolling marquee component displaying market snapshots.
 * Uses CSS animations for the infinite scroll effect.
 */
const TickerTape = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchTickerData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8080/api/market/ticker-tape', {
             headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        setItems(response.data);
      } catch (error) {
        console.error("Failed to load ticker tape", error);
        // Fallback
      }
    };

    fetchTickerData();
  }, []);

  // If no data yet, show nothing or a loading state
  if (items.length === 0) return null;

  return (
    <div className="w-full bg-black border-b border-gray-800 overflow-hidden h-10 flex items-center relative z-20">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Duplicate list for infinite scroll effect */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-6 text-sm font-mono">
            <span className="font-bold text-white">{item.symbol}</span>
            <span className={item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
              ${item.price.toFixed(2)}
            </span>
            <span className={`text-xs ${item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;