
import React, { useState, useEffect } from 'react';
import { 
    DocumentTextIcon, TableCellsIcon, PresentationChartLineIcon, 
    CloudArrowUpIcon, EnvelopeIcon, CalendarIcon, VideoCameraIcon, 
    XMarkIcon, SparklesIcon, DocumentIcon, CheckCircleIcon,
    PrinterIcon, BoldIcon, ItalicIcon, ListIcon, ArrowDownIcon, TrashIcon,
    DownloadIcon, PlusIcon, PaperAirplaneIcon, UserCircleIcon,
    PhoneIcon, PhoneXMarkIcon, MicrophoneIcon, StopIcon, ChevronLeftIcon, ChevronRightIcon, UserGroupIcon, ClipboardDocumentCheckIcon, ServerIcon, SpeakerWaveIcon,
    ArchiveBoxIcon, StarIcon
} from '../Icons.tsx';
import PyProd from './PyProd.tsx';

type AppType = 'pyword' | 'pytab' | 'pyslides' | 'pydrive' | 'pymail' | 'pycal' | 'pyhuddle' | 'pyprod' | null;

const APPS = [
    { id: 'pyword', name: 'PyWord', icon: <DocumentIcon className="w-8 h-8 text-blue-500" />, desc: 'AI-Powered Docs' },
    { id: 'pytab', name: 'PyTab', icon: <TableCellsIcon className="w-8 h-8 text-green-500" />, desc: 'Smart Spreadsheets' },
    { id: 'pyslides', name: 'PySlides', icon: <PresentationChartLineIcon className="w-8 h-8 text-orange-500" />, desc: 'Auto Presentations' },
    { id: 'pydrive', name: 'PyDrive', icon: <CloudArrowUpIcon className="w-8 h-8 text-yellow-500" />, desc: 'Unlimited Storage' },
    { id: 'pymail', name: 'PyMail', icon: <EnvelopeIcon className="w-8 h-8 text-red-500" />, desc: 'Secure Email' },
    { id: 'pycal', name: 'PyCal', icon: <CalendarIcon className="w-8 h-8 text-purple-500" />, desc: 'Smart Scheduling' },
    { id: 'pyhuddle', name: 'PyHuddle', icon: <VideoCameraIcon className="w-8 h-8 text-pink-500" />, desc: 'Video Conferencing' },
    { id: 'pyprod', name: 'PyProd', icon: <ClipboardDocumentCheckIcon className="w-8 h-8 text-indigo-500" />, desc: 'Project Management' },
];

// Helper for TTS
const speak = (text: string) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-Speech not supported in this browser.");
    }
};

