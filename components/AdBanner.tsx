
import React from 'react';
import { SparklesIcon } from './Icons.tsx';

interface AdBannerProps {
  title: string;
  description: string;
  buttonText?: string;
  onAction?: () => void;
}

const AdBanner: React.FC<AdBannerProps> = ({ title, description, buttonText = "Book Now", onAction }) => {
  return (
    <div className="bg-gray-800/50 border-2 border-dashed border-purple-500/30 p-8 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-yellow-400">{title}</h3>
          <p className="text-gray-300 mt-2">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={onAction}
            className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-500 transition-transform hover:scale-105"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
