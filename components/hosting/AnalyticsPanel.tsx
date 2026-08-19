
import React, { useState } from 'react';
import { ChartPieIcon, ArrowPathIcon, BugAntIcon, ClockIcon, TerminalIcon } from '../Icons.tsx';

const AnalyticsPanel: React.FC = () => {
    const [logs, setLogs] = useState([
        "[INFO] Request served by web-prod-01 in 12ms",
        "[WARN] High latency detected on db-shard-04 (150ms)",
        "[INFO] Auto-scaling triggered: +1 Node",
        "[ERROR] Connection refused: redis-cache-02 (Retrying...)"
    ]);

    return (
        <div className="h-full bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ChartPieIcon className="w-8 h-8 text-purple-500" />
                    Operational Analytics
                </h2>
                <div className="flex gap-2">
                    <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 outline-none">
                        <option>Last 1 Hour</option>
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                    </select>
                    <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                        <ArrowPathIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Metrics Cards */}
                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Global RPS</p>
                        <p className="text-3xl font-bold text-white">4,291</p>
                        <span className="text-green-400 text-xs flex items-center gap-1 mt-2">↑ 12% vs last hour</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">P99 Latency</p>
                        <p className="text-3xl font-bold text-yellow-400">142ms</p>
                        <span className="text-slate-400 text-xs flex items-center gap-1 mt-2">Stable</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Error Rate</p>
                        <p className="text-3xl font-bold text-red-400">0.04%</p>
                        <span className="text-red-400 text-xs flex items-center gap-1 mt-2">↑ Spike detected</span>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Active Users</p>
                        <p className="text-3xl font-bold text-blue-400">892</p>
                        <span className="text-green-400 text-xs flex items-center gap-1 mt-2">↑ 5% Growth</span>
                    </div>
                </div>

                {/* Charts (Placeholder Visuals) */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-slate-400" /> Request Volume
                    </h3>
                    <div className="flex-grow flex items-end gap-1">
                        {Array.from({length: 40}).map((_, i) => (
                            <div 
                                key={i} 
                                className="flex-grow bg-blue-600/50 rounded-t hover:bg-blue-500 transition-colors"
                                style={{ height: `${20 + Math.random() * 80}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-80 flex flex-col">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <TerminalIcon className="w-5 h-5 text-slate-400" /> Error Distribution
                    </h3>
                    <div className="flex-grow flex items-center justify-center">
                         {/* Simple Pie Chart Representation */}
                        <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative" style={{ background: 'conic-gradient(#ef4444 0% 10%, #eab308 10% 35%, #3b82f6 35% 100%)' }}>
                             <div className="w-24 h-24 bg-slate-900 rounded-full"></div>
                        </div>
                        <div className="ml-8 space-y-2 text-xs">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> <span className="text-slate-300">500 Internal Server Error (10%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div> <span className="text-slate-300">404 Not Found (25%)</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div> <span className="text-slate-300">200 OK (65%)</span></div>
                        </div>
                    </div>
                </div>

                {/* Debug Console */}
                <div className="col-span-1 lg:col-span-2 bg-black rounded-xl border border-slate-800 flex flex-col h-64 overflow-hidden">
                    <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center justify-between px-4">
                        <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                            <BugAntIcon className="w-4 h-4" /> Live Debug Console
                        </span>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] text-green-400">Connected</span>
                        </div>
                    </div>
                    <div className="flex-grow p-4 font-mono text-xs overflow-y-auto space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('WARN') ? 'text-yellow-400' : 'text-slate-300'}`}>
                                <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </div>
                        ))}
                        <div className="text-slate-500 animate-pulse">_</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
