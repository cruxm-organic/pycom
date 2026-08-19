
import React, { useState } from 'react';
import { 
    BookOpenIcon, ShieldCheckIcon, ServerStackIcon, BoltIcon, UserGroupIcon, 
    LifebuoyIcon, CubeIcon, BanknotesIcon, CodeBracketIcon, SparklesIcon, 
    DocumentTextIcon, GlobeAltIcon, CheckCircleIcon, TerminalIcon, 
    PlayIcon, CogIcon, ArrowRightOnRectangleIcon, TableCellsIcon
} from '../Icons.tsx';

type DocSection = 'intro' | 'features' | 'user' | 'platform' | 'api' | 'self-hosting' | 'mcp' | 'support';

// --- Helper Components for Visuals ---

const MockWindow: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
    <div className={`border border-slate-700 rounded-lg overflow-hidden mt-6 mb-8 shadow-2xl bg-slate-950 ${className}`}>
        <div className="bg-slate-800 p-2 flex items-center gap-2 border-b border-slate-700">
            <div className="flex gap-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-slate-900 text-slate-400 text-[10px] px-3 py-1 rounded flex-grow text-center mx-4 font-mono truncate">
                {title}
            </div>
        </div>
        <div className="p-0">{children}</div>
    </div>
);

const GuideStep: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex gap-4 mb-8">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-900/50">
            {number}
        </div>
        <div className="flex-grow">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <div className="text-slate-400 text-sm leading-relaxed space-y-2">
                {children}
            </div>
        </div>
    </div>
);

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "bash" }) => (
    <div className="relative group my-4">
        <div className="absolute -top-3 right-4 bg-slate-700 text-xs text-slate-300 px-2 py-1 rounded uppercase">
            {language}
        </div>
        <pre className="bg-black/50 border border-slate-800 rounded-lg p-4 overflow-x-auto font-mono text-sm text-blue-300">
            {code}
        </pre>
    </div>
);

const DocsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<DocSection>('intro');

    const SidebarItem: React.FC<{ id: DocSection, label: string, icon: any }> = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                activeSection === id 
                ? 'bg-purple-600 text-white shadow-lg translate-x-1' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'intro':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="border-b border-slate-800 pb-6">
                            <h1 className="text-4xl font-extrabold text-white mb-4">Welcome to PyCom Platform</h1>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                PyCom is an all-in-one AI-Powered Python Development & Education Ecosystem. 
                                Whether you are a student learning code, a developer building apps, or a business automating workflows, 
                                this guide will help you navigate the platform.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <SparklesIcon className="w-8 h-8 text-yellow-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">For Learners</h3>
                                <p className="text-sm text-slate-400">Master Python via Gamezone, AI Lab, and interactive courses with Professor Py.</p>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <CodeBracketIcon className="w-8 h-8 text-blue-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">For Developers</h3>
                                <p className="text-sm text-slate-400">Use SourceKit, PySrch Workspace, and our Cloud Host to build and deploy.</p>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <BoltIcon className="w-8 h-8 text-green-400 mb-3" />
                                <h3 className="font-bold text-white mb-2">For Business</h3>
                                <p className="text-sm text-slate-400">Automate operations with Agentic AI, MCP Servers, and Big Data tools.</p>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mt-8 mb-6">Quick Start Guide</h2>
                        <div className="space-y-2">
                            <GuideStep number={1} title="Create Your Profile">
                                Click "Sign In" on the top right. You can use Google or Mobile auth. Complete your profile to unlock the <strong>Dashboard</strong>.
                            </GuideStep>
                            <GuideStep number={2} title="Select Your Path">
                                <p>Navigate to <strong>Careers</strong> to see roadmaps, or jump straight into <strong>Gamezone</strong> to test your skills.</p>
                            </GuideStep>
                            <GuideStep number={3} title="Launch an Agent">
                                <p>Go to <strong>Agentic AI</strong>. Choose a role (e.g., Sales Director) and click "Launch Workstation" to see autonomous workflows in action.</p>
                            </GuideStep>
                        </div>
                    </div>
                );

            case 'features':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-6">Feature Deep Dive</h1>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-purple-400 mb-4">1. Agentic AI Workstation</h2>
                            <p className="text-slate-300 mb-4">
                                The core of PyCom's business automation. It allows you to deploy AI agents that can use tools to complete tasks.
                            </p>
                            
                            <MockWindow title="Agent Workstation Dashboard - Visual Reference">
                                <div className="bg-slate-900 p-4 grid grid-cols-4 gap-4 h-64 overflow-hidden">
                                    <div className="col-span-1 bg-slate-800 rounded p-2 space-y-2 border border-slate-700">
                                        <div className="h-4 w-20 bg-slate-700 rounded"></div>
                                        <div className="h-2 w-full bg-slate-700 rounded"></div>
                                        <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                                        <div className="mt-4 h-8 w-full bg-green-900/20 border border-green-500/50 rounded flex items-center justify-center text-[10px] text-green-400">Active Integrations</div>
                                    </div>
                                    <div className="col-span-3 bg-slate-950 rounded border border-slate-700 p-4 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 mb-2"><BoltIcon className="w-6 h-6" /></div>
                                        <div className="text-white text-xs font-bold">Workflow Execution Engine</div>
                                        <div className="flex gap-2 mt-4">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <div className="w-16 h-2 bg-slate-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </MockWindow>

                            <GuideStep number={1} title="Connecting Integrations">
                                <p>Open the <strong>Integrations</strong> modal from the sidebar. Click "Connect" on services like HubSpot or Slack. The Agent automatically authenticates via the internal MCP bridge.</p>
                            </GuideStep>
                            <GuideStep number={2} title="Running Auto-Pilot">
                                <p>Go to the <strong>Auto-Pilot</strong> tab. Select a template (e.g., "Lead Enrichment"). Click "Deploy". The agent will load the steps into the dashboard. Click "Initialize Automation" to start.</p>
                            </GuideStep>
                        </section>

                        <div className="border-t border-slate-800 my-8"></div>

                        <section>
                            <h2 className="text-2xl font-bold text-blue-400 mb-4">2. PySrch Workspace</h2>
                            <p className="text-slate-300 mb-4">
                                A cloud-native productivity suite built into PyCom. It includes PyWord, PyTab, and PyDrive.
                            </p>
                            <MockWindow title="PySrch Workspace - Apps">
                                <div className="bg-slate-100 p-4 grid grid-cols-4 gap-4 h-40">
                                    <div className="bg-white p-2 rounded shadow flex flex-col items-center justify-center gap-2">
                                        <DocumentTextIcon className="w-8 h-8 text-blue-500" />
                                        <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="bg-white p-2 rounded shadow flex flex-col items-center justify-center gap-2">
                                        <TableCellsIcon className="w-8 h-8 text-green-500" />
                                        <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    </div>
                                    <div className="bg-white p-2 rounded shadow flex flex-col items-center justify-center gap-2">
                                        <GlobeAltIcon className="w-8 h-8 text-purple-500" />
                                        <div className="h-2 w-12 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                            </MockWindow>
                            <ul className="list-disc list-inside text-slate-400 space-y-2 pl-4">
                                <li><strong>PyWord:</strong> AI-assisted document editor. Use "AI Writer" in the toolbar to generate text.</li>
                                <li><strong>PyTab:</strong> Web-based spreadsheet with formula support.</li>
                                <li><strong>PyDrive:</strong> Unlimited cloud storage for your projects and agent artifacts.</li>
                            </ul>
                        </section>
                    </div>
                );

            case 'self-hosting':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6">
                            <ServerStackIcon className="w-10 h-10 text-green-400" />
                            <h1 className="text-3xl font-bold text-white">Host & Build Guide</h1>
                        </div>
                        <p className="text-slate-400">
                            PyCom allows you to self-host the entire platform or deploy your own Python applications using our built-in CI/CD pipeline.
                        </p>

                        <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg mb-8">
                            <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5" /> Prerequisites</h4>
                            <ul className="list-disc list-inside text-sm text-yellow-100/80">
                                <li>A Linux server (Ubuntu 20.04+ recommended)</li>
                                <li>Docker & Docker Compose installed</li>
                                <li>Python 3.11+</li>
                                <li>Minimum 4GB RAM (8GB recommended for AI models)</li>
                            </ul>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-4">Step 1: Server Initialization</h2>
                        <p className="text-slate-400 mb-2">Use the PyCom CLI (simulated in the Host terminal) to prepare your environment.</p>
                        <MockWindow title="PyCom Terminal">
                            <div className="bg-black p-4 font-mono text-xs">
                                <div className="text-slate-400">$ ssh root@10.0.0.1</div>
                                <div className="text-green-400">Welcome to PyCom OS.</div>
                                <div className="text-slate-400">$ pycom-cli init --cloud</div>
                                <div className="text-blue-400">[INFO] Pulling Docker images...</div>
                                <div className="text-blue-400">[INFO] Configuring Nginx reverse proxy...</div>
                                <div className="text-blue-400">[INFO] Setting up SSL certificates...</div>
                                <div className="text-green-400">[SUCCESS] Server initialized. Ready for deployment.</div>
                                <div className="text-slate-400 animate-pulse">$ _</div>
                            </div>
                        </MockWindow>

                        <h2 className="text-xl font-bold text-white mb-4">Step 2: Configuring CI/CD</h2>
                        <p className="text-slate-400 mb-2">Create a `pycom.yaml` file in your project root to define build steps.</p>
                        <CodeBlock code={`# pycom.yaml
name: my-python-app
runtime: python-3.11
build:
  - pip install -r requirements.txt
  - pytest
deploy:
  provider: pycom-cloud
  region: us-east-1
  replicas: 2`} language="yaml" />

                        <h2 className="text-xl font-bold text-white mb-4">Step 3: Deployment</h2>
                        <p className="text-slate-400 mb-2">Push your code to the connected Git repository or use the manual deploy command.</p>
                        <CodeBlock code="pycom-cli deploy . --env production" />
                    </div>
                );

            case 'mcp':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-6">
                            <CubeIcon className="w-10 h-10 text-orange-500" />
                            <h1 className="text-3xl font-bold text-white">Model Context Protocol (MCP)</h1>
                        </div>
                        
                        <p className="text-slate-400 text-lg">
                            MCP is the standard that allows PyCom's AI Agents to "see" and "touch" your local and cloud tools. 
                            It acts as a universal translator between LLMs and APIs.
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-8">
                            <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-700">
                                <div className="font-bold text-purple-400 mb-2">AI Model</div>
                                <div className="text-xs text-slate-400">Gemini / GPT-4</div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="h-1 w-full bg-slate-600 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-xs text-orange-500 font-bold border border-orange-500/50 rounded">MCP Bridge</div>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg text-center border border-slate-700">
                                <div className="font-bold text-green-400 mb-2">Tools</div>
                                <div className="text-xs text-slate-400">Database, Slack, Files</div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-4">Configuring an MCP Server</h2>
                        <p className="text-slate-400 mb-4">
                            Navigate to <strong>Host & Build &gt; MCP Server</strong>. Here you can define tools using JSON schemas.
                        </p>

                        <MockWindow title="MCP Tool Definition Example">
                            <div className="bg-[#1e1e1e] p-4 font-mono text-xs text-blue-300 overflow-x-auto">
{`{
  "name": "query_sales_db",
  "description": "Executes SQL query on the sales database",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The SQL query to execute"
      }
    },
    "required": ["query"]
  }
}`}
                            </div>
                        </MockWindow>
                        <p className="text-sm text-slate-500 mt-2">
                            Once saved, the AI Agent will automatically detect this tool and know how to use it when you ask "Show me sales for last month".
                        </p>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-6">API Reference</h1>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">GET</span>
                                    <span className="font-mono text-white font-bold">/v1/agents</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-300 mb-4">Lists all available AI agents and their current status.</p>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Response Example</h4>
                                <CodeBlock code={`{
  "agents": [
    {
      "id": "billy-jay",
      "role": "Sales Director",
      "status": "idle",
      "capabilities": ["email", "crm"]
    },
    {
      "id": "maya",
      "role": "HR Manager",
      "status": "working",
      "currentTask": "Screening resumes"
    }
  ]
}`} language="json" />
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">POST</span>
                                    <span className="font-mono text-white font-bold">/v1/workflows/execute</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-300 mb-4">Triggers a specific automation workflow for an agent.</p>
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Request Body</h4>
                                <CodeBlock code={`{
  "agentId": "billy-jay",
  "workflowId": "lead-enrichment-protocol",
  "parameters": {
    "source": "linkedin",
    "limit": 50
  }
}`} language="json" />
                            </div>
                        </div>
                    </div>
                );

            case 'user':
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-6">User Guide & Gamification</h1>
                        
                        <section>
                            <h2 className="text-2xl font-bold text-purple-400 mb-4">XP & Leveling Up</h2>
                            <p className="text-slate-300 mb-4">
                                PyCom gamifies your learning. Every action you take earns Experience Points (XP).
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Complete Quiz</span>
                                    <span className="text-green-400 font-bold">+50 XP</span>
                                </div>
                                <div className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Run AI Workflow</span>
                                    <span className="text-green-400 font-bold">+100 XP</span>
                                </div>
                                <div className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Deploy App</span>
                                    <span className="text-green-400 font-bold">+500 XP</span>
                                </div>
                                <div className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Daily Login</span>
                                    <span className="text-green-400 font-bold">+10 XP</span>
                                </div>
                            </div>
                        </section>

                        <section className="mt-8">
                            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Profile & Badges</h2>
                            <p className="text-slate-300 mb-4">
                                Your profile showcases your achievements. Badges are awarded for milestones.
                            </p>
                            <MockWindow title="User Profile Card">
                                <div className="bg-slate-900 p-6 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl">👨‍💻</div>
                                    <div className="flex-grow">
                                        <h3 className="text-white font-bold text-lg">Alex Dev</h3>
                                        <p className="text-purple-400 text-sm">Level 5 Pythonista</p>
                                        <div className="w-full bg-slate-800 h-2 rounded-full mt-2">
                                            <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded bg-yellow-900/50 border border-yellow-500 flex items-center justify-center text-xs" title="Early Adopter">🚀</div>
                                        <div className="w-8 h-8 rounded bg-blue-900/50 border border-blue-500 flex items-center justify-center text-xs" title="AI Master">🤖</div>
                                    </div>
                                </div>
                            </MockWindow>
                        </section>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl animate-fade-in-up">
            {/* Sidebar */}
            <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col shrink-0 overflow-y-auto">
                <div className="mb-8 px-2">
                    <h2 className="text-white font-bold text-xl flex items-center gap-2 mb-1">
                        <BookOpenIcon className="w-6 h-6 text-purple-500" />
                        Docs Hub
                    </h2>
                    <p className="text-xs text-slate-500">v2.4.0 (Stable)</p>
                </div>
                
                <div className="space-y-1 flex-grow">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">General</p>
                    <SidebarItem id="intro" label="Introduction" icon={<DocumentTextIcon className="w-5 h-5" />} />
                    <SidebarItem id="features" label="Feature Guide" icon={<SparklesIcon className="w-5 h-5" />} />
                    <SidebarItem id="user" label="User Guide" icon={<UserGroupIcon className="w-5 h-5" />} />
                    
                    <div className="my-4 border-t border-slate-800"></div>
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Technical</p>
                    <SidebarItem id="self-hosting" label="Host & Build" icon={<ServerStackIcon className="w-5 h-5" />} />
                    <SidebarItem id="mcp" label="MCP Guide" icon={<BoltIcon className="w-5 h-5" />} />
                    <SidebarItem id="api" label="API & SDK" icon={<CodeBracketIcon className="w-5 h-5" />} />
                    
                    <div className="my-4 border-t border-slate-800"></div>
                    <SidebarItem id="support" label="Support" icon={<LifebuoyIcon className="w-5 h-5" />} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-8 overflow-y-auto bg-slate-950 relative scrollbar-thin scrollbar-thumb-slate-700">
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                <div className="max-w-5xl mx-auto relative z-10">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DocsPage;
