import React, { useState, useEffect, useRef } from 'react';
import type { Agent, WorkflowTemplate } from '../../types.ts';
import { AGENT_WORKFLOWS, AGENTS } from '../../constants.ts';
import { 
    RobotIcon, CogIcon, PlayIcon, CheckCircleIcon, ArrowRightOnRectangleIcon, 
    PlusIcon, LinkIcon, DatabaseIcon, CubeIcon, DownloadIcon, TableCellsIcon, CodeBracketIcon, SparklesIcon, ClockIcon, DocumentIcon, UserGroupIcon, ChartBarIcon, PaperAirplaneIcon, ServerStackIcon, BeakerIcon, UsersIcon, WrenchScrewdriverIcon
} from '../Icons.tsx';
import IntegrationsModal from './IntegrationsModal.tsx';
import AutoPilot from './AutoPilot.tsx';
import MCPServer from './MCPServer.tsx';
import KnowledgeBase from './KnowledgeBase.tsx';
import AgentSettings from './AgentSettings.tsx';
import BigDataTool from './BigDataTool.tsx';
import AgentIDE from './AgentIDE.tsx';
import OrgChart from './OrgChart.tsx';
import ModelTuner from './ModelTuner.tsx';
import CollaborativeCanvas from './CollaborativeCanvas.tsx';
import AdminDashboard from './AdminDashboard.tsx';
import { GoogleGenAI, Chat } from '@google/genai';

interface AgentWorkstationProps {
    agent: Agent;
    onLogout: () => void;
}

type View = 'dashboard' | 'mcp' | 'autopilot' | 'knowledge' | 'settings' | 'bigdata' | 'ide' | 'team' | 'tuner' | 'collab' | 'admin';

