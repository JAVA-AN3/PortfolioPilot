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
  ArrowUpRight,
  ArrowDownRight,
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
 * Displays REAL metrics (Open, High, Low, Prev Close, Change %).
 * Chart remains mocked for visual trend representation on Free Tier.
 */
const MarketPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [isMarketOpen, setIsMarketOpen] = useState(null);

  // --- MARKET STATUS ---
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
        setIsMarketOpen(false);
      }
    };
    fetchMarketStatus();
  }, []);

  /**
   * --- SMART CHART ALGORITHM ---
   * Instead of random noise, this creates a path that respects the REAL trading session.
   * Path: PrevClose -> Open -> (Randomly High then Low OR Low then High) -> Current Price
   */
  const generateSmartChartData = (stock) => {
    if (!stock) return [];

    // 1. Extract Real Anchors (Parse as floats to be safe)
    const current = parseFloat(stock.price);
    const open = parseFloat(stock.open) || current;
    const prevClose = parseFloat(stock.prevClose) || open;
    const high = parseFloat(stock.high) || Math.max(open, current);
    const low = parseFloat(stock.low) || Math.min(open, current);

    // 2. Determine Random Path for the middle of the day
    // 50% chance to hit High first, 50% to hit Low first
    const hitHighFirst = Math.random() > 0.5;
    const mid1 = hitHighFirst ? high : low;
    const mid2 = hitHighFirst ? low : high;

    // 3. Define Time Segments (Anchors)
    // We divide the trading day (09:30 - 16:00) into segments
    const points = [];
    const segments = 40; // Total data points for smoothness

    // Helper to generate noise
    const addNoise = (val) => val * (1 + (Math.random() * 0.002 - 0.001));

    // Interpolation function
    const interpolate = (startVal, endVal, steps, baseTimeHour, startMin) => {
      const stepSize = (endVal - startVal) / steps;
      for (let i = 0; i < steps; i++) {
        const val = startVal + stepSize * i;
        // Convert index to rough time
        const totalMinutes = startMin + i * 10; // 10 min steps approx
        const hour = Math.floor(baseTimeHour + totalMinutes / 60);
        const minute = totalMinutes % 60;

        points.push({
          time: `${hour}:${minute.toString().padStart(2, "0")}`,
          price: addNoise(val), // Add realistic jitter
        });
      }
    };

    // --- GENERATE PATH ---

    // Segment 1: "Pre-Market" gap visualizer (PrevClose -> Open)
    // This helps visualize the gap up/down at opening
    points.push({ time: "Prev", price: prevClose });

    // Segment 2: Open -> Mid1 (09:30 -> 11:30)
    interpolate(open, mid1, 12, 9, 30);

    // Segment 3: Mid1 -> Mid2 (11:30 -> 13:30)
    interpolate(mid1, mid2, 12, 11, 30);

    // Segment 4: Mid2 -> Current (13:30 -> 16:00/Now)
    interpolate(mid2, current, 16, 13, 30);

    // Ensure the final point is EXACTLY the current price for accuracy
    points.push({ time: "Live", price: current });

    return points;
  };

  // --- SEARCH HANDLER ---
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

      if (!response.data.price || response.data.price === 0) {
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

  const isEtfOrFund = (data) => {
    return !data.profile.finnhubIndustry && !data.profile.marketCapitalization;
  };

  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col relative min-w-0 overflow-x-hidden">
        <div className="flex-none w-full">
          <TickerTape />
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full">
          {/* HEADER */}
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

          {/* SEARCH */}
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

          {/* RESULTS */}
          {stockData && (
            <div className="animate-fade-in grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
              {/* LEFT: INFO CARD */}
              <div className="space-y-6">
                <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
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
                        {stockData.profile.name ||
                          (isEtfOrFund(stockData)
                            ? "ETF / Index Fund"
                            : "Unknown Asset")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                      <span className="text-gray-500 flex items-center gap-2">
                        <DollarSign size={16} /> Current Price
                      </span>
                      <span className="text-3xl font-bold text-white">
                        ${Number(stockData.price).toFixed(2)}
                      </span>
                    </div>

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
                              profile metadata is unavailable via standard
                              feeds.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: CHART & STATS */}
              <div className="xl:col-span-2 space-y-6 min-w-0">
                <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl h-[400px] flex flex-col">
                  {/* REAL INTRADAY PERFORMANCE HEADER */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Activity className="text-blue-500" /> Intraday
                      Performance
                    </h3>
                    {stockData.changePercent !== undefined && (
                      <span
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 ${stockData.changePercent >= 0 ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}
                      >
                        {stockData.changePercent >= 0 ? (
                          <ArrowUpRight size={16} />
                        ) : (
                          <ArrowDownRight size={16} />
                        )}
                        {stockData.changePercent >= 0 ? "+" : ""}
                        {Number(stockData.changePercent).toFixed(2)}% Today
                      </span>
                    )}
                  </div>

                  <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateSmartChartData(stockData)}>
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
                              stopColor={
                                stockData.changePercent >= 0
                                  ? "#22c55e"
                                  : "#ef4444"
                              }
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={
                                stockData.changePercent >= 0
                                  ? "#22c55e"
                                  : "#ef4444"
                              }
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
                          interval={6}
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
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [
                            `$${Number(value).toFixed(2)}`,
                            "Price",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={
                            stockData.changePercent >= 0 ? "#22c55e" : "#ef4444"
                          }
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* --- REAL DATA GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBox
                    label="Open"
                    value={
                      stockData.open
                        ? `$${Number(stockData.open).toFixed(2)}`
                        : "N/A"
                    }
                  />
                  <StatBox
                    label="High"
                    value={
                      stockData.high
                        ? `$${Number(stockData.high).toFixed(2)}`
                        : "N/A"
                    }
                  />
                  <StatBox
                    label="Low"
                    value={
                      stockData.low
                        ? `$${Number(stockData.low).toFixed(2)}`
                        : "N/A"
                    }
                  />
                  {/* Using Prev Close because Volume is not in the Quote endpoint */}
                  <StatBox
                    label="Prev. Close"
                    value={
                      stockData.prevClose
                        ? `$${Number(stockData.prevClose).toFixed(2)}`
                        : "N/A"
                    }
                  />
                </div>
              </div>
            </div>
          )}

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

const StatBox = ({ label, value }) => (
  <div className="bg-dashboard-card p-5 rounded-xl border border-gray-800 shadow-lg hover:border-gray-700 transition">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
      {label}
    </p>
    <p className="text-white font-bold text-xl">{value}</p>
  </div>
);

export default MarketPage;
