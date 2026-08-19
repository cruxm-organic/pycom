
import React, { useState } from 'react';
import { MCP_SERVICES } from '../../constants.ts';
import { 
    CubeIcon, ServerStackIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, 
    ArrowPathIcon, XMarkIcon, LockClosedIcon, KeyIcon, BoltIcon, CheckCircleIcon 
} from '../Icons.tsx';

type Tab = 'monitor' | 'config' | 'security' | 'cicd';

const MCPServer: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('monitor');
    const [serverPort, setServerPort] = useState(3000);
    const [contextLimit, setContextLimit] = useState(32000);
    const [logLevel, setLogLevel] = useState('INFO');
    const [apiKey, setApiKey] = useState('mcp_sk_8f92...a1b2');
    const [ipWhitelist, setIpWhitelist] = useState(['127.0.0.1', '192.168.1.10']);
    const [tlsEnabled, setTlsEnabled] = useState(true);
    const [newIp, setNewIp] = useState('');
    
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);

    const handleSaveConfig = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            setIsSaving(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 1500);
    }

    const handleRotateKey = () => {
        const newKey = 'mcp_sk_' + Math.random().toString(36).substring(2, 10) + '...';
        setApiKey(newKey);
    };

    const handleAddIp = () => {
        if (newIp && !ipWhitelist.includes(newIp)) {
            setIpWhitelist([...ipWhitelist, newIp]);
            setNewIp('');
        }
    };

    const handleRemoveIp = (ip: string) => {
        setIpWhitelist(ipWhitelist.filter(i => i !== ip));
    };

    const MonitorView = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Server Stats */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <ServerStackIcon className="w-5 h-5 text-purple-400" />
                    System Resources
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Context Window Usage</span>
                            <span>{Math.floor(contextLimit * 0.12).toLocaleString()} / {contextLimit.toLocaleString()} Tokens</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                            <span>Memory (RAM)</span>
                            <span>1.2 GB / 8.0 GB</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">12ms</p>
                            <p className="text-xs text-slate-500">Avg Latency</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">99.9%</p>
                            <p className="text-xs text-slate-500">Uptime</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">5</p>
                            <p className="text-xs text-slate-500">Active Tools</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connections List */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Connected Resources</h3>
                    <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                        + Add Resource
                    </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                    {MCP_SERVICES.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 group hover:border-slate-600 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${service.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <div>
                                    <p className="font-semibold text-slate-200 text-sm">{service.name}</p>
                                    <p className="text-xs text-slate-500 uppercase">{service.type} • {service.latency}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-white"><ArrowPathIcon className="w-4 h-4" /></button>
                                <button className="text-slate-400 hover:text-red-400"><XMarkIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Logs */}
            <div className="col-span-1 lg:col-span-2 bg-black rounded-xl border border-slate-800 font-mono text-xs p-4 h-48 overflow-y-auto">
                <div className="text-green-500">[MCP-CORE] Server started on port {serverPort}</div>
                <div className="text-blue-400">[MCP-CONN] Establishing connection to PostgresDB... Success.</div>
                <div className="text-blue-400">[MCP-CONN] Handshake with HubSpot API... Validated.</div>
                <div className="text-yellow-500">[MCP-WARN] Slack Bot integration token expired. Re-auth required.</div>
                <div className="text-slate-500">[MCP-IDLE] Waiting for agent requests...</div>
                <div className="animate-pulse text-green-500">_</div>
            </div>
        </div>
    );

    const ConfigView = () => (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-blue-400" />
                Server Configuration
            </h3>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-1">Server Port</label>
                        <input 
                            type="number" 
                            value={serverPort}
                            onChange={(e) => setServerPort(parseInt(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-1">Max Context Tokens</label>
                        <select 
                            value={contextLimit}
                            onChange={(e) => setContextLimit(parseInt(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value={4096}>4,096 (Standard)</option>
                            <option value={16384}>16,384 (High)</option>
                            <option value={32000}>32,000 (Ultra)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Log Level</label>
                    <div className="flex gap-4">
                        {['DEBUG', 'INFO', 'WARN', 'ERROR'].map(level => (
                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="logLevel" 
                                    value={level} 
                                    checked={logLevel === level}
                                    onChange={(e) => setLogLevel(e.target.value)}
                                    className="accent-blue-500"
                                />
                                <span className="text-slate-300 text-sm">{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Environment Variables</label>
                    <div className="bg-slate-950 rounded-lg border border-slate-700 p-4 space-y-2 font-mono text-sm">
                        <div className="flex gap-2">
                            <input type="text" value="DB_HOST" readOnly className="bg-transparent text-purple-300 w-1/3 outline-none" />
                            <input type="text" value="10.0.0.5" readOnly className="bg-transparent text-slate-400 w-2/3 outline-none" />
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value="API_TIMEOUT" readOnly className="bg-transparent text-purple-300 w-1/3 outline-none" />
                            <input type="text" value="5000ms" readOnly className="bg-transparent text-slate-400 w-2/3 outline-none" />
                        </div>
                        <div className="flex gap-2 opacity-50">
                            <input type="text" placeholder="KEY" className="bg-transparent text-slate-500 w-1/3 outline-none border-b border-slate-800" />
                            <input type="text" placeholder="VALUE" className="bg-transparent text-slate-500 w-2/3 outline-none border-b border-slate-800" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button 
                        onClick={handleSaveConfig}
                        disabled={isSaving || savedSuccess}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                            savedSuccess 
                            ? 'bg-green-600 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {isSaving ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : savedSuccess ? (
                            <CheckCircleIcon className="w-4 h-4" />
                        ) : null}
                        {isSaving ? 'Saving...' : savedSuccess ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );

    const SecurityView = () => (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                Security Hardening
            </h3>
            
            <div className="space-y-8">
                {/* API Key Section */}
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4 text-yellow-500" /> Master API Key
                        </label>
                        <button onClick={handleRotateKey} className="text-xs text-red-400 hover:text-red-300 underline">Rotate Key</button>
                    </div>
                    <div className="flex gap-2 items-center bg-black p-2 rounded border border-slate-800">
                        <code className="text-green-400 font-mono text-sm flex-grow">{apiKey}</code>
                        <button className="text-slate-500 hover:text-white text-xs">Copy</button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Used for agent-to-server authentication. Rotating invalidates all active sessions.</p>
                </div>

                {/* TLS Toggle */}
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-lg border border-slate-700">
                    <div>
                        <h4 className="font-bold text-white flex items-center gap-2">
                            <LockClosedIcon className="w-4 h-4 text-blue-400" /> 
                            Enforce TLS/SSL
                        </h4>
                        <p className="text-xs text-slate-400">Reject non-secure HTTP connections.</p>
                    </div>
                    <button 
                        onClick={() => setTlsEnabled(!tlsEnabled)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${tlsEnabled ? 'bg-green-600' : 'bg-slate-700'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${tlsEnabled ? 'translate-x-6' : ''}`}></div>
                    </button>
                </div>

                {/* IP Whitelist */}
                <div>
                    <h4 className="font-bold text-white mb-3">IP Whitelist</h4>
                    <div className="bg-slate-950 rounded-lg border border-slate-700 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-slate-400">
                                <tr>
                                    <th className="p-3">IP Address</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {ipWhitelist.map(ip => (
                                    <tr key={ip} className="text-slate-300">
                                        <td className="p-3 font-mono">{ip}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => handleRemoveIp(ip)} className="text-red-400 hover:text-red-300">
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-3">
                                        <input 
                                            type="text" 
                                            placeholder="0.0.0.0" 
                                            value={newIp}
                                            onChange={(e) => setNewIp(e.target.value)}
                                            className="bg-transparent outline-none text-white placeholder-slate-600 font-mono w-full"
                                        />
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={handleAddIp} className="text-green-400 hover:text-green-300 font-bold text-xs">
                                            ADD
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    const CICDView = () => (
        <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-3xl mx-auto text-center">
            <BoltIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">CI/CD Pipelines</h3>
            <p className="text-slate-400 mb-6">Automated testing and deployment workflows are currently managed via the "Host & Build" tab.</p>
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                Go to Host & Build
            </button>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <CubeIcon className="w-8 h-8 text-blue-500" />
                        MCP Server Control
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Model Context Protocol v1.0.2 • Local Instance</p>
                </div>
                
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setActiveTab('monitor')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'monitor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Monitor</button>
                    <button onClick={() => setActiveTab('config')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Config</button>
                    <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Security</button>
                    <button onClick={() => setActiveTab('cicd')} className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${activeTab === 'cicd' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>CI/CD</button>
                </div>
            </div>

            <div className="flex-grow p-6 overflow-y-auto bg-slate-950">
                {activeTab === 'monitor' && <MonitorView />}
                {activeTab === 'config' && <ConfigView />}
                {activeTab === 'security' && <SecurityView />}
                {activeTab === 'cicd' && <CICDView />}
            </div>
        </div>
    );
};

export default MCPServer;
