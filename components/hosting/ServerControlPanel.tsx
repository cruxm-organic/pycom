
import React, { useState, useEffect } from 'react';
import type { ServerInstance, VPSInstance, VPNConfig, VPNPeer } from '../../types.ts';
import { 
    ServerIcon, TerminalIcon, CubeIcon, CloudArrowUpIcon, 
    DatabaseIcon, CpuChipIcon, GlobeAltIcon, ChartBarIcon, 
    LockClosedIcon, PlusIcon, CheckCircleIcon, WifiIcon, ShieldExclamationIcon, StopIcon, KeyIcon, NetworkIcon, ScaleIcon, ChartPieIcon, ArrowPathIcon
} from '../Icons.tsx';
import LoadBalancer from './LoadBalancer.tsx';
import AnalyticsPanel from './AnalyticsPanel.tsx';

// ... ResourceGauge Component ...
const ResourceGauge: React.FC<{ label: string, value: number, unit: string }> = ({ label, value, unit }) => {
    let color = 'bg-green-500';
    if (value > 80) color = 'bg-red-500';
    else if (value > 50) color = 'bg-yellow-500';

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>{label}</span>
                <span className="font-mono">{value.toFixed(1)}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
                    style={{ width: `${Math.min(value, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

type SubTab = 'overview' | 'data' | 'infrastructure' | 'tools' | 'dns' | 'vps' | 'lb' | 'analytics';

interface ServerControlPanelProps {
    onNavigate?: (tab: 'browser' | 'mcp' | 'wsgi') => void;
    onOpenBrowser?: (url: string) => void;
}

const ServerControlPanel: React.FC<ServerControlPanelProps> = ({ onNavigate, onOpenBrowser }) => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
    const [servers, setServers] = useState<ServerInstance[]>([
        { 
            id: '1', name: 'PyCom Cloud Native (Free)', type: 'cloud', ip: '10.0.0.1', status: 'running', region: 'PyCom-Central', mcpEnabled: true, 
            metrics: { cpu: 12, ram: 24, diskIo: 5 },
            installedServices: [
                { id: 's1', name: 'FAISS (Vector DB)', type: 'vector-db', status: 'running', port: 8000 },
                { id: 's2', name: 'PyMail Service', type: 'database', status: 'running', port: 2525 },
                { id: 's3', name: 'PyDrive Gateway', type: 'database', status: 'running', port: 9000 },
                { id: 's4', name: 'PyHuddle RTC Engine', type: 'database', status: 'running', port: 443 },
                { id: 's5', name: 'Agent Reporting API', type: 'api', status: 'running', port: 3030 }
            ]
        },
        { id: '2', name: 'Localhost Docker', type: 'local', ip: '127.0.0.1', status: 'running', region: 'Local', mcpEnabled: true, metrics: { cpu: 5, ram: 10, diskIo: 0 }, installedServices: [] },
    ]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

    // VPS & VPN State
    const [vpsInstances, setVpsInstances] = useState<VPSInstance[]>([
        { id: 'v1', name: 'Dev-Box-01', os: 'Ubuntu 22.04', status: 'running', ip: '10.10.5.2', specs: { cpu: 2, ram: 4 } }
    ]);
    const [vpnConfig, setVpnConfig] = useState<VPNConfig>({
        status: 'inactive',
        publicIp: '203.0.113.5',
        port: 51820,
        publicKey: '',
        peers: []
    });
    const [isProvisioning, setIsProvisioning] = useState(false);
    const [newVpsName, setNewVpsName] = useState('');
    const [newVpsOs, setNewVpsOs] = useState<VPSInstance['os']>('Ubuntu 22.04');

    useEffect(() => {
        const interval = setInterval(() => {
            setServers(prevServers => prevServers.map(server => {
                if (server.status !== 'running') return { ...server, metrics: { cpu: 0, ram: 0, diskIo: 0 } };
                const loadFactor = server.installedServices ? server.installedServices.length * 5 : 0;
                const newCpu = Math.min(100, Math.max(1, (server.metrics?.cpu || 10) + (Math.random() * 10 - 5) + (loadFactor / 5)));
                const newRam = Math.min(100, Math.max(5, (server.metrics?.ram || 20) + (Math.random() * 5 - 2.5) + (loadFactor / 2)));
                const newDisk = Math.max(0, (Math.random() * 50));
                return { ...server, metrics: { cpu: newCpu, ram: newRam, diskIo: newDisk } };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const openTerminal = (id: string) => {
        setActiveTerminal(id);
        const server = servers.find(s => s.id === id);
        setTerminalOutput([
            `Connecting to ${server?.name} (${server?.ip})...`,
            'Authenticating via PyCom Secure Shell...',
            'Access Granted.',
            'Welcome to PyCom OS 2.0 LTS',
            'System load: 0.14, 0.10, 0.05',
            `root@${server?.name.replace(/\s/g, '-')}:~# `
        ]);
    };

    const handleProvisionVps = () => {
        if (!newVpsName.trim()) return;
        setIsProvisioning(true);
        setTimeout(() => {
            const newVps: VPSInstance = {
                id: Date.now().toString(),
                name: newVpsName,
                os: newVpsOs,
                status: 'running',
                ip: `10.10.5.${vpsInstances.length + 3}`,
                specs: { cpu: 1, ram: 2 }
            };
            setVpsInstances([...vpsInstances, newVps]);
            setNewVpsName('');
            setIsProvisioning(false);
        }, 2000);
    };

    const handleToggleVpn = () => {
        setVpnConfig(prev => ({
            ...prev,
            status: prev.status === 'active' ? 'inactive' : 'active',
            publicKey: prev.status === 'inactive' ? 'wG+7s8...kL9=' : ''
        }));
    };

    const handleAddPeer = () => {
        const newPeer: VPNPeer = {
            id: Date.now().toString(),
            name: `Client-${vpnConfig.peers.length + 1}`,
            ip: `10.8.0.${vpnConfig.peers.length + 2}/32`,
            status: 'connected',
            lastHandshake: 'Just now'
        };
        setVpnConfig(prev => ({ ...prev, peers: [...prev.peers, newPeer] }));
    };

    const NavButton: React.FC<{ id: SubTab, label: string, icon: any }> = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveSubTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                activeSubTab === id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center overflow-x-auto">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 whitespace-nowrap mr-4">
                    <ServerIcon className="w-5 h-5 text-blue-500" />
                    Infrastructure Control
                </h3>
                <div className="flex bg-slate-950 p-1 rounded-lg overflow-x-auto">
                    <NavButton id="overview" label="Overview" icon={<ChartBarIcon className="w-4 h-4" />} />
                    <NavButton id="lb" label="Load Balancer" icon={<ScaleIcon className="w-4 h-4" />} />
                    <NavButton id="analytics" label="Analytics" icon={<ChartPieIcon className="w-4 h-4" />} />
                    <NavButton id="data" label="Data/Storage" icon={<DatabaseIcon className="w-4 h-4" />} />
                    <NavButton id="infrastructure" label="Infra" icon={<CpuChipIcon className="w-4 h-4" />} />
                    <NavButton id="vps" label="VPS & VPN" icon={<WifiIcon className="w-4 h-4" />} />
                    <NavButton id="dns" label="DNS" icon={<GlobeAltIcon className="w-4 h-4" />} />
                    <NavButton id="tools" label="Tools" icon={<CubeIcon className="w-4 h-4" />} />
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {activeSubTab === 'lb' ? (
                    <div className="flex-grow p-0 overflow-hidden">
                        <LoadBalancer />
                    </div>
                ) : activeSubTab === 'analytics' ? (
                     <div className="flex-grow p-0 overflow-hidden">
                        <AnalyticsPanel />
                    </div>
                ) : (
                    <>
                         <div className="w-72 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900 hidden md:block">
                            {servers.map(server => (
                                <div key={server.id} className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all ${activeTerminal === server.id ? 'bg-slate-800 border-green-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`} onClick={() => openTerminal(server.id)}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            <span className="text-sm font-bold text-white">{server.name}</span>
                                        </div>
                                        {server.type === 'cloud' && <CloudArrowUpIcon className="w-4 h-4 text-purple-400" />}
                                    </div>
                                    <div className="space-y-2">
                                        <ResourceGauge label="CPU" value={server.metrics?.cpu || 0} unit="%" />
                                        <ResourceGauge label="RAM" value={server.metrics?.ram || 0} unit="%" />
                                    </div>
                                    {server.installedServices && server.installedServices.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-slate-700/50">
                                            <p className="text-[10px] text-slate-500 uppercase mb-1">Active Services</p>
                                            <div className="flex flex-wrap gap-1">
                                                {server.installedServices.map(s => (
                                                    <span key={s.id} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                                        {s.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto bg-black/20">
                            {activeSubTab === 'overview' && (
                                <div className="space-y-6">
                                     {/* Server Type Indicator */}
                                     <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Active Web Server</p>
                                            <h4 className="text-white font-bold flex items-center gap-2">
                                                <NetworkIcon className="w-5 h-5 text-cyan-400" />
                                                PyCom WSGI Server
                                            </h4>
                                            <p className="text-xs text-slate-400 mt-1">Optimized for Python workloads</p>
                                        </div>
                                        <button 
                                            onClick={() => onNavigate && onNavigate('wsgi')}
                                            className="text-xs bg-cyan-900/30 text-cyan-400 px-3 py-1.5 rounded font-bold hover:bg-cyan-900/50 transition-colors border border-cyan-500/30"
                                        >
                                            Manage WSGI
                                        </button>
                                    </div>

                                    <div className="bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden h-96 shadow-2xl">
                                        <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-2">
                                            <TerminalIcon className="w-4 h-4 text-green-500" />
                                            <span className="text-xs font-mono text-slate-400">Secure Shell Access</span>
                                        </div>
                                        <div className="flex-grow p-4 font-mono text-sm text-green-400 overflow-y-auto">
                                            {terminalOutput.map((line, i) => <div key={i}>{line}</div>)}
                                            {activeTerminal && <span className="animate-pulse">_</span>}
                                            {!activeTerminal && <div className="text-slate-600 italic text-center mt-20">Select a server instance to connect.</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeSubTab === 'vps' && (
                                <div className="space-y-8">
                                    {/* VPS Manager */}
                                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                        <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                            <ServerIcon className="w-5 h-5 text-blue-400" />
                                            Virtual Private Servers
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Provisioner */}
                                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-700">
                                                <h5 className="text-sm font-bold text-slate-300 mb-4">Launch Instance</h5>
                                                <div className="space-y-3">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Instance Name" 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                                        value={newVpsName}
                                                        onChange={(e) => setNewVpsName(e.target.value)}
                                                    />
                                                    <select 
                                                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                                                        value={newVpsOs}
                                                        onChange={(e) => setNewVpsOs(e.target.value as any)}
                                                    >
                                                        <option>Ubuntu 22.04</option>
                                                        <option>Debian 12</option>
                                                        <option>Alpine Linux</option>
                                                    </select>
                                                    <button 
                                                        onClick={handleProvisionVps}
                                                        disabled={isProvisioning}
                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isProvisioning ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <PlusIcon className="w-4 h-4" />}
                                                        Launch
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Instance List */}
                                            <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {vpsInstances.map(vps => (
                                                    <div key={vps.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col justify-between hover:border-blue-500/50 transition-colors group">
                                                        <div>
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${vps.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                                    <span className="font-bold text-white text-sm">{vps.name}</span>
                                                                </div>
                                                                <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{vps.os}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-400 mb-3 font-mono">
                                                                IP: {vps.ip}<br/>
                                                                Specs: {vps.specs.cpu}vCPU / {vps.specs.ram}GB
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1">
                                                                <TerminalIcon className="w-3 h-3" /> Console
                                                            </button>
                                                            <button 
                                                                onClick={() => onOpenBrowser && onOpenBrowser(`https://${vps.ip}:8443`)}
                                                                className="flex-1 bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 text-xs py-1.5 rounded border border-blue-500/30 flex items-center justify-center gap-1"
                                                                title="Open Web Admin"
                                                            >
                                                                <GlobeAltIcon className="w-3 h-3" /> Admin
                                                            </button>
                                                            <button className="px-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded border border-red-900/50">
                                                                <StopIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* VPN Manager */}
                                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-white flex items-center gap-2">
                                                <ShieldExclamationIcon className={`w-5 h-5 ${vpnConfig.status === 'active' ? 'text-green-500' : 'text-gray-500'}`} />
                                                WireGuard VPN
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs font-bold uppercase ${vpnConfig.status === 'active' ? 'text-green-400' : 'text-slate-500'}`}>
                                                    {vpnConfig.status}
                                                </span>
                                                <button 
                                                    onClick={handleToggleVpn}
                                                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${vpnConfig.status === 'active' ? 'bg-green-600' : 'bg-slate-700'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${vpnConfig.status === 'active' ? 'translate-x-5' : ''}`}></div>
                                                </button>
                                            </div>
                                        </div>

                                        {vpnConfig.status === 'active' ? (
                                            <div className="space-y-6 animate-fade-in-up">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-700">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase mb-1">Endpoint</p>
                                                        <p className="text-sm text-white font-mono">{vpnConfig.publicIp}:{vpnConfig.port}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase mb-1">Server Public Key</p>
                                                        <p className="text-sm text-yellow-400 font-mono truncate">{vpnConfig.publicKey}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h5 className="text-sm font-bold text-slate-300">Connected Peers</h5>
                                                        <button onClick={handleAddPeer} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 font-bold flex items-center gap-1">
                                                            <PlusIcon className="w-3 h-3" /> Add Peer
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {vpnConfig.peers.length === 0 && <p className="text-slate-500 text-xs italic">No peers connected.</p>}
                                                        {vpnConfig.peers.map(peer => (
                                                            <div key={peer.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="bg-slate-800 p-1.5 rounded">
                                                                        <KeyIcon className="w-4 h-4 text-slate-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-white">{peer.name}</p>
                                                                        <p className="text-xs text-slate-500 font-mono">{peer.ip}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-[10px] text-slate-500">Last seen: {peer.lastHandshake}</span>
                                                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-500">
                                                <ShieldExclamationIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                <p>VPN Service is offline.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeSubTab === 'data' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <CloudArrowUpIcon className="w-5 h-5 text-yellow-400" /> 
                                            PySrch Unlimited Cloud Storage
                                        </h4>
                                        {/* ... (Storage content) ... */}
                                        <div className="p-4 bg-slate-950 rounded text-center text-slate-500">Storage Metrics Visualization</div>
                                    </div>
                                </div>
                            )}
                            
                             {(activeSubTab === 'dns' || activeSubTab === 'tools' || activeSubTab === 'infrastructure') && (
                                 <div className="text-center text-slate-500 mt-10">
                                     Select a tab to manage specific infrastructure components.
                                 </div>
                             )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ServerControlPanel;
