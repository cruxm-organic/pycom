import React from 'react';
import { SparklesIcon } from './Icons.tsx';

const AILabBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-8 shadow-lg text-center animate-fade-in-up">
      <SparklesIcon className="w-10 h-10 text-yellow-300 mx-auto mb-2 animate-subtle-float" />
      <h3 className="font-bold text-2xl">The Future is at Your Fingertips</h3>
      <p className="mt-2 mb-4 max-w-2xl mx-auto text-blue-100">
        You're in the lab now. Unleash your creativity with Gemini to generate images, create videos, chat with an AI, and discover what's possible.
      </p>
    </div>
  );
};

export default AILabBanner;
