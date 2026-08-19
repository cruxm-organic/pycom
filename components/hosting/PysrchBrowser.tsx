import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
    GlobeAltIcon, ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, 
    LockClosedIcon, MagnifyingGlassIcon, SparklesIcon, TableCellsIcon,
    DocumentTextIcon, ShieldCheckIcon, NewspaperIcon, PlusIcon, XMarkIcon,
    EyeSlashIcon, PhotoIcon, VideoCameraIcon, UserGroupIcon, MapIcon, ShoppingBagIcon, PuzzlePieceIcon, CogIcon, ServerIcon, TerminalIcon, CheckCircleIcon, CpuChipIcon, CubeIcon, MapPinIcon, HandThumbUpIcon, ChatBubbleLeftRightIcon, WifiIcon, MegaphoneIcon, SpeakerWaveIcon
} from '../Icons.tsx';
import type { SearchResult } from '../../types.ts';

interface Tab {
    id: number;
    url: string;
    title: string;
    active: boolean;
    loading: boolean;
    data?: any;
    mode: SearchMode;
    error?: string;
    searchResults?: SearchResult[];
}

type SearchMode = 'web' | 'pyai' | 'image' | 'video' | 'forum' | 'maps' | 'market' | 'ext' | 'settings';

interface PysrchBrowserProps {
    initialUrl?: string | null;
}

