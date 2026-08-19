
import React, { useState } from 'react';
import { WORKFLOW_TEMPLATES } from '../../constants.ts';
import type { WorkflowTemplate } from '../../types.ts';
import { RobotIcon, PlayIcon, MagnifyingGlassIcon, ChartBarIcon } from '../Icons.tsx';

interface AutoPilotProps {
    onDeploy: (template: WorkflowTemplate) => void;
}

const AutoPilot: React.FC<AutoPilotProps> = ({ onDeploy }) => {
    const [category, setCategory] = useState<string>('All');
    const [search, setSearch] = useState('');

    const filteredTemplates = WORKFLOW_TEMPLATES.filter(t => {
        const matchesCategory = category === 'All' || t.category === category;
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Sales', 'Marketing', 'Strategy', 'Technical', 'Operations'];

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <RobotIcon className="w-7 h-7 text-green-500" />
                            Auto-Pilot Library
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Select from 100+ pre-configured automation workflows</p>
                    </div>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Search templates..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-green-500 w-full md:w-64 transition-all focus:w-72"
                        />
                    </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                category === cat 
                                ? 'bg-green-600 text-white' 
                                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto bg-slate-950">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 hover:border-green-500/50 transition-all group flex flex-col shadow-lg hover:shadow-green-900/10 hover:-translate-y-1 duration-300">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                    template.complexity === 'Low' ? 'bg-blue-900/30 text-blue-400' :
                                    template.complexity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                    'bg-red-900/30 text-red-400'
                                }`}>
                                    {template.complexity}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">{template.steps} Steps</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2 h-14">{template.title}</h3>
                            <p className="text-slate-400 text-xs mb-6 flex-grow leading-relaxed line-clamp-3">{template.description}</p>
                            <button 
                                onClick={() => onDeploy(template)}
                                className="w-full bg-slate-800 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-green-900/20"
                            >
                                <PlayIcon className="w-4 h-4" />
                                Deploy
                            </button>
                        </div>
                    ))}
                </div>
                {filteredTemplates.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <ChartBarIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>No templates found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AutoPilot;
