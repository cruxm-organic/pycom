
import React, { useState, useEffect } from 'react';
import type { GitFile, GitRepo, GitCommit } from '../../types.ts';
import { GitBranchIcon, CloudArrowDownIcon, CloudArrowUpIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon, PlusIcon, ArrowRightOnRectangleIcon, CubeIcon, ArrowPathIcon, LockClosedIcon } from '../Icons.tsx';

const TEMPLATES = [
    { id: 'flask', name: 'flask-starter', url: 'github.com/pycom/flask-starter', description: 'Basic Flask app structure with templates.', icon: '🌶️' },
    { id: 'django', name: 'django-crm', url: 'github.com/pycom/django-crm', description: 'Full-featured Django project with auth.', icon: '🛡️' },
    { id: 'data', name: 'pandas-analysis', url: 'github.com/pycom/pandas-analysis', description: 'Data pipelines with Pandas and NumPy.', icon: '📊' },
    { id: 'ai', name: 'gemini-agent', url: 'github.com/pycom/gemini-agent', description: 'Boilerplate for building AI agents.', icon: '🤖' },
];

const GitManager: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [repo, setRepo] = useState<GitRepo | null>(null);
    const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPushing, setIsPushing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [showNewBranchInput, setShowNewBranchInput] = useState(false);
    const [syncStatus, setSyncStatus] = useState<'synced' | 'ahead' | 'behind'>('synced');

    // Mock files for simulation
    const mockFiles: GitFile[] = [
        { name: 'main.py', content: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()', originalContent: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()', status: 'unmodified' },
        { name: 'utils.py', content: 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b', originalContent: 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b', status: 'unmodified' },
        { name: 'README.md', content: '# PyCom Project\nThis is a simulated repository for learning Git.', originalContent: '# PyCom Project\nThis is a simulated repository for learning Git.', status: 'unmodified' }
    ];

    const handleClone = (url: string = repoUrl) => {
        if (!url.trim()) return;
        
        setIsLoading(true);
        
        // Simulate network delay
        setTimeout(() => {
            const newRepo: GitRepo = {
                url: url,
                name: url.split('/').pop() || 'project',
                files: JSON.parse(JSON.stringify(mockFiles)), // Deep copy
                commits: [
                    { id: 'a1b2c3d', message: 'Initial commit', timestamp: Date.now() - 86400000, author: 'System', changes: ['ALL'] }
                ],
                branch: 'main',
                branches: ['main', 'develop', 'feature/login']
            };
            setRepo(newRepo);
            setActiveFileIndex(0);
            setFileContent(newRepo.files[0].content);
            setIsLoading(false);
            setSyncStatus('synced');
        }, 1500);
    };

    const handleFileSelect = (index: number) => {
        setActiveFileIndex(index);
        if (repo) {
            setFileContent(repo.files[index].content);
        }
    };

    const handleContentChange = (newContent: string) => {
        setFileContent(newContent);
        if (repo && activeFileIndex !== null) {
            const updatedFiles = [...repo.files];
            updatedFiles[activeFileIndex].content = newContent;
            
            // Check status
            if (newContent !== updatedFiles[activeFileIndex].originalContent) {
                updatedFiles[activeFileIndex].status = 'modified';
            } else {
                updatedFiles[activeFileIndex].status = 'unmodified';
            }
            
            setRepo({ ...repo, files: updatedFiles });
        }
    };

    const handleCommit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!repo || !commitMessage.trim()) return;

        const modifiedFiles = repo.files.filter(f => f.status === 'modified');
        if (modifiedFiles.length === 0) {
            alert("No changes to commit!");
            return;
        }

        const newCommit: GitCommit = {
            id: Math.random().toString(36).substring(2, 9), // Mock SHA
            message: commitMessage,
            timestamp: Date.now(),
            author: 'You',
            changes: modifiedFiles.map(f => f.name)
        };

        // Update files: set originalContent to current content, reset status
        const updatedFiles = repo.files.map(f => ({
            ...f,
            originalContent: f.content,
            status: 'unmodified' as const
        }));

        setRepo({
            ...repo,
            files: updatedFiles,
            commits: [newCommit, ...repo.commits]
        });
        setCommitMessage('');
        setSyncStatus('ahead');
    };

    const handlePush = () => {
        if (!repo) return;
        setIsPushing(true);
        setTimeout(() => {
            setIsPushing(false);
            setSyncStatus('synced');
            alert(`Successfully pushed commits to origin/${repo.branch}`);
        }, 2000);
    };

    const handlePull = () => {
        if (!repo) return;
        setIsPulling(true);
        setTimeout(() => {
            // Simulate an incoming commit
            const incomingCommit: GitCommit = {
                id: Math.random().toString(36).substring(2, 9),
                message: 'Update from remote collaborator',
                timestamp: Date.now(),
                author: 'Teammate',
                changes: ['utils.py']
            };
            
            setRepo(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    commits: [incomingCommit, ...prev.commits]
                };
            });
            setIsPulling(false);
            setSyncStatus('synced');
            alert('Pulled latest changes from origin.');
        }, 2000);
    };

    const handleBranchChange = (branch: string) => {
        if (repo) {
            setRepo({ ...repo, branch });
            // In a real app, we would reload files for that branch
        }
    };

    const createBranch = () => {
        if (repo && newBranchName.trim()) {
            setRepo({ 
                ...repo, 
                branches: [...repo.branches, newBranchName],
                branch: newBranchName
            });
            setNewBranchName('');
            setShowNewBranchInput(false);
        }
    };

    const saveToSnippets = () => {
        if (!repo || activeFileIndex === null) return;
        
        const currentFile = repo.files[activeFileIndex];
        const snippet = {
            id: Date.now().toString(),
            title: `From Git: ${currentFile.name}`,
            language: 'python',
            code: fileContent,
            category: 'Git Snippets',
            createdAt: Date.now()
        };

        const existingSnippets = JSON.parse(localStorage.getItem('pycom_snippets') || '[]');
        localStorage.setItem('pycom_snippets', JSON.stringify([snippet, ...existingSnippets]));
        alert('File saved to Snippet Library!');
    };

    if (!repo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-900/50 rounded-xl border border-purple-500/30 p-8">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-10">
                        <div className="mx-auto bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mb-4 border border-gray-700 shadow-xl">
                            <CloudArrowDownIcon className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">Git Manager</h3>
                        <p className="text-gray-400">Clone a repository to start editing, committing, and pushing code.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Manual Clone */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <LockClosedIcon className="w-5 h-5 text-blue-400" />
                                Clone via URL
                            </h4>
                            <form onSubmit={(e) => { e.preventDefault(); handleClone(); }} className="space-y-4 flex-grow flex flex-col justify-center">
                                <input 
                                    type="text" 
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Clone Repository'}
                                </button>
                            </form>
                        </div>

                        {/* Template Gallery */}
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CubeIcon className="w-5 h-5 text-green-400" />
                                Quick Start Templates
                            </h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {TEMPLATES.map(template => (
                                    <button 
                                        key={template.id}
                                        onClick={() => handleClone(template.url)}
                                        className="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-gray-700 border border-gray-700 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{template.icon}</span>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-purple-300 transition-colors">{template.name}</p>
                                                    <p className="text-xs text-gray-500 truncate w-48">{template.url}</p>
                                                </div>
                                            </div>
                                            <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-600 group-hover:text-white" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const modifiedCount = repo.files.filter(f => f.status === 'modified').length;

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gray-800 p-3 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-purple-600 p-1.5 rounded-md">
                            <GitBranchIcon className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="font-bold text-white text-sm truncate max-w-[150px]">{repo.name}</h2>
                    </div>
                    
                    {/* Branch Selector */}
                    <div className="relative group">
                        <div className="flex items-center gap-1 text-xs bg-gray-900 text-gray-300 px-3 py-1.5 rounded-full font-mono cursor-pointer hover:bg-gray-700 transition-colors border border-gray-600">
                            <span className="text-purple-400">⎇</span> 
                            <select 
                                value={repo.branch} 
                                onChange={(e) => handleBranchChange(e.target.value)}
                                className="bg-transparent outline-none appearance-none cursor-pointer pr-2"
                            >
                                {repo.branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* New Branch Button */}
                    {!showNewBranchInput ? (
                        <button onClick={() => setShowNewBranchInput(true)} className="text-gray-400 hover:text-white bg-gray-700 p-1 rounded-full" title="New Branch">
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded">
                            <input 
                                type="text" 
                                value={newBranchName} 
                                onChange={(e) => setNewBranchName(e.target.value)}
                                placeholder="Branch..." 
                                className="bg-transparent text-xs text-white w-20 outline-none"
                                autoFocus
                            />
                            <button onClick={createBranch} className="text-green-400 hover:text-green-300"><CheckCircleIcon className="w-3 h-3" /></button>
                            <button onClick={() => setShowNewBranchInput(false)} className="text-red-400 hover:text-red-300 font-bold px-1">×</button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="flex items-center gap-2 mr-4">
                        <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-green-500' : syncStatus === 'ahead' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-xs text-gray-400 uppercase">{syncStatus}</span>
                    </div>
                    
                    <button 
                        onClick={handlePull}
                        disabled={isPulling}
                        className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors bg-gray-700 text-white hover:bg-gray-600"
                        title="Pull from Remote"
                    >
                        {isPulling ? <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span> : <ArrowPathIcon className="w-3 h-3" />}
                        Pull
                    </button>

                    <button 
                        onClick={handlePush}
                        disabled={isPushing || repo.commits.length === 0}
                        className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors ${isPushing ? 'bg-blue-900/50 text-blue-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        title="Push to Remote"
                    >
                        {isPushing ? <span className="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full"></span> : <CloudArrowUpIcon className="w-3 h-3" />}
                        Push
                    </button>
                    <div className="w-px h-6 bg-gray-600 mx-1"></div>
                    <button onClick={() => setRepo(null)} className="text-red-400 text-xs hover:text-red-300">Close</button>
                </div>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                {/* File Explorer */}
                <div className="w-full lg:w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
                    <div className="p-3 font-bold text-gray-500 text-[10px] uppercase tracking-wider bg-gray-800/80">Explorer</div>
                    <div className="flex-grow overflow-y-auto">
                        {repo.files.map((file, index) => (
                            <button
                                key={file.name}
                                onClick={() => handleFileSelect(index)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${activeFileIndex === index ? 'bg-purple-600/10 text-white border-l-2 border-purple-500' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <DocumentTextIcon className={`w-4 h-4 ${file.name.endsWith('.py') ? 'text-blue-400' : file.name.endsWith('.md') ? 'text-yellow-400' : 'text-gray-500'}`} />
                                    {file.name}
                                </div>
                                {file.status === 'modified' && <span className="text-yellow-400 font-bold text-xs">• M</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-grow flex flex-col bg-[#0d1117] min-w-0">
                    <div className="bg-gray-800/50 p-2 text-xs text-gray-500 border-b border-gray-700 flex justify-between items-center">
                        <span className="font-mono text-gray-300 ml-2">{activeFileIndex !== null ? repo.files[activeFileIndex].name : 'No file selected'}</span>
                        <div className="flex gap-2">
                            {activeFileIndex !== null && (
                                <button 
                                    onClick={saveToSnippets}
                                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors px-2 py-1 rounded hover:bg-purple-900/20"
                                    title="Save this file to Snippet Library"
                                >
                                    <ArrowRightOnRectangleIcon className="w-3 h-3" />
                                    Save to Snippets
                                </button>
                            )}
                        </div>
                    </div>
                    {activeFileIndex !== null ? (
                        <textarea 
                            value={fileContent}
                            onChange={(e) => handleContentChange(e.target.value)}
                            className="flex-grow bg-[#0d1117] p-4 font-mono text-sm text-gray-300 focus:outline-none resize-none leading-relaxed"
                            spellCheck={false}
                        />
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-600">
                            <CubeIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a file to start editing</p>
                        </div>
                    )}
                </div>

                {/* Git Controls */}
                <div className="w-full lg:w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
                    
                    {/* Staging Area */}
                    <div className="flex-grow p-4 overflow-y-auto border-b border-gray-700">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                            Source Control
                        </h3>
                        
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 mb-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-2">
                                <span>Staged Changes</span>
                                <span className="bg-gray-800 px-2 rounded text-white">{modifiedCount}</span>
                            </div>
                            {modifiedCount > 0 ? (
                                <ul className="space-y-1">
                                    {repo.files.filter(f => f.status === 'modified').map(f => (
                                        <li key={f.name} className="text-xs text-yellow-400 flex items-center gap-2 font-mono">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            {f.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-xs text-gray-600 italic">Working tree clean.</p>
                            )}
                        </div>

                        <form onSubmit={handleCommit} className="space-y-2">
                            <textarea 
                                placeholder="Commit message..."
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none h-16 resize-none"
                            />
                            <button 
                                disabled={modifiedCount === 0}
                                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckCircleIcon className="w-3 h-3" />
                                Commit Changes
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="h-1/3 bg-gray-900 p-4 overflow-y-auto border-t border-gray-700">
                        <h4 className="font-bold text-gray-500 text-[10px] uppercase mb-3 flex items-center gap-2">
                            <ClockIcon className="w-3 h-3" /> Commit History
                        </h4>
                        <div className="space-y-3">
                            {repo.commits.map((commit, idx) => (
                                <div key={commit.id} className="relative pl-4 pb-1">
                                    <div className="absolute left-0 top-1 w-2 h-2 bg-purple-500 rounded-full border border-gray-900 z-10"></div>
                                    {idx < repo.commits.length - 1 && <div className="absolute left-[3px] top-3 bottom-[-12px] w-0.5 bg-gray-700"></div>}
                                    
                                    <p className="text-white text-xs font-semibold truncate" title={commit.message}>{commit.message}</p>
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
                                        <span className="text-purple-400">{commit.author}</span>
                                        <span>{new Date(commit.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitManager;
