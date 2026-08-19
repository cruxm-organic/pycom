
import React, { useState, useRef, useEffect } from 'react';
import { 
    CodeBracketIcon, PlayIcon, TerminalIcon, CubeTransparentIcon, 
    MagnifyingGlassIcon, CheckCircleIcon, SparklesIcon, CloudArrowDownIcon
} from '../Icons.tsx';

const PACKAGES = [
    { id: 'django', name: 'Django', version: '5.0', desc: 'High-level Python Web framework.' },
    { id: 'flask', name: 'Flask', version: '3.0', desc: 'Lightweight WSGI web application framework.' },
    { id: 'fastapi', name: 'FastAPI', version: '0.109', desc: 'Modern, fast (high-performance) web framework.' },
    { id: 'pandas', name: 'Pandas', version: '2.2', desc: 'Data analysis and manipulation tool.' },
    { id: 'numpy', name: 'NumPy', version: '1.26', desc: 'Fundamental package for array computing.' },
    { id: 'pytorch', name: 'PyTorch', version: '2.1', desc: 'Tensors and Dynamic neural networks.' },
    { id: 'tensorflow', name: 'TensorFlow', version: '2.15', desc: 'End-to-end machine learning platform.' },
    { id: 'scikit-learn', name: 'scikit-learn', version: '1.4', desc: 'Simple and efficient tools for predictive data analysis.' },
    { id: 'requests', name: 'Requests', version: '2.31', desc: 'Elegant and simple HTTP library for Python.' },
    { id: 'sqlalchemy', name: 'SQLAlchemy', version: '2.0', desc: 'The Python SQL Toolkit and Object Relational Mapper.' },
];