// Inner Chat Interface for the Dashboard View
const DashboardChat: React.FC<{ agent: Agent, logs: string[] }> = ({ agent, logs }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are the AI Assistant for ${agent.name}. 
                    You have access to the system logs. 
                    When a workflow starts or finishes, acknowledge it enthusiastically.`
                }
            });
            setChat(newChat);
            setMessages([{ role: 'model', text: `System Online. I am ready to assist you, ${agent.name}.` }]);
        } else {
            setMessages([{ role: 'model', text: `System Online (Offline Mode). I am ready to assist you, ${agent.name}.` }]);
        }
    }, [agent]);

    // React to system logs
    useEffect(() => {
        if (logs.length > 0) {
            const lastLog = logs[0]; // Newest log
            if (lastLog.includes('WORKFLOW COMPLETE')) {
                setMessages(prev => [...prev, { role: 'model', text: "🎉 Workflow completed successfully! The artifacts are ready for download." }]);
            } else if (lastLog.includes('Initializing')) {
                setMessages(prev => [...prev, { role: 'model', text: "🚀 Starting automation sequence. Connecting to MCP tools..." }]);
            }
        }
    }, [logs]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const userText = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            if (chat) {
                const res = await chat.sendMessage({ message: userText });
                setMessages(prev => [...prev, { role: 'model', text: res.text || '' }]);
            } else {
                // Offline Fallback
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'model', text: "I am operating in offline mode. I can see your request but cannot access the LLM for a dynamic response. Please check your API configuration." }]);
                }, 500);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Connection error." }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-xl border border-slate-800">
            <div className="p-3 border-b border-slate-800 bg-slate-900 rounded-t-xl flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-sm">AI Assistant</span>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-2 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="text-slate-500 text-xs animate-pulse">Thinking...</div>}
                <div ref={endRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-xl">
                <input 
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    placeholder="Chat with agent..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
            </form>
        </div>
    );
};

const AgentWorkstation: React.FC<AgentWorkstationProps> = ({ agent, onLogout }) => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [connectedServices, setConnectedServices] = useState<string[]>([]);
    
    // Workflow State
    const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'initializing' | 'running' | 'completed'>('idle');
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [logs, setLogs] = useState<string[]>([]);
    const [artifacts, setArtifacts] = useState<{name: string, type: string, content?: any}[]>([]);
    const [activeWorkflowName, setActiveWorkflowName] = useState<string>(AGENT_WORKFLOWS[agent.id]?.name || 'Default Workflow');
    const [workflowSteps, setWorkflowSteps] = useState(AGENT_WORKFLOWS[agent.id]?.steps || []);
    const [isContinuousMode, setIsContinuousMode] = useState(false);
    
    // New State for Training Simulation & Reporting
    const [trainingMetrics, setTrainingMetrics] = useState<{epoch: number, loss: number, accuracy: number} | null>(null);
    const [reportingManager, setReportingManager] = useState<Agent | null>(null);

    const logContainerRef = useRef<HTMLDivElement>(null);

    // Helper to check for admin role
    const isAdmin = agent.role === 'CEO' || agent.role === 'System Admin';

    // Find manager
    useEffect(() => {
        if (agent.reportsTo) {
            const manager = AGENTS.find(a => a.id === agent.reportsTo);
            setReportingManager(manager || null);
        }
    }, [agent]);

    // Auto-connect required tools on mount
    useEffect(() => {
        const required = AGENT_WORKFLOWS[agent.id]?.requiredIntegrations || [];
        if (required.length > 0) {
            // Simulate cloud handshake
            setTimeout(() => {
                setConnectedServices(required);
                addLog(`[SYSTEM] Auto-connected required tools: ${required.join(', ')}`, 'success');
            }, 1000);
        }
    }, [agent.id]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        let colorClass = 'text-green-500';
        if (type === 'warn') colorClass = 'text-yellow-500';
        if (type === 'success') colorClass = 'text-blue-400';
        if (type === 'error') colorClass = 'text-red-500';
        
        setLogs(prev => [`<span class="text-slate-500 font-mono text-[10px]">[${timestamp}]</span> <span class="${colorClass}">${message}</span>`, ...prev]);
    };

    const handleDeployTemplate = (template: WorkflowTemplate) => {
        setActiveWorkflowName(template.title);
        // Generate dummy steps based on template
        const newSteps = Array.from({ length: template.steps }).map((_, i) => ({
            id: i + 1,
            action: `Executing ${template.category} Task ${i + 1}`,
            tool: 'PyCom Cloud Agent',
            duration: 1500,
            outputDescription: `Step ${i + 1} completed.`
        }));
        setWorkflowSteps(newSteps);
        setActiveView('dashboard');
        addLog(`Template deployed: ${template.title}.`, 'success');
        setWorkflowStatus('idle');
    };

    const startWorkflow = () => {
        setWorkflowStatus('initializing');
        setLogs([]);
        setArtifacts([]);
        setTrainingMetrics(null);
        setCurrentStepIndex(0);
        
        addLog(`Initializing ${activeWorkflowName}...`);
        addLog(`[CLOUD] Syncing with PyCom MCP Server...`, 'warn');
        
        setTimeout(() => {
            addLog("[MCP] Tools verified. Starting execution sequence.", 'success');
            setWorkflowStatus('running');
        }, 1500);
    };

    // Workflow Engine
    useEffect(() => {
        if (workflowStatus !== 'running') return;

        if (currentStepIndex >= workflowSteps.length) {
            setWorkflowStatus('completed');
            setTrainingMetrics(null); // Clear metrics display
            addLog("WORKFLOW COMPLETE. All tasks finished.", 'success');
            
            if (isContinuousMode) {
                addLog("[LOOP] Continuous mode active. Restarting workflow in 5s...", 'warn');
                setTimeout(() => {
                    startWorkflow();
                }, 5000);
            }
            return;
        }

        const step = workflowSteps[currentStepIndex];
        addLog(`Starting Step ${step.id}: ${step.action}...`);

        // Check if this is a training step
        if (step.action.includes('Training') || step.action.includes('Fine-Tuning')) {
            // Simulate training loop within the step duration
            let epoch = 0;
            const trainingInterval = setInterval(() => {
                epoch++;
                const loss = Math.max(0.1, 2.5 - (epoch * 0.5) + (Math.random() * 0.2));
                const acc = Math.min(0.99, 0.5 + (epoch * 0.1) + (Math.random() * 0.05));
                
                setTrainingMetrics({ epoch, loss, accuracy: acc });
                addLog(`[TRAIN] Epoch ${epoch}: Loss=${loss.toFixed(4)}, Acc=${(acc * 100).toFixed(2)}%`);
            }, 800);

            setTimeout(() => {
                clearInterval(trainingInterval);
                addLog(`>> ${step.outputDescription}`, 'success');
                setCurrentStepIndex(prev => prev + 1);
            }, step.duration);
            
        } else {
            const timer = setTimeout(() => {
                addLog(`>> ${step.outputDescription}`, 'success');
                
                // Generate Rich Artifacts based on workflow type context
                if (currentStepIndex === workflowSteps.length - 1) {
                    let artifactName = `${activeWorkflowName.replace(/\s/g, '_')}_Output.json`;
                    let content: any = {
                        timestamp: new Date().toISOString(),
                        source: activeWorkflowName,
                        data: "Simulation of extracted data/results from PyCom Cloud."
                    };

                    // Enhanced Artifact Logic
                    if (activeWorkflowName.includes('Sales ETL') || agent.role === 'Sales Director') {
                        artifactName = "daily_sales_leads_report.csv";
                        const companies = ['TechSol', 'SoftSys', 'DataCorp', 'CloudNine', 'NextGen AI'];
                        const industries = ['IT Services', 'Software', 'Analytics', 'Cloud Infra', 'AI Research'];
                        const csvHeader = "name,address,phone,website,lead_score,industry\n";
                        const csvRows = companies.map(comp => {
                            const industry = industries[Math.floor(Math.random() * industries.length)];
                            const score = Math.random() > 0.5 ? 'Hot' : 'Warm';
                            return `${comp},${Math.floor(Math.random()*999)} Innovation Dr,+1-555-${Math.floor(Math.random()*9000) + 1000},${comp.toLowerCase()}.io,${score},${industry}`;
                        }).join('\n');
                        content = csvHeader + csvRows;
                    } else if (agent.role.includes('Scientist') || agent.role.includes('Researcher')) {
                        artifactName = "model_weights_v2.pt";
                        content = "BINARY_MODEL_DATA_SIMULATION"; // Mock binary content
                    } else if (activeWorkflowName.toLowerCase().includes("lead")) {
                        artifactName = "Extracted_Leads_Batch_01.json";
                        content = Array.from({length: 5}).map((_, i) => ({
                            id: i,
                            name: `Lead ${i+1}`,
                            email: `lead${i+1}@target.com`,
                            score: Math.floor(Math.random() * 100)
                        }));
                    }
                    
                    setArtifacts(prev => [...prev, { name: artifactName, type: artifactName.endsWith('.csv') ? 'csv' : 'data', content }]);
                    addLog(`[ARTIFACT] Saved to Cloud: ${artifactName}`, 'success');
                }
                
                setCurrentStepIndex(prev => prev + 1);
            }, step.duration);

            return () => clearTimeout(timer);
        }
    }, [workflowStatus, currentStepIndex, workflowSteps, isContinuousMode]);

    const handleConnectService = (service: string) => {
        if (!connectedServices.includes(service)) {
            setConnectedServices(prev => [...prev, service]);
            addLog(`Integration manually added: ${service}`, 'success');
        }
    };

    const handleDownloadArtifact = (artifact: {name: string, type: string, content?: any}) => {
        let blob;
        if (artifact.type === 'csv') {
             blob = new Blob([artifact.content], { type: 'text/csv' });
        } else {
             const jsonContent = typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content || {
                timestamp: new Date().toISOString(),
                source: activeWorkflowName,
                data: "Simulation of extracted data/results from PyCom Cloud."
            }, null, 2);
            blob = new Blob([jsonContent], { type: 'application/json' });
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = artifact.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadLogs = () => {
        const logContent = logs.map(l => l.replace(/<[^>]*>?/gm, '')).join('\n'); // Strip HTML tags
        const blob = new Blob([logContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Agent_Logs_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSubmitDeliverable = () => {
        if (!reportingManager) return;
        addLog(`[EMAIL] Sending deliverables to ${reportingManager.email}...`, 'warn');
        setTimeout(() => {
            addLog(`[SUCCESS] Deliverables submitted to ${reportingManager.name}. Notification sent via PyMail.`, 'success');
        }, 1500);
    };

    const renderView = () => {
        switch(activeView) {
            case 'autopilot': return <AutoPilot onDeploy={handleDeployTemplate} />;
            case 'mcp': return <MCPServer />;
            case 'knowledge': return <KnowledgeBase />;
            case 'settings': return <AgentSettings />;
            case 'bigdata': return <BigDataTool />;
            case 'ide': return <AgentIDE />;
            case 'team': return <OrgChart activeAgentId={agent.id} />;
            case 'tuner': return <ModelTuner />;
            case 'collab': return <CollaborativeCanvas />;
            case 'admin': return isAdmin ? <AdminDashboard /> : <div className="p-10 text-center text-red-400">Access Denied. Requires System Admin privileges.</div>;
            default: return (
                <div className="flex flex-col h-full">
                    <div className="flex-grow p-6 flex flex-col relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                        
                        {workflowStatus === 'idle' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto z-10 animate-fade-in-up">
                                <div className="w-24 h-24 bg-purple-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                                    <PlayIcon className="w-10 h-10 text-purple-400" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">{activeWorkflowName}</h1>
                                <p className="text-slate-400 mb-8 text-sm">Workflow configured and ready. Initialize autonomous execution sequence to begin processing.</p>
                                
                                <button 
                                    onClick={startWorkflow}
                                    className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-purple-600 rounded-lg hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1"
                                >
                                    <PlayIcon className="w-5 h-5 mr-2" />
                                    Initialize Automation
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-full flex gap-6">
                                {/* Left: Execution Status */}
                                <div className="flex-grow flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                            {workflowStatus === 'running' || workflowStatus === 'initializing' ? (
                                                <span className="relative flex h-3 w-3">
                                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                </span>
                                            ) : (
                                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            )}
                                            {workflowStatus === 'initializing' ? 'Booting System...' : workflowStatus === 'running' ? 'Executing Workflow...' : 'Task Complete'}
                                        </h3>
                                    </div>

                                    <div className="flex-grow bg-slate-900/50 rounded-xl border border-slate-800 p-4 overflow-y-auto">
                                        <div className="space-y-3">
                                            {workflowSteps.map((step, index) => {
                                                let statusClass = 'border-slate-800 bg-slate-900/30 text-slate-600';
                                                let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-xs font-mono">{index + 1}</div>;

                                                if (index < currentStepIndex || workflowStatus === 'completed') {
                                                    statusClass = 'border-green-900/50 bg-green-900/10 text-green-400';
                                                    icon = <CheckCircleIcon className="w-6 h-6 text-green-500" />;
                                                } else if (index === currentStepIndex && workflowStatus === 'running') {
                                                    statusClass = 'border-blue-900/50 bg-blue-900/10 text-blue-400 border-l-4 border-l-blue-500';
                                                    icon = <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400 animate-pulse">{index + 1}</div>;
                                                }

                                                return (
                                                    <div key={step.id} className={`p-3 rounded-lg border transition-all duration-500 flex items-center gap-4 ${statusClass}`}>
                                                        {icon}
                                                        <div className="flex-grow">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="font-bold text-sm">{step.action}</h4>
                                                                <span className="text-[10px] uppercase tracking-wider opacity-70">{step.tool}</span>
                                                            </div>
                                                            {index < currentStepIndex && <p className="text-xs opacity-70 mt-1">{step.outputDescription}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Artifacts & Submit Panel */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Artifacts */}
                                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 min-h-[120px]">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <DatabaseIcon className="w-4 h-4" /> Generated Artifacts
                                            </h4>
                                            {artifacts.length > 0 ? (
                                                <div className="space-y-2">
                                                    {artifacts.map((artifact, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-700">
                                                            <span className="text-xs font-mono text-white truncate max-w-[150px]">{artifact.name}</span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => handleDownloadArtifact(artifact)}
                                                                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center gap-1 font-bold transition-colors"
                                                                    title="Download"
                                                                >
                                                                    <DownloadIcon className="w-3 h-3" />
                                                                </button>
                                                                {/* Send to Big Data Button */}
                                                                <button 
                                                                    onClick={() => addLog(`[DATA] Sent ${artifact.name} to Big Data Studio pipeline.`, 'success')}
                                                                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded flex items-center gap-1 font-bold transition-colors"
                                                                    title="Send to Big Data Studio"
                                                                >
                                                                    <TableCellsIcon className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-600 italic">No artifacts generated yet.</p>
                                            )}
                                        </div>
                                        
                                        {/* Submission Panel */}
                                        <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 flex flex-col justify-between min-h-[120px]">
                                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                                <PaperAirplaneIcon className="w-4 h-4" /> Next Actions
                                            </h4>
                                            {reportingManager && workflowStatus === 'completed' ? (
                                                <div>
                                                    <p className="text-xs text-slate-300 mb-2">Manager: <span className="text-white font-bold">{reportingManager.name}</span></p>
                                                    <button 
                                                        onClick={handleSubmitDeliverable}
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        Submit Deliverables
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-600 italic flex-grow flex items-center justify-center">Waiting for completion...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Logs, Metrics & Chat */}
                                <div className="w-1/3 flex flex-col gap-4">
                                    {/* Live Metrics Chart (if training) */}
                                    {trainingMetrics && (
                                        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <ChartBarIcon className="w-4 h-4" /> Live Training Metrics
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                                        <span>Loss</span>
                                                        <span>{trainingMetrics.loss.toFixed(4)}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${Math.min(100, trainingMetrics.loss * 20)}%` }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                                        <span>Accuracy</span>
                                                        <span>{(trainingMetrics.accuracy * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${trainingMetrics.accuracy * 100}%` }}></div>
                                                    </div>
                                                </div>
                                                <p className="text-center text-xs text-slate-500 font-mono mt-1">Epoch {trainingMetrics.epoch}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Logs */}
                                    <div className="flex-grow bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden min-h-[200px]">
                                        <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">System Logs</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={handleDownloadLogs} className="text-slate-500 hover:text-white" title="Download Logs">
                                                    <DownloadIcon className="w-3 h-3" />
                                                </button>
                                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                            </div>
                                        </div>
                                        <div 
                                            ref={logContainerRef}
                                            className="flex-grow p-4 font-mono text-xs overflow-y-auto space-y-1"
                                        >
                                            {logs.map((log, i) => (
                                                <div key={i} dangerouslySetInnerHTML={{__html: log}} />
                                            ))}
                                            <div className="animate-pulse text-green-500">_</div>
                                        </div>
                                    </div>
                                    
                                    {/* Integrated Chat */}
                                    <div className="h-1/3 min-h-[150px]">
                                        <DashboardChat agent={agent} logs={logs} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    const NavButton: React.FC<{ view: View, icon: any, label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                activeView === view 
                ? 'bg-purple-600/10 text-purple-400 border-r-2 border-purple-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={label}
        >
            {icon}
            <span className="hidden lg:block text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <IntegrationsModal 
                isOpen={isIntegrationModalOpen} 
                onClose={() => setIsIntegrationModalOpen(false)} 
                onConnect={handleConnectService}
                connectedServices={connectedServices}
            />

            {/* Top Bar */}
            {/* NOTE: In a real layout, top bar might be separate, but here we integrate controls inside the main area or keep sidebar */}
            
            {/* Sidebar */}
            <div className="w-16 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
                <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center gap-3 border-b border-slate-800 shrink-0">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                        <div className="hidden lg:block overflow-hidden">
                            <span className="font-bold text-white block truncate">{agent.name}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{agent.role}</span>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                        <NavButton view="dashboard" icon={<ChartBarIcon className="w-5 h-5 flex-shrink-0" />} label="Dashboard" />
                        <NavButton view="team" icon={<UserGroupIcon className="w-5 h-5 flex-shrink-0" />} label="Team" />
                        <NavButton view="autopilot" icon={<RobotIcon className="w-5 h-5 flex-shrink-0" />} label="Auto-Pilot" />
                        <NavButton view="mcp" icon={<CubeIcon className="w-5 h-5 flex-shrink-0" />} label="MCP Server" />
                        <NavButton view="knowledge" icon={<DatabaseIcon className="w-5 h-5 flex-shrink-0" />} label="Knowledge" />
                        <NavButton view="bigdata" icon={<TableCellsIcon className="w-5 h-5 flex-shrink-0" />} label="Big Data" />
                        <NavButton view="ide" icon={<CodeBracketIcon className="w-5 h-5 flex-shrink-0" />} label="Agent IDE" />
                        <NavButton view="tuner" icon={<BeakerIcon className="w-5 h-5 flex-shrink-0" />} label="Tuner" />
                        <NavButton view="collab" icon={<UsersIcon className="w-5 h-5 flex-shrink-0" />} label="Collab" />
                        <NavButton view="settings" icon={<CogIcon className="w-5 h-5 flex-shrink-0" />} label="Settings" />
                        {isAdmin && (
                            <NavButton view="admin" icon={<WrenchScrewdriverIcon className="w-5 h-5 flex-shrink-0 text-red-400" />} label="Admin Console" />
                        )}
                    </nav>
                    <div className="p-4 border-t border-slate-800 shrink-0">
                        <button onClick={onLogout} className="w-full flex items-center gap-3 text-slate-400 hover:text-white transition-colors px-4 py-2">
                            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
                            <span className="hidden lg:block text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center shrink-0">
                    <h2 className="text-white font-bold capitalize flex items-center gap-2">
                        {activeView === 'admin' && <WrenchScrewdriverIcon className="w-5 h-5 text-red-500" />}
                        {activeView.replace('-', ' ')}
                    </h2>
                    <div className="flex gap-3 items-center">
                         <button 
                            onClick={() => setIsContinuousMode(!isContinuousMode)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${isContinuousMode ? 'bg-blue-900/50 text-blue-300 border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-600'}`}
                            title="Restart workflow automatically"
                        >
                            <ClockIcon className="w-3 h-3" />
                            Loop: {isContinuousMode ? 'ON' : 'OFF'}
                        </button>
                        <div className="h-6 w-px bg-slate-700 mx-2"></div>
                        <button 
                            onClick={() => setIsIntegrationModalOpen(true)}
                            className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 flex items-center gap-2"
                        >
                            <LinkIcon className="w-4 h-4" /> Integrations
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-hidden relative">
                    {renderView()}
                </div>
            </div>

            {/* Chat Sidebar (Hidden on smaller screens) */}
            <div className="w-80 bg-slate-900 border-l border-slate-800 hidden 2xl:flex flex-col shrink-0">
                <DashboardChat agent={agent} logs={logs} />
            </div>
        </div>
    );
};

export default AgentWorkstation;
