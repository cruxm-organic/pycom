
import React, { useState } from 'react';
import { XMarkIcon, ChevronDownIcon, RocketLaunchIcon, UserGroupIcon, ChartBarIcon, BanknotesIcon, LightBulbIcon } from '../Icons.tsx';

interface InvestorDeckViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: "PyCom",
    subtitle: "Democratizing Python Education with AI",
    content: "Seed Round Pitch Deck",
    icon: <RocketLaunchIcon className="w-24 h-24 text-purple-500" />,
    bg: "bg-gradient-to-br from-slate-900 to-purple-900"
  },
  {
    id: 2,
    title: "The Problem",
    subtitle: "Coding Education is Broken",
    content: "Static tutorials and passive video lectures fail to engage modern learners. High dropout rates in MOOCs (96%) prove that students need personalized, interactive guidance, not just content.",
    icon: <XMarkIcon className="w-24 h-24 text-red-500" />,
    bg: "bg-slate-900"
  },
  {
    id: 3,
    title: "The Solution",
    subtitle: "AI-Powered Interactive Ecosystem",
    content: "PyCom combines a gamified arcade, a real-time AI Tutor (Professor Py), and browser-based execution environments. We turn learning into an addiction, not a chore.",
    icon: <LightBulbIcon className="w-24 h-24 text-yellow-400" />,
    bg: "bg-slate-900"
  },
  {
    id: 4,
    title: "Traction",
    subtitle: "Product-Market Fit",
    content: "• 10,000+ Monthly Active Users\n• 500,000+ Code Executions\n• 4.8/5 Average User Rating\n• Partnerships with Modern Business Network",
    icon: <ChartBarIcon className="w-24 h-24 text-green-400" />,
    bg: "bg-slate-900"
  },
  {
    id: 5,
    title: "The Team",
    subtitle: "Visionaries & Builders",
    content: "Led by Jeyabal Anthony (Founder) and supported by experts in Sales (Billy Jay), Tech (Walter Shekar), and Marketing (Suresh Kumar). A team with deep domain expertise.",
    icon: <UserGroupIcon className="w-24 h-24 text-blue-400" />,
    bg: "bg-slate-900"
  },
  {
    id: 6,
    title: "The Ask",
    subtitle: "Accelerating Growth",
    content: "Raising $2M Seed Round to:\n• Scale AI Infrastructure (GPU Clusters)\n• Expand Course Library\n• Launch B2B University Tier",
    icon: <BanknotesIcon className="w-24 h-24 text-green-500" />,
    bg: "bg-gradient-to-tl from-slate-900 to-green-900"
  }
];

const InvestorDeckViewer: React.FC<InvestorDeckViewerProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in-up">
      <div className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
        
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button onClick={onClose} className="bg-black/50 hover:bg-red-600/80 text-white p-2 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>

        {/* Slide Content */}
        <div className={`flex-grow flex flex-col items-center justify-center p-12 text-center relative ${slide.bg}`}>
            <div className="mb-8 animate-pop-in">
                {slide.icon}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">{slide.title}</h2>
            <h3 className="text-xl md:text-2xl text-purple-300 font-semibold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{slide.subtitle}</h3>
            <p className="text-lg text-gray-300 max-w-2xl whitespace-pre-line animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {slide.content}
            </p>
            
            <div className="absolute bottom-4 right-4 text-gray-500 text-sm font-mono">
                {currentSlide + 1} / {SLIDES.length}
            </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-900 p-4 flex justify-between items-center border-t border-gray-800">
            <button 
                onClick={prevSlide} 
                disabled={currentSlide === 0}
                className="text-white font-bold px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
                <ChevronDownIcon className="w-5 h-5 rotate-90" /> Previous
            </button>
            
            <div className="flex gap-2">
                {SLIDES.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-purple-500' : 'bg-gray-700'}`} />
                ))}
            </div>

            <button 
                onClick={nextSlide} 
                disabled={currentSlide === SLIDES.length - 1}
                className="text-white font-bold px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
                Next <ChevronDownIcon className="w-5 h-5 -rotate-90" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default InvestorDeckViewer;
