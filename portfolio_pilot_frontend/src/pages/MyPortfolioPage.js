import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import EditAssetModal from "../components/EditAssetModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import AddAssetModal from "../components/AddAssetModal";
import { Trash2, Edit2, Plus, TrendingUp } from "lucide-react";

const MyPortfolioPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook to read data from Dashboard
  const location = useLocation();
  const highlightTicker = location.state?.highlightTicker;

  // To redirect you to Market page
  const navigate = useNavigate();

  // --- EDIT MODAL STATE ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  // --- DELETE MODAL STATE ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holdingToDelete, setHoldingToDelete] = useState(null);

  // --- ADD MODAL STATE ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- FETCH DATA ---
  const fetchHoldings = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8080/api/portfolios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHoldings(response.data.holdings);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  // --- AUTO-SCROLL & HIGHLIGHT EFFECT ---
  useEffect(() => {
    if (!loading && highlightTicker && holdings.length > 0) {
      const element = document.getElementById(`holding-row-${highlightTicker}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        element.classList.add("bg-blue-600/20");
        element.classList.add("transition-colors");
        element.classList.add("duration-1000");

        setTimeout(() => {
          element.classList.remove("bg-blue-600/20");
        }, 2000);
      }
    }
  }, [loading, highlightTicker, holdings]);

  // --- HANDLERS ---

  // REFRESH DATA (Used by Add and Edit modals)
  const handleDataRefresh = () => {
    setLoading(true);
    fetchHoldings();
  };

  // DELETE LOGIC
  const initiateDelete = (holding) => {
    setHoldingToDelete(holding);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!holdingToDelete) return;

    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(
        `http://localhost:8080/api/portfolios/holdings/${holdingToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Optimistic UI update
      setHoldings((prevHoldings) =>
        prevHoldings.filter((h) => h.id !== holdingToDelete.id),
      );

      setIsDeleteModalOpen(false);
      setHoldingToDelete(null);
    } catch (err) {
      console.error("Failed to delete holding:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  // --- EDIT HANDLERS ---
  const handleEditClick = (holding) => {
    setSelectedHolding(holding);
    setIsEditModalOpen(true);
  };

  // --- Holding click redirects to Market page
  const handleTickerClick = (ticker) => {
    // Navigate to /market and pass the ticker in the "state" object
    navigate('/market', { state: { searchTicker: ticker } });
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
            <p className="text-gray-400 mt-2">
              Manage your assets and track performance detail.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus size={18} />
            New Investment
          </button>
        </header>

        <div className="bg-dashboard-card rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Ticker</th>
                <th className="p-4 font-medium">Quantity</th>
                <th className="p-4 font-medium">Avg. Price</th>
                <th className="p-4 font-medium">Current Price</th>
                <th className="p-4 font-medium">Market Value</th>
                <th className="p-4 font-medium">Profit / Loss</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {holdings.map((holding, index) => (
                <tr key={index} className="hover:bg-gray-800/30 transition group">
                  
                  {/* 4. CLICKABLE TICKER CELL */}
                  <td 
                    onClick={() => handleTickerClick(holding.ticker)} 
                    className="p-4 font-bold text-white flex items-center gap-3 cursor-pointer hover:text-blue-400 transition-colors"
                    title="Analyze in Market Page"
                  >
                    <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                        {holding.ticker[0]}
                    </div>
                    {holding.ticker}
                    <TrendingUp size={14} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                  </td>

                  <td className="p-4 text-gray-300">{holding.quantity}</td>
                  <td className="p-4 text-gray-300">
                    ${holding.averagePrice?.toLocaleString()}
                  </td>
                  <td className="p-4 text-white font-medium">
                    ${holding.currentPrice?.toLocaleString()}
                  </td>
                  <td className="p-4 text-white font-bold">
                    ${holding.marketValue?.toLocaleString()}
                  </td>
                  <td
                    className={`p-4 font-medium ${holding.totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {holding.totalProfitLoss >= 0 ? "+" : ""}
                    {holding.totalProfitLoss?.toLocaleString()}
                    <span className="text-xs opacity-75 ml-1">
                      ({holding.profitLossPercentage}%)
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(holding)}
                      className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => initiateDelete(holding)}
                      className="p-2 hover:bg-red-900/30 rounded-lg text-gray-400 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {holdings.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No holdings found. Click "New Investment" to start.
            </div>
          )}
        </div>

        {/* --- INJECT MODALS --- */}

        {/* Add Modal */}
        <AddAssetModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAssetAdded={handleDataRefresh}
        />

        {/* Edit Modal */}
        <EditAssetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          holding={selectedHolding}
          onUpdateSuccess={handleDataRefresh}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          ticker={holdingToDelete?.ticker}
        />
      </main>
    </div>
  );
};

export default MyPortfolioPage;