const PysrchBrowser: React.FC<PysrchBrowserProps> = ({ initialUrl }) => {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: 1, url: 'techcrunch.com', title: 'TechCrunch', active: true, loading: false, mode: 'web' }
    ]);
    const [incognito, setIncognito] = useState(false);
    const [urlInput, setUrlInput] = useState('techcrunch.com');
    const [isWifiConnected, setIsWifiConnected] = useState(true);

    const activeTab = tabs.find(t => t.active) || tabs[0];

    // Handle deep linking from external components (e.g., VPS web admin)
    useEffect(() => {
        if (initialUrl) {
            const newId = Date.now();
            const newTab: Tab = { 
                id: newId, 
                url: initialUrl, 
                title: 'Loading...', 
                active: true, 
                loading: false, 
                mode: 'web' 
            };
            setTabs(prev => prev.map(t => ({ ...t, active: false })).concat(newTab));
        }
    }, [initialUrl]);

    // Trigger navigation when activeTab changes to a state that needs loading
    useEffect(() => {
        if (activeTab && !activeTab.loading && activeTab.url) {
            if (!activeTab.data && !activeTab.searchResults && !activeTab.error && activeTab.mode !== 'pyai') {
                handleNavigate(activeTab.id, activeTab.url);
            }
        }
    }, [activeTab?.id, activeTab?.url, activeTab?.mode, activeTab?.data]);

    useEffect(() => {
        setUrlInput(activeTab?.url || '');
    }, [activeTab?.id]);

    const createTab = () => {
        const newId = Date.now();
        const newTab: Tab = { id: newId, url: '', title: 'New Tab', active: true, loading: false, mode: 'web' };
        setTabs(prev => prev.map(t => ({ ...t, active: false })).concat(newTab));
    };

    const closeTab = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (tabs.length === 1) return; // Keep at least one tab
        const newTabs = tabs.filter(t => t.id !== id);
        if (activeTab.id === id) {
            newTabs[newTabs.length - 1].active = true;
        }
        setTabs(newTabs);
    };

    const switchTab = (id: number) => {
        setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
    };

    const updateTab = (id: number, updates: Partial<Tab>) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const speakPage = () => {
        if (!activeTab.data) return;
        const textToRead = `${activeTab.data.siteName}. ${activeTab.data.heroHeadline}. ${activeTab.data.heroSubtext}`;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToRead);
            window.speechSynthesis.speak(utterance);
        } else {
            alert("TTS not supported");
        }
    };

    const handleNavigate = async (tabId: number, urlStr: string) => {
        if (!urlStr) return;
        
        setUrlInput(urlStr);
        updateTab(tabId, { loading: true, url: urlStr, title: urlStr, error: undefined, searchResults: undefined });
        const formattedUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;

        // Intercept VPS Admin IPs
        if (urlStr.includes('10.10.') || urlStr.includes(':8443')) {
            setTimeout(() => {
                const data = {
                    siteName: "PyCom Server Admin",
                    heroHeadline: "VPS Dashboard",
                    heroSubtext: "Connected via PyCom Secure Tunnel",
                    isVpsAdmin: true,
                    ip: urlStr.split(':')[0].replace('https://', '')
                };
                updateTab(tabId, { loading: false, data, title: 'VPS Admin' });
            }, 1000);
            return;
        }

        // Handle different search modes simulation
        if (activeTab.mode !== 'web' && activeTab.mode !== 'pyai' && activeTab.mode !== 'settings') {
             setTimeout(() => {
                 const results = generateMockResults(urlStr, activeTab.mode);
                 updateTab(tabId, { loading: false, searchResults: results, title: `${urlStr} - Pysrch ${activeTab.mode}` });
             }, 1500);
             return;
        }

        try {
            if (process.env.API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Render homepage for: ${formattedUrl}`,
                    config: {
                        responseMimeType: "application/json",
                        systemInstruction: `You are a web browser engine. Return ONLY a valid JSON object: { "siteName": "String", "heroHeadline": "String", "heroSubtext": "String", "heroImageKeyword": "String", "articles": [{ "title": "String", "summary": "String", "category": "String", "date": "String" }] }`
                    }
                });
                const text = result.text || "";
                const data = JSON.parse(text);
                updateTab(tabId, { loading: false, data, title: data.siteName });
            } else {
                throw new Error("API Key Missing");
            }
        } catch (err: any) {
             setTimeout(() => {
                 const data = {
                    siteName: urlStr,
                    heroHeadline: `Welcome to ${urlStr}`,
                    heroSubtext: "This page is generated by Pysrch Browser Simulation.",
                    heroImageKeyword: "technology",
                    articles: [
                        { title: "Latest Tech Trends", summary: "Exploring the future of AI.", category: "Tech", date: "Today" },
                        { title: "Coding Best Practices", summary: "How to write clean Python code.", category: "Dev", date: "Yesterday" }
                    ]
                };
                updateTab(tabId, { loading: false, data, title: urlStr });
            }, 1000);
        }
    };

    const generateMockResults = (query: string, mode: SearchMode): SearchResult[] => {
        const baseResults = Array.from({length: 8});
        switch(mode) {
            case 'image': return baseResults.map((_, i) => ({ title: `${query} Img ${i+1}`, url: '#', snippet: '', type: 'image', meta: { image: `https://source.unsplash.com/400x300/?${query},${i}` } }));
            case 'video': return baseResults.map((_, i) => ({ title: `${query} Tut ${i+1}`, url: '#', snippet: 'Watch guide...', type: 'video', meta: { duration: '10:00', views: '10k views' } }));
            case 'forum': return baseResults.map((_, i) => ({ title: `Help with ${query}`, url: '#', snippet: `Issue with ${query}...`, type: 'forum', meta: { replies: 12 } }));
            case 'maps': return baseResults.map((_, i) => ({ title: `${query} Place ${i+1}`, url: '#', snippet: '123 Tech St', type: 'web', rank: i + 1 }));
            default: return [];
        }
    };

    const handleSearchMode = (mode: SearchMode) => {
        updateTab(activeTab.id, { mode, data: null, searchResults: undefined });
    };

    const renderContent = (tab: Tab) => {
        if (tab.mode === 'pyai') return <PyAIView />;
        if (tab.loading) return <div className="flex flex-col items-center justify-center h-full bg-white/5"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div><p className="text-gray-500 font-mono text-sm">Loading...</p></div>;
        if (tab.error) return <div className="flex flex-col items-center justify-center h-full text-gray-400"><ShieldCheckIcon className="w-16 h-16 mb-4 text-red-500" /><p>{tab.error}</p></div>;
        if (tab.searchResults) return <SearchResultsView results={tab.searchResults} mode={tab.mode} query={tab.url} />;
        if (!tab.data) return <div className="flex flex-col items-center justify-center h-full text-gray-400"><GlobeAltIcon className="w-16 h-16 mb-4 opacity-20" /><p>Enter URL</p></div>;
        if (tab.data.isVpsAdmin) return <VPSAdminView data={tab.data} />;

        return (
            <div className={`font-sans h-full overflow-y-auto ${incognito ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}>
                <div className="bg-gray-100 border-b border-gray-200 p-2 flex items-center justify-center gap-4">
                    <span className="text-[10px] text-gray-400 uppercase font-bold border border-gray-300 px-1 rounded">Ad</span>
                    <span className="text-sm text-gray-600">Build like this? <a href="#" className="text-blue-600 hover:underline font-bold">Deploy on PyCom Cloud</a></span>
                </div>
                <header className={`border-b p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm ${incognito ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <div className="font-bold text-xl">{tab.data.siteName}</div>
                    <nav className="space-x-4 text-sm opacity-70 hidden sm:block">
                        <span>News</span><span>About</span><span>Contact</span>
                    </nav>
                </header>
                <section className={`p-12 text-center border-b ${incognito ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
                    <h1 className="text-4xl font-extrabold mb-4">{tab.data.heroHeadline}</h1>
                    <p className="text-xl opacity-80 max-w-2xl mx-auto">{tab.data.heroSubtext}</p>
                    {tab.data.heroImageKeyword && <div className="mt-8 mx-auto w-full max-w-3xl h-64 bg-gray-200 rounded-xl shadow-lg overflow-hidden"><img src={`https://source.unsplash.com/800x400/?${tab.data.heroImageKeyword}`} alt="Hero" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>}
                </section>
                <section className="max-w-4xl mx-auto p-8">
                    <div className="grid grid-cols-1 gap-6">
                        {tab.data.articles?.map((article: any, idx: number) => (
                            <div key={idx} className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${incognito ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                                <div className="flex justify-between items-start mb-2"><span className="text-xs font-bold text-purple-600 uppercase tracking-wide">{article.category}</span><span className="text-xs opacity-50">{article.date}</span></div>
                                <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                <p className="opacity-70">{article.summary}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    };

    return (
        <div className={`h-full flex flex-col rounded-xl overflow-hidden border shadow-2xl transition-colors duration-500 ${incognito ? 'bg-slate-900 border-purple-900' : 'bg-slate-100 border-slate-300'}`}>
            <div className={`flex items-center px-2 pt-2 gap-1 ${incognito ? 'bg-black' : 'bg-slate-200'}`}>
                {tabs.map(tab => (
                    <div key={tab.id} onClick={() => switchTab(tab.id)} className={`group relative flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-medium cursor-pointer transition-colors max-w-[150px] ${tab.active ? (incognito ? 'bg-slate-800 text-white' : 'bg-white text-slate-800') : (incognito ? 'bg-transparent text-slate-500 hover:bg-slate-900' : 'bg-transparent text-slate-500 hover:bg-slate-300')}`}>
                        {incognito && <EyeSlashIcon className="w-3 h-3" />}
                        {tab.loading && <div className="animate-spin h-3 w-3 border-2 border-purple-500 border-t-transparent rounded-full"></div>}
                        <span className="truncate">{tab.title || 'New Tab'}</span>
                        <button onClick={(e) => closeTab(tab.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 ml-1"><XMarkIcon className="w-3 h-3" /></button>
                    </div>
                ))}
                <button onClick={createTab} className="p-1 hover:bg-slate-400/20 rounded" title="New Tab"><PlusIcon className="w-4 h-4 text-slate-500" /></button>
            </div>

            <div className={`p-3 flex items-center gap-3 border-b ${incognito ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex gap-2 text-slate-400">
                    <button className="hover:text-purple-500" title="Back"><ArrowLeftIcon className="w-4 h-4" /></button>
                    <button className="hover:text-purple-500" title="Forward"><ArrowRightIcon className="w-4 h-4" /></button>
                    <button className="hover:text-purple-500" onClick={() => handleNavigate(activeTab.id, activeTab.url)} title="Refresh"><ArrowPathIcon className="w-4 h-4" /></button>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleNavigate(activeTab.id, urlInput); }} className="flex-grow relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${incognito ? 'text-purple-400' : 'text-slate-400'}`}>
                        {incognito ? <EyeSlashIcon className="w-4 h-4" /> : <LockClosedIcon className="w-4 h-4" />}
                    </div>
                    <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className={`w-full rounded-full py-1.5 pl-9 pr-20 text-sm focus:outline-none font-mono ${incognito ? 'bg-slate-900 text-white border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'}`} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 items-center">
                        <button type="button" onClick={speakPage} className="text-slate-400 hover:text-purple-500 p-1" title="Read Page Aloud">
                            <SpeakerWaveIcon className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setIsWifiConnected(!isWifiConnected)} className={`text-xs font-bold px-2 rounded flex items-center gap-1 ${isWifiConnected ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`} title={isWifiConnected ? "VPN Secured" : "Unsecured"}>
                            <WifiIcon className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                <button onClick={() => setIncognito(!incognito)} className={`p-2 rounded-full transition-all ${incognito ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`} title="Toggle Incognito">
                    <EyeSlashIcon className="w-4 h-4" />
                </button>
            </div>

            <div className={`flex gap-4 px-4 py-2 text-xs font-semibold border-b overflow-x-auto scrollbar-hide ${incognito ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-600'}`}>
                <ModeButton mode="web" label="Web" icon={<GlobeAltIcon className="w-3 h-3" />} active={activeTab.mode === 'web'} onClick={handleSearchMode} />
                <ModeButton mode="pyai" label="PyAI" icon={<SparklesIcon className="w-3 h-3" />} active={activeTab.mode === 'pyai'} onClick={handleSearchMode} />
                <ModeButton mode="image" label="Image" icon={<PhotoIcon className="w-3 h-3" />} active={activeTab.mode === 'image'} onClick={handleSearchMode} />
                <ModeButton mode="video" label="Video" icon={<VideoCameraIcon className="w-3 h-3" />} active={activeTab.mode === 'video'} onClick={handleSearchMode} />
                <ModeButton mode="forum" label="Forums" icon={<UserGroupIcon className="w-3 h-3" />} active={activeTab.mode === 'forum'} onClick={handleSearchMode} />
                <ModeButton mode="maps" label="Maps" icon={<MapIcon className="w-3 h-3" />} active={activeTab.mode === 'maps'} onClick={handleSearchMode} />
                <ModeButton mode="market" label="Market" icon={<ShoppingBagIcon className="w-3 h-3" />} active={activeTab.mode === 'market'} onClick={handleSearchMode} />
                <ModeButton mode="ext" label="Extensions" icon={<PuzzlePieceIcon className="w-3 h-3" />} active={activeTab.mode === 'ext'} onClick={handleSearchMode} />
                <ModeButton mode="settings" label="Settings" icon={<CogIcon className="w-3 h-3" />} active={activeTab.mode === 'settings'} onClick={handleSearchMode} />
            </div>

            <div className="flex-grow relative overflow-hidden">
                {renderContent(activeTab)}
            </div>
        </div>
    );
};

const ModeButton: React.FC<{ mode: SearchMode, label: string, icon: any, active: boolean, onClick: (m: SearchMode) => void }> = ({ mode, label, icon, active, onClick }) => (
    <button onClick={() => onClick(mode)} className={`flex items-center gap-1 pb-1 border-b-2 transition-colors whitespace-nowrap ${active ? 'text-purple-500 border-purple-500' : 'border-transparent hover:text-purple-400'}`} title={`Switch to ${label} Mode`}>
        {icon} {label}
    </button>
);

const SearchResultsView: React.FC<{ results: SearchResult[], mode: SearchMode, query: string }> = ({ results, mode, query }) => {
    const resultsWithAd: SearchResult[] = [{ title: "Sponsored: PyCom Cloud Hosting", url: "pycom.io/cloud", snippet: "Deploy Python apps instantly.", type: 'ad' } as unknown as SearchResult, ...results];
    
    if (mode === 'image') return <div className="p-6 bg-slate-50 h-full overflow-y-auto"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{resultsWithAd.map((res, i) => <div key={i} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"><div className="h-40 bg-gray-200">{res.meta?.image ? <img src={res.meta?.image} className="w-full h-full object-cover" /> : <PhotoIcon className="w-8 h-8 m-auto mt-12 text-gray-400"/>}</div><div className="p-2"><p className="text-xs font-semibold truncate">{res.title}</p></div></div>)}</div></div>;
    
    if (mode === 'video') return <div className="p-6 bg-slate-50 h-full overflow-y-auto"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{resultsWithAd.map((res, i) => <div key={i} className="bg-white rounded-lg shadow overflow-hidden group cursor-pointer"><div className="h-48 bg-gray-800 flex items-center justify-center"><VideoCameraIcon className="w-12 h-12 text-white opacity-50" /></div><div className="p-4"><h3 className="font-bold text-slate-800">{res.title}</h3><p className="text-xs text-slate-500">{res.snippet}</p></div></div>)}</div></div>;

    if (mode === 'forum') return <div className="p-6 bg-slate-50 h-full overflow-y-auto"><div className="space-y-4 max-w-4xl mx-auto">{resultsWithAd.map((res, i) => <div key={i} className="bg-white p-4 rounded-lg shadow-sm border hover:border-blue-400 cursor-pointer"><h3 className="text-lg font-bold text-blue-600">{res.title}</h3><p className="text-sm text-slate-600">{res.snippet}</p></div>)}</div></div>;

    if (mode === 'maps') return <div className="h-full relative bg-slate-200 overflow-hidden flex items-center justify-center"><div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div><p className="text-2xl font-bold text-slate-400 z-10">Map View Placeholder</p>{results.map((res, i) => <div key={i} className="absolute flex flex-col items-center hover:scale-110 transition-transform" style={{top: `${20+Math.random()*60}%`, left: `${20+Math.random()*60}%`}}><MapPinIcon className="w-8 h-8 text-red-500 drop-shadow-lg" /></div>)}</div>;

    return <div>Unknown Mode</div>;
}

const PyAIView = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            if (process.env.API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: query });
                setResponse(result.text || "No response.");
            } else {
                setResponse("API Key not available.");
            }
        } catch (e) { setResponse("Error connecting to PyAI."); } finally { setLoading(false); }
    };

    return (
        <div className="h-full bg-slate-50 p-8 flex flex-col items-center overflow-y-auto">
            <div className="max-w-2xl w-full space-y-6">
                <div className="text-center"><SparklesIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" /><h2 className="text-2xl font-bold text-slate-800">PyAI Search Mode</h2></div>
                <form onSubmit={handleAsk} className="relative"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask anything..." className="w-full p-4 pr-12 rounded-xl border border-slate-300 shadow-sm focus:outline-none focus:border-purple-500" /><button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">{loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <ArrowRightIcon className="w-5 h-5" />}</button></form>
                {response && <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm prose max-w-none"><p className="whitespace-pre-wrap text-slate-700">{response}</p></div>}
            </div>
        </div>
    );
};

const VPSAdminView: React.FC<{ data: any }> = ({ data }) => (
    <div className="h-full bg-slate-900 text-gray-200 font-mono flex flex-col overflow-hidden">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center shadow-md"><div className="flex items-center gap-3"><ServerIcon className="w-6 h-6 text-blue-500" /><div><h1 className="text-lg font-bold text-white">PyCom Server Admin</h1><div className="flex items-center gap-2 text-xs"><span className="text-green-400 flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> System Online</span><span className="text-slate-500">|</span><span className="text-slate-400">{data.ip}</span></div></div></div></div>
        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-slate-950 rounded-xl border border-slate-800 p-6"><h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><CpuChipIcon className="w-4 h-4" /> Real-time Metrics</h3><div className="space-y-6"><div><div className="flex justify-between text-xs mb-1"><span>CPU Load</span><span className="text-green-400">12%</span></div><div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[12%]"></div></div></div></div></div><div className="bg-slate-950 rounded-xl border border-slate-800 p-6"><h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><CubeIcon className="w-4 h-4" /> Active Containers</h3><div className="space-y-3"><div className="flex justify-between items-center p-3 bg-slate-900 rounded border border-slate-800"><span className="text-sm font-bold">nginx_proxy</span><span className="text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded">Running</span></div></div></div><div className="lg:col-span-2 bg-black rounded-xl border border-slate-800 p-4 font-mono text-xs h-64 overflow-y-auto"><div className="flex items-center gap-2 text-slate-500 mb-2 border-b border-slate-800 pb-2"><TerminalIcon className="w-4 h-4" /><span>System Logs</span></div><div className="space-y-1 text-gray-300"><div>[KERNEL] Linux pycom-vps 5.15.0-76-generic #83-Ubuntu SMP</div><div className="animate-pulse text-purple-400">_</div></div></div></div>
    </div>
);

export default PysrchBrowser;