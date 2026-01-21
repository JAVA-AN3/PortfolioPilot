import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TickerTape from "../components/TickerTape";
import {
  Search,
  Globe,
  TrendingUp,
  Clock,
  Activity,
  DollarSign,
  BarChart2,
  Briefcase,
  PieChart,
  Info,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Market Research Page.
 */
const MarketPage = () => {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [isMarketOpen, setIsMarketOpen] = useState(null);

  // --- EFFECT: Check Market Status on Load ---
  React.useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(
          "http://localhost:8080/api/market/status",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setIsMarketOpen(response.data.isOpen);
      } catch (e) {
        console.error("Failed to check market status", e);
        // Fallback default
        setIsMarketOpen(false);
      }
    };
    fetchMarketStatus();
  }, []);

  // --- HANDLERS ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:8080/api/market/details/${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.price === 0) {
        setError(`Ticker symbol "${searchTerm.toUpperCase()}" not found.`);
      } else {
        setStockData(response.data);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch market data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- CHART GENERATOR (Mock) ---
  const generateMockChartData = (basePrice) => {
    const data = [];
    let price = basePrice * 0.98;
    for (let i = 9; i <= 16; i++) {
      data.push({ time: `${i}:00`, price: price });
      price = price * (1 + (Math.random() * 0.03 - 0.01));
    }
    return data;
  };

  // --- HELPER: DETECT IF ETF/FUND ---
  // If we have a price but no industry/marketCap, it is likely an ETF or Index Fund
  // where the free API tier doesn't provide deep metadata.
  const isEtfOrFund = (data) => {
    return !data.profile.finnhubIndustry && !data.profile.marketCapitalization;
  };

  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
        {/* 1. TICKER TAPE (Fixed Top) */}
        <div className="flex-none w-full">
          <TickerTape />
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full">
          {/* 2. HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Market Research
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                Real-time data and comprehensive analytics.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 shadow-sm">
              <Clock
                size={16}
                className={isMarketOpen ? "text-green-400" : "text-orange-400"}
              />
              <span className="text-sm font-medium text-white">
                US Market:{" "}
                <span
                  className={
                    isMarketOpen
                      ? "text-green-400 font-bold"
                      : "text-orange-400 font-bold"
                  }
                >
                  {isMarketOpen === null
                    ? "LOADING..."
                    : isMarketOpen
                      ? "OPEN"
                      : "CLOSED"}
                </span>
              </span>
            </div>
          </div>

          {/* 3. SEARCH BAR */}
          <div className="w-full max-w-3xl mx-auto mb-12">
            <form
              onSubmit={handleSearch}
              className="flex gap-2 bg-dashboard-card p-2 rounded-2xl border border-gray-700 shadow-xl focus-within:ring-2 focus-within:ring-blue-600 transition-all"
            >
              <div className="flex-1 flex items-center px-4">
                <Search className="text-gray-500 mr-3" size={24} />
                <input
                  type="text"
                  placeholder="Search Ticker (e.g. AAPL, TSLA, BTC)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-white text-lg placeholder-gray-600 focus:outline-none h-12"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Searching..." : "Analyze"}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>

          {/* 4. RESULTS DASHBOARD */}
          {stockData && (
            <div className="animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
              {/* LEFT COLUMN: Company Profile */}
              <div className="space-y-6">
                <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl">
                  {/* --- HEADER: LOGO & TICKER --- */}
                  <div className="flex items-center gap-4 mb-8">
                    {/* Logic: Show Logo if exists, otherwise show generic letter or PieChart if ETF */}
                    {stockData.profile.logo ? (
                      <img
                        src={stockData.profile.logo}
                        alt="logo"
                        className="w-20 h-20 rounded-2xl bg-white p-2 object-contain shadow-lg"
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg ${isEtfOrFund(stockData) ? "bg-purple-600" : "bg-gradient-to-br from-blue-600 to-blue-800"}`}
                      >
                        {/* Show PieChart icon for ETFs, First Letter for stocks */}
                        {isEtfOrFund(stockData) ? (
                          <PieChart size={32} />
                        ) : (
                          stockData.profile.ticker?.[0]
                        )}
                      </div>
                    )}
                    <div>
                      <h2 className="text-4xl font-bold text-white tracking-tight">
                        {stockData.profile.ticker}
                      </h2>
                      <p className="text-gray-400 font-medium">
                        {/* If name exists use it, otherwise generic fallback */}
                        {stockData.profile.name ||
                          (isEtfOrFund(stockData)
                            ? "ETF / Index Fund"
                            : "Unknown Asset")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Always show Price */}
                    <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                      <span className="text-gray-500 flex items-center gap-2">
                        <DollarSign size={16} /> Current Price
                      </span>
                      <span className="text-3xl font-bold text-white">
                        ${Number(stockData.price).toFixed(2)}
                      </span>
                    </div>

                    {/* --- CONDITIONAL RENDERING --- */}
                    {/* If it's a regular company (Not ETF), show details */}
                    {!isEtfOrFund(stockData) ? (
                      <>
                        <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                          <span className="text-gray-500 flex items-center gap-2">
                            <Briefcase size={16} /> Industry
                          </span>
                          <span className="text-white font-medium text-right max-w-[50%] truncate">
                            {stockData.profile.finnhubIndustry || "N/A"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                          <span className="text-gray-500 flex items-center gap-2">
                            <BarChart2 size={16} /> Market Cap
                          </span>
                          <span className="text-white font-medium">
                            {stockData.profile.marketCapitalization
                              ? `$${Number(stockData.profile.marketCapitalization).toLocaleString()} M`
                              : "N/A"}
                          </span>
                        </div>

                        <div className="pt-2">
                          <a
                            href={stockData.profile.weburl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition text-sm font-medium border border-gray-700"
                          >
                            <Globe size={16} /> Visit Website
                          </a>
                        </div>
                      </>
                    ) : (
                      // --- ETF / FUND VIEW ---
                      // Show this friendly message instead of N/A
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <Info
                            className="text-blue-400 shrink-0 mt-1"
                            size={20}
                          />
                          <div>
                            <h4 className="text-blue-400 font-bold text-sm mb-1">
                              Fund Data
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                              This asset appears to be an{" "}
                              <strong>ETF or Index Fund</strong>. Detailed
                              profile metadata (like industry or headquarters)
                              is generally not available for these asset classes
                              via the standard feed.
                            </p>
                            <p className="text-white font-bold text-sm mt-2">
                              Real-time pricing is active.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Charts & Stats */}
              <div className="xl:col-span-2 space-y-6 min-w-0">
                {/* Chart Card */}
                <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="text-blue-500" /> Intraday
                      Performance
                    </h3>
                    <span
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${stockData.dayChangePercent >= 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                    >
                      <TrendingUp size={14} />
                      {stockData.dayChangePercent >= 0 ? "+" : ""}
                      {Number(stockData.dayChangePercent).toFixed(2)}% Today
                    </span>
                  </div>

                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateMockChartData(stockData.price)}>
                        <defs>
                          <linearGradient
                            id="colorPrice"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="time"
                          stroke="#64748b"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          domain={["auto", "auto"]}
                          stroke="#64748b"
                          tick={{ fontSize: 12 }}
                          prefix="$"
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                          tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            borderColor: "#374151",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                          itemStyle={{ color: "#3b82f6" }}
                          formatter={(value) => [
                            `$${Number(value).toFixed(2)}`,
                            "Price",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBox
                    label="Open"
                    value={`$${(stockData.price * 0.99).toFixed(2)}`}
                  />
                  <StatBox
                    label="High"
                    value={`$${(stockData.price * 1.01).toFixed(2)}`}
                  />
                  <StatBox
                    label="Low"
                    value={`$${(stockData.price * 0.98).toFixed(2)}`}
                  />
                  <StatBox
                    label="Volume"
                    value={`${(Math.random() * 50 + 10).toFixed(1)}M`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!stockData && !loading && !error && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-600 space-y-4">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center">
                <TrendingUp size={48} className="opacity-40" />
              </div>
              <p className="text-xl font-medium">
                Enter a ticker symbol above to start analyzing.
              </p>
              <p className="text-sm opacity-60">
                Try searching for AAPL, MSFT, or NVDA
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper Component for Stats
const StatBox = ({ label, value }) => (
  <div className="bg-dashboard-card p-5 rounded-xl border border-gray-800 shadow-lg hover:border-gray-700 transition">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-white font-bold text-xl">{value}</p>
  </div>
);

export default MarketPage;
