import React, { useState } from 'react';
// Fix: Add .tsx extension to module paths
import Chatbot from '../ai-lab/Chatbot.tsx';
import ImageStudio from '../ai-lab/ImageStudio.tsx';
import VideoStudio from '../ai-lab/VideoStudio.tsx';
import AudioSuite from '../ai-lab/AudioSuite.tsx';
import Researcher from '../ai-lab/Researcher.tsx';
// Fix: Add .tsx extension to module path
import { ChatIcon, ImageIcon, VideoIcon, SparklesIcon } from '../Icons.tsx';

type LabTool = 'chat' | 'image' | 'video' | 'audio' | 'research';

const AILabPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<LabTool>('chat');

    const LabButton: React.FC<{ tool: LabTool, label: string, children: React.ReactNode }> = ({ tool, label, children }) => (
        <button
            onClick={() => setActiveTool(tool)}
            className={`interactive-card flex flex-col items-center justify-center p-4 rounded-lg w-full h-full text-center border ${activeTool === tool ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-gray-800/50 border-purple-500/20 text-gray-300'}`}
        >
            {children}
            <span className="font-bold mt-2">{label}</span>
        </button>
    );

    const renderTool = () => {
        switch (activeTool) {
            case 'chat': return <Chatbot />;
            case 'image': return <ImageStudio />;
            case 'video': return <VideoStudio />;
            case 'audio': return <AudioSuite />;
            case 'research': return <Researcher />;
            default: return <Chatbot />;
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate-text-glow">Welcome to the AI Lab</h1>
                <p className="text-lg text-gray-400">Create, innovate, and experiment with the power of Google's Gemini models.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <LabButton tool="chat" label="PyPal GenBot">
                    <ChatIcon className="w-10 h-10" />
                </LabButton>
                <LabButton tool="image" label="Image Studio">
                    <ImageIcon className="w-10 h-10" />
                </LabButton>
                <LabButton tool="video" label="Video Studio">
                    <VideoIcon className="w-10 h-10" />
                </LabButton>
                <LabButton tool="audio" label="Audio Suite">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0l-2.828 2.828m0 0a2 2 0 010 2.828l2.828 2.828m0-5.656l2.828-2.828m-2.828 2.828l-2.828 2.828" />
                    </svg>
                </LabButton>
                <LabButton tool="research" label="AI Researcher">
                    <SparklesIcon className="w-10 h-10" />
                </LabButton>
            </div>

            <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl border border-purple-500/30">
                {renderTool()}
            </div>
        </div>
    );
};

export default AILabPage;