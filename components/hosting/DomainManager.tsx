import React, { useState } from 'react';
import { GlobeAltIcon, MagnifyingGlassIcon, CheckCircleIcon, PlusIcon, TrashIcon, ServerIcon, LockClosedIcon, ShieldCheckIcon, ArrowPathIcon, KeyIcon } from '../Icons.tsx';

interface DNSRecord {
    id: string;
    type: 'A' | 'CNAME' | 'MX' | 'TXT' | 'AAAA' | 'SRV' | 'NS' | 'PTR' | 'CAA';
    name: string;
    value: string;
    ttl: number;
}

interface SSLCertificate {
    status: 'none' | 'provisioning' | 'active';
    provider: string;
    serialNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
}

interface Domain {
    name: string;
    status: 'active' | 'pending' | 'expired';
    expires: string;
    records: DNSRecord[];
    ssl: SSLCertificate;
    ssoEnabled?: boolean;
}

const DomainManager: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<{ domain: string, available: boolean, price: string } | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    
    const [myDomains, setMyDomains] = useState<Domain[]>([
        {
            name: 'www.pysrch.com',
            status: 'active',
            expires: 'Lifetime (Enterprise Free)',
            ssoEnabled: true,
            records: [
                { id: 'p1', type: 'A', name: '@', value: '10.0.0.5', ttl: 3600 },
                { id: 'p2', type: 'CNAME', name: 'www', value: 'pysrch.com', ttl: 3600 },
                { id: 'p3', type: 'MX', name: '@', value: 'mail.pysrch.com', ttl: 14400 },
                { id: 'p4', type: 'TXT', name: '@', value: 'v=spf1 include:_spf.pycom.cloud ~all', ttl: 3600 },
                { id: 'p5', type: 'AAAA', name: '@', value: '2001:db8:85a3::8a2e:370:7334', ttl: 3600 },
                { id: 'p6', type: 'CAA', name: '@', value: '0 issue "pycom-ca.org"', ttl: 3600 }
            ],
            ssl: {
                status: 'active',
                provider: 'PyCom Enterprise CA',
                serialNumber: 'PY-99-AA-BB-CC-DD-EE',
                issuedDate: '2025-01-01',
                expiryDate: '2030-01-01'
            }
        },
        {
            name: 'my-startup.pycom',
            status: 'active',
            expires: '2026-11-24',
            records: [
                { id: '1', type: 'A', name: '@', value: '10.0.0.1', ttl: 3600 },
                { id: '2', type: 'CNAME', name: 'www', value: 'my-startup.pycom', ttl: 3600 }
            ],
            ssl: {
                status: 'none',
                provider: 'Let\'s Encrypt',
            }
        }
    ]);
    
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(myDomains[0]);
    const [newRecordType, setNewRecordType] = useState<DNSRecord['type']>('A');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        setTimeout(() => {
            setSearchResult({
                domain: searchQuery.includes('.') ? searchQuery : `${searchQuery}.pycom`,
                available: true, // Always make domains available for demo
                price: '$0.00 (PyCom Free Tier)'
            });
            setIsSearching(false);
        }, 1000);
    };

    const handleBuy = () => {
        if (!searchResult) return;
        const newDomain: Domain = {
            name: searchResult.domain,
            status: 'active',
            expires: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
            records: [
                { id: Date.now().toString(), type: 'A', name: '@', value: '10.0.0.1', ttl: 3600 }
            ],
            ssl: { status: 'none', provider: 'Let\'s Encrypt' }
        };
        setMyDomains([...myDomains, newDomain]);
        setSearchResult(null);
        setSearchQuery('');
        setSelectedDomain(newDomain);
    };

    const handleAddRecord = () => {
        if (!selectedDomain) return;
        const newRecord: DNSRecord = {
            id: Date.now().toString(),
            type: newRecordType,
            name: newRecordType === 'MX' ? '@' : 'sub',
            value: newRecordType === 'A' ? '1.2.3.4' : 'example.com',
            ttl: 3600
        };
        const updatedDomain = { ...selectedDomain, records: [...selectedDomain.records, newRecord] };
        setMyDomains(myDomains.map(d => d.name === selectedDomain.name ? updatedDomain : d));
        setSelectedDomain(updatedDomain);
    };

    const handleDeleteRecord = (id: string) => {
        if (!selectedDomain) return;
        const updatedDomain = { ...selectedDomain, records: selectedDomain.records.filter(r => r.id !== id) };
        setMyDomains(myDomains.map(d => d.name === selectedDomain.name ? updatedDomain : d));
        setSelectedDomain(updatedDomain);
    };

    const handleProvisionSSL = () => {
        if (!selectedDomain) return;
        
        // Set to provisioning
        let updatedDomain: Domain = { ...selectedDomain, ssl: { ...selectedDomain.ssl, status: 'provisioning' as const } };
        setMyDomains(myDomains.map(d => d.name === selectedDomain.name ? updatedDomain : d));
        setSelectedDomain(updatedDomain);

        // Simulate process
        setTimeout(() => {
            const serial = Array.from({length: 16}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':');
            const today = new Date();
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + 3);

            updatedDomain = { 
                ...selectedDomain, 
                ssl: { 
                    status: 'active', 
                    provider: 'Let\'s Encrypt (via PyCom)',
                    serialNumber: serial,
                    issuedDate: today.toISOString().split('T')[0],
                    expiryDate: expiry.toISOString().split('T')[0]
                } 
            };
            setMyDomains(myDomains.map(d => d.name === selectedDomain.name ? updatedDomain : d));
            setSelectedDomain(updatedDomain);
        }, 3000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <GlobeAltIcon className="w-8 h-8 text-blue-500" />
                    Domain & DNS Manager
                </h2>
                <p className="text-slate-400 text-sm mt-1">Register domains and manage DNS zones for your PyCom Cloud services.</p>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Left Panel: Domain List & Search */}
                <div className="w-80 bg-slate-900/50 border-r border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-800">
                        <form onSubmit={handleSearch} className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Register new domain..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-2 text-white focus:border-blue-500 focus:outline-none text-sm"
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        </form>
                        
                        {isSearching && <div className="text-center text-xs text-slate-500 mt-2 animate-pulse">Checking registry...</div>}
                        
                        {searchResult && (
                            <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                                <p className="text-white font-bold text-sm">{searchResult.domain}</p>
                                <div className="flex justify-between items-center mt-2">
                                    {searchResult.available ? (
                                        <>
                                            <span className="text-green-400 text-xs font-bold">Available</span>
                                            <span className="text-slate-300 text-xs">{searchResult.price}</span>
                                            <button onClick={handleBuy} className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold hover:bg-blue-700">Get it</button>
                                        </>
                                    ) : (
                                        <span className="text-red-400 text-xs font-bold">Taken</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-2 space-y-1">
                        {myDomains.map(domain => (
                            <button
                                key={domain.name}
                                onClick={() => setSelectedDomain(domain)}
                                className={`w-full text-left p-3 rounded-lg flex justify-between items-center transition-colors ${
                                    selectedDomain?.name === domain.name 
                                    ? 'bg-blue-900/20 border border-blue-500/50' 
                                    : 'hover:bg-slate-800 border border-transparent'
                                }`}
                            >
                                <div>
                                    <p className="font-bold text-slate-200 text-sm">{domain.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] text-slate-500">Expires {domain.expires}</p>
                                        {domain.ssl.status === 'active' && <LockClosedIcon className="w-3 h-3 text-green-500" />}
                                    </div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${domain.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Panel: DNS Records */}
                <div className="flex-grow p-6 bg-slate-950 overflow-y-auto">
                    {selectedDomain ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedDomain.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-bold uppercase tracking-wider">Active</span>
                                        {selectedDomain.ssoEnabled && (
                                            <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase tracking-wider flex items-center gap-1">
                                                <KeyIcon className="w-3 h-3" /> SSO Enabled
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Nameservers</p>
                                    <p className="text-sm text-slate-300 font-mono">ns1.pycom.cloud</p>
                                    <p className="text-sm text-slate-300 font-mono">ns2.pycom.cloud</p>
                                </div>
                            </div>

                            {/* SSL Section */}
                            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        <ShieldCheckIcon className={`w-5 h-5 ${selectedDomain.ssl.status === 'active' ? 'text-green-500' : 'text-gray-500'}`} />
                                        SSL/TLS Certificate
                                    </h4>
                                    {selectedDomain.ssl.status === 'none' && (
                                        <button onClick={handleProvisionSSL} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded font-bold hover:bg-green-700 flex items-center gap-1">
                                            <LockClosedIcon className="w-3 h-3" /> Provision Free SSL
                                        </button>
                                    )}
                                </div>
                                <div className="p-6">
                                    {selectedDomain.ssl.status === 'active' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase mb-1">Status</p>
                                                <p className="text-green-400 font-bold flex items-center gap-2">
                                                    <CheckCircleIcon className="w-4 h-4" /> Active (Secure)
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase mb-1">Issuer</p>
                                                <p className="text-white">{selectedDomain.ssl.provider}</p>
                                            </div>
                                            <div className="col-span-2 bg-black/30 p-3 rounded border border-slate-700 font-mono text-xs">
                                                <p className="text-slate-500 mb-1">Serial Number</p>
                                                <p className="text-yellow-400 break-all">{selectedDomain.ssl.serialNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase mb-1">Issued</p>
                                                <p className="text-slate-300">{selectedDomain.ssl.issuedDate}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs uppercase mb-1">Expires</p>
                                                <p className="text-slate-300">{selectedDomain.ssl.expiryDate} (Auto-renews)</p>
                                            </div>
                                        </div>
                                    ) : selectedDomain.ssl.status === 'provisioning' ? (
                                        <div className="flex flex-col items-center justify-center py-4">
                                            <ArrowPathIcon className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                                            <p className="text-purple-300 text-sm font-bold">Verifying DNS challenge...</p>
                                            <p className="text-slate-500 text-xs mt-1">Requesting certificate from Let's Encrypt</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-slate-400 mb-2">No active certificate.</p>
                                            <p className="text-xs text-slate-500">Your site is currently served over HTTP (Insecure).</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        <ServerIcon className="w-5 h-5 text-purple-400" />
                                        DNS Records
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <select 
                                            value={newRecordType} 
                                            onChange={(e) => setNewRecordType(e.target.value as any)}
                                            className="bg-slate-800 text-white text-xs border border-slate-600 rounded px-2 py-1 outline-none"
                                        >
                                            <option value="A">A</option>
                                            <option value="CNAME">CNAME</option>
                                            <option value="MX">MX</option>
                                            <option value="TXT">TXT</option>
                                            <option value="AAAA">AAAA</option>
                                            <option value="SRV">SRV</option>
                                            <option value="NS">NS</option>
                                            <option value="PTR">PTR</option>
                                            <option value="CAA">CAA</option>
                                        </select>
                                        <button onClick={handleAddRecord} className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded font-bold hover:bg-purple-700 flex items-center gap-1">
                                            <PlusIcon className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                </div>
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Value</th>
                                            <th className="px-4 py-3">TTL</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {selectedDomain.records.map(record => (
                                            <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-bold text-blue-400">{record.type}</td>
                                                <td className="px-4 py-3 text-slate-300 font-mono">{record.name}</td>
                                                <td className="px-4 py-3 text-slate-300 font-mono break-all">{record.value}</td>
                                                <td className="px-4 py-3 text-slate-500">{record.ttl}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button onClick={() => handleDeleteRecord(record.id)} className="text-slate-500 hover:text-red-400">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <GlobeAltIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a domain to manage DNS.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DomainManager;