
import React, { useState, useEffect } from 'react';
import { ScaleIcon, ServerIcon, CheckCircleIcon, XMarkIcon, ArrowPathIcon, BoltIcon, CogIcon, PlusIcon } from '../Icons.tsx';

interface Node {
    id: string;
    name: string;
    status: 'healthy' | 'draining' | 'unhealthy';
    load: number; // 0-100%
    requests: number;
}

const LoadBalancer: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([
        { id: 'n1', name: 'web-prod-01', status: 'healthy', load: 45, requests: 1240 },
        { id: 'n2', name: 'web-prod-02', status: 'healthy', load: 38, requests: 1180 },
        { id: 'n3', name: 'web-prod-03', status: 'healthy', load: 52, requests: 1350 },
        { id: 'n4', name: 'web-prod-04', status: 'draining', load: 5, requests: 120 },
    ]);
    const [autoScaling, setAutoScaling] = useState(true);
    const [totalRPS, setTotalRPS] = useState(3890);

    // Simulate traffic distribution
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalRPS(prev => Math.max(1000, prev + Math.floor(Math.random() * 200) - 100));
            setNodes(prev => prev.map(n => {
                if (n.status === 'unhealthy') return n;
                const loadChange = Math.random() * 10 - 5;
                return {
                    ...n,
                    load: Math.max(0, Math.min(100, n.load + loadChange)),
                    requests: n.requests + Math.floor(Math.random() * 50)
                };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleNodeStatus = (id: string) => {
        setNodes(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'healthy' ? 'draining' : 'healthy' } : n));
    };

    return (
        <div className="h-full bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ScaleIcon className="w-8 h-8 text-blue-500" />
                        PyCom Load Balancer
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Algorithm: Least Connections (Weighted)</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total Throughput</p>
                        <p className="text-2xl font-mono font-bold text-green-400">{totalRPS.toLocaleString()} req/s</p>
                    </div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <button 
                        onClick={() => setAutoScaling(!autoScaling)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors ${autoScaling ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                    >
                        <BoltIcon className="w-4 h-4" />
                        Auto-Scaling: {autoScaling ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            <div className="flex-grow p-8 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                {/* Visual Traffic Flow Animation (Simplified) */}
                <div className="flex justify-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                    <div className="bg-slate-900 border border-blue-500 rounded-full px-6 py-2 z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <span className="text-blue-400 font-mono text-sm">Ingress Gateway</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {nodes.map(node => (
                        <div key={node.id} className={`relative bg-slate-900 rounded-xl border p-5 transition-all duration-300 ${node.status === 'healthy' ? 'border-slate-700 hover:border-blue-500' : 'border-red-900/50 opacity-75'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <ServerIcon className={`w-5 h-5 ${node.status === 'healthy' ? 'text-slate-300' : 'text-red-400'}`} />
                                    <span className="font-bold text-white text-sm">{node.name}</span>
                                </div>
                                <button onClick={() => toggleNodeStatus(node.id)} className="text-slate-500 hover:text-white" title="Toggle Maintenance Mode">
                                    <CogIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>Load</span>
                                        <span className={node.load > 80 ? 'text-red-400' : 'text-green-400'}>{node.load.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${node.load > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                            style={{ width: `${node.load}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                        node.status === 'healthy' ? 'bg-green-900/20 text-green-400' : 
                                        node.status === 'draining' ? 'bg-yellow-900/20 text-yellow-400' : 'bg-red-900/20 text-red-400'
                                    }`}>
                                        {node.status}
                                    </span>
                                    <span className="text-xs font-mono text-slate-500">{node.requests.toLocaleString()} reqs</span>
                                </div>
                            </div>
                            
                            {/* Traffic Particles (CSS Animation Placeholder) */}
                            {node.status === 'healthy' && (
                                <div className="absolute -top-1 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                            )}
                        </div>
                    ))}
                    
                    {/* Add Node Placeholder */}
                    <button className="border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 hover:border-slate-600 hover:bg-slate-900/50 transition-all group">
                        <PlusIcon className="w-8 h-8 text-slate-600 group-hover:text-slate-400 mb-2" />
                        <span className="text-slate-600 font-bold text-sm group-hover:text-slate-400">Add Node</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoadBalancer;
