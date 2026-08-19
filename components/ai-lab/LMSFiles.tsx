
import React, { useState } from 'react';
import type { LMSFile } from '../../types.ts';
import { FolderIcon, DocumentTextIcon, CloudArrowDownIcon, UploadIcon, TrashIcon } from '../Icons.tsx';

const MOCK_FILES: LMSFile[] = [
    { id: '1', name: 'Syllabus.pdf', type: 'pdf', size: '2.4 MB', date: '2025-01-15' },
    { id: '2', name: 'lecture_01_notes.py', type: 'code', size: '4 KB', date: '2025-01-16' },
    { id: '3', name: 'data_structure_cheatsheet.pdf', type: 'pdf', size: '1.1 MB', date: '2025-01-20' },
];

const LMSFiles: React.FC = () => {
    const [files, setFiles] = useState<LMSFile[]>(MOCK_FILES);

    const handleUpload = () => {
        // Simulation
        const newFile: LMSFile = {
            id: Date.now().toString(),
            name: `assignment_upload_${Math.floor(Math.random() * 100)}.py`,
            type: 'code',
            size: '2 KB',
            date: new Date().toISOString().split('T')[0]
        };
        setFiles([newFile, ...files]);
    };

    const handleDelete = (id: string) => {
        setFiles(files.filter(f => f.id !== id));
    };

    return (
        <div className="h-full bg-gray-900 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <FolderIcon className="w-5 h-5 text-yellow-400" />
                    Course Resources
                </h3>
                <button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <UploadIcon className="w-4 h-4" />
                    Upload Assignment
                </button>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map(file => (
                        <div key={file.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors group relative">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-3 bg-gray-700 rounded-lg">
                                    {file.type === 'pdf' ? (
                                        <DocumentTextIcon className="w-6 h-6 text-red-400" />
                                    ) : (
                                        <CloudArrowDownIcon className="w-6 h-6 text-blue-400" />
                                    )}
                                </div>
                                <button onClick={() => handleDelete(file.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <h4 className="font-bold text-white truncate" title={file.name}>{file.name}</h4>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>{file.size}</span>
                                <span>{file.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LMSFiles;
