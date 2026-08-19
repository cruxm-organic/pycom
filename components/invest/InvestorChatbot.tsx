
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '../Icons.tsx';

const InvestorChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'model', text: "Hello! I'm the PyCom Investor Relations AI. I can answer questions about our growth metrics, business model, and future roadmap. How can I assist you today?" }]);
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
                setMessages(prev => [...prev, { role: 'model', text: "I am currently in demo mode (API Key missing). In production, I would provide detailed financial projections and user growth data." }]);
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
                    systemInstruction: `You are the Investor Relations Officer for PyCom, an AI-powered EdTech platform.
                    
                    KEY FACTS:
                    - Mission: Democratize Python & AI education.
                    - Traction: 10k+ Monthly Active Users, 500k+ code executions.
                    - Revenue Model: Freemium (Courses, Advanced AI Tools), B2B Licensing, Recruitment referrals.
                    - Funding Goal: $2M Seed Round for infrastructure scaling and model fine-tuning.
                    
                    TONE: Professional, data-driven, yet visionary and confident. Keep answers concise.`
                }
            });
            
            const responseText = result.text || "No response generated.";
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble accessing the latest data. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="bg-gray-900 border border-purple-500 rounded-xl shadow-2xl w-80 sm:w-96 h-96 mb-4 flex flex-col overflow-hidden animate-pop-in">
                    <div className="bg-gray-800 p-3 flex justify-between items-center border-b border-gray-700">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4 text-yellow-400" />
                            Investor Relations AI
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-black/20">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="text-xs text-gray-500 animate-pulse ml-2">Generating response...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSend} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about revenue, growth..."
                            className="flex-grow bg-gray-900 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={isLoading} className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                            <PaperAirplaneIcon className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-lg transition-all hover:scale-105 ${isOpen ? 'bg-gray-700 text-white' : 'bg-yellow-400 text-gray-900'}`}
            >
                {isOpen ? (
                    <>Close Chat</>
                ) : (
                    <>
                        <span className="text-xl">🤖</span>
                        <span>Ask IR AI</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default InvestorChatbot;
