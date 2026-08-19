
import React, { useState } from 'react';
import { CloudArrowDownIcon, StarIcon, CheckCircleIcon, RocketLaunchIcon, ArrowPathIcon } from '../Icons.tsx';

const APPS = [
    { id: '1', name: 'Django Starter', cat: 'Web', stars: '4.9', desc: 'Production-ready Django 5.0 setup with PostgreSQL.', icon: '🌶️' },
    { id: '2', name: 'Apache Airflow', cat: 'Data', stars: '4.8', desc: 'Workflow automation platform for data engineering.', icon: '🌬️' },
    { id: '3', name: 'Superset', cat: 'BI', stars: '4.7', desc: 'Modern data exploration and visualization platform.', icon: '📊' },
    { id: '4', name: 'JupyterHub', cat: 'Data', stars: '4.9', desc: 'Multi-user server for Jupyter notebooks.', icon: '🪐' },
    { id: '5', name: 'Odoo ERP', cat: 'Business', stars: '4.6', desc: 'All-in-one business software including CRM, website, e-commerce.', icon: '📦' },
    { id: '6', name: 'FastAPI Microservice', cat: 'Web', stars: '5.0', desc: 'High-performance API template with async support.', icon: '⚡' },
    { id: '7', name: 'PyTorch Training', cat: 'AI/ML', stars: '4.8', desc: 'Pre-configured environment for deep learning models.', icon: '🔥' },
    { id: '8', name: 'Streamlit Dashboard', cat: 'Data', stars: '4.9', desc: 'Turn data scripts into shareable web apps in minutes.', icon: '👑' },
];

interface MarketplaceProps {
    onDeploy: (app: any) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onDeploy }) => {
    const [deployingId, setDeployingId] = useState<string | null>(null);

    const handleDeployClick = (app: any) => {
        if (deployingId) return;
        setDeployingId(app.id);
        // Small delay for visual feedback before switching tabs
        setTimeout(() => {
            onDeploy(app);
            setDeployingId(null);
        }, 800);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="bg-slate-900 p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <RocketLaunchIcon className="w-7 h-7 text-orange-500" />
                    Open Source Marketplace
                </h2>
                <p className="text-slate-400 text-sm mt-1">One-click deployment for the best Python open-source projects.</p>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {APPS.map(app => (
                    <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500 transition-all hover:-translate-y-1 group cursor-pointer shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-4xl">{app.icon}</span>
                            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs font-bold text-yellow-400">
                                <StarIcon className="w-3 h-3 fill-current" /> {app.stars}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{app.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">{app.cat}</span>
                            <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Verified</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2">{app.desc}</p>
                        <button 
                            onClick={() => handleDeployClick(app)}
                            disabled={deployingId !== null}
                            className={`w-full font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                                deployingId === app.id 
                                ? 'bg-purple-700 text-white cursor-wait'
                                : 'bg-slate-800 text-white group-hover:bg-purple-600'
                            }`}
                        >
                            {deployingId === app.id ? (
                                <><ArrowPathIcon className="w-4 h-4 animate-spin" /> Starting...</>
                            ) : (
                                <><CloudArrowDownIcon className="w-4 h-4" /> Deploy</>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
