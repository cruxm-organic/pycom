
import React, { useState, useEffect, useRef } from 'react';
// Fix: Add .tsx extension to module path
import { UploadIcon, SparklesIcon } from '../Icons.tsx';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

type VideoTool = 'generate' | 'analyze';

// Polling interval for the video generation job status
const POLLING_INTERVAL = 10000; // 10 seconds

const VideoStudio: React.FC = () => {
    const [activeTool, setActiveTool] = useState<VideoTool>('generate');

    const Generator = () => {
        const [prompt, setPrompt] = useState('');
        const [image, setImage] = useState<{ data: string, url: string, mimeType: string } | null>(null);
        const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
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

        const pollOperation = (operationId: string) => {
            pollIntervalRef.current = window.setInterval(async () => {
                try {
                    const response = await fetch(`${API_BASE}/api/video/status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ operation_id: operationId }),
                    });
                    if (!response.ok) {
                        const body = await response.json().catch(() => ({}));
                        throw new Error(body.detail || `Backend returned ${response.status}`);
                    }
                    const contentType = response.headers.get('content-type') || '';
                    if (contentType.includes('application/json')) {
                        const data = await response.json();
                        if (data.done === false) return; // still generating, keep polling
                    } else {
                        // Video finished: response body is the raw video bytes.
                        clearInterval(pollIntervalRef.current!);
                        pollIntervalRef.current = null;
                        const blob = await response.blob();
                        setVideoUrl(URL.createObjectURL(blob));
                        setIsLoading(false);
                    }
                } catch (err: any) {
                    console.error('Polling error:', err);
                    setError(err.message || 'An error occurred while checking video status.');
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

            try {
                const response = await fetch(`${API_BASE}/api/video/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt,
                        aspect_ratio: aspectRatio,
                        image_base64: image?.data,
                        mime_type: image?.mimeType,
                    }),
                });
                if (!response.ok) {
                    const body = await response.json().catch(() => ({}));
                    throw new Error(body.detail || `Backend returned ${response.status}`);
                }
                const data = await response.json();
                pollOperation(data.operation_id);
            } catch (err: any) {
                setError(err.message || 'Failed to start video generation. Please try again.');
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
