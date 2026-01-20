import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Trash2, Edit2, Save, X } from "lucide-react";

const MyPortfolioPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Temporary data for editing
  const [editFormData, setEditFormData] = useState({
    quantity: "",
    averagePrice: "",
  });

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

  // --- DELETE HANDLER ---
  const handleDelete = async (id, ticker) => {
    // 1. Confirmation
    if (!window.confirm(`Are you sure you want to delete ${ticker}?`)) return;

    try {
      const token = localStorage.getItem("jwtToken");

      // 2. Call Backend API
      await axios.delete(
        `http://localhost:8080/api/portfolios/holdings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // 3. Optimistic Update (Update UI immediately without reloading page)
      // We filter out the deleted item from the state
      setHoldings((prevHoldings) => prevHoldings.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Failed to delete holding:", err);
      alert("Failed to delete. Please try again.");
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-dashboard-main text-dashboard-text font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
          <p className="text-gray-400 mt-2">
            Manage your assets and track performance detail.
          </p>
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
                <tr key={index} className="hover:bg-gray-800/30 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                      {holding.ticker[0]}
                    </div>
                    {holding.ticker}
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
                    <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition">
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(holding.id, holding.ticker)}
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
              No holdings found. Go to Dashboard to add some investments.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPortfolioPage;
