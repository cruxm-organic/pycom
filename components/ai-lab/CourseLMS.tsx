
import React, { useState } from 'react';
import type { LMSView } from '../../types.ts';
import { AcademicCapIcon, ChatBubbleLeftRightIcon, FolderIcon, BellIcon, XMarkIcon } from '../Icons.tsx';
import ClassroomView from './ClassroomView.tsx';
import LMSChat from './LMSChat.tsx';
import LMSFiles from './LMSFiles.tsx';
import LMSNotes from './LMSNotes.tsx';

interface CourseLMSProps {
    courseTitle: string;
    onLeaveClass: () => void;
}

const CourseLMS: React.FC<CourseLMSProps> = ({ courseTitle, onLeaveClass }) => {
    const [activeView, setActiveView] = useState<LMSView>('classroom');

    const renderView = () => {
        switch (activeView) {
            case 'classroom': return <ClassroomView courseTitle={courseTitle} />;
            case 'chat': return <LMSChat courseTitle={courseTitle} />;
            case 'files': return <LMSFiles />;
            case 'notes': return <LMSNotes courseTitle={courseTitle} />;
            default: return <ClassroomView courseTitle={courseTitle} />;
        }
    };

    const NavButton: React.FC<{ view: LMSView, icon: any, label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeView === view 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {icon}
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-900/50 p-2 rounded-lg">
                        <AcademicCapIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg leading-tight">{courseTitle}</h2>
                        <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Virtual Campus</p>
                    </div>
                </div>
                <button onClick={onLeaveClass} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 hidden lg:flex">
                    <NavButton view="classroom" icon={<AcademicCapIcon className="w-5 h-5" />} label="Classroom" />
                    <NavButton view="chat" icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} label="Discussion" />
                    <NavButton view="files" icon={<FolderIcon className="w-5 h-5" />} label="Resources" />
                    <NavButton view="notes" icon={<BellIcon className="w-5 h-5" />} label="Daily Notes" />
                    
                    <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-400 mb-2 font-bold uppercase">AI Status</p>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Professor Py is Online
                        </div>
                    </div>
                </div>

                {/* Mobile Nav (Top) */}
                <div className="lg:hidden flex justify-around bg-slate-900 border-b border-slate-800 p-2">
                     <button onClick={() => setActiveView('classroom')} className={`p-2 rounded ${activeView === 'classroom' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><AcademicCapIcon className="w-6 h-6" /></button>
                     <button onClick={() => setActiveView('chat')} className={`p-2 rounded ${activeView === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><ChatBubbleLeftRightIcon className="w-6 h-6" /></button>
                     <button onClick={() => setActiveView('files')} className={`p-2 rounded ${activeView === 'files' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><FolderIcon className="w-6 h-6" /></button>
                     <button onClick={() => setActiveView('notes')} className={`p-2 rounded ${activeView === 'notes' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}><BellIcon className="w-6 h-6" /></button>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow p-4 overflow-hidden bg-black/20">
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

export default CourseLMS;
