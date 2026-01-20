import React from 'react';

// Hardcoded popular stocks to simulate the "Wall Street" feel without draining API limits
const MOCK_TICKERS = [
  { symbol: 'SPY', price: 478.20, change: 0.45 },
  { symbol: 'DIA', price: 375.10, change: -0.12 },
  { symbol: 'NDAQ', price: 164.50, change: 1.20 },
  { symbol: 'AAPL', price: 185.90, change: 0.85 },
  { symbol: 'MSFT', price: 390.20, change: 1.10 },
  { symbol: 'TSLA', price: 215.30, change: -2.30 },
  { symbol: 'GOOGL', price: 140.50, change: 0.50 },
  { symbol: 'AMZN', price: 155.80, change: 0.15 },
  { symbol: 'NVDA', price: 550.00, change: 3.40 },
  { symbol: 'BTC', price: 42500.00, change: 1.50 },
];

/**
 * A horizontal scrolling marquee component displaying market snapshots.
 * Uses CSS animations for the infinite scroll effect.
 */
const TickerTape = () => {
  return (
    <div className="w-full bg-black border-b border-gray-800 overflow-hidden h-10 flex items-center relative z-20">
      {/* The scrolling wrapper */}
      <div className="flex animate-marquee whitespace-nowrap">
        {/* We duplicate the list to ensure seamless infinite scrolling */}
        {[...MOCK_TICKERS, ...MOCK_TICKERS].map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-6 text-sm font-mono">
            <span className="font-bold text-white">{item.symbol}</span>
            <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {item.price.toFixed(2)}
            </span>
            <span className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ({item.change >= 0 ? '+' : ''}{item.change}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;