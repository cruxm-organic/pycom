import React, { useState } from 'react';
// Fix: Add .ts extension to module path
import { CAREER_PATHS } from '../../constants.ts';
// Fix: Add .ts extension to module path
import type { CareerPath, PageNavigationProps } from '../../types.ts';
// Fix: Add .tsx extension to module paths
import ServicesBanner from '../ServicesBanner.tsx';
import { ChevronDownIcon, BriefcaseIcon, CurrencyDollarIcon } from '../Icons.tsx';

const CareerPathCard: React.FC<{ path: CareerPath }> = ({ path }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700/80 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start md:items-center justify-between p-6 text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white">{path.title}</h3>
          <p className="text-blue-400 font-semibold">{path.subtitle}</p>
        </div>
        <ChevronDownIcon
          className={`w-8 h-8 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 border-t border-slate-700/50">
            <img src={path.illustrationUrl} alt={`${path.title} illustration`} className="w-full h-48 object-cover rounded-xl my-4" />
            <p className="text-slate-300 mt-2 mb-6">{path.description}</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2 text-lg">
                  <BriefcaseIcon className="w-6 h-6 text-purple-400" />
                  Key Responsibilities
                </h4>
                <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                  {path.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                 <h4 className="font-bold text-slate-200 mb-3 flex items-center gap-2 text-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-green-400" />
                  Average Salary (USA)
                </h4>
                <p className="text-green-300 font-semibold text-lg pl-2">{path.averageSalary}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-3 text-lg">Key Tools:</h4>
                <div className="flex flex-wrap gap-2 pl-2">
                  {path.tools.map(tool => (
                    <span key={tool} className="bg-slate-700 text-sm text-slate-200 px-3 py-1 rounded-full">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CareerPathsPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
  return (
    <div className="animate-fade-in-up space-y-16">
      <div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Forge Your Future: Career Paths</h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Python is your key to unlocking these in-demand technology careers. Explore the paths below to see where your skills can take you.
          </p>
        </div>
        <div className="space-y-6 max-w-4xl mx-auto">
          {CAREER_PATHS.map(path => (
            <CareerPathCard key={path.id} path={path} />
          ))}
        </div>
      </div>
      <ServicesBanner onCTAClick={() => setActivePage('contact')} />
    </div>
  );
};

export default CareerPathsPage;
