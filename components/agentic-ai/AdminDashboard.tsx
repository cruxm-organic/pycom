import React, { useState } from 'react';
import { AGENTS } from '../../constants.ts';
import { 
    ServerStackIcon, UserGroupIcon, ShieldCheckIcon, KeyIcon, 
    CheckCircleIcon, ExclamationTriangleIcon, WrenchScrewdriverIcon, GlobeAltIcon 
} from '../Icons.tsx';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'resources' | 'infra' | 'config'>('resources');

    const ResourceView = () => (
        <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-blue-400" />
                    Agent Resource Allocation
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-3">Agent</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Email Status</th>
                                <th className="px-4 py-3">VPS ID</th>
                                <th className="px-4 py-3">Access Level</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {AGENTS.map(agent => (
                                <tr key={agent.id} className="hover:bg-slate-800/50">
                                    <td className="px-4 py-3 font-bold text-white">{agent.name}</td>
                                    <td className="px-4 py-3">{agent.role}</td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-green-400 text-xs">
                                            <CheckCircleIcon className="w-3 h-3" /> Verified
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs text-purple-300">vps-{agent.id.substring(0,4)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${agent.role === 'CEO' || agent.role === 'System Admin' ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                            {agent.role === 'CEO' || agent.role === 'System Admin' ? 'Root' : 'Standard'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded border border-slate-600">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const InfrastructureView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <ServerStackIcon className="w-5 h-5 text-green-400" />
                    System Health
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Web Cluster Load</span>
                            <span className="text-green-400">42%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[42%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>DB Replica Lag</span>
                            <span className="text-blue-400">0ms</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[1%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>AI Inference Queue</span>
                            <span className="text-yellow-400">12 Jobs</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[35%]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheckIcon className="w-5 h-5 text-purple-400" />
                    Security Audit
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-green-500/30">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-white">Firewall Rules</span>
                        </div>
                        <span className="text-xs text-slate-500">Updated 2h ago</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-green-500/30">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-white">SSL Certificates</span>
                        </div>
                        <span className="text-xs text-slate-500">Valid (Wildcard)</span>
                    </div>
                     <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-yellow-500/30">
                        <div className="flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-white">VPN Gateways</span>
                        </div>
                        <span className="text-xs text-yellow-400">1 Peer Disconnected</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const GlobalConfigView = () => (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <GlobeAltIcon className="w-5 h-5 text-indigo-400" />
                Global Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <KeyIcon className="w-4 h-4 text-slate-400" /> SSO Settings
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">Manage Google/Microsoft OAuth providers.</p>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded transition-colors">Configure</button>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4 text-slate-400" /> DNS Zones
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">Manage PyCom Cloud subdomains.</p>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded transition-colors">Manage Zones</button>
                </div>
                 <div className="p-4 bg-slate-950 rounded-lg border border-slate-700">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <WrenchScrewdriverIcon className="w-4 h-4 text-slate-400" /> Maintenance
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">System-wide maintenance mode.</p>
                    <button className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs py-2 rounded transition-colors border border-red-900/50">Enable Mode</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <WrenchScrewdriverIcon className="w-8 h-8 text-red-500" />
                        IT Admin Console
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">System Operations & Resource Management</p>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setActiveTab('resources')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'resources' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Resources</button>
                    <button onClick={() => setActiveTab('infra')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'infra' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Infrastructure</button>
                    <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Config</button>
                </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                {activeTab === 'resources' && <ResourceView />}
                {activeTab === 'infra' && <InfrastructureView />}
                {activeTab === 'config' && <GlobalConfigView />}
            </div>
        </div>
    );
};

export default AdminDashboard;
