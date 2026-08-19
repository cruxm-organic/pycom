
import React from 'react';
import { UsersIcon, RobotIcon, ArrowRightIcon, ChatBubbleLeftRightIcon } from '../Icons.tsx';

const CollaborativeCanvas: React.FC = () => {
    return (
        <div className="h-full bg-slate-950 flex flex-col">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <UsersIcon className="w-6 h-6 text-blue-500" />
                        Agent Collaboration Canvas
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Visualize hierarchical task delegation and multi-agent swarms.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-900/30 text-green-400 text-xs font-bold border border-green-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active Swarm
                    </span>
                </div>
            </div>

            <div className="flex-grow relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }}></div>

                {/* Visual Hierarchy */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full max-w-4xl h-[500px]">
                        {/* Connections */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 450 80 L 250 250" stroke="#475569" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" />
                            <path d="M 450 80 L 650 250" stroke="#475569" strokeWidth="2" />
                            <path d="M 250 250 L 150 400" stroke="#475569" strokeWidth="2" />
                            <path d="M 250 250 L 350 400" stroke="#475569" strokeWidth="2" />
                        </svg>

                        {/* Root Agent */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                            <div className="w-16 h-16 rounded-full bg-purple-600 border-4 border-slate-900 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center text-white">
                                <RobotIcon className="w-8 h-8" />
                            </div>
                            <div className="mt-2 bg-slate-900 border border-purple-500 rounded px-3 py-1 text-center">
                                <p className="text-white font-bold text-sm">CEO Agent</p>
                                <p className="text-[10px] text-purple-400">Orchestrator</p>
                            </div>
                        </div>

                        {/* Level 2 Agents */}
                        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                            <div className="w-14 h-14 rounded-full bg-blue-600 border-4 border-slate-900 shadow-lg flex items-center justify-center text-white">
                                <RobotIcon className="w-6 h-6" />
                            </div>
                            <div className="mt-2 bg-slate-900 border border-blue-500 rounded px-3 py-1 text-center">
                                <p className="text-white font-bold text-sm">Sales Director</p>
                                <p className="text-[10px] text-blue-400">Lead Gen</p>
                            </div>
                            {/* Communication Bubble */}
                            <div className="absolute -top-12 right-[-100px] bg-slate-800 text-xs text-slate-300 p-2 rounded-lg border border-slate-700 shadow-xl w-40 animate-fade-in-up">
                                <p>"Q3 Strategy Approved. Initiating outreach..."</p>
                            </div>
                        </div>

                        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 opacity-50">
                            <div className="w-14 h-14 rounded-full bg-orange-600 border-4 border-slate-900 shadow-lg flex items-center justify-center text-white">
                                <RobotIcon className="w-6 h-6" />
                            </div>
                            <div className="mt-2 bg-slate-900 border border-orange-500 rounded px-3 py-1 text-center">
                                <p className="text-white font-bold text-sm">Marketing Lead</p>
                                <p className="text-[10px] text-orange-400">Idle</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Log Stream */}
            <div className="h-48 bg-black border-t border-slate-800 p-4 overflow-y-auto font-mono text-xs">
                <div className="text-slate-500 font-bold mb-2 flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-4 h-4" /> Swarm Communication Log
                </div>
                <div className="space-y-1">
                    <div className="text-purple-400">[CEO] Delegated task "Series A Prep" to Sales Director.</div>
                    <div className="text-blue-400">[SALES] Acknowledged. Engaging enrichment tools via MCP.</div>
                    <div className="text-green-500">[SYSTEM] Shared memory context updated (v14.2).</div>
                    <div className="text-slate-500 animate-pulse">_</div>
                </div>
            </div>
        </div>
    );
};

export default CollaborativeCanvas;