const AgentIDE: React.FC = () => {
    const [activeFile, setActiveFile] = useState('sales_automation.py');
    const [code, setCode] = useState(`# ===============================================
# SCRIPT 1: EXTRACTION (E in ETL)
# ===============================================

import requests
import pandas as pd
import json

def extract_leads_from_google(query, location):
    """
    Calls a third-party scraping API to get structured Google Maps data.
    """
    # Example using a conceptual API service
    api_url = "api.scraperprovider.com"
    params = {
        'q': f"{query} in {location}",
        'api_key': 'YOUR_API_KEY',
        'limit': 100
    }
    
    # Simulating API call
    print(f"Extracting leads for '{query}' in '{location}'...")
    return [{"name": "TechSol", "rating": 4.8, "reviews": 120, "website": "techsol.io", "phone": "+1-555-0102"}]

# ===============================================
# SCRIPT 2: TRANSFORM & MINE (T in ETL)
# ===============================================

def transform_and_clean_data(raw_data):
    """
    Cleans, standardizes, and mines the data using Pandas.
    """
    df = pd.DataFrame(raw_data)
    
    # --- Data Mining/Enrichment ---
    def score_lead(row):
        if row['rating'] >= 4.5 and row['reviews'] > 50:
            return 'Hot'
        else:
            return 'Warm/Cold'

    df['lead_score'] = df.apply(score_lead, axis=1)
    
    # Select final columns for the database schema
    print(f"Cleaned down to {len(df)} valid leads.")
    return df

# ===============================================
# SCRIPT 3: LOAD (L in ETL) AND REPORTING
# ===============================================

def generate_report(dataframe):
    """Generates the downloadable report (CSV)."""
    report_path = "daily_sales_leads_report.csv"
    # dataframe.to_csv(report_path, index=False)
    print(f"Report generated and saved to {report_path}")

# ===============================================
# MAIN AUTOMATION FLOW
# ===============================================

if __name__ == "__main__":
    # 1. Run Extraction Step
    raw_data = extract_leads_from_google(query="IT Services", location="Mumbai")
    
    if raw_data:
        # 2. Run Transformation Step
        cleaned_leads_df = transform_and_clean_data(raw_data)
        
        # 3. Generate Reporting Step
        generate_report(cleaned_leads_df)
`);
    const [installedPackages, setInstalledPackages] = useState<string[]>(['pandas', 'requests']);
    const [terminalOutput, setTerminalOutput] = useState<string[]>(['pycom-env activated.', 'Ready.']);
    const [isInstalling, setIsInstalling] = useState<string | null>(null);
    const [sidebarTab, setSidebarTab] = useState<'files' | 'packages'>('files');
    const [vibeCodingActive, setVibeCodingActive] = useState(false);

    const handleInstall = (pkg: typeof PACKAGES[0]) => {
        if (installedPackages.includes(pkg.id)) return;
        setIsInstalling(pkg.id);
        setTerminalOutput(prev => [...prev, `> pip install ${pkg.name.toLowerCase()}`]);
        
        setTimeout(() => {
            setTerminalOutput(prev => [...prev, `Downloading ${pkg.name.toLowerCase()}-${pkg.version}...`, `Installing collected packages: ${pkg.name.toLowerCase()}`, `Successfully installed ${pkg.name.toLowerCase()}-${pkg.version}`]);
            setInstalledPackages(prev => [...prev, pkg.id]);
            setIsInstalling(null);
        }, 1500);
    };

    const handleRun = () => {
        setTerminalOutput(prev => [...prev, `> python ${activeFile}`, `Extracting leads for 'IT Services' in 'Mumbai'...`, `Cleaned down to 1 valid leads.`, `Report generated and saved to daily_sales_leads_report.csv`, '[Program finished with exit code 0]']);
    };

    const handleVibeCoding = () => {
        setVibeCodingActive(true);
        const fullCode = `import pandas as pd\nimport numpy as np\n\n# AI Generated Data Analysis Script\ndef analyze_data(data_source):\n    print(f"Loading data from {data_source}...")\n    # Simulating data load\n    df = pd.DataFrame(np.random.randint(0,100,size=(100, 4)), columns=list('ABCD'))\n    \n    print("Data Shape:", df.shape)\n    print("Summary Statistics:")\n    print(df.describe())\n    \n    return df\n\nif __name__ == "__main__":\n    analyze_data("sales_data.csv")`;
        
        let i = 0;
        setCode('');
        const interval = setInterval(() => {
            setCode(fullCode.substring(0, i));
            i++;
            if (i > fullCode.length) {
                clearInterval(interval);
                setVibeCodingActive(false);
            }
        }, 10);
    };

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] text-gray-300 rounded-xl overflow-hidden font-sans">
            {/* Top Bar */}
            <div className="h-10 bg-[#252526] flex items-center justify-between px-4 border-b border-[#333]">
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-400 font-bold">PyCom Agent IDE</span>
                    <span className="text-gray-500">/</span>
                    <span>{activeFile}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handleVibeCoding}
                        disabled={vibeCodingActive}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold transition-colors disabled:opacity-50"
                    >
                        <SparklesIcon className="w-3 h-3" /> Vibe Code
                    </button>
                    <button onClick={handleRun} className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold transition-colors">
                        <PlayIcon className="w-3 h-3" /> Run
                    </button>
                </div>
            </div>

            <div className="flex-grow flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-12 bg-[#333] flex flex-col items-center py-4 gap-4 border-r border-[#1e1e1e] shrink-0">
                    <button onClick={() => setSidebarTab('files')} className={`p-2 rounded ${sidebarTab === 'files' ? 'text-white bg-[#1e1e1e]' : 'text-gray-500 hover:text-white'}`}>
                        <CodeBracketIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setSidebarTab('packages')} className={`p-2 rounded ${sidebarTab === 'packages' ? 'text-white bg-[#1e1e1e]' : 'text-gray-500 hover:text-white'}`}>
                        <CubeTransparentIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="w-64 bg-[#252526] border-r border-[#333] flex flex-col">
                    <div className="p-2 text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-[#333]">
                        {sidebarTab === 'files' ? 'Explorer' : 'Package Manager'}
                    </div>
                    
                    {sidebarTab === 'files' && (
                        <div className="p-2">
                            <div className="flex items-center gap-2 px-2 py-1 bg-[#37373d] text-white rounded cursor-pointer text-sm">
                                <span className="text-blue-400">PY</span> {activeFile}
                            </div>
                        </div>
                    )}

                    {sidebarTab === 'packages' && (
                        <div className="flex-grow overflow-y-auto p-2 space-y-2">
                            {PACKAGES.map(pkg => (
                                <div key={pkg.id} className="bg-[#333] p-3 rounded border border-transparent hover:border-[#444] group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white text-sm">{pkg.name}</span>
                                        <span className="text-[10px] bg-[#1e1e1e] px-1.5 rounded text-gray-400">{pkg.version}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">{pkg.desc}</p>
                                    <button 
                                        onClick={() => handleInstall(pkg)}
                                        disabled={installedPackages.includes(pkg.id) || isInstalling === pkg.id}
                                        className={`w-full py-1 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${
                                            installedPackages.includes(pkg.id) 
                                            ? 'bg-green-900/30 text-green-400 cursor-default' 
                                            : isInstalling === pkg.id 
                                            ? 'bg-blue-600 text-white cursor-wait'
                                            : 'bg-[#007acc] text-white hover:bg-[#0062a3]'
                                        }`}
                                    >
                                        {installedPackages.includes(pkg.id) ? (
                                            <><CheckCircleIcon className="w-3 h-3" /> Installed</>
                                        ) : isInstalling === pkg.id ? (
                                            'Installing...'
                                        ) : (
                                            <><CloudArrowDownIcon className="w-3 h-3" /> Install</>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Code Editor Area */}
                <div className="flex-grow flex flex-col relative bg-[#1e1e1e]">
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-grow bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm p-4 resize-none outline-none leading-relaxed"
                        spellCheck={false}
                    />
                    
                    {/* Terminal Panel */}
                    <div className="h-48 bg-[#1e1e1e] border-t border-[#333] flex flex-col">
                        <div className="flex items-center px-4 py-1 bg-[#252526] border-b border-[#333] text-xs gap-4">
                            <span className="text-white border-b-2 border-white pb-1">TERMINAL</span>
                            <span className="text-gray-500">OUTPUT</span>
                            <span className="text-gray-500">DEBUG CONSOLE</span>
                        </div>
                        <div className="flex-grow p-4 font-mono text-xs overflow-y-auto">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className="text-gray-300 mb-1">{line}</div>
                            ))}
                            <div className="flex items-center text-gray-300">
                                <span className="mr-2">➜</span>
                                <span className="animate-pulse">_</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentIDE;