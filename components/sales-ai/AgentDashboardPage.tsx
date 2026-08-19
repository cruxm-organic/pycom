

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Lead, Agent, ActivityLog } from '../../types.ts';
import { LEADS_DATA } from '../../constants.ts';
import CustomizationPanel from './CustomizationPanel.tsx';
import WorkflowTracker from './WorkflowTracker.tsx';
import TimezoneClocks from './TimezoneClocks.tsx';
import ActivityLogPanel from './ActivityLog.tsx';
import LeadDownloader from './LeadDownloader.tsx';
import { SparklesIcon, UserCircleIcon, ArrowRightOnRectangleIcon, BriefcaseIcon, TrendingUpIcon, CheckCircleIcon, ClockIcon } from '../Icons.tsx';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set for AgentDashboardPage. This feature will not work.");
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AgentDashboardPageProps {
    agent: Agent;
    onLogout: () => void;
    activityLog: ActivityLog[];
    addActivity: (description: string) => void;
}

const priorityOrder: { [key in Lead['priority']]: number } = {
    High: 1,
    Medium: 2,
    Low: 3,
};

const AgentJobCard: React.FC<{ agent: Agent }> = ({ agent }) => (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
            <BriefcaseIcon className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-lg">Agent Profile</h3>
        </div>
        <div className="space-y-4">
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Job Description</p>
                <p className="text-sm text-slate-300 leading-relaxed">{agent.jobDescription}</p>
            </div>
            {agent.joinDate && (
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Joining Date</p>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <ClockIcon className="w-4 h-4 text-yellow-500" />
                        <span className="font-mono">{agent.joinDate}</span>
                    </div>
                </div>
            )}
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Monthly Target</p>
                <div className="bg-green-900/30 text-green-400 px-3 py-2 rounded-lg border border-green-500/30 font-mono font-bold text-center">
                    {agent.monthlyTarget}
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Key Performance Indicators</p>
                <ul className="space-y-1">
                    {agent.kpis.map((kpi, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                            <TrendingUpIcon className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                            <span>{kpi}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const AgentDashboardPage: React.FC<AgentDashboardPageProps> = ({ agent, onLogout, activityLog, addActivity }) => {
    const [leads, setLeads] = useState<Lead[]>(() => 
        (LEADS_DATA[agent.id] || []).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    );
    const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
    const [personality, setPersonality] = useState('Professional');
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const systemInstructions: { [key: string]: string } = {
        Professional: `You are a highly professional AI Assistant for ${agent.name} (${agent.role}) at PyCom. Your goal is to execute tasks and suggest strategies tailored to ${agent.role}. Be formal and data-driven.`,
        Enthusiastic: `You are an energetic and enthusiastic AI 'Hype-Man' for ${agent.name} (${agent.role}) at PyCom! Your goal is to get ${agent.name} excited about tasks by highlighting their potential in a fun, upbeat way. Use emojis!`,
        Concise: `You are a to-the-point AI Assistant for ${agent.name} (${agent.role}) at PyCom. Provide brief, actionable insights related to ${agent.role}. No fluff. Get straight to the strategy.`,
    };
    
    const handlePersonalityChange = (newPersonality: string) => {
        setPersonality(newPersonality);
        addActivity(`Changed AI personality to ${newPersonality}.`);
    };

    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
        addActivity(`Viewed lead: ${lead.name} from ${lead.company}.`);
    };

    useEffect(() => {
        if (process.env.API_KEY) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: systemInstructions[personality] },
            });
            setChat(newChat);
             setMessages([{ role: 'model', text: `Hello ${agent.name}! I'm your AI Agent, ready to help you with your ${agent.role} tasks. I'm currently in '${personality}' mode.` }]);
        } else {
             setMessages([{ role: 'model', text: 'API Key not configured. This is a demo view.' }]);
        }
    }, [personality, agent.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if(selectedLead && chat) {
            handleSystemMessage(`Analyze this lead: ${selectedLead.name} from ${selectedLead.company}. Their current status is ${selectedLead.status} and priority is ${selectedLead.priority}.`);
        }
    }, [selectedLead, chat]);
    
    const handleSystemMessage = async (message: string) => {
        if (!chat) return;
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'model', text: 'Analyzing...' }]);
        
        try {
            const result = await chat.sendMessage({message});
            addActivity(`Generated AI insight for ${selectedLead?.name}.`);
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: result.text };
                return newMessages;
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessageStream({ message: currentInput });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of response) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
             addActivity(`Generated AI response to user query.`);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getStatusColor = (status: Lead['status']) => {
        const colors: { [key in Lead['status']]: string } = {
            Research: 'bg-gray-500', Identify: 'bg-blue-500', Formatting: 'bg-cyan-500',
            Outreach: 'bg-indigo-500', Pipeline: 'bg-purple-500', 'Lead Filtering': 'bg-pink-500',
            Email: 'bg-yellow-500', 'Follow-up': 'bg-orange-500', Closure: 'bg-green-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    const getPriorityIndicator = (priority: Lead['priority']) => {
        const colors = {
            High: 'bg-red-500',
            Medium: 'bg-yellow-500',
            Low: 'bg-green-500',
        };
        return <span className={`w-3 h-3 rounded-full ${colors[priority]} flex-shrink-0`} title={`Priority: ${priority}`}></span>;
    };

    return (
        <div>
            <div className="text-center mb-4 relative">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{agent.name}'s Dashboard</h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">Your personal AI assistant for {agent.role} workflow automation.</p>
                <button onClick={onLogout} className="absolute top-0 right-0 bg-slate-700/50 text-white font-bold py-2 px-3 rounded-lg hover:bg-slate-600/50 transition-colors flex items-center gap-2 text-sm">
                    <ArrowRightOnRectangleIcon className="w-5 h-5"/> Logout
                </button>
            </div>
            
            <TimezoneClocks />
            
            <div className="my-8 bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
                <h2 className="text-xl font-bold text-center text-white mb-4">Workflow Tracker</h2>
                <WorkflowTracker status={selectedLead?.status || 'Research'} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Leads & Downloader */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
                        <h2 className="text-xl font-bold text-white mb-4">Active Tasks / Leads</h2>
                        {leads.length > 0 ? (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {leads.map(lead => (
                                    <button key={lead.id} onClick={() => handleSelectLead(lead)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedLead?.id === lead.id ? 'bg-purple-600/30 ring-2 ring-purple-400' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {getPriorityIndicator(lead.priority)}
                                                <p className="font-bold text-white">{lead.name}</p>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${getStatusColor(lead.status)}`}>{lead.status}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 pl-5">{lead.company}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">No active tasks assigned.</p>
                        )}
                    </div>
                    <LeadDownloader leads={leads} />
                </div>

                {/* Center Panel: Chat */}
                <div className="lg:col-span-6 flex flex-col h-[80vh] bg-gray-800/50 rounded-xl border border-purple-500/30">
                    <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <SparklesIcon className="w-8 h-8 text-purple-400 flex-shrink-0" />}
                                <div className={`max-w-xl p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}><p className="whitespace-pre-wrap">{msg.text}</p></div>
                                {msg.role === 'user' && <UserCircleIcon className="w-8 h-8 text-blue-300 flex-shrink-0" />}
                            </div>
                        ))}
                        {isLoading && messages[messages.length-1].role === 'user' && (
                            <div className="flex justify-start"><div className="max-w-lg p-3 rounded-xl bg-gray-700 text-gray-200 animate-pulse">Thinking...</div></div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t border-gray-700">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask for an email draft, a follow-up idea..." className="flex-1 bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" disabled={isLoading || !process.env.API_KEY} />
                            <button type="submit" disabled={isLoading || !userInput.trim() || !process.env.API_KEY} className="bg-purple-600 text-white font-bold p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500">Send</button>
                        </form>
                    </div>
                </div>

                {/* Right Panel: Activity & Customization */}
                 <div className="lg:col-span-3 space-y-6">
                    <AgentJobCard agent={agent} />
                    <ActivityLogPanel activityLog={activityLog} />
                    <CustomizationPanel personality={personality} setPersonality={handlePersonalityChange} />
                </div>
            </div>
        </div>
    );
};

export default AgentDashboardPage;
