
import React, { useState, useEffect } from 'react';
import type { LMSNote } from '../../types.ts';
import { BellIcon, ClockIcon } from '../Icons.tsx';

const LMSNotes: React.FC<{ courseTitle: string }> = ({ courseTitle }) => {
    const [notes, setNotes] = useState<LMSNote[]>([]);

    useEffect(() => {
        // Simulate fetching daily broadcasts
        const mockNotes: LMSNote[] = [
            {
                id: '1',
                title: 'Welcome to the Course!',
                content: `Welcome to ${courseTitle}. I am Professor Py. Please review the syllabus in the Resources tab.`,
                timestamp: new Date(),
                isImportant: true
            },
            {
                id: '2',
                title: 'Today\'s Focus: Variables',
                content: 'Remember: Variables are containers for storing data values. Python has no command for declaring a variable.',
                timestamp: new Date(Date.now() - 86400000),
                isImportant: false
            }
        ];
        setNotes(mockNotes);
    }, [courseTitle]);

    // PushPinIcon is not in Icons.tsx, let's define a simple inline svg or use BellIcon for important ones
    
    return (
        <div className="h-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-yellow-400" />
                    Daily Broadcasts & Notes
                </h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {notes.map(note => (
                    <div key={note.id} className={`p-4 rounded-lg border ${note.isImportant ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-800 border-gray-700'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className={`font-bold ${note.isImportant ? 'text-purple-300' : 'text-white'}`}>{note.title}</h4>
                            {note.isImportant && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">Pinned</span>}
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{note.content}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockIcon className="w-3 h-3" />
                            <span>{note.timestamp.toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LMSNotes;
