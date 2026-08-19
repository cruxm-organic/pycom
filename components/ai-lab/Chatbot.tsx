import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
// Fix: Add .tsx extension to module path
import { SparklesIcon } from '../Icons.tsx';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set for Chatbot. Chatbot will not work.");
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are Py, a helpful and friendly Python programming expert from PyCom. You assist users with their Python questions in a clear and concise way. You can provide code examples.",
                },
            });
            setChat(newChat);
        }
        setMessages([{ role: 'model', text: 'Hello! I am Py, your personal Python assistant. How can I help you today?' }]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const responseStream = await chat.sendMessageStream({ message: currentInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[70vh] bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-lg p-3 rounded-xl ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                           <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1].role === 'user' && (
                    <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-xl bg-gray-700 text-gray-200 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask me anything about Python..."
                        className="flex-1 bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        disabled={isLoading || !process.env.API_KEY}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim() || !process.env.API_KEY} className="bg-purple-600 text-white font-bold p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
