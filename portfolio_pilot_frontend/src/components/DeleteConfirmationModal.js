import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * A professional warning modal for irreversible actions.
 * * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Closes the modal without action
 * @param {function} onConfirm - Executes the deletion
 * @param {string} ticker - The name of the asset being deleted (for context)
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, ticker }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      
      <div className="bg-dashboard-card border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header with Warning Icon */}
        <div className="flex flex-col items-center justify-center p-6 bg-red-500/10 border-b border-red-500/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white text-center">Delete Position?</h3>
          <p className="text-red-400 text-sm mt-1 font-medium">This action cannot be undone.</p>
        </div>

        {/* Body Content */}
        <div className="p-6 text-center space-y-2">
          <p className="text-gray-300">
            Are you sure you want to remove <span className="text-white font-bold">{ticker}</span> from your portfolio?
          </p>
          <p className="text-gray-500 text-sm">
            All historical data associated with this specific holding record will be permanently lost.
          </p>
        </div>

        {/* Footer / Buttons */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 group"
          >
            <Trash2 size={18} className="group-hover:animate-bounce" />
            Delete Anyway
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteConfirmationModal;