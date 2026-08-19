
import React, { useState, useRef } from 'react';
import { 
    TableCellsIcon, ChartPieIcon, CloudArrowUpIcon, 
    MagnifyingGlassIcon, SparklesIcon, PresentationChartLineIcon,
    BoltIcon, TrashIcon, ArrowDownIcon, DocumentArrowDownIcon,
    PlusIcon, CheckCircleIcon, PlayIcon, ClockIcon, CloudArrowDownIcon,
    FunnelIcon, ArrowPathIcon, CubeIcon, CodeBracketIcon, RobotIcon
} from '../Icons.tsx';
import type { Dataset, BigDataQuery } from '../../types.ts';

type View = 'explore' | 'etl' | 'manager';

const BigDataTool: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('explore');
    const [datasets, setDatasets] = useState<Dataset[]>([
        { id: '1', name: 'Global Sales Q3', source: 'Snowflake', rows: 150420, columns: ['Region', 'Product', 'Revenue', 'Date'] },
        { id: '2', name: 'User Churn Prediction', source: 'CSV Upload', rows: 5400, columns: ['User_ID', 'Last_Login', 'Churn_Prob', 'Plan'] },
        { id: '3', name: 'daily_sales_leads_report.csv', source: 'Agent: Sales Director', rows: 48, columns: ['name', 'address', 'phone', 'website', 'lead_score', 'industry'] }
    ]);
    
    // ETL State
    const [etlPrompt, setEtlPrompt] = useState('');
    const [etlSteps, setEtlSteps] = useState<string[]>([]);
    const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
    const [isRunningPipeline, setIsRunningPipeline] = useState(false);
    const [pipelineProgress, setPipelineProgress] = useState(0);
    const [etlSource, setEtlSource] = useState<string>(datasets[0]?.id || '');

    // Explore State
    const [activeDataset, setActiveDataset] = useState<Dataset | null>(datasets[0] || null);
    const [queryPrompt, setQueryPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [queryResult, setQueryResult] = useState<BigDataQuery | null>(null);

    // Manager State
    const [isUploading, setIsUploading] = useState(false);
    const [selectedCloudPath, setSelectedCloudPath] = useState('s3://pycom-datalake/raw/');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Helpers ---
    const handleDownload = (fileName: string, content: string, type: string = 'text/csv') => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // --- Data Manager Functions ---
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        // Simulate upload progress
        setTimeout(() => {
            const newDs: Dataset = {
                id: Date.now().toString(),
                name: file.name,
                source: `Upload to ${selectedCloudPath}`,
                rows: Math.floor(Math.random() * 50000) + 1000,
                columns: ['Column_A', 'Column_B', 'Value', 'Timestamp']
            };
            setDatasets([...datasets, newDs]);
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }, 2000);
    };

    const handleDeleteDataset = (id: string) => {
        setDatasets(datasets.filter(d => d.id !== id));
        if (activeDataset?.id === id) setActiveDataset(null);
    };

    // --- ETL Functions ---
    const generateEtlSteps = (e: React.FormEvent) => {
        e.preventDefault();
        if (!etlPrompt.trim()) return;
        setIsGeneratingSteps(true);
        
        setTimeout(() => {
            const steps = [
                `# Step 1: Load Data\ndf = pd.read_csv('${datasets.find(d => d.id === etlSource)?.name}')`,
                `# Step 2: AI Transformation\n${etlPrompt.split(' ').slice(0, 3).join('_')}_clean(df)`,
                `# Step 3: Removing Nulls\ndf.dropna(inplace=True)`,
                `# Step 4: Export\ndf.to_csv('processed_output.csv')`
            ];
            setEtlSteps(steps);
            setIsGeneratingSteps(false);
        }, 1500);
    };

    const runEtlPipeline = () => {
        setIsRunningPipeline(true);
        setPipelineProgress(0);
        
        const interval = setInterval(() => {
            setPipelineProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsRunningPipeline(false);
                        const newDs: Dataset = {
                            id: Date.now().toString(),
                            name: `Cleaned_${datasets.find(d => d.id === etlSource)?.name}`,
                            source: 'AI ETL Pipeline',
                            rows: Math.floor((datasets.find(d => d.id === etlSource)?.rows || 1000) * 0.9), // Removed some rows
                            columns: datasets.find(d => d.id === etlSource)?.columns || []
                        };
                        setDatasets(prev => [...prev, newDs]);
                        setEtlSteps([]);
                        setEtlPrompt('');
                        alert("Pipeline completed successfully! New dataset created.");
                    }, 500);
                    return 100;
                }
                return prev + 20;
            });
        }, 800);
    };

    // --- Explore Functions ---
    const handleQuery = (e: React.FormEvent) => {
        e.preventDefault();
        if (!queryPrompt.trim() || !activeDataset) return;

        setIsAnalyzing(true);
        setQueryResult(null);

        setTimeout(() => {
            setQueryResult({
                id: Date.now().toString(),
                prompt: queryPrompt,
                sql: `SELECT ${activeDataset.columns[0]}, SUM(${activeDataset.columns[2]}) \nFROM ${activeDataset.name} \nGROUP BY ${activeDataset.columns[0]} \nLIMIT 5;`,
                result: [
                    { [activeDataset.columns[0]]: 'Segment A', [activeDataset.columns[2]]: 45000 },
                    { [activeDataset.columns[0]]: 'Segment B', [activeDataset.columns[2]]: 32000 },
                    { [activeDataset.columns[0]]: 'Segment C', [activeDataset.columns[2]]: 28000 },
                    { [activeDataset.columns[0]]: 'Segment D', [activeDataset.columns[2]]: 15000 },
                    { [activeDataset.columns[0]]: 'Segment E', [activeDataset.columns[2]]: 12000 },
                ],
                chartType: 'bar'
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-900/20 p-2 rounded-lg">
                        <TableCellsIcon className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white leading-none">Big Data Studio</h2>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">AI-Powered ETL & Analytics</p>
                    </div>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setActiveView('explore')} title="Interactive data exploration" className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeView === 'explore' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>Explorer</button>
                    <button onClick={() => setActiveView('etl')} title="Design transformation pipelines" className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeView === 'etl' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>ETL Studio</button>
                    <button onClick={() => setActiveView('manager')} title="Manage your datasets" className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeView === 'manager' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'}`}>Data Manager</button>
                </div>
            </div>

            <div className="flex-grow overflow-hidden bg-slate-950 relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                
                {/* === EXPLORE VIEW === */}
                {activeView === 'explore' && (
                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-slate-800 p-4 bg-slate-900/50 flex flex-col">
                            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Select Dataset</h3>
                            <div className="space-y-2 overflow-y-auto flex-grow">
                                {datasets.map(ds => (
                                    <button
                                        key={ds.id}
                                        onClick={() => setActiveDataset(ds)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                                            activeDataset?.id === ds.id 
                                            ? 'bg-blue-900/20 border-blue-500 text-white' 
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                                        }`}
                                        title={`Source: ${ds.source}`}
                                    >
                                        <div className="font-bold text-sm truncate">{ds.name}</div>
                                        <div className="text-[10px] opacity-70 mt-1">{ds.rows.toLocaleString()} rows</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Explorer */}
                        <div className="flex-grow p-6 overflow-y-auto">
                            {!activeDataset ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                    <MagnifyingGlassIcon className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Select a dataset to analyze</p>
                                </div>
                            ) : (
                                <div className="space-y-6 max-w-4xl mx-auto">
                                    <form onSubmit={handleQuery} className="relative">
                                        <input 
                                            type="text" 
                                            value={queryPrompt}
                                            onChange={(e) => setQueryPrompt(e.target.value)}
                                            placeholder={`Ask about ${activeDataset.name}... (e.g., "Show revenue by region")`}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-32 text-white focus:outline-none focus:border-blue-500 shadow-lg"
                                        />
                                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                                        <button 
                                            type="submit" 
                                            disabled={isAnalyzing || !queryPrompt}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                                            title="Generate SQL Query and Visualization"
                                        >
                                            <SparklesIcon className="w-4 h-4" />
                                            Analyze
                                        </button>
                                    </form>

                                    {isAnalyzing && (
                                        <div className="p-8 text-center animate-pulse">
                                            <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto mb-2"></div>
                                            <p className="text-blue-400 text-sm">Generating SQL & Visuals...</p>
                                        </div>
                                    )}

                                    {queryResult && !isAnalyzing && (
                                        <div className="space-y-6 animate-fade-in-up">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-bold text-white flex items-center gap-2">
                                                            <PresentationChartLineIcon className="w-5 h-5 text-purple-400" />
                                                            Visualization
                                                        </h4>
                                                        <button className="text-slate-500 hover:text-white" title="Download Chart Image"><ArrowDownIcon className="w-4 h-4" /></button>
                                                    </div>
                                                    <div className="h-64 flex items-end justify-around gap-2 px-4 pb-4 border-b border-l border-slate-700">
                                                        {queryResult.result.map((row, idx) => (
                                                            <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                                                                <div 
                                                                    className="w-full bg-blue-600/80 rounded-t hover:bg-blue-500 transition-all relative"
                                                                    style={{ height: `${(Object.values(row)[1] as number) / 500}%` }}
                                                                    title={`${Object.values(row)[0]}: ${Object.values(row)[1]}`}
                                                                ></div>
                                                                <span className="text-[10px] text-slate-400 truncate w-full text-center">{Object.values(row)[0] as React.ReactNode}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                                                    <h4 className="font-bold text-white mb-4">Data & Export</h4>
                                                    <div className="flex-grow overflow-y-auto mb-4">
                                                        <table className="w-full text-xs text-left text-slate-300">
                                                            <tbody>
                                                                {queryResult.result.map((row, idx) => (
                                                                    <tr key={idx} className="border-b border-slate-800">
                                                                        <td className="py-2">{Object.values(row)[0] as React.ReactNode}</td>
                                                                        <td className="py-2 text-right font-mono text-blue-400">{Object.values(row)[1] as React.ReactNode}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDownload('query_results.csv', JSON.stringify(queryResult.result))}
                                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2"
                                                        title="Export raw data as CSV"
                                                    >
                                                        <DocumentArrowDownIcon className="w-4 h-4" /> Download CSV
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-black/30 border border-slate-800 rounded-lg p-4 font-mono text-xs">
                                                <span className="text-slate-500 block mb-1"># Generated SQL</span>
                                                <span className="text-green-400">{queryResult.sql}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* === ETL VIEW === */}
                {activeView === 'etl' && (
                    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* ETL Configuration */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <BoltIcon className="w-5 h-5 text-yellow-400" />
                                        Pipeline Configuration
                                    </h3>
                                    
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Source Dataset</label>
                                    <select 
                                        value={etlSource}
                                        onChange={(e) => setEtlSource(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none mb-6"
                                    >
                                        {datasets.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>

                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Transformation Goal</label>
                                    <textarea 
                                        value={etlPrompt}
                                        onChange={(e) => setEtlPrompt(e.target.value)}
                                        placeholder="Describe steps... e.g. 'Drop rows with null emails, clean phone numbers, and calculate ROI'"
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-32 resize-none mb-4"
                                    />
                                    
                                    <button 
                                        onClick={generateEtlSteps}
                                        disabled={isGeneratingSteps || !etlPrompt}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                        title="Use AI to generate Python code for your transformation"
                                    >
                                        {isGeneratingSteps ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
                                        {isGeneratingSteps ? 'Generating Code...' : 'Generate Steps'}
                                    </button>
                                </div>
                            </div>

                            {/* ETL Preview & Execution */}
                            <div className="space-y-6">
                                <div className="bg-black rounded-xl border border-slate-800 p-6 h-full flex flex-col">
                                    <h3 className="font-bold text-slate-400 uppercase text-xs mb-4 flex items-center gap-2">
                                        <CodeBracketIcon className="w-4 h-4" /> Generated Pipeline Code
                                    </h3>
                                    <div className="flex-grow font-mono text-sm text-green-400 overflow-y-auto space-y-2 mb-6">
                                        {etlSteps.length === 0 ? (
                                            <span className="text-slate-600 italic">Waiting for configuration...</span>
                                        ) : (
                                            etlSteps.map((step, i) => (
                                                <div key={i} className="border-b border-slate-800 pb-2 mb-2">
                                                    {step.split('\n').map((line, l) => <div key={l}>{line}</div>)}
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {isRunningPipeline ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-white">
                                                <span>Executing Pipeline...</span>
                                                <span>{pipelineProgress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-800 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full transition-all duration-200" style={{ width: `${pipelineProgress}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={runEtlPipeline}
                                            disabled={etlSteps.length === 0}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-slate-800"
                                            title="Execute code and create new dataset"
                                        >
                                            <PlayIcon className="w-5 h-5" /> Run Pipeline
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* === MANAGER VIEW === */}
                {activeView === 'manager' && (
                    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="text-2xl font-bold text-white">Data Asset Manager</h2>
                            <div className="flex gap-2">
                                <select 
                                    value={selectedCloudPath}
                                    onChange={(e) => setSelectedCloudPath(e.target.value)}
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                                >
                                    <option>s3://pycom-datalake/raw/</option>
                                    <option>s3://pycom-datalake/processed/</option>
                                    <option>gs://bigquery-staging/</option>
                                </select>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept=".csv,.json,.parquet"
                                />
                                <button 
                                    onClick={handleUploadClick}
                                    disabled={isUploading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 text-sm"
                                    title="Upload Local CSV/JSON to Cloud"
                                >
                                    {isUploading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CloudArrowUpIcon className="w-4 h-4" />}
                                    {isUploading ? 'Uploading...' : 'Upload Dataset'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {datasets.map(ds => (
                                <div key={ds.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-colors group relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-slate-800 rounded-lg relative">
                                            <TableCellsIcon className="w-8 h-8 text-blue-400" />
                                            {ds.source.includes('Agent') && (
                                                <div className="absolute -top-1 -right-1">
                                                    <RobotIcon className="w-4 h-4 text-purple-500 bg-slate-900 rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleDownload(ds.name, 'sample data', 'text/csv')}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300" 
                                                title="Download Data"
                                            >
                                                <CloudArrowDownIcon className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteDataset(ds.id)}
                                                className="p-2 bg-slate-800 hover:bg-red-900/50 rounded-full text-red-400" 
                                                title="Delete Data"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-white text-lg mb-1 truncate" title={ds.name}>{ds.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4">{ds.source}</p>
                                    
                                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-4">
                                        <span className="flex items-center gap-1"><CubeIcon className="w-3 h-3" /> {ds.rows.toLocaleString()} Rows</span>
                                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {new Date().toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BigDataTool;
