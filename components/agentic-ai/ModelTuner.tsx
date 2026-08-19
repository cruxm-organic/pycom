
import React, { useState } from 'react';
import { BeakerIcon, SparklesIcon, CheckCircleIcon, ArrowPathIcon } from '../Icons.tsx';

const ModelTuner: React.FC = () => {
    const [systemPrompt, setSystemPrompt] = useState(`You are a senior data analyst AI. 
Your goal is to extract actionable insights from unstructured data.
Always cite your sources. Format output as JSON.`);
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [isTesting, setIsTesting] = useState(false);
    const [testOutput, setTestOutput] = useState('');

    const handleTestRun = () => {
        setIsTesting(true);
        setTestOutput('');
        setTimeout(() => {
            setIsTesting(false);
            setTestOutput(`{
  "insight": "Revenue grew by 15% QoQ",
  "confidence": 0.92,
  "source": "Q3_Financials.csv"
}`);
        }, 1500);
    };

    return (
        <div className="h-full bg-slate-950 flex flex-col border-r border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <BeakerIcon className="w-6 h-6 text-purple-500" />
                    Model Instruction Tuner
                </h2>
                <p className="text-slate-400 text-sm mt-1">Fine-tune agent behavior and parameters.</p>
            </div>

            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">System Instruction (Prompt)</label>
                    <textarea 
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-blue-300 focus:outline-none focus:border-purple-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-300">Temperature</label>
                            <span className="text-xs text-purple-400 font-mono">{temperature}</span>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>Precise</span>
                            <span>Creative</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-300">Max Tokens</label>
                            <span className="text-xs text-blue-400 font-mono">{maxTokens}</span>
                        </div>
                        <input 
                            type="range" min="256" max="8192" step="256" 
                            value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white">Test Configuration</h3>
                        <button 
                            onClick={handleTestRun}
                            disabled={isTesting}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {isTesting ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                            Run Test
                        </button>
                    </div>
                    <div className="bg-black rounded-xl border border-slate-800 p-4 min-h-[150px] relative">
                        <div className="absolute top-2 left-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Output Preview</div>
                        {testOutput ? (
                            <pre className="mt-4 font-mono text-sm text-green-400 whitespace-pre-wrap">{testOutput}</pre>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-600 italic text-sm mt-4">
                                Run a test to see model output...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelTuner;
