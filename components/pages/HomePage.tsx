
import React from 'react';
// Fix: Add .ts extension to module path
import type { Page, PageNavigationProps } from '../../types.ts';
// Fix: Add .tsx extension to module paths
import { BrainIcon, CodeBracketIcon, TrendingUpIcon, NewspaperIcon } from '../Icons.tsx';
import ServicesBanner from '../ServicesBanner.tsx';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  page: Page;
  setActivePage: (page: Page) => void;
}> = ({ icon, title, description, page, setActivePage }) => (
  <button
    onClick={() => setActivePage(page)}
    className="interactive-card bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-left h-full flex flex-col"
  >
    <div className="flex-shrink-0">{icon}</div>
    <h3 className="text-xl font-bold text-white mt-4 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm flex-grow">{description}</p>
  </button>
);

const HomePage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
  return (
    <div className="animate-fade-in-up space-y-16">
      <section className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-text-glow">
          The AI-Powered Platform to Master Python
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          From interactive games and AI-driven tools to expert-led career paths, PyCom is your all-in-one launchpad for Python excellence.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => setActivePage('gamezone')} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform hover:scale-105">
            Start Learning
          </button>
          <button onClick={() => setActivePage('lab')} className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-600 transition-transform hover:scale-105">
            Explore AI Lab
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<BrainIcon className="w-10 h-10 text-purple-400" />}
          title="Interactive Gamezone"
          description="Learn complex Python concepts through a series of fun, engaging mini-games designed to test and reinforce your skills."
          page="gamezone"
          setActivePage={setActivePage}
        />
        <FeatureCard
          icon={<TrendingUpIcon className="w-10 h-10 text-green-400" />}
          title="Career Paths"
          description="Explore detailed roadmaps for in-demand tech careers like Data Science and Backend Development, complete with required skills and tools."
          page="careers"
          setActivePage={setActivePage}
        />
        <FeatureCard
          icon={<CodeBracketIcon className="w-10 h-10 text-blue-400" />}
          title="SourceKit"
          description="Your personal library of cheat sheets, code snippets, and essential resources to accelerate your development workflow."
          page="sourcekit"
          setActivePage={setActivePage}
        />
        <FeatureCard
          icon={<NewspaperIcon className="w-10 h-10 text-yellow-400" />}
          title="PyCom Blog"
          description="Stay updated with the latest trends, tutorials, and insights from the world of Python and AI development."
          page="blog"
          setActivePage={setActivePage}
        />
      </section>
      
      <ServicesBanner onCTAClick={() => setActivePage('contact')} />
    </div>
  );
};

export default HomePage;
