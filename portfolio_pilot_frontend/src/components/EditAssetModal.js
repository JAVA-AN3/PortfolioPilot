import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Loader } from 'lucide-react';

/**
 * Modal component for updating an existing stock holding.
 * It pre-fills the form with the current data passed via props.
 * * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Function to close the modal
 * @param {object} holding - The holding object to be edited (contains id, ticker, quantity, price)
 * @param {function} onUpdateSuccess - Callback to refresh the parent list after save
 */
const EditAssetModal = ({ isOpen, onClose, holding, onUpdateSuccess }) => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    quantity: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- EFFECT: Pre-fill form when holding changes ---
  // This is crucial. When the parent passes a new 'holding', we update our inputs.
  useEffect(() => {
    if (holding) {
      setFormData({
        quantity: holding.quantity,
        price: holding.averagePrice
      });
    }
  }, [holding]);

  if (!isOpen || !holding) return null;

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      
      // PUT Request to update specific ID
      await axios.put(`http://localhost:8080/api/portfolios/holdings/${holding.id}`, 
        {
          quantity: parseFloat(formData.quantity),
          averagePrice: parseFloat(formData.price)
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // On success
      onUpdateSuccess(); 
      onClose();

    } catch (err) {
      console.error("Failed to update asset:", err);
      setError('Failed to update. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-dashboard-card border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-dashboard-main/50">
          <h3 className="text-xl font-bold text-white">Edit Position: <span className="text-blue-400">{holding.ticker}</span></h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
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

          {/* Ticker (Read Only) */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400">Ticker Symbol</label>
            <input
              type="text"
              value={holding.ticker}
              disabled
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Quantity</label>
              <input
                type="number"
                name="quantity"
                step="any"
                value={formData.quantity}
                onChange={handleChange}
                min="0.0000001"
                className="w-full bg-dashboard-main border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Price Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400">Avg. Buy Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="w-full bg-dashboard-main border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          {/* Footer */}
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
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <><Save size={20} /> Update</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;