import React, { useState } from 'react';
// Fix: Add .tsx extension to module path
import { SparklesIcon } from './Icons.tsx';

const PromotionalBanner: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg mb-8 shadow-lg animate-fade-in-up overflow-hidden">
       <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
       <div className="absolute -bottom-8 -left-2 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-4">
          <SparklesIcon className="w-12 h-12 text-yellow-300 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-xl">Build Your Vision with PyCom!</h3>
            <p className="text-sm mt-1">Go beyond learning. We offer AI-powered app development, 360° marketing, and expert business solutions.</p>
          </div>
        </div>
         <button 
          onClick={onCTAClick}
          className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-transform hover:scale-105 flex-shrink-0"
        >
          Let's Build
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full p-1"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromotionalBanner;