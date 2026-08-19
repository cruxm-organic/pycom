
import React, { useState, useEffect } from 'react';
import { NetworkIcon, FireIcon, ChipIcon, ServerIcon, PlayIcon, StopIcon, ArrowPathIcon, CogIcon, TrashIcon, PlusIcon, CheckCircleIcon } from '../Icons.tsx';

interface WorkerProcess {
    pid: number;
    status: 'idle' | 'processing' | 'starting';
    memory: number; // MB
    cpu: number; // %
    uptime: string;
}

interface Middleware {
    id: string;
    name: string;
    type: 'standard' | 'ai';
    active: boolean;
}

const PyComWSGI: React.FC = () => {
    const [serverStatus, setServerStatus] = useState<'running' | 'stopped'>('running');
    const [workers, setWorkers] = useState<WorkerProcess[]>([
        { pid: 4102, status: 'processing', memory: 45, cpu: 12, uptime: '2d 4h' },
        { pid: 4103, status: 'idle', memory: 32, cpu: 0.5, uptime: '2d 4h' },
        { pid: 4104, status: 'processing', memory: 128, cpu: 45, uptime: '5h 12m' },
    ]);
    const [middlewares, setMiddlewares] = useState<Middleware[]>([
        { id: 'mw1', name: 'SecurityHeaders', type: 'standard', active: true },
        { id: 'mw2', name: 'GzipCompression', type: 'standard', active: true },
        { id: 'mw3', name: 'PyCom AI Optimizer', type: 'ai', active: false },
        { id: 'mw4', name: 'RequestLogger', type: 'standard', active: true },
    ]);
    const [logs, setLogs] = useState<string[]>([
        '[INFO] [PID:4102] GET /api/v1/users 200 OK (12ms)',
        '[INFO] [PID:4104] POST /api/v1/auth 201 Created (45ms)',
        '[INFO] Spawning worker process 4105...'
    ]);
    const [metrics, setMetrics] = useState({ rps: 145, latency: 24, errorRate: 0.02 });
    
    // Simulation Effect
    useEffect(() => {
        if (serverStatus === 'stopped') return;

        const interval = setInterval(() => {
            // Randomize metrics
            setMetrics(prev => ({
                rps: Math.max(0, prev.rps + Math.floor(Math.random() * 20) - 10),
                latency: Math.max(5, prev.latency + Math.floor(Math.random() * 5) - 2),
                errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() * 0.01) - 0.005))
            }));

            // Randomize logs
            if (Math.random() > 0.7) {
                const methods = ['GET', 'POST', 'PUT', 'DELETE'];
                const paths = ['/api/data', '/auth/login', '/ws/chat', '/static/main.css'];
                const statuses = ['200 OK', '201 Created', '404 Not Found', '500 Internal Error'];
                const method = methods[Math.floor(Math.random() * methods.length)];
                const path = paths[Math.floor(Math.random() * paths.length)];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const pid = workers[Math.floor(Math.random() * workers.length)]?.pid || 4000;
                
                const newLog = `[INFO] [PID:${pid}] ${method} ${path} ${status} (${Math.floor(Math.random() * 100)}ms)`;
                setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
            }

            // Randomize worker stats
            setWorkers(prev => prev.map(w => ({
                ...w,
                cpu: w.status === 'processing' ? Math.min(100, w.cpu + Math.random() * 10 - 5) : 0.5,
                memory: Math.max(20, w.memory + Math.random() * 5 - 2)
            })));

        }, 1000);

        return () => clearInterval(interval);
    }, [serverStatus, workers]);

    const toggleServer = () => {
        if (serverStatus === 'running') {
            setServerStatus('stopped');
            setLogs(prev => ['[INFO] Shutting down PyCom WSGI Server...', ...prev]);
        } else {
            setServerStatus('running');
            setLogs(prev => ['[INFO] Starting PyCom WSGI Server v2.4...', ...prev]);
        }
    };

    const toggleMiddleware = (id: string) => {
        setMiddlewares(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
    };

    const addWorker = () => {
        const newPid = 4100 + workers.length + Math.floor(Math.random() * 100);
        setWorkers([...workers, { pid: newPid, status: 'starting', memory: 20, cpu: 0, uptime: '0s' }]);
        setTimeout(() => {
            setWorkers(prev => prev.map(w => w.pid === newPid ? { ...w, status: 'idle' } : w));
        }, 2000);
    };

    const killWorker = (pid: number) => {
        setWorkers(workers.filter(w => w.pid !== pid));
        setLogs(prev => [`[WARN] Worker PID:${pid} killed by user.`, ...prev]);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            {/* Header */}
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-900/20 rounded-xl border border-purple-500/30">
                        <NetworkIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            PyCom WSGI Server
                            {serverStatus === 'running' ? (
                                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/30 font-mono uppercase">Running</span>
                            ) : (
                                <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-mono uppercase">Stopped</span>
                            )}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">High-performance Python Web Server Gateway Interface with AI Injection</p>
                    </div>
                </div>
                
                <div className="flex gap-4 items-center">
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-slate-500 uppercase font-bold">Uptime</p>
                        <p className="text-white font-mono">14d 2h 12m</p>
                    </div>
                    <button 
                        onClick={toggleServer}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${serverStatus === 'running' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                        title={serverStatus === 'running' ? "Stop Server" : "Start Server"}
                    >
                        {serverStatus === 'running' ? <StopIcon className="w-6 h-6 text-white" /> : <PlayIcon className="w-6 h-6 text-white" />}
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
                {/* Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ArrowPathIcon className="w-24 h-24 text-blue-500" />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Requests / Sec</p>
                        <p className="text-4xl font-extrabold text-white">{metrics.rps}</p>
                        <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(metrics.rps / 300) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FireIcon className="w-24 h-24 text-orange-500" />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">Avg Latency</p>
                        <p className="text-4xl font-extrabold text-white">{metrics.latency}<span className="text-lg text-slate-500 ml-1">ms</span></p>
                        <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${metrics.latency > 100 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${(metrics.latency / 200) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ChipIcon className="w-24 h-24 text-purple-500" />
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase mb-1">AI Middleware Load</p>
                        <p className="text-4xl font-extrabold text-white">12<span className="text-lg text-slate-500 ml-1">%</span></p>
                        <p className="text-xs text-green-400 mt-2 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Model Warm</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Worker Management */}
                    <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <ServerIcon className="w-5 h-5 text-blue-400" /> Worker Processes
                            </h3>
                            <button onClick={addWorker} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-bold flex items-center gap-1 transition-colors">
                                <PlusIcon className="w-3 h-3" /> Spawn Worker
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-3">PID</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">CPU</th>
                                        <th className="px-4 py-3">RAM</th>
                                        <th className="px-4 py-3">Uptime</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {workers.map(worker => (
                                        <tr key={worker.pid} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-mono text-blue-300">{worker.pid}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                    worker.status === 'processing' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                                                    worker.status === 'starting' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/30' :
                                                    'bg-slate-700 text-slate-300'
                                                }`}>
                                                    {worker.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono">{worker.cpu.toFixed(1)}%</td>
                                            <td className="px-4 py-3 font-mono">{worker.memory.toFixed(0)} MB</td>
                                            <td className="px-4 py-3 text-slate-400">{worker.uptime}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => killWorker(worker.pid)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 rounded transition-colors" title="Kill Process">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Middleware Chain */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <CogIcon className="w-5 h-5 text-slate-400" /> Middleware Stack
                            </h3>
                            <div className="space-y-2 relative">
                                {/* Visual Connection Line */}
                                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-700 -z-10"></div>
                                
                                {middlewares.map((mw, i) => (
                                    <div key={mw.id} className={`p-3 rounded-lg border flex justify-between items-center bg-slate-950 transition-all ${
                                        mw.active 
                                        ? (mw.type === 'ai' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-slate-600') 
                                        : 'border-slate-800 opacity-60'
                                    }`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${mw.active ? 'bg-green-500' : 'bg-slate-600'}`}></div>
                                            <span className={`text-sm font-mono ${mw.type === 'ai' ? 'text-purple-300 font-bold' : 'text-slate-300'}`}>{mw.name}</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={mw.active} onChange={() => toggleMiddleware(mw.id)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                                <h4 className="text-xs font-bold text-purple-300 mb-1 flex items-center gap-1">
                                    <ChipIcon className="w-3 h-3" /> AI Boost Active
                                </h4>
                                <p className="text-[10px] text-purple-200/70 leading-tight">
                                    LLM Middleware intercepts 404/500 errors and attempts to auto-correct or generate helpful responses based on context.
                                </p>
                            </div>
                        </div>

                        {/* Log Stream */}
                        <div className="bg-black rounded-xl border border-slate-800 p-4 flex flex-col h-64">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Access Log</h3>
                            <div className="flex-grow overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300 scrollbar-thin scrollbar-thumb-slate-700">
                                {logs.map((log, i) => (
                                    <div key={i} className="truncate">
                                        <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PyComWSGI;
