
import React, { useState } from 'react';
import { BoltIcon, CodeBracketIcon, DatabaseIcon, RobotIcon, ArrowPathIcon, PuzzlePieceIcon, SparklesIcon, PlusIcon, GlobeAltIcon, ChipIcon } from '../Icons.tsx';
import IntegrationsModal from '../agentic-ai/IntegrationsModal.tsx';

const VisualAutomator: React.FC = () => {
    const [nodes, setNodes] = useState([
        { id: 1, type: 'webhook', label: 'Webhook Listener', x: 50, y: 100, status: 'active' },
        { id: 2, type: 'script', label: 'Python Script', x: 300, y: 100, status: 'idle' },
        { id: 3, type: 'transformer', label: 'GenAI Transformer', x: 550, y: 100, status: 'idle' },
        { id: 4, type: 'db', label: 'Postgres Insert', x: 800, y: 100, status: 'idle' },
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [showIntegrationsDropdown, setShowIntegrationsDropdown] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        // Simulate execution flow
        nodes.forEach((node, index) => {
            setTimeout(() => {
                setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'running' } : n));
                setTimeout(() => {
                    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'success' } : n));
                    if (index === nodes.length - 1) setIsRunning(false);
                }, 1000);
            }, index * 1200);
        });
    };

    const handleAIGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setIsGenerating(true);
        
        // Simulate AI generation
        setTimeout(() => {
            setNodes([
                { id: 1, type: 'api', label: 'Fetch NASA API', x: 50, y: 150, status: 'idle' },
                { id: 2, type: 'transformer', label: 'Summarize Data', x: 300, y: 150, status: 'idle' },
                { id: 3, type: 'email', label: 'Email Report', x: 550, y: 150, status: 'idle' },
            ]);
            setIsGenerating(false);
            setPrompt('');
        }, 2000);
    };

    const addNode = (type: string, label: string) => {
        const newId = Date.now();
        const lastNode = nodes[nodes.length - 1];
        const newX = lastNode ? lastNode.x + 250 : 100;
        const newY = lastNode ? lastNode.y : 100;
        setNodes([...nodes, { id: newId, type, label, x: newX, y: newY, status: 'idle' }]);
        setShowIntegrationsDropdown(false);
    };

    const getNodeColor = (type: string) => {
        switch(type) {
            case 'webhook': return 'bg-orange-600';
            case 'script': return 'bg-blue-600';
            case 'ai': return 'bg-purple-600';
            case 'transformer': return 'bg-indigo-600';
            case 'db': return 'bg-green-600';
            case 'api': return 'bg-teal-600';
            case 'email': return 'bg-pink-600';
            default: return 'bg-gray-600';
        }
    };

    const getNodeIcon = (type: string) => {
        switch(type) {
            case 'webhook': return <BoltIcon className="w-5 h-5" />;
            case 'script': return <CodeBracketIcon className="w-5 h-5" />;
            case 'ai': return <RobotIcon className="w-5 h-5" />;
            case 'transformer': return <ChipIcon className="w-5 h-5" />;
            case 'db': return <DatabaseIcon className="w-5 h-5" />;
            case 'api': return <GlobeAltIcon className="w-5 h-5" />;
            case 'email': return <div className="font-bold text-xs">@</div>;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <IntegrationsModal 
                isOpen={isIntegrationModalOpen} 
                onClose={() => setIsIntegrationModalOpen(false)} 
                onConnect={(s) => alert(`Connected ${s}`)} 
                connectedServices={[]} 
            />

            {/* Toolbar */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <BoltIcon className="w-6 h-6 text-yellow-400" />
                        Workflow Automator
                    </h2>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div className="relative">
                        <button 
                            onClick={() => setShowIntegrationsDropdown(!showIntegrationsDropdown)}
                            className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700 border border-slate-700"
                            title="Connect External Services"
                        >
                            <PuzzlePieceIcon className="w-4 h-4 text-blue-400" />
                            Integrations
                        </button>
                        {/* Dropdown */}
                        {showIntegrationsDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-20 p-2">
                                <button onClick={() => setIsIntegrationModalOpen(true)} className="w-full text-left px-3 py-2 rounded hover:bg-purple-900/20 text-sm text-purple-300 mb-2 border-b border-slate-800 font-bold">
                                    + Manage Connections
                                </button>

                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-2">Open Source APIs</p>
                                <button onClick={() => addNode('api', 'NASA API')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">NASA (Free)</button>
                                <button onClick={() => addNode('api', 'OpenWeather')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">OpenWeather (Free)</button>
                                
                                <div className="my-2 border-t border-slate-700"></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-2">PySrch Workspace</p>
                                <button onClick={() => addNode('webhook', 'On New Email')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">Trigger: New Email</button>
                                <button onClick={() => addNode('webhook', 'On File Upload')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">Trigger: File Upload</button>

                                <div className="my-2 border-t border-slate-700"></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-2">Connectors</p>
                                <button onClick={() => addNode('api', 'Twitter/X Post')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">Twitter/X</button>
                                <button onClick={() => addNode('api', 'Twilio SMS')} className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-sm text-slate-300">Twilio</button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => addNode('transformer', 'GenAI Transformer')}
                        className="bg-indigo-900/50 text-indigo-300 p-2 rounded-lg hover:bg-indigo-800/50 border border-indigo-500/30"
                        title="Add Transformer Node"
                    >
                        <ChipIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => addNode('script', 'Python Script')}
                        className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 border border-slate-700"
                        title="Add Python Script Node"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleRun} 
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                        title="Execute current workflow"
                    >
                        {isRunning ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <BoltIcon className="w-4 h-4" />}
                        {isRunning ? 'Executing...' : 'Test Workflow'}
                    </button>
                </div>
            </div>
            
            {/* Canvas */}
            <div className="flex-grow bg-slate-950 relative overflow-hidden" onClick={() => setShowIntegrationsDropdown(false)}>
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>

                {/* Connections (Simplified) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodes.map((node, i) => {
                        if (i === nodes.length - 1) return null;
                        const nextNode = nodes[i+1];
                        return (
                            <path 
                                key={i} 
                                d={`M ${node.x + 150} ${node.y + 40} C ${node.x + 200} ${node.y + 40}, ${nextNode.x - 50} ${nextNode.y + 40}, ${nextNode.x} ${nextNode.y + 40}`} 
                                stroke={isRunning ? "#10b981" : "#475569"} 
                                strokeWidth="2" 
                                fill="none"
                                className={isRunning ? "animate-pulse" : ""}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div 
                        key={node.id}
                        className={`absolute w-48 p-3 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                            node.status === 'running' ? 'border-yellow-400 scale-105 shadow-yellow-500/20' :
                            node.status === 'success' ? 'border-green-500 shadow-green-500/20' : 
                            'border-slate-700 bg-slate-900'
                        }`}
                        style={{ left: node.x, top: node.y }}
                        title={`Node: ${node.label}`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${getNodeColor(node.type)}`}>
                                {getNodeIcon(node.type)}
                            </div>
                            <div>
                                <p className="text-xs text-white font-bold">{node.label}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{node.type}</p>
                            </div>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${
                                node.status === 'success' ? 'bg-green-500 w-full' : 
                                node.status === 'running' ? 'bg-yellow-500 w-1/2 animate-pulse' : 'w-0'
                            }`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Prompt Bar */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 relative z-10">
                <form onSubmit={handleAIGenerate} className="relative max-w-3xl mx-auto">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <input 
                        type="text" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe a workflow... e.g., 'When I get a new PyMail, save attachment to PyDrive'"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-32 text-white focus:outline-none focus:border-purple-500 shadow-lg"
                        disabled={isGenerating}
                    />
                    <button 
                        type="submit" 
                        disabled={isGenerating || !prompt}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50"
                        title="Generate flow with AI"
                    >
                        {isGenerating ? 'Building...' : 'Generate'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VisualAutomator;
