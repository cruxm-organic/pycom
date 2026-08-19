
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { XMarkIcon, PaperAirplaneIcon, TerminalIcon } from '../Icons.tsx';

const PyPingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'model', text: "System Online. I am PyPing, your Autonomous DevOps Assistant. I can help you configure Nginx, debug Docker containers, or automate CI/CD pipelines on PyCom Cloud. How can I assist?" }]);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [isOpen, messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        if (!process.env.API_KEY) {
             setTimeout(() => {
                setMessages(prev => [...prev, { role: 'model', text: "Error: API Key missing. Unable to access neural core for automation processing." }]);
                setIsLoading(false);
             }, 1000);
             return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })).concat([{ role: 'user', parts: [{ text: userMsg }] }]),
                config: {
                    systemInstruction: `You are PyPing, an advanced AI DevOps Engineer for the PyCom Cloud Platform.
                    
                    YOUR CAPABILITIES:
                    - Server Management (Linux/Ubuntu, Nginx, Systemd)
                    - Containerization (Docker, Kubernetes)
                    - Python Deployment (Gunicorn, Uvicorn, Supervisor)
                    - Security (Firewalls, SSL, SSH Hardening)
                    
                    CONTEXT:
                    - The user is the SOLE OWNER and ROOT ADMIN of this infrastructure.
                    - You have full permission to generate deletion scripts or destructive commands if requested (with a warning).
                    - Provide concrete terminal commands and configuration snippets.
                    
                    TONE: Technical, precise, slightly robotic but helpful. Like a futuristic terminal interface.`
                }
            });
            
            const responseText = result.text || "Command processing failed.";
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "Connection to PyPing Core failed. Please retry." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
            {isOpen && (
                <div className="bg-slate-950 border border-green-500/50 rounded-xl shadow-2xl w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden animate-fade-in-up backdrop-blur-md">
                    <div className="bg-slate-900/80 p-3 flex justify-between items-center border-b border-green-500/30">
                        <h3 className="font-bold text-green-400 flex items-center gap-2 font-mono">
                            <TerminalIcon className="w-4 h-4" />
                            PyPing_v1.0
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto space-y-3 font-mono text-xs">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-900/40 text-blue-200 border border-blue-500/30' : 'bg-slate-900/60 text-green-300 border border-green-500/20'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="text-green-500 animate-pulse ml-2">_processing...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="p-3 bg-slate-900/80 border-t border-green-500/30 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Execute command or ask query..."
                            className="flex-grow bg-black text-green-400 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono border border-slate-700"
                        />
                        <button type="submit" disabled={isLoading} className="bg-green-600/20 text-green-400 border border-green-500/50 p-2 rounded-lg hover:bg-green-600/40 transition-colors disabled:opacity-50">
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 border ${isOpen ? 'bg-slate-800 text-white border-slate-600' : 'bg-black text-green-400 border-green-500 shadow-green-500/20'}`}
            >
                {isOpen ? (
                    <>Hide Terminal</>
                ) : (
                    <>
                        <TerminalIcon className="w-5 h-5" />
                        <span>PyPing Assistant</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default PyPingChatbot;
