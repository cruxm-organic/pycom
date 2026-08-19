
import React from 'react';
import { XMarkIcon, ArrowPathIcon, GlobeAltIcon, ArrowRightOnRectangleIcon } from '../Icons.tsx';

interface LivePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ isOpen, onClose, url, title }) => {
    if (!isOpen) return null;

    const handleOpenInNewTab = () => {
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Live Preview</title>
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f0f9ff; color: #1e293b; }
        .container { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 600px; }
        h1 { color: #7c3aed; margin-bottom: 1rem; }
        .status { margin-top: 2rem; padding: 1rem; background: #f1f5f9; border-radius: 0.5rem; text-align: left; font-family: monospace; font-size: 0.9rem; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; background: #22c55e; color: white; border-radius: 9999px; font-size: 0.8rem; font-weight: bold; margin-bottom: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <span class="badge">Live Deployment</span>
        <h1>Hello from ${title}!</h1>
        <p>This application is successfully hosted on PyCom Cloud.</p>
        <p>Your code changes have been deployed and are live.</p>
        
        <div class="status">
            <p><strong>Server Status:</strong> <span style="color: #16a34a">Online</span></p>
            <p><strong>Region:</strong> pycom-us-east-1</p>
            <p><strong>Runtime:</strong> Python 3.11</p>
            <p><strong>URL:</strong> ${url}</p>
        </div>
    </div>
</body>
</html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={onClose}>
            <div 
                className="bg-slate-900 w-full max-w-6xl h-[80vh] rounded-xl border border-slate-700 flex flex-col shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Browser Toolbar */}
                <div className="bg-slate-800 p-3 flex items-center gap-4 border-b border-slate-700">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-400" onClick={onClose}></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-grow flex items-center bg-slate-900 rounded-lg px-3 py-1.5 text-xs text-slate-400 border border-slate-700">
                        <GlobeAltIcon className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="flex-grow">{url}</span>
                        <ArrowPathIcon className="w-4 h-4 cursor-pointer hover:text-white" />
                    </div>
                    <button 
                        onClick={handleOpenInNewTab}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700 transition-colors"
                        title="Open in new tab"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow bg-white relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-900">
                        <h1 className="text-4xl font-bold mb-4">Hello from {title}!</h1>
                        <p className="text-lg text-gray-600 mb-8">This application is successfully hosted on PyCom Cloud.</p>
                        <div className="p-6 bg-gray-100 rounded-xl border border-gray-200 shadow-inner max-w-md text-left">
                            <p className="font-mono text-sm text-gray-600 mb-2">Server Status: <span className="text-green-600 font-bold">Online</span></p>
                            <p className="font-mono text-sm text-gray-600 mb-2">Region: <span className="font-bold">pycom-us-east-1</span></p>
                            <p className="font-mono text-sm text-gray-600">Runtime: <span className="font-bold">Python 3.11</span></p>
                        </div>
                        <div className="mt-8 animate-bounce">
                            <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                PyCom Hosting Live
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LivePreviewModal;