const MenuBar: React.FC<{ title: string, onExport?: (fmt: string) => void }> = ({ title, onExport }) => {
    const [toast, setToast] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleMenuClick = (menu: string) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menu);
        }
    };

    const handleMenuItemClick = (action: string) => {
        setToast(`${action} action executed`);
        setActiveMenu(null);
        setTimeout(() => setToast(null), 1500);
    };

    const handleSaveToVPS = () => {
        setToast("Saving to VPS: /var/www/html...");
        setTimeout(() => setToast("Saved to VPS Successfully!"), 1500);
        setTimeout(() => setToast(null), 3000);
    }

    return (
        <div className="bg-slate-100 p-2 border-b flex items-center justify-between text-slate-700 shrink-0 relative z-20">
            {toast && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded z-50 animate-pop-in shadow-lg">
                    {toast}
                </div>
            )}
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg ml-2 text-slate-800" title="Current File">{title}</span>
                <div className="flex gap-1 text-sm relative">
                    {['File', 'Edit', 'View', 'Help'].map(menu => (
                        <div key={menu} className="relative">
                            <button 
                                onClick={() => handleMenuClick(menu)} 
                                className={`px-2 py-1 hover:bg-slate-200 rounded ${activeMenu === menu ? 'bg-slate-200' : ''}`}
                                title={`${menu} Menu`}
                            >
                                {menu}
                            </button>
                            {activeMenu === menu && (
                                <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-slate-300 shadow-xl rounded-md py-1 z-50">
                                    <button onClick={() => handleMenuItemClick(`New ${menu} Item`)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm">New...</button>
                                    <button onClick={() => handleMenuItemClick(`${menu} Settings`)} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm">Settings</button>
                                    <div className="border-t border-slate-200 my-1"></div>
                                    <button onClick={() => handleMenuItemClick('Close')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-500">Exit</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2 mr-4" title="Active Collaborators">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[10px] text-white">JD</div>
                    <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-[10px] text-white">SK</div>
                </div>
                
                <button onClick={handleSaveToVPS} className="flex items-center gap-1 px-3 py-1 bg-slate-800 text-green-400 rounded hover:bg-slate-700 text-xs font-bold transition-colors border border-slate-600" title="Save directly to Virtual Private Server">
                    <ServerIcon className="w-3 h-3" /> Save to VPS
                </button>

                {onExport && (
                    <div className="relative group">
                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-bold transition-colors" title="Export Document">
                            <DownloadIcon className="w-4 h-4" /> Export
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-300 shadow-lg rounded-md hidden group-hover:block z-10">
                            <button onClick={() => onExport('pdf')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm transition-colors" title="Export as PDF">PDF Document</button>
                            <button onClick={() => onExport('docx')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm transition-colors" title="Export as Word">Word (.docx)</button>
                            <button onClick={() => onExport('txt')} className="block w-full text-left px-4 py-2 hover:bg-slate-100 text-sm transition-colors" title="Export as Text">Plain Text</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PyWordApp = () => {
    const [content, setContent] = useState("PyCom Cloud Documentation\n\n1. Introduction\nPyCom Cloud is a state-of-the-art infrastructure platform designed for AI-native applications.\n\n2. Features\n- Auto-scaling GPU Clusters\n- Integrated MCP Bridge\n- Secure VPS/VPN Tunneling");
    const [format, setFormat] = useState({ bold: false, italic: false, align: 'left' });

    const toggleFormat = (type: 'bold' | 'italic') => {
        setFormat(prev => ({ ...prev, [type]: !prev[type] }));
    };
    
    const handleExport = (fmt: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document.${fmt === 'pdf' ? 'pdf' : fmt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900">
            <MenuBar title="Untitled Doc" onExport={handleExport} />
            <div className="bg-slate-50 border-b p-2 flex gap-2 items-center shrink-0">
                <button className="p-1 hover:bg-slate-200 rounded transition-colors" title="Print"><PrinterIcon className="w-4 h-4 text-slate-600" /></button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button onClick={() => toggleFormat('bold')} className={`p-1 rounded transition-colors ${format.bold ? 'bg-blue-200' : 'hover:bg-slate-200'}`} title="Bold"><BoldIcon className="w-4 h-4 text-slate-600" /></button>
                <button onClick={() => toggleFormat('italic')} className={`p-1 rounded transition-colors ${format.italic ? 'bg-blue-200' : 'hover:bg-slate-200'}`} title="Italic"><ItalicIcon className="w-4 h-4 text-slate-600" /></button>
                <button className="p-1 hover:bg-slate-200 rounded transition-colors" title="List"><ListIcon className="w-4 h-4 text-slate-600" /></button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button onClick={() => speak(content)} className="p-1 hover:bg-slate-200 rounded transition-colors" title="Read Aloud"><SpeakerWaveIcon className="w-4 h-4 text-slate-600" /></button>
                <div className="h-4 w-px bg-slate-300 mx-1"></div>
                <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-bold flex items-center gap-1 hover:bg-purple-200 transition-colors" title="AI Assistant">
                    <SparklesIcon className="w-3 h-3" /> AI Writer
                </button>
            </div>
            <div className="flex-grow bg-gray-100 p-8 overflow-y-auto flex justify-center">
                <div className="bg-white w-full max-w-[800px] min-h-[1000px] shadow-lg p-10 border border-gray-200">
                    <textarea 
                        className={`w-full h-full outline-none resize-none text-slate-800 font-serif leading-relaxed ${format.bold ? 'font-bold' : ''} ${format.italic ? 'italic' : ''}`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>
            <div className="bg-slate-100 border-t p-1 px-4 text-xs text-slate-500 flex justify-between shrink-0">
                <span>Page 1 of 1</span>
                <span>{content.split(/\s+/).length} words</span>
            </div>
        </div>
    );
};

const PyTabApp = () => {
    const [rows, setRows] = useState(30);
    
    return (
        <div className="flex flex-col h-full bg-white text-slate-900">
            <MenuBar title="Financial_Q3.xlsx" onExport={() => alert('Exporting spreadsheet...')} />
            <div className="flex items-center gap-2 p-2 border-b bg-slate-50 shrink-0">
                <div className="font-bold text-slate-500 px-2" title="Formula Bar">fx</div>
                <input type="text" className="flex-grow border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" placeholder="=SUM(A1:A10)" title="Enter Formula" />
            </div>
            <div className="flex-grow overflow-auto">
                <div className="flex border-b sticky top-0 z-10">
                    <div className="w-10 bg-gray-100 border-r border-b flex-shrink-0"></div>
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => (
                        <div key={col} className="w-24 bg-gray-100 border-r border-b text-center py-1 font-bold text-xs text-slate-600 flex-shrink-0">{col}</div>
                    ))}
                    <button className="w-8 bg-gray-100 hover:bg-gray-200 border-b flex items-center justify-center" title="Add Column">
                        <PlusIcon className="w-3 h-3 text-slate-500" />
                    </button>
                </div>
                {Array.from({length: rows}).map((_, row) => (
                    <div key={row} className="flex h-6">
                        <div className="w-10 bg-gray-100 border-r border-b text-center py-1 text-xs font-bold text-slate-600 flex-shrink-0">{row + 1}</div>
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => (
                            <div key={col} className="w-24 border-r border-b outline-none focus:bg-blue-50 text-xs px-1 flex-shrink-0" contentEditable></div>
                        ))}
                    </div>
                ))}
                <button onClick={() => setRows(rows + 10)} className="w-full py-2 text-xs text-slate-500 hover:bg-slate-50 border-t" title="Load More Rows">
                    + Add 10 Rows
                </button>
            </div>
            <div className="bg-slate-100 border-t p-1 px-2 flex gap-1 shrink-0">
                <button className="bg-white px-4 py-0.5 text-xs rounded-t border-t border-x font-bold text-green-600">Sheet1</button>
                <button className="px-2 py-0.5 text-slate-500 hover:bg-slate-200 rounded" title="New Sheet"><PlusIcon className="w-3 h-3" /></button>
            </div>
        </div>
    );
};

const PySlidesApp = () => {
    const [activeSlide, setActiveSlide] = useState(1);
    
    return (
        <div className="flex flex-col h-full bg-white text-slate-900">
            <MenuBar title="Pitch Deck" />
            <div className="flex flex-grow overflow-hidden">
                <div className="w-48 bg-slate-100 border-r p-4 space-y-4 overflow-y-auto shrink-0">
                    {[1, 2, 3].map(i => (
                        <div 
                            key={i} 
                            onClick={() => setActiveSlide(i)}
                            className={`aspect-video bg-white border-2 rounded shadow-sm p-2 cursor-pointer transition-all ${activeSlide === i ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-slate-300'}`}
                            title={`Go to Slide ${i}`}
                        >
                            <div className="text-[8px] text-slate-400 mb-1">Slide {i}</div>
                            <div className="w-full h-1 bg-slate-200 mb-1"></div>
                            <div className="w-2/3 h-1 bg-slate-200"></div>
                        </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-colors flex justify-center" title="Add New Slide">
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-grow bg-slate-200 p-8 flex items-center justify-center">
                    <div className="aspect-video w-full max-w-3xl bg-white shadow-2xl rounded-lg p-12 flex flex-col justify-center items-center text-center border border-slate-300 relative animate-fade-in-up" key={activeSlide}>
                        {activeSlide === 1 && (
                            <>
                                <h1 className="text-5xl font-bold text-slate-800 mb-4 outline-none focus:border-b-2 border-blue-500" contentEditable title="Edit Title">PyCom</h1>
                                <p className="text-2xl text-slate-500 outline-none focus:border-b-2 border-blue-500" contentEditable title="Edit Subtitle">The Future of AI Education</p>
                            </>
                        )}
                        {activeSlide === 2 && (
                            <>
                                <h2 className="text-4xl font-bold text-slate-800 mb-4" contentEditable>The Problem</h2>
                                <ul className="text-left list-disc pl-5 text-xl text-slate-600 space-y-2">
                                    <li contentEditable>Static Learning</li>
                                    <li contentEditable>Lack of Engagement</li>
                                    <li contentEditable>Outdated Tools</li>
                                </ul>
                            </>
                        )}
                        {activeSlide === 3 && (
                            <>
                                <h2 className="text-4xl font-bold text-slate-800 mb-4" contentEditable>The Solution</h2>
                                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                                    <div className="p-4 bg-blue-50 rounded border border-blue-200" contentEditable>AI Tutor</div>
                                    <div className="p-4 bg-green-50 rounded border border-green-200" contentEditable>Interactive Code</div>
                                    <div className="p-4 bg-purple-50 rounded border border-purple-200" contentEditable>Real-time Feedback</div>
                                    <div className="p-4 bg-orange-50 rounded border border-orange-200" contentEditable>Gamification</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple placeholders for other apps
const PyDriveApp = () => (
    <div className="flex flex-col h-full bg-white text-slate-900">
        <MenuBar title="PyDrive - Cloud Storage" />
        <div className="flex-grow p-6">
            <div className="grid grid-cols-4 gap-4">
                {['Project Specs', 'Assets', 'Backups', 'Shared'].map(folder => (
                    <div key={folder} className="p-4 border rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 cursor-pointer" title={`Open ${folder}`}>
                        <CloudArrowUpIcon className="w-12 h-12 text-blue-400 mb-2" />
                        <span className="text-sm font-semibold">{folder}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PyMailApp = () => {
    const [activeFolder, setActiveFolder] = useState<'inbox'|'sent'|'drafts'>('inbox');
    const [selectedEmail, setSelectedEmail] = useState<any>(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [emails, setEmails] = useState({
        inbox: [
            { id: 1, from: 'Jeyabal Anthony', subject: 'Welcome to PyCom Team!', date: '10:30 AM', body: 'Hi Team,\n\nWelcome to the future of AI education. Let\'s build something amazing.\n\nCheers,\nJeyabal' },
            { id: 2, from: 'Billy Jay', subject: 'Q3 Sales Targets Updated', date: 'Yesterday', body: 'Attached are the revised targets for Q3. We are aiming for $50k MRR growth.' },
            { id: 3, from: 'HR Dept', subject: 'New Policy Update', date: '2 days ago', body: 'Please review the attached document regarding the new remote work policy.' }
        ],
        sent: [
            { id: 4, to: 'Client A', subject: 'Proposal Follow-up', date: 'Yesterday', body: 'Just checking in on the proposal we sent last week.' }
        ],
        drafts: [
            { id: 5, to: '', subject: 'Meeting Notes', date: 'Today', body: 'Agenda: 1. Review metrics 2. Discuss roadmap' }
        ]
    });

    const handleSend = (to: string, subject: string, body: string) => {
        const newEmail = { id: Date.now(), to, subject, date: 'Just now', body };
        setEmails(prev => ({ ...prev, sent: [newEmail, ...prev.sent] }));
        setIsComposeOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-white text-slate-900 relative">
            <MenuBar title={`PyMail - ${activeFolder.charAt(0).toUpperCase() + activeFolder.slice(1)}`} />
            
            {/* Compose Modal */}
            {isComposeOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden h-[500px]">
                        <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                            <span className="font-bold">New Message</span>
                            <button onClick={() => setIsComposeOpen(false)}><XMarkIcon className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 flex flex-col flex-grow gap-4">
                            <input className="border-b p-2 outline-none" placeholder="To" />
                            <input className="border-b p-2 outline-none" placeholder="Subject" />
                            <textarea className="flex-grow outline-none resize-none p-2" placeholder="Write your message..." />
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2 bg-slate-50">
                            <button onClick={() => setIsComposeOpen(false)} className="text-slate-500 hover:text-slate-700 px-4 py-2">Discard</button>
                            <button onClick={() => handleSend('demo@pycom.io', 'Demo', 'Test')} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold flex items-center gap-2">
                                <PaperAirplaneIcon className="w-4 h-4" /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-full overflow-hidden">
                {/* Sidebar */}
                <div className="w-48 border-r bg-slate-50 flex flex-col">
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="m-4 bg-blue-600 text-white py-2 px-4 rounded-full font-bold shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        title="Write new email"
                    >
                        <PlusIcon className="w-5 h-5" /> Compose
                    </button>
                    <div className="space-y-1 px-2">
                        <button onClick={() => {setActiveFolder('inbox'); setSelectedEmail(null)}} className={`w-full text-left px-4 py-2 rounded text-sm font-medium flex items-center gap-3 ${activeFolder === 'inbox' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-200 text-slate-600'}`}>
                            <ArchiveBoxIcon className="w-4 h-4" /> Inbox
                        </button>
                        <button onClick={() => {setActiveFolder('sent'); setSelectedEmail(null)}} className={`w-full text-left px-4 py-2 rounded text-sm font-medium flex items-center gap-3 ${activeFolder === 'sent' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-200 text-slate-600'}`}>
                            <PaperAirplaneIcon className="w-4 h-4" /> Sent
                        </button>
                        <button onClick={() => {setActiveFolder('drafts'); setSelectedEmail(null)}} className={`w-full text-left px-4 py-2 rounded text-sm font-medium flex items-center gap-3 ${activeFolder === 'drafts' ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-200 text-slate-600'}`}>
                            <DocumentIcon className="w-4 h-4" /> Drafts
                        </button>
                    </div>
                </div>

                {/* Email List */}
                <div className="w-80 border-r overflow-y-auto bg-white">
                    {emails[activeFolder].map((email: any) => (
                        <div 
                            key={email.id} 
                            onClick={() => setSelectedEmail(email)}
                            className={`border-b p-4 cursor-pointer transition-colors ${selectedEmail?.id === email.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className={`font-bold text-sm ${selectedEmail?.id === email.id ? 'text-blue-800' : 'text-slate-800'}`}>{email.from || email.to}</span>
                                <span className="text-xs text-slate-500">{email.date}</span>
                            </div>
                            <div className="text-sm font-medium text-slate-700 truncate">{email.subject}</div>
                            <div className="text-xs text-slate-500 truncate mt-1">{email.body}</div>
                        </div>
                    ))}
                </div>

                {/* Reading Pane */}
                <div className="flex-grow bg-white p-8 overflow-y-auto">
                    {selectedEmail ? (
                        <div className="animate-fade-in-up">
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedEmail.subject}</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                                            {(selectedEmail.from || selectedEmail.to).charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{selectedEmail.from || `To: ${selectedEmail.to}`}</p>
                                            <p className="text-xs text-slate-500">{selectedEmail.date}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => speak(selectedEmail.body)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Read Aloud">
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500" title="Star">
                                        <StarIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-red-50 rounded-full text-red-400" title="Delete">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="prose max-w-none text-slate-700 whitespace-pre-wrap">
                                {selectedEmail.body}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <EnvelopeIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select an email to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PyCalApp = () => (
    <div className="flex flex-col h-full bg-white text-slate-900">
        <MenuBar title="PyCal - Schedule" />
        <div className="flex-grow p-6 flex items-center justify-center">
            <div className="text-center text-slate-400">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Calendar View Placeholder</p>
            </div>
        </div>
    </div>
);

const PyHuddleApp = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
        <div className="flex-grow flex items-center justify-center bg-slate-800 m-4 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center text-4xl font-bold shadow-2xl">JA</div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-sm">Jeyabal Anthony (Host)</div>
        </div>
        <div className="h-20 bg-black flex items-center justify-center gap-4 border-t border-slate-700">
            <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white" title="Toggle Mic"><MicrophoneIcon className="w-6 h-6" /></button>
            <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white" title="Toggle Camera"><VideoCameraIcon className="w-6 h-6" /></button>
            <button className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white px-6 font-bold" title="Leave Call">End Call</button>
        </div>
    </div>
);

const PySrchWorkspace: React.FC = () => {
    const [activeApp, setActiveApp] = useState<AppType>(null);

    const renderApp = () => {
        switch(activeApp) {
            case 'pyword': return <PyWordApp />;
            case 'pytab': return <PyTabApp />;
            case 'pyslides': return <PySlidesApp />;
            case 'pyprod': return <PyProd />;
            case 'pydrive': return <PyDriveApp />;
            case 'pymail': return <PyMailApp />;
            case 'pycal': return <PyCalApp />;
            case 'pyhuddle': return <PyHuddleApp />;
            default: return null;
        }
    };

    if (activeApp) {
        return (
            <div className="h-full flex flex-col relative">
                <button 
                    onClick={() => setActiveApp(null)}
                    className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-1 rounded-full text-xs font-bold shadow-xl z-50 hover:bg-slate-700 transition-colors border border-slate-600 flex items-center gap-2"
                    title="Close Application"
                >
                    <XMarkIcon className="w-3 h-3" /> Close App
                </button>
                {renderApp()}
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">PySrch Workspace</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {APPS.map(app => (
                    <button 
                        key={app.id}
                        onClick={() => setActiveApp(app.id as AppType)}
                        className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:scale-105 transition-all group w-40 h-40 justify-center shadow-lg"
                        title={`Launch ${app.name} - ${app.desc}`}
                    >
                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                            {app.icon}
                        </div>
                        <span className="font-bold text-white text-sm">{app.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PySrchWorkspace;
