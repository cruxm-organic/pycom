
import React, { useState } from 'react';
// Fix: Add .ts extension to module path
import { groundedSearch, complexReasoning } from '../../services/geminiLabService.ts';
// Fix: Add .ts extension to module path
import type { GroundingChunk } from '../../types.ts';
import { DownloadIcon } from '../Icons.tsx';

type ResearchTool = 'deep-dive' | 'web-search' | 'map-search';

const Researcher: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ResearchTool>('deep-dive');

    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [chunks, setChunks] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setError('');
        setResult('');
        setChunks([]);

        try {
            switch(activeTool) {
                case 'deep-dive':
                    const reasoningResult = await complexReasoning(prompt);
                    setResult(reasoningResult);
                    break;
                case 'web-search':
                    const webResult = await groundedSearch(prompt, 'web');
                    setResult(webResult.text);
                    setChunks(webResult.chunks);
                    break;
                case 'map-search':
                    const mapResult = await groundedSearch(prompt, 'maps');
                    setResult(mapResult.text);
                    setChunks(mapResult.chunks);
                    break;
            }
        } catch (err) {
            setError('An error occurred during the search. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadReport = () => {
        if (!result) return;
        const content = `# Research Report: ${prompt}\n\n${result}\n\n## Sources\n${chunks.map(c => `- ${c.web?.title || c.maps?.title}: ${c.web?.uri || c.maps?.uri}`).join('\n')}`;
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Research_${Date.now()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const placeholders = {
        'deep-dive': 'Ask a complex question requiring deep reasoning...\ne.g., "Explain the architectural differences between Django and Flask and when to use each."',
        'web-search': 'Ask about recent events or up-to-date information...\ne.g., "Who won the most recent Python Software Foundation Community Service Award?"',
        'map-search': 'Ask for location-based information...\ne.g., "What are some highly-rated coffee shops near me that are good for working?"',
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-center gap-2 mb-4">
                 <button onClick={() => setActiveTool('deep-dive')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'deep-dive' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Deep Dive</button>
                 <button onClick={() => setActiveTool('web-search')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'web-search' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Web Search</button>
                 <button onClick={() => setActiveTool('map-search')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'map-search' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Map Search</button>
            </div>
            
            <form onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholders[activeTool]}
                    className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white h-32"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="w-full mt-2 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500">
                    {isLoading ? 'Researching...' : 'Submit Query'}
                </button>
            </form>

            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            
            {(isLoading || result) && (
                <div className="mt-6 p-4 bg-gray-900/50 rounded-lg relative">
                    {result && (
                        <button 
                            onClick={handleDownloadReport}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800"
                            title="Download Report"
                        >
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                    )}
                    
                    {isLoading && !result && <div className="text-center animate-pulse">Thinking...</div>}
                    {result && <p className="text-gray-300 whitespace-pre-wrap">{result}</p>}

                    {chunks.length > 0 && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <h4 className="font-bold text-purple-400 mb-2">Sources:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {chunks.map((chunk, index) => {
                                    const source = chunk.web || chunk.maps;
                                    // Fix: Add a check for source and source.uri to prevent rendering links with an undefined href.
                                    if (!source || !source.uri) return null;
                                    return (
                                        <li key={index}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                {source.title || source.uri}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Researcher;
