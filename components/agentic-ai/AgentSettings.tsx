
import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, QuestionMarkCircleIcon, CloudArrowUpIcon, CheckCircleIcon, BrainIcon, DatabaseIcon } from '../Icons.tsx';

const AgentSettings: React.FC = () => {
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.95);
    const [topK, setTopK] = useState(40);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [modelProvider, setModelProvider] = useState<'gemini' | 'huggingface'>('gemini');
    const [hfToken, setHfToken] = useState('');
    const [hfModel, setHfModel] = useState('meta-llama/Llama-2-70b-chat-hf');
    const [outputFormat, setOutputFormat] = useState('json');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call to PyCom Cloud
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const Tooltip: React.FC<{ text: string }> = ({ text }) => (
        <div className="group relative inline-block ml-2">
            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help" />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded bg-gray-800 p-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 border border-slate-600 z-10">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="bg-slate-900 p-6 border-b border-slate-800 shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <AdjustmentsHorizontalIcon className="w-7 h-7 text-gray-400" />
                    Advanced Agent Configuration
                </h2>
            </div>
            
            <div className="p-8 max-w-5xl overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column: Model & Inference */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <BrainIcon className="w-5 h-5 text-purple-400" />
                                Inference Engine
                            </h3>
                            
                            <div className="mb-4">
                                <label className="block text-slate-300 font-bold mb-2">Model Provider</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setModelProvider('gemini')}
                                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${modelProvider === 'gemini' ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <span className="font-bold text-sm">Google Gemini</span>
                                    </button>
                                    <button 
                                        onClick={() => setModelProvider('huggingface')}
                                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${modelProvider === 'huggingface' ? 'bg-yellow-600/20 border-yellow-500 text-white' : 'bg-slate-950 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <span className="font-bold text-sm">Hugging Face</span>
                                    </button>
                                </div>
                            </div>

                            {modelProvider === 'gemini' ? (
                                <div>
                                    <label className="block text-slate-300 font-bold mb-2 text-sm">Gemini Model Version</label>
                                    <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm">
                                        <option>Gemini 2.5 Pro (Reasoning)</option>
                                        <option>Gemini 2.5 Flash (Speed)</option>
                                        <option>Gemini 1.5 Pro (Legacy)</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in-up">
                                    <div>
                                        <label className="block text-slate-300 font-bold mb-2 text-sm">Hugging Face API Token</label>
                                        <input 
                                            type="password" 
                                            value={hfToken}
                                            onChange={(e) => setHfToken(e.target.value)}
                                            placeholder="hf_..."
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-yellow-500 outline-none text-sm font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 font-bold mb-2 text-sm">Model Endpoint / ID</label>
                                        <input 
                                            type="text" 
                                            value={hfModel}
                                            onChange={(e) => setHfModel(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-yellow-500 outline-none text-sm font-mono"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Temperature: {temperature}</label>
                                <Tooltip text="Controls randomness. Higher values (e.g., 0.8) make output more random, while lower values (e.g., 0.2) make it more focused and deterministic." />
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>Precise (0.0)</span>
                                <span>Creative (1.0)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Max Output Tokens: {maxTokens}</label>
                                <Tooltip text="The maximum number of tokens to generate in the response. Controls the length of the output." />
                            </div>
                            <input 
                                type="range" 
                                min="128" 
                                max="8192" 
                                step="128" 
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    {/* Right Column: Pipeline & System */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <DatabaseIcon className="w-5 h-5 text-green-400" />
                                Data Pipeline Output
                            </h3>
                            <p className="text-xs text-slate-400 mb-4">Configure how this agent structures its deliverables for the Big Data Engine.</p>
                            
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="outputFormat" 
                                        checked={outputFormat === 'json'} 
                                        onChange={() => setOutputFormat('json')}
                                        className="accent-green-500" 
                                    />
                                    <span className="text-sm font-mono text-white">JSON (Structured)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="outputFormat" 
                                        checked={outputFormat === 'csv'} 
                                        onChange={() => setOutputFormat('csv')}
                                        className="accent-green-500" 
                                    />
                                    <span className="text-sm font-mono text-white">CSV (Tabular / Excel)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="outputFormat" 
                                        checked={outputFormat === 'sql'} 
                                        onChange={() => setOutputFormat('sql')}
                                        className="accent-green-500" 
                                    />
                                    <span className="text-sm font-mono text-white">SQL Insert Statements</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Top P (Nucleus Sampling): {topP}</label>
                                <Tooltip text="Change how the model selects tokens. Top-P selects from the top P% probability mass. 0.95 is standard." />
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={topP}
                                onChange={(e) => setTopP(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-bold mb-2">System Prompt Override</label>
                            <textarea 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none h-40 font-mono text-sm"
                                placeholder="You are a helpful AI assistant..."
                                defaultValue="You are an autonomous agent capable of using tools to achieve business objectives. Always prioritize accuracy and efficiency. When generating data artifacts, ensure strict schema compliance for ETL pipelines."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-800 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || saved}
                        className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 ${
                            saved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Syncing to PyCom Cloud...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                Configuration Saved
                            </>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="w-5 h-5" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentSettings;
