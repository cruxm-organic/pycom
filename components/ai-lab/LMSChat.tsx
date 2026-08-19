
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '../Icons.tsx';

interface LMSChatProps {
    courseTitle: string;
}

const LMSChat: React.FC<LMSChatProps> = ({ courseTitle }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: `You are a teaching assistant for the course "${courseTitle}". 
                    Answer student questions clearly and concisely. You can provide examples but keep them brief.`
                }
            });
            setChat(newChat);
            setMessages([{ role: 'model', text: `Hello! I'm your TA for ${courseTitle}. What questions do you have about the course material?` }]);
        } else {
            setMessages([{ role: 'model', text: "Error: API Key missing. Chat unavailable." }]);
        }
    }, [courseTitle]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const result = await chat.sendMessage({ message: userMsg });
            setMessages(prev => [...prev, { role: 'model', text: result.text || "I didn't catch that." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-purple-400" />
                    Class Chat
                </h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 p-3 rounded-lg text-sm text-gray-400 animate-pulse">Writing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow bg-gray-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type your question..."
                />
                <button type="submit" disabled={isLoading} className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default LMSChat;
