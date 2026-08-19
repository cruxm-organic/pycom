
import React, { useState } from 'react';
import { ServerStackIcon, BoltIcon, CloudArrowDownIcon, ShoppingBagIcon, GlobeAltIcon, RectangleStackIcon, CubeIcon, NetworkIcon } from '../Icons.tsx';
import DeploymentManager from '../hosting/DeploymentManager.tsx';
import VisualAutomator from '../hosting/VisualAutomator.tsx';
import ServerControlPanel from '../hosting/ServerControlPanel.tsx';
import PyPingChatbot from '../hosting/PyPingChatbot.tsx';
import Marketplace from '../hosting/Marketplace.tsx';
import PysrchBrowser from '../hosting/PysrchBrowser.tsx';
import PySrchWorkspace from '../hosting/PySrchWorkspace.tsx';
import DomainManager from '../hosting/DomainManager.tsx';
import MCPServer from '../agentic-ai/MCPServer.tsx';
import PyComWSGI from '../hosting/PyComWSGI.tsx';

type HostTab = 'manage' | 'deploy' | 'automate' | 'marketplace' | 'browser' | 'workspace' | 'domains' | 'mcp' | 'wsgi';

const HostPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<HostTab>('manage');
    // Shared state for deployments to link marketplace and deployment manager
    const [deployments, setDeployments] = useState<any[]>([
        { id: '0', name: 'PyCom Platform (Self-Hosted)', repo: 'pycom/platform-core', branch: 'production', status: 'deployed', url: 'https://pycom.io', lastBuilt: '10m ago', commitMessage: 'Hotfix: Auth Token' },
        { id: '1', name: 'pycom-blog', repo: 'jeyabal/pycom-blog', branch: 'main', status: 'deployed', url: 'https://blog.pycom.app', lastBuilt: '2m ago', commitMessage: 'Update styles' }
    ]);
    const [browserInitialUrl, setBrowserInitialUrl] = useState<string | null>(null);

    const handleMarketplaceDeploy = (app: any) => {
        const newDeploy = {
            id: Date.now().toString(),
            name: app.name.toLowerCase().replace(/\s/g, '-'),
            repo: `pycom/${app.name.toLowerCase().replace(/\s/g, '-')}`,
            branch: 'main',
            status: 'building',
            url: '#',
            lastBuilt: 'Building...',
            commitMessage: 'Initial Deploy from Marketplace'
        };
        setDeployments([newDeploy, ...deployments]);
        setActiveTab('deploy'); // Automatically switch to deployment view
    };

    const handleInternalNavigate = (tab: HostTab) => {
        setActiveTab(tab);
    };

    const handleOpenBrowser = (url: string) => {
        setBrowserInitialUrl(url);
        setActiveTab('browser');
        // Reset after a short delay so subsequent clicks work even if url is same
        setTimeout(() => setBrowserInitialUrl(null), 500);
    };

    const TabButton: React.FC<{ id: HostTab, label: string, icon: any, color: string }> = ({ id, label, icon, color }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 lg:px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === id ? `${color} text-white shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col relative">
            <PyPingChatbot />
            
            <div className="mb-6 text-center shrink-0">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">PyCom Cloud Host</h1>
                <p className="text-sm md:text-base text-slate-400">Open-Source, AI-Powered Cloud Infrastructure & CI/CD.</p>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col flex-grow overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="bg-slate-900 p-2 flex justify-center border-b border-slate-800 shrink-0 overflow-x-auto">
                    <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <TabButton id="manage" label="Server Control" icon={<ServerStackIcon className="w-4 h-4" />} color="bg-blue-600" />
                        <TabButton id="wsgi" label="WSGI" icon={<NetworkIcon className="w-4 h-4" />} color="bg-cyan-600" />
                        <TabButton id="deploy" label="Deployments" icon={<CloudArrowDownIcon className="w-4 h-4" />} color="bg-purple-600" />
                        <TabButton id="domains" label="Domains" icon={<GlobeAltIcon className="w-4 h-4" />} color="bg-green-600" />
                        <TabButton id="workspace" label="Workspace" icon={<RectangleStackIcon className="w-4 h-4" />} color="bg-indigo-600" />
                        <TabButton id="browser" label="Pysrch Browser" icon={<GlobeAltIcon className="w-4 h-4" />} color="bg-teal-600" />
                        <TabButton id="automate" label="Automation" icon={<BoltIcon className="w-4 h-4" />} color="bg-yellow-500 text-gray-900" />
                        <TabButton id="marketplace" label="Marketplace" icon={<ShoppingBagIcon className="w-4 h-4" />} color="bg-pink-600" />
                        <TabButton id="mcp" label="MCP Server" icon={<CubeIcon className="w-4 h-4" />} color="bg-orange-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-4 md:p-6 overflow-hidden bg-slate-950 relative">
                    <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                    {activeTab === 'manage' && <ServerControlPanel onNavigate={handleInternalNavigate} onOpenBrowser={handleOpenBrowser} />}
                    {activeTab === 'wsgi' && <PyComWSGI />}
                    {activeTab === 'deploy' && <DeploymentManager deployments={deployments} setDeployments={setDeployments} />}
                    {activeTab === 'domains' && <DomainManager />}
                    {activeTab === 'automate' && <VisualAutomator />}
                    {activeTab === 'marketplace' && <Marketplace onDeploy={handleMarketplaceDeploy} />}
                    {activeTab === 'browser' && <PysrchBrowser initialUrl={browserInitialUrl} />}
                    {activeTab === 'workspace' && <PySrchWorkspace />}
                    {activeTab === 'mcp' && <MCPServer />}
                </div>
            </div>
        </div>
    );
};

export default HostPage;
