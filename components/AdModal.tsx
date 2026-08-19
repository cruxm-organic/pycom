import React from 'react';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="relative bg-gray-800 border border-purple-500 rounded-lg w-full max-w-lg shadow-2xl p-4 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-3 -right-3 text-white bg-gray-700 rounded-full p-1.5 hover:bg-gray-600 z-10">&times;</button>
        <p className="text-center text-xs text-gray-400 mb-2">This is an example of a pop-up ad</p>
        <a href="https://modernbusinessnetwork.com/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://modernbusinessnetwork.com/wp-content/uploads/2023/10/mbn-logo.png" 
            alt="Modern Business Network" 
            className="w-full rounded-md"
          />
        </a>
      </div>
    </div>
  );
};

export default AdModal;
