import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import AddAssetModal from "../components/AddAssetModal";
import PortfolioChart from '../components/PortfolioChart';

/**
 * Component for displaying a single row in the Holdings list.
 * Replaces the static "ActivityItem" with real portfolio data.
 */
const HoldingItem = ({
  ticker,
  quantity,
  price,
  value,
  profit,
  profitPercent,
}) => {
  // Determine color based on profit (Green for +, Red for -)
  const isProfitable = profit >= 0;
  const colorClass = isProfitable ? "text-green-400" : "text-red-400";
  const profitSign = isProfitable ? "+" : "";

  return (
    <div className="flex justify-between items-center p-4 hover:bg-gray-800/50 rounded-lg transition border-b border-gray-800/50 last:border-0">
      <div className="flex items-center gap-4">
        {/* Ticker Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white shadow-md">
          {ticker}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{ticker}</p>
          <p className="text-xs text-gray-500">
            {quantity} Shares @ ${price}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-white">
          ${value.toLocaleString()}
        </p>
        <p className={`text-xs ${colorClass}`}>
          {profitSign}
          {profit.toLocaleString()} ({profitSign}
          {profitPercent}%)
        </p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  // Store the portfolio data from the backend
  const [portfolio, setPortfolio] = useState(null);
  // Store loading state (show spinner while fetching)
  const [loading, setLoading] = useState(true);
  // Store error messages
  const [error, setError] = useState("");
  // State for Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DATA FETCHING ---
  const fetchPortfolioData = useCallback(async () => {
    try {
      // 1. Get the JWT token from storage
      const token = localStorage.getItem("jwtToken");

      // If no token, force logout
      if (!token) {
        navigate("/login");
        return;
      }

      // 2. Call the Backend API
      const response = await axios.get("http://localhost:8080/api/portfolios", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the "Badge"
        },
      });

      // 3. Save data to state
      setPortfolio(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
      setError("Failed to load portfolio data.");
      setLoading(false);

      // Optional: If 403/401, redirect to login
      if (
        err.response &&
        (err.response.status === 403 || err.response.status === 401)
      ) {
        navigate("/login");
      }
    }
  }, [navigate]);

  // Initial load
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // --- HANDLERS ---
  const handleAssetAdded = () => {
    // When an asset is added via modal, re-fetch the data to update the UI immediately
    setLoading(true);
    fetchPortfolioData();
  };

  // --- RENDER HELPERS ---

  if (loading) {
    return (
      <div className="h-screen bg-dashboard-main flex items-center justify-center text-white">
        Loading Financial Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-dashboard-main flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // Use default values if portfolio is null to prevent crashes
  const data = portfolio || {
    totalBalance: 0,
    totalProfit: 0,
    totalProfitPercentage: 0,
    holdings: [],
  };

  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-dashboard-main/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>

          {/* Button triggers the Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20"
          >
            + New Investment
          </button>
        </header>

        <div className="p-8 space-y-6">
          {/* --- TOP STATS CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Balance"
              value={`$${data.totalBalance.toLocaleString()}`}
              trend={data.totalProfitPercentage >= 0 ? "+Active" : "-Loss"}
              positive={true}
            />
            <StatCard
              title="Total Profit"
              value={`$${data.totalProfit.toLocaleString()}`}
              trend={`${data.totalProfitPercentage}%`}
              positive={data.totalProfit >= 0}
            />
            {/* Placeholder for Best Performer logic (can be computed later) */}
            <StatCard
              title="Total Invested"
              value={`$${data.totalInvested.toLocaleString()}`}
              trend="Cost Basis"
              positive
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            {/* --- LEFT: CHART PLACEHOLDER --- */}
            <div className="lg:col-span-2 bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-white">Asset Allocation</h3>
              <div className="flex-1 w-full min-h-[300px]">
                 <PortfolioChart holdings={data.holdings} />
              </div>
            </div>

            {/* --- RIGHT: HOLDINGS LIST (The Rows from Spreadsheet) --- */}
            <div className="bg-dashboard-card rounded-2xl p-6 border border-gray-800 shadow-xl overflow-hidden flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Your Holdings
              </h3>

              <div className="overflow-y-auto pr-2 space-y-2">
                {data.holdings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No investments yet.
                  </p>
                ) : (
                  data.holdings.map((holding, index) => (
                    <HoldingItem
                      key={index}
                      ticker={holding.ticker}
                      quantity={holding.quantity}
                      price={holding.averagePrice}
                      value={holding.marketValue}
                      profit={holding.totalProfitLoss}
                      profitPercent={holding.profitLossPercentage}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL INJECTION --- */}
        <AddAssetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAssetAdded={handleAssetAdded}
        />
      </main>
    </div>
  );
};

export default DashboardPage;
