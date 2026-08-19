

import React, { useState, useEffect } from 'react';
import type { CodeSnippet } from '../../types.ts';
import { MagnifyingGlassIcon, TrashIcon, PlusIcon, CodeBracketIcon, XMarkIcon } from '../Icons.tsx';

// --- Syntax Highlighting Helpers ---
// A simple regex-based highlighter to keep things lightweight without external deps
const highlightCode = (code: string, language: string) => {
    let highlighted = code;

    // Escaping HTML entities first
    highlighted = highlighted.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (language === 'python') {
        // Comments
        highlighted = highlighted.replace(/(#.*)/g, '<span class="text-gray-500 italic">$1</span>');
        // Strings
        highlighted = highlighted.replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>');
        // Keywords
        const keywords = ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'with', 'as', 'pass', 'lambda'];
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-bold">$1</span>');
        // Built-ins/Functions
        highlighted = highlighted.replace(/\b(print|len|range|open|str|int|float|list|dict|set)\b/g, '<span class="text-blue-400">$1</span>');
    } else if (language === 'javascript') {
        highlighted = highlighted.replace(/(\/\/.*)/g, '<span class="text-gray-500 italic">$1</span>');
        highlighted = highlighted.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>');
        const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'default', 'class', 'extends', 'async', 'await'];
        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
        highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-bold">$1</span>');
        highlighted = highlighted.replace(/\b(console|log|document|window)\b/g, '<span class="text-blue-400">$1</span>');
    }

    return <code dangerouslySetInnerHTML={{ __html: highlighted }} />;
};

const SimpleCodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => (
    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm text-gray-200 border border-gray-700">
        {highlightCode(code, language)}
    </pre>
);

const SnippetLibrary: React.FC = () => {
    const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    // Form State
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState<CodeSnippet['language']>('python');
    const [code, setCode] = useState('');
    const [category, setCategory] = useState('');

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('pycom_snippets');
        if (saved) {
            setSnippets(JSON.parse(saved));
        } else {
            // Add a default welcome snippet
            const welcome: CodeSnippet = {
                id: 'welcome',
                title: 'Welcome to Snippets',
                language: 'python',
                code: '# Use this area to save your useful code blocks!\ndef hello_world():\n    print("Welcome to SourceKit")',
                category: 'General',
                createdAt: Date.now()
            };
            setSnippets([welcome]);
        }
    }, []);

    // Save to local storage whenever snippets change
    useEffect(() => {
        if (snippets.length > 0) {
            localStorage.setItem('pycom_snippets', JSON.stringify(snippets));
        }
    }, [snippets]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !code) return;

        const newSnippet: CodeSnippet = {
            id: Date.now().toString(),
            title,
            language,
            code,
            category: category || 'Uncategorized',
            createdAt: Date.now()
        };

        setSnippets([newSnippet, ...snippets]);
        
        // Reset Form
        setTitle('');
        setCode('');
        setCategory('');
        setIsFormOpen(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this snippet?')) {
            const updated = snippets.filter(s => s.id !== id);
            setSnippets(updated);
            localStorage.setItem('pycom_snippets', JSON.stringify(updated));
        }
    };

    // Filter Logic
    const categories = ['All', ...Array.from(new Set(snippets.map(s => s.category)))];
    
    const filteredSnippets = snippets.filter(s => {
        const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              s.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
                <div className="flex-1 w-full md:w-auto relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search snippets..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 pl-10 pr-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="w-full md:w-auto bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Snippet</span>
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Modal for New Snippet */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-600 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-pop-in">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">Create New Snippet</h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Connect to SQLite"
                                    required
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-1">Language</label>
                                    <select 
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value as any)}
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="python">Python</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="html">HTML</option>
                                        <option value="css">CSS</option>
                                        <option value="sql">SQL</option>
                                        <option value="bash">Bash</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-1">Category</label>
                                    <input 
                                        type="text" 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        placeholder="e.g., Database"
                                        className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-1">Code</label>
                                <textarea 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    rows={10}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 font-mono text-sm text-white focus:ring-2 focus:ring-purple-500"
                                    placeholder="# Paste your code here..."
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                                Save Snippet
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Snippets Grid */}
            <div className="grid grid-cols-1 gap-6">
                {filteredSnippets.length === 0 ? (
                    <div className="text-center p-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                        <CodeBracketIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No snippets found</h3>
                        <p className="text-gray-500 mt-2">Add your first snippet to get started!</p>
                    </div>
                ) : (
                    filteredSnippets.map(snippet => (
                        <div key={snippet.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <span className="text-purple-400 text-lg">#</span>
                                        {snippet.title}
                                    </h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded uppercase font-bold">{snippet.language}</span>
                                        <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">{snippet.category}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(snippet.id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors p-2"
                                    title="Delete Snippet"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <SimpleCodeBlock code={snippet.code} language={snippet.language} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SnippetLibrary;