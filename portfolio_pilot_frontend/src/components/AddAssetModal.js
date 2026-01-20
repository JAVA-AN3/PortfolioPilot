import React, { useState } from "react";
import axios from "axios";
import { X, Save, Loader } from "lucide-react";

/**
 * Modal component for adding a new stock position.
 * Handles user input, validation, and the API POST request.
 * * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Function to close the modal
 * @param {function} onAssetAdded - Callback to trigger dashboard refresh on success
 */
const AddAssetModal = ({ isOpen, onClose, onAssetAdded }) => {
  // --- Local state ---
  const [formData, setFormData] = useState({
    ticker: "",
    quantity: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verify if it's open, either way not render
  if (!isOpen) return null;

  // --- Handlers ---

  const handleChange = (e) => {
    // If typing in ticker force uppercase
    const value =
      e.target.name === "ticker"
        ? e.target.value.toUpperCase()
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");

      // Send data to Backend (POST /api/porfolios/holdings)
      await axios.post(
        "http://localhost:8080/api/portfolios/holdings",
        {
          ticker: formData.ticker,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // On success: reset form, notify parent and close
      setFormData({ ticker: "", quantity: "", price: "" });
      onAssetAdded(); // dashboard refresh
      onClose();
    } catch (err) {
      console.error("Failed to add asset:", err);
      setError("Failed to save. Check your inputs or connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay (backdrop)
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      {/* Modal Card */}
      <div className="bg-dashboard-card border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-dashboard-main/50">
          <h3 className="text-xl font-bold text-white">Add New Asset</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Ticker Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">
              Ticker Symbol
            </label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              placeholder="e.g. AAPL, TSLA"
              className="w-full bg-dashboard-main border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className="w-full bg-dashboard-main border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Price Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">
                Buy Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full bg-dashboard-main border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Footer / Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} /> Save Asset
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
