
import React, { useState, useRef, useEffect } from 'react';
import { CloudArrowDownIcon, GitHubIcon, ArrowPathIcon, TerminalIcon, TrashIcon, PlayIcon, StopIcon, CubeIcon, GlobeAltIcon, PlusIcon } from '../Icons.tsx';
import type { Deployment } from '../../types.ts';
import LivePreviewModal from './LivePreviewModal.tsx';

interface DeploymentManagerProps {
    deployments: Deployment[];
    setDeployments: (deployments: Deployment[]) => void;
}

const DeploymentManager: React.FC<DeploymentManagerProps> = ({ deployments, setDeployments }) => {
    const [isDeploying, setIsDeploying] = useState(false);
    const [activeTab, setActiveTab] = useState<'logs' | 'terminal' | 'settings'>('logs');
    const [logs, setLogs] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    // Terminal State
    const [terminalOutput, setTerminalOutput] = useState<string[]>(['pycom@server:~$']);
    const [terminalInput, setTerminalInput] = useState('');
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Env Vars State
    const [envVars, setEnvVars] = useState<{key: string, value: string}[]>([
        {key: 'DATABASE_URL', value: 'postgres://user:pass@db-host:5432/mydb'},
        {key: 'SECRET_KEY', value: 'sk_live_51Nq...'},
        {key: 'DEBUG', value: 'False'}
    ]);
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalOutput]);

    useEffect(() => {
        if (activeTab === 'logs') {
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, activeTab]);

    const startDeployment = () => {
        setIsDeploying(true);
        setLogs(['> Initializing build environment on PyCom Cloud...', '> Cloning repository jeyabal/new-project...']);
        setActiveTab('logs');
        
        setTimeout(() => {
            setLogs(prev => [...prev, '> Installing dependencies (pip install -r requirements.txt)...', '> Found 42 packages.']);
            setTimeout(() => {
                setLogs(prev => [...prev, '> Running tests...', '> Tests passed (12/12).']);
                setTimeout(() => {
                    setLogs(prev => [...prev, '> Building Docker image...', '> Pushing to PyCom Registry...', '> Deployment successful!']);
                    setIsDeploying(false);
                    const newDeploy: Deployment = {
                        id: Date.now().toString(),
                        name: 'new-project',
                        repo: 'jeyabal/new-project',
                        branch: 'main',
                        status: 'deployed',
                        url: 'https://new-project.pycom.app',
                        lastBuilt: 'Just now',
                        commitMessage: 'Initial commit'
                    };
                    setDeployments([newDeploy, ...deployments]);
                }, 2000);
            }, 1500);
        }, 1500);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('WARNING: This will permanently delete the deployment, wipe the container, and remove all associated data. Are you sure?')) {
            setDeployments(deployments.filter(d => d.id !== id));
        }
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!terminalInput.trim()) return;
        
        setTerminalOutput(prev => [...prev, `pycom@server:~$ ${terminalInput}`]);
        
        // Simple command simulation
        setTimeout(() => {
            let response = '';
            const cmd = terminalInput.trim();
            if (cmd === 'ls') response = 'main.py  requirements.txt  Dockerfile  utils.py  assets/';
            else if (cmd === 'pwd') response = '/home/pycom/apps/deployment-1';
            else if (cmd === 'whoami') response = 'root';
            else if (cmd.startsWith('python')) response = 'Python 3.11.4 (main, Jun  7 2023, 15:45:48) [GCC 11.2.0] on linux';
            else response = `bash: ${cmd}: command not found`;
            
            setTerminalOutput(prev => [...prev, response, 'pycom@server:~$']);
        }, 300);
        
        setTerminalInput('');
    };

    const handleAddEnvVar = () => {
        if (newKey.trim() && newValue.trim()) {
            setEnvVars([...envVars, { key: newKey, value: newValue }]);
            setNewKey('');
            setNewValue('');
        }
    };

    const handleDeleteEnvVar = (key: string) => {
        setEnvVars(envVars.filter(v => v.key !== key));
    };

    const handleUpdateEnvVar = (idx: number, field: 'key' | 'value', val: string) => {
        const newVars = [...envVars];
        newVars[idx][field] = val;
        setEnvVars(newVars);
    };

    const handleDeleteService = () => {
        if (deployments.length > 0) {
            const confirm = window.confirm("DANGER: Are you sure you want to delete this service? This cannot be undone.");
            if(confirm) {
                setDeployments(deployments.slice(1)); // Remove first
                setActiveTab('logs');
                alert("Service deleted successfully.");
            }
        } else {
            alert("No active service to delete.");
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {previewUrl && (
                <LivePreviewModal 
                    isOpen={!!previewUrl} 
                    onClose={() => setPreviewUrl(null)} 
                    url={previewUrl} 
                    title="Deployed App" 
                />
            )}

            {/* Deployment List */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="text-white font-bold text-lg">Active Deployments</h3>
                        <p className="text-xs text-slate-400">Hosted on PyCom Cloud (US-East)</p>
                    </div>
                    <button 
                        onClick={startDeployment}
                        disabled={isDeploying}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        title="Start a new deployment pipeline"
                    >
                        {isDeploying ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CubeIcon className="w-4 h-4" />}
                        {isDeploying ? 'Deploying...' : 'New Deployment'}
                    </button>
                </div>
                
                {deployments.length === 0 && <div className="text-slate-500 italic text-center py-10">No active deployments.</div>}

                {deployments.map(deploy => (
                    <div key={deploy.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/50 transition-colors group">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white">{deploy.name}</h4>
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                                    <GitHubIcon className="w-3 h-3" /> {deploy.repo}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1 text-green-400"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> {deploy.status}</span>
                                <span className="font-mono">{deploy.branch}</span>
                                <span>{deploy.lastBuilt}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setPreviewUrl(deploy.url || '#')} 
                                className="bg-slate-800 hover:bg-slate-700 text-purple-400 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
                                title="Open Live App"
                            >
                                <GlobeAltIcon className="w-4 h-4" />
                                Visit Site
                            </button>
                            <button 
                                onClick={() => handleDelete(deploy.id)}
                                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-lg transition-colors border border-red-900/30"
                                title="Delete Deployment - Irreversible"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Panel (Logs/Terminal) */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col overflow-hidden h-96 lg:h-auto shadow-lg">
                <div className="bg-slate-900 p-2 border-b border-slate-800 flex gap-1">
                    <button onClick={() => setActiveTab('logs')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'logs' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Build Logs</button>
                    <button onClick={() => setActiveTab('terminal')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'terminal' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Console</button>
                    <button onClick={() => setActiveTab('settings')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Settings</button>
                </div>

                <div className="flex-grow overflow-hidden relative">
                    {activeTab === 'logs' && (
                        <div className="absolute inset-0 p-4 font-mono text-xs overflow-y-auto space-y-1 bg-black">
                            {logs.length === 0 && <span className="text-slate-600 italic">Waiting for build job...</span>}
                            {logs.map((log, i) => (
                                <div key={i} className="text-green-400">{log}</div>
                            ))}
                            {isDeploying && <div className="animate-pulse text-green-500">_</div>}
                            <div ref={logsEndRef} />
                        </div>
                    )}

                    {activeTab === 'terminal' && (
                        <div className="absolute inset-0 flex flex-col bg-black">
                            <div className="flex-grow p-4 font-mono text-xs overflow-y-auto space-y-1 text-slate-300" onClick={() => document.getElementById('term-input')?.focus()}>
                                {terminalOutput.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                                <div ref={terminalEndRef} />
                            </div>
                            <form onSubmit={handleTerminalSubmit} className="p-2 bg-slate-900 border-t border-slate-800">
                                <input 
                                    id="term-input"
                                    type="text" 
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    className="w-full bg-transparent text-white font-mono text-xs outline-none placeholder-slate-700"
                                    placeholder="Enter command..."
                                    autoComplete="off"
                                />
                            </form>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="absolute inset-0 p-6 bg-slate-900 overflow-y-auto">
                            <h4 className="text-white font-bold mb-4">Environment Variables</h4>
                            <div className="space-y-3 mb-6">
                                {envVars.map((env, idx) => (
                                    <div key={idx} className="flex gap-2 group" title={`Edit ${env.key}`}>
                                        <input 
                                            type="text" 
                                            value={env.key} 
                                            onChange={(e) => handleUpdateEnvVar(idx, 'key', e.target.value)}
                                            className="bg-slate-800 text-slate-300 text-xs p-2 rounded w-1/3 border border-slate-700 focus:border-purple-500 outline-none" 
                                        />
                                        <input 
                                            type="text" 
                                            value={env.value} 
                                            onChange={(e) => handleUpdateEnvVar(idx, 'value', e.target.value)}
                                            className="bg-slate-800 text-slate-300 text-xs p-2 rounded w-2/3 border border-slate-700 focus:border-purple-500 outline-none" 
                                        />
                                        <button onClick={() => handleDeleteEnvVar(env.key)} className="text-slate-600 hover:text-red-400 transition-colors" title="Remove Variable">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                
                                <div className="flex gap-2 mt-2 border-t border-slate-800 pt-2">
                                    <input 
                                        type="text" 
                                        placeholder="KEY" 
                                        value={newKey}
                                        onChange={(e) => setNewKey(e.target.value)}
                                        className="bg-slate-950 text-slate-400 text-xs p-2 rounded w-1/3 border border-slate-700 focus:border-purple-500 outline-none" 
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="VALUE" 
                                        value={newValue}
                                        onChange={(e) => setNewValue(e.target.value)}
                                        className="bg-slate-950 text-slate-400 text-xs p-2 rounded w-2/3 border border-slate-700 focus:border-purple-500 outline-none" 
                                    />
                                    <button onClick={handleAddEnvVar} className="text-purple-400 hover:text-purple-300 p-2" title="Add Variable">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-slate-800 my-4 pt-4">
                                <h4 className="text-white font-bold mb-2">Build Triggers</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="accent-purple-600" />
                                        Push to branch (main)
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                        <input type="checkbox" className="accent-purple-600" />
                                        Pull Request Merged
                                    </label>
                                </div>
                            </div>

                            <div className="border-t border-slate-800 my-4 pt-4">
                                <h4 className="text-white font-bold mb-2">Deployment Strategy</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                        <input type="radio" name="strategy" defaultChecked className="accent-purple-600" />
                                        Rolling Update (Zero Downtime)
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                        <input type="radio" name="strategy" className="accent-purple-600" />
                                        Recreate (Kill then Start)
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                                        <input type="radio" name="strategy" className="accent-purple-600" />
                                        Blue/Green (Advanced)
                                    </label>
                                </div>
                            </div>

                            <h4 className="text-red-400 font-bold mb-2 mt-6">Danger Zone</h4>
                            <div className="border border-red-900/30 rounded-lg p-4 bg-red-900/10">
                                <p className="text-xs text-red-300 mb-3">This action is irreversible. It will destroy the container and all data.</p>
                                <button 
                                    onClick={handleDeleteService}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-colors"
                                    title="Permanently delete this service"
                                >
                                    Delete Service
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeploymentManager;
