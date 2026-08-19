
import React, { useState } from 'react';
import { ClipboardDocumentCheckIcon, ChatBubbleLeftRightIcon, BoltIcon, DocumentTextIcon, PlusIcon, UserCircleIcon, CheckCircleIcon, ClockIcon, PaperAirplaneIcon } from '../Icons.tsx';
import type { PyProdTask, PyProdColumn, PyProdMessage } from '../../types.ts';
import PyPingChatbot from './PyPingChatbot.tsx';

const INITIAL_COLUMNS: PyProdColumn[] = [
    {
        id: 'todo',
        title: 'To Do',
        tasks: [
            { id: 't1', title: 'Setup CI/CD Pipeline', assignee: 'Alex', tag: 'DevOps' },
            { id: 't2', title: 'Draft Marketing Copy', assignee: 'Suresh', tag: 'Marketing' }
        ]
    },
    {
        id: 'progress',
        title: 'In Progress',
        tasks: [
            { id: 't3', title: 'API Integration', assignee: 'Kai', tag: 'Backend' }
        ]
    },
    {
        id: 'done',
        title: 'Done',
        tasks: [
            { id: 't4', title: 'Initial Requirement Gathering', assignee: 'Jeyabal', tag: 'Strategy' }
        ]
    }
];

const PyProd: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'board' | 'chat' | 'cicd' | 'docs'>('board');
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [chatMessages, setChatMessages] = useState<PyProdMessage[]>([
        { id: 'm1', user: 'System', text: 'Welcome to PyProd Team Space.', time: '09:00 AM' },
        { id: 'm2', user: 'Billy Jay', text: 'Updated the Q3 targets in Docs.', time: '09:15 AM' },
    ]);
    const [chatInput, setChatInput] = useState('');

    const moveTask = (taskId: string, fromColId: string, toColId: string) => {
        const fromCol = columns.find(c => c.id === fromColId);
        const toCol = columns.find(c => c.id === toColId);
        if (!fromCol || !toCol) return;

        const task = fromCol.tasks.find(t => t.id === taskId);
        if (!task) return;

        const newFromTasks = fromCol.tasks.filter(t => t.id !== taskId);
        const newToTasks = [...toCol.tasks, task];

        setColumns(columns.map(c => {
            if (c.id === fromColId) return { ...c, tasks: newFromTasks };
            if (c.id === toColId) return { ...c, tasks: newToTasks };
            return c;
        }));
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const newMessage: PyProdMessage = {
            id: Date.now().toString(),
            user: 'You',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages([...chatMessages, newMessage]);
        setChatInput('');
        
        // Simulate PyPing response
        if (chatInput.toLowerCase().includes('build') || chatInput.toLowerCase().includes('status')) {
            setTimeout(() => {
                setChatMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    user: 'PyPing Bot',
                    text: 'Latest build status: PASS (v2.4.1) on PyCom Cloud Server.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 1000);
        }
    };

    const BoardView = () => (
        <div className="flex gap-6 h-full overflow-x-auto p-2">
            {columns.map(col => (
                <div key={col.id} className="w-80 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-white">{col.title}</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">{col.tasks.length}</span>
                    </div>
                    <div className="p-3 space-y-3 flex-grow overflow-y-auto">
                        {col.tasks.map(task => (
                            <div key={task.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-sm hover:border-purple-500 cursor-pointer group relative">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                        task.tag === 'DevOps' ? 'bg-orange-900/30 text-orange-400' :
                                        task.tag === 'Marketing' ? 'bg-pink-900/30 text-pink-400' :
                                        task.tag === 'Backend' ? 'bg-blue-900/30 text-blue-400' :
                                        'bg-green-900/30 text-green-400'
                                    }`}>{task.tag}</span>
                                </div>
                                <p className="text-sm text-white font-medium mb-3">{task.title}</p>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <UserCircleIcon className="w-4 h-4" /> {task.assignee}
                                    </div>
                                </div>
                                
                                {/* Quick Move Controls (Simulation of Drag & Drop) */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                                    {col.id !== 'todo' && <button onClick={() => moveTask(task.id, col.id, 'todo')} className="w-2 h-2 bg-slate-600 rounded-full hover:bg-red-500" title="Move to Todo"></button>}
                                    {col.id !== 'progress' && <button onClick={() => moveTask(task.id, col.id, 'progress')} className="w-2 h-2 bg-slate-600 rounded-full hover:bg-yellow-500" title="Move to In Progress"></button>}
                                    {col.id !== 'done' && <button onClick={() => moveTask(task.id, col.id, 'done')} className="w-2 h-2 bg-slate-600 rounded-full hover:bg-green-500" title="Move to Done"></button>}
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-slate-500 text-xs font-bold hover:text-white hover:border-slate-500 flex items-center justify-center gap-1" title="Create New Task">
                            <PlusIcon className="w-3 h-3" /> Add Task
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const ChatView = () => (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-400" /> Team Chat
                </h3>
                <span className="text-xs text-green-400 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> PyPing Active</span>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-400">{msg.user}</span>
                            <span className="text-[10px] text-slate-600">{msg.time}</span>
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            msg.user === 'You' ? 'bg-purple-600 text-white rounded-tr-none' : 
                            msg.user === 'PyPing Bot' ? 'bg-green-900/20 border border-green-500/30 text-green-300' :
                            'bg-slate-800 text-slate-300 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input 
                    className="flex-grow bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Type a message to team or @PyPing..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                />
                <button type="submit" className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors" title="Send Message">
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );

    const CICDView = () => (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Build Success Rate</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">98.5%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Avg Deploy Time</p>
                    <p className="text-2xl font-bold text-blue-400 mt-1">4m 12s</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <p className="text-xs text-slate-500 uppercase font-bold">Active Environments</p>
                    <p className="text-2xl font-bold text-purple-400 mt-1">3</p>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-500 text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Build ID</th>
                            <th className="px-6 py-3">Commit</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Duration</th>
                            <th className="px-6 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-purple-400">#3492</td>
                            <td className="px-6 py-4">fix: auth headers</td>
                            <td className="px-6 py-4"><span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded font-bold flex items-center gap-1 w-fit"><CheckCircleIcon className="w-3 h-3" /> Passed</span></td>
                            <td className="px-6 py-4">3m 45s</td>
                            <td className="px-6 py-4 text-slate-500">10 mins ago</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-purple-400">#3491</td>
                            <td className="px-6 py-4">feat: new dashboard</td>
                            <td className="px-6 py-4"><span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded font-bold flex items-center gap-1 w-fit"><CheckCircleIcon className="w-3 h-3" /> Passed</span></td>
                            <td className="px-6 py-4">4m 20s</td>
                            <td className="px-6 py-4 text-slate-500">1 hour ago</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-purple-400">#3490</td>
                            <td className="px-6 py-4">chore: update deps</td>
                            <td className="px-6 py-4"><span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded font-bold flex items-center gap-1 w-fit"><CheckCircleIcon className="w-3 h-3" /> Passed</span></td>
                            <td className="px-6 py-4">2m 10s</td>
                            <td className="px-6 py-4 text-slate-500">2 hours ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-900/20 p-2 rounded-lg">
                        <ClipboardDocumentCheckIcon className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg">PyProd</h2>
                        <p className="text-xs text-slate-400">Project Management & DevOps</p>
                    </div>
                </div>
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button onClick={() => setActiveTab('board')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'board' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Kanban</button>
                    <button onClick={() => setActiveTab('chat')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Team Chat</button>
                    <button onClick={() => setActiveTab('cicd')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'cicd' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>CI/CD</button>
                    <button onClick={() => setActiveTab('docs')} className={`px-4 py-1.5 rounded text-xs font-bold transition-colors ${activeTab === 'docs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>Docs</button>
                </div>
            </div>

            <div className="flex-grow overflow-hidden relative bg-slate-950 p-4">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                {activeTab === 'board' && <BoardView />}
                {activeTab === 'chat' && <ChatView />}
                {activeTab === 'cicd' && <CICDView />}
                {activeTab === 'docs' && (
                    <div className="h-full flex items-center justify-center text-slate-500 flex-col gap-4">
                        <DocumentTextIcon className="w-16 h-16 opacity-20" />
                        <p>Connected to PySrch Workspace Docs.</p>
                        <button className="text-indigo-400 hover:text-indigo-300 underline text-sm">Open PyWord</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PyProd;
