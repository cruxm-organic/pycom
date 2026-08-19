
import React, { useState } from 'react';
// Fix: Add .ts extension to module path
import { generateImage, editImage, analyzeImage } from '../../services/geminiLabService.ts';
// Fix: Add .tsx extension to module path
import { UploadIcon, SparklesIcon } from '../Icons.tsx';

type ImageTool = 'generate' | 'edit' | 'analyze';

const ImageStudio: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ImageTool>('generate');

    const ToolButton: React.FC<{ tool: ImageTool, label: string }> = ({ tool, label }) => (
        <button onClick={() => setActiveTool(tool)} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === tool ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {label}
        </button>
    );

    const Generator = () => {
        const [prompt, setPrompt] = useState('');
        const [aspectRatio, setAspectRatio] = useState('1:1');
        const [image, setImage] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        const handleGenerate = async () => {
            if (!prompt.trim()) return;
            setIsLoading(true);
            setError('');
            setImage(null);
            try {
                const base64Image = await generateImage(prompt, aspectRatio);
                setImage(`data:image/jpeg;base64,${base64Image}`);
            } catch (err) {
                setError('Failed to generate image. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="space-y-4">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A robot holding a red skateboard in a pop art style" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white h-24" />
                <div className="flex items-center gap-4">
                    <label htmlFor="aspect-ratio" className="font-semibold">Aspect Ratio:</label>
                    <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="bg-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white">
                        <option value="1:1">1:1 (Square)</option>
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Portrait)</option>
                        <option value="4:3">4:3</option>
                        <option value="3:4">3:4</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 flex items-center justify-center gap-2">
                    <SparklesIcon className="w-5 h-5" />
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
                {error && <p className="text-red-400 text-center">{error}</p>}
                {isLoading && <div className="text-center animate-pulse">Conjuring pixels...</div>}
                {image && <img src={image} alt="Generated" className="w-full max-w-lg mx-auto rounded-lg mt-4" />}
            </div>
        )
    };

    const Editor = () => {
        const [prompt, setPrompt] = useState('');
        const [originalImage, setOriginalImage] = useState<{ data: string, url: string, mime: string } | null>(null);
        const [editedImage, setEditedImage] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    setOriginalImage({ data: base64String, url: URL.createObjectURL(file), mime: file.type });
                    setEditedImage(null);
                };
                reader.readAsDataURL(file);
            }
        };

        const handleEdit = async () => {
            if (!prompt.trim() || !originalImage) return;
            setIsLoading(true);
            setError('');
            setEditedImage(null);
            try {
                const base64Image = await editImage(prompt, originalImage.data, originalImage.mime);
                setEditedImage(`data:image/png;base64,${base64Image}`);
            } catch (err) {
                setError('Failed to edit image. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="space-y-4">
                {!originalImage ? (
                    <label className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50">
                        <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-400">Upload an image to edit</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                ) : (
                    <>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., Add a retro filter, remove the person in the background" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white h-24" />
                        <button onClick={handleEdit} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 flex items-center justify-center gap-2">
                             <SparklesIcon className="w-5 h-5" />
                            {isLoading ? 'Applying Edits...' : 'Edit Image'}
                        </button>
                    </>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {originalImage && (
                        <div>
                            <h3 className="font-bold text-center mb-2">Original</h3>
                            <img src={originalImage.url} alt="Original" className="w-full rounded-lg" />
                        </div>
                    )}
                    {isLoading && <div className="text-center animate-pulse md:col-start-2">Applying magic...</div>}
                    {editedImage && (
                        <div>
                            <h3 className="font-bold text-center mb-2">Edited</h3>
                            <img src={editedImage} alt="Edited" className="w-full rounded-lg" />
                        </div>
                    )}
                </div>
            </div>
        )
    };

    const Analyzer = () => {
        const [image, setImage] = useState<{ data: string, url: string, mime: string } | null>(null);
        const [analysis, setAnalysis] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    setImage({ data: base64String, url: URL.createObjectURL(file), mime: file.type });
                    setAnalysis('');
                };
                reader.readAsDataURL(file);
            }
        };

        const handleAnalyze = async () => {
            if (!image) return;
            setIsLoading(true);
            setError('');
            setAnalysis('');
            try {
                const result = await analyzeImage(image.data, image.mime);
                setAnalysis(result);
            } catch (err) {
                setError('Failed to analyze image. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="space-y-4">
                {!image ? (
                     <label className="w-full h-48 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/50">
                        <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-400">Upload an image to analyze</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                ) : (
                    <>
                        <img src={image.url} alt="To analyze" className="w-full max-w-lg mx-auto rounded-lg" />
                        <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500">
                            {isLoading ? 'Analyzing...' : 'Analyze Image'}
                        </button>
                    </>
                )}
                 {error && <p className="text-red-400 text-center">{error}</p>}
                 {isLoading && <div className="text-center animate-pulse">Thinking about the image...</div>}
                 {analysis && <div className="bg-gray-900/50 p-4 rounded-lg mt-4"><p className="text-gray-300 whitespace-pre-wrap">{analysis}</p></div>}
            </div>
        )
    };

    return (
        <div>
            <div className="flex justify-center gap-2 mb-6">
                <ToolButton tool="generate" label="Generate" />
                <ToolButton tool="edit" label="Edit" />
                <ToolButton tool="analyze" label="Analyze" />
            </div>
            <div>
                {activeTool === 'generate' && <Generator />}
                {activeTool === 'edit' && <Editor />}
                {activeTool === 'analyze' && <Analyzer />}
            </div>
        </div>
    );
};

export default ImageStudio;
