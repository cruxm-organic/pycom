import React from 'react';
import { CodeBracketIcon } from './Icons.tsx';

interface ServicesBannerProps {
  onCTAClick: () => void;
}

const ServicesBanner: React.FC<ServicesBannerProps> = ({ onCTAClick }) => {
  return (
    <section>
      <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-8 rounded-2xl shadow-lg border border-purple-500/30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-5">
            <CodeBracketIcon className="w-12 h-12 text-purple-400 flex-shrink-0 hidden sm:block" />
            <div>
              <h3 className="font-bold text-2xl text-white">Ready to Build Your AI-Powered Future?</h3>
              <p className="text-gray-300 mt-1">Leverage our expertise in AI, web development, and digital marketing to bring your vision to life. Let's create something amazing together.</p>
            </div>
          </div>
          <button 
            onClick={onCTAClick}
            className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform hover:scale-105 flex-shrink-0"
          >
            Get a Free Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesBanner;