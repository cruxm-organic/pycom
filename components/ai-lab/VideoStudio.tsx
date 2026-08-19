
import React, { useState, useEffect, useRef } from 'react';
// Fix: Add .ts extension to module path
import { generateVideo, getVideosOperation, analyzeVideo } from '../../services/geminiLabService.ts';
import { GenerateVideosOperation } from '@google/genai';
// Fix: Add .tsx extension to module path
import { UploadIcon, SparklesIcon } from '../Icons.tsx';

type VideoTool = 'generate' | 'analyze';

// Polling interval for VEO operation status
const POLLING_INTERVAL = 10000; // 10 seconds

const VideoStudio: React.FC = () => {
    const [activeTool, setActiveTool] = useState<VideoTool>('generate');
    const [hasApiKey, setHasApiKey] = useState(false);
    const [isCheckingKey, setIsCheckingKey] = useState(true);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const keyStatus = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(keyStatus);
            }
            setIsCheckingKey(false);
        };
        checkKey();
    }, []);
    
    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Optimistically assume key selection was successful to avoid race conditions
            setHasApiKey(true);
        }
    };
    
    if (isCheckingKey) {
        return <div className="text-center p-8 animate-pulse">Checking API key status...</div>;
    }

    if (!hasApiKey) {
        return (
            <div className="text-center p-8 bg-yellow-900/50 border border-yellow-600 rounded-lg">
                <h3 className="text-xl font-bold text-yellow-300">VEO API Key Required</h3>
                <p className="my-4 text-yellow-200">Video generation with VEO requires you to select an API key. This service may incur costs.</p>
                <p className="mb-4 text-sm text-yellow-300">Please review the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">billing documentation</a> before proceeding.</p>
                <button onClick={handleSelectKey} className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-600">
                    Select API Key
                </button>
            </div>
        )
    }

    const Generator = () => {
        const [prompt, setPrompt] = useState('');
        // Fix: Changed state property from 'mime' to 'mimeType' to match the expected type for the geminiLabService.
        const [image, setImage] = useState<{ data: string, url: string, mimeType: string } | null>(null);
        const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
        const [operation, setOperation] = useState<GenerateVideosOperation | null>(null);
        const [videoUrl, setVideoUrl] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');
        const pollIntervalRef = useRef<number | null>(null);

        useEffect(() => {
            return () => {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                }
            };
        }, []);

        const pollOperation = (op: GenerateVideosOperation) => {
            pollIntervalRef.current = window.setInterval(async () => {
                try {
                    const updatedOp = await getVideosOperation(op);
                    setOperation(updatedOp);
                    if (updatedOp.done) {
                        clearInterval(pollIntervalRef.current!);
                        pollIntervalRef.current = null;
                        const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                        if (uri) {
                            const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
                            if (!response.ok) {
                                const errorJson = await response.json().catch(() => ({ message: `Failed to download video. Status: ${response.status}` }));
                                throw errorJson;
                            }
                            const blob = await response.blob();
                            setVideoUrl(URL.createObjectURL(blob));
                        } else {
                            setError('Video generation finished, but no video URI was found.');
                        }
                        setIsLoading(false);
                    }
                } catch (err: any) {
                    console.error('Polling error:', err);
                    if (JSON.stringify(err).includes("Requested entity was not found")) {
                        setError("API Key not found. Please re-select your key.");
                        setHasApiKey(false); // Reset key state to force re-selection
                    } else {
                        setError('An error occurred while checking video status.');
                    }
                    setIsLoading(false);
                    clearInterval(pollIntervalRef.current!);
                    pollIntervalRef.current = null;
                }
            }, POLLING_INTERVAL);
        };

        const handleGenerate = async () => {
            if (!prompt.trim()) return;
            setIsLoading(true);
            setError('');
            setVideoUrl(null);
            setOperation(null);
            
            try {
                const initialOp = await generateVideo(prompt, image ?? undefined, aspectRatio);
                setOperation(initialOp);
                if (!initialOp.done) {
                    pollOperation(initialOp);
                }
            } catch (err: any) {
                if (JSON.stringify(err).includes("Requested entity was not found")) {
                    setError("API Key not found. Please re-select your key.");
                    setHasApiKey(false); // Reset key state to force re-selection
                } else {
                    setError('Failed to start video generation. Please try again.');
                }
                console.error(err);
                setIsLoading(false);
            }
        };

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    // Fix: Changed property from 'mime' to 'mimeType' to align with the state and service function.
                    setImage({ data: base64String, url: URL.createObjectURL(file), mimeType: file.type });
                };
                reader.readAsDataURL(file);
            }
        };

        const loadingMessages = [
            "Warming up the digital cameras...",
            "Directing the silicon actors...",
            "Rendering the first few frames...",
            "This can take a few minutes, hang tight!",
            "Compositing the final shots...",
            "Adding a touch of cinematic magic...",
        ];
        const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

        useEffect(() => {
            if (isLoading) {
                const interval = setInterval(() => {
                    setLoadingMessage(prev => {
                        const currentIndex = loadingMessages.indexOf(prev);
                        return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                    });
                }, 4000);
                return () => clearInterval(interval);
            }
        }, [isLoading]);

        return (
            <div className="space-y-4">
                 <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A neon hologram of a cat driving at top speed" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white h-24" />
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold block mb-2">Starting Image (Optional):</label>
                        <label className="w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50">
                             {!image ? (
                                <>
                                    <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-gray-400 text-sm">Upload Image</span>
                                </>
                            ) : (
                                <img src={image.url} alt="Starting frame" className="h-full w-full object-cover rounded-md" />
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>
                     <div>
                        <label htmlFor="aspect-ratio" className="font-semibold block mb-2">Aspect Ratio:</label>
                        <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')} className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white">
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                        </select>
                    </div>
                 </div>

                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
                {error && <p className="text-red-400 text-center">{error}</p>}
                {isLoading && (
                    <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                        <div className="animate-pulse mb-2">{loadingMessage}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full animate-background-pan" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}
                {videoUrl && <video src={videoUrl} controls autoPlay loop className="w-full max-w-lg mx-auto rounded-lg mt-4" />}
            </div>
        )
    };

    const Analyzer = () => {
         return (
            <div className="text-center p-8 bg-gray-900/50 rounded-lg">
                <h3 className="text-xl font-bold">Video Analysis</h3>
                <p className="mt-2 text-gray-400">This feature is a demonstration. Due to browser limitations on uploading large video files, a full implementation would typically use a cloud storage solution like Google Cloud Storage to provide the video to the model.</p>
                <button className="mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                    Analyze Video (Coming Soon)
                </button>
            </div>
        )
    };
    
    return (
        <div>
            <div className="flex justify-center gap-2 mb-6">
                <button onClick={() => setActiveTool('generate')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'generate' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Generate
                </button>
                <button onClick={() => setActiveTool('analyze')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'analyze' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                    Analyze
                </button>
            </div>
            <div>
                {activeTool === 'generate' && <Generator />}
                {activeTool === 'analyze' && <Analyzer />}
            </div>
        </div>
    );
};

export default VideoStudio;
