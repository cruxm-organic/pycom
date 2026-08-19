
import React, { useState } from 'react';
import { XMarkIcon, UserCircleIcon, LinkIcon, DocumentTextIcon, CloudArrowDownIcon, CheckCircleIcon, PaperAirplaneIcon } from '../Icons.tsx';

interface GuestPostFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const GuestPostForm: React.FC<GuestPostFormProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'form' | 'submitting' | 'success'>('form');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        linkedin: '',
        topic: '',
        category: 'Python Development',
        level: 'Intermediate',
        abstract: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('submitting');
        // Simulate API submission
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleClose = () => {
        setStep('form');
        setFormData({
            name: '',
            email: '',
            linkedin: '',
            topic: '',
            category: 'Python Development',
            level: 'Intermediate',
            abstract: ''
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={handleClose}>
            <div 
                className="bg-gray-900 border border-purple-500 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Submit Guest Post Proposal</h2>
                        <p className="text-purple-400 text-sm">Share your expertise with the PyCom community</p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {step === 'success' ? (
                    <div className="p-12 text-center animate-pop-in">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircleIcon className="w-12 h-12 text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Proposal Received!</h3>
                        <p className="text-gray-300 mb-8 max-w-md mx-auto">
                            Thank you, {formData.name}. Our editorial team will review your pitch on <strong>{formData.topic}</strong> and get back to you at {formData.email} within 3-5 business days.
                        </p>
                        <button onClick={handleClose} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Author Section */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <UserCircleIcon className="w-5 h-5 text-blue-400" />
                                Author Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Jane Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="jane@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Portfolio / LinkedIn URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                        <input 
                                            type="url" 
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 p-3 text-white focus:border-purple-500 focus:outline-none"
                                            placeholder="https://linkedin.com/in/janedoe"
                                            value={formData.linkedin}
                                            onChange={e => setFormData({...formData, linkedin: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-800"></div>

                        {/* Article Details Section */}
                        <section>
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <DocumentTextIcon className="w-5 h-5 text-yellow-400" />
                                Article Details
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Proposed Title / Topic</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="e.g., Mastering Asynchronous Python with FastAPI"
                                        value={formData.topic}
                                        onChange={e => setFormData({...formData, topic: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Category</label>
                                        <select 
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                        >
                                            <option>Python Development</option>
                                            <option>Data Science & Analytics</option>
                                            <option>Machine Learning / AI</option>
                                            <option>Web Development (Django/Flask)</option>
                                            <option>DevOps & Automation</option>
                                            <option>Career Advice</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Target Difficulty</label>
                                        <select 
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                            value={formData.level}
                                            onChange={e => setFormData({...formData, level: e.target.value})}
                                        >
                                            <option>Beginner (Concepts)</option>
                                            <option>Intermediate (Practical)</option>
                                            <option>Advanced (Deep Dive)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Abstract / Brief Outline (200 words max)</label>
                                    <textarea 
                                        rows={4}
                                        required
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                        placeholder="Describe what the reader will learn..."
                                        value={formData.abstract}
                                        onChange={e => setFormData({...formData, abstract: e.target.value})}
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Upload Section */}
                        <section>
                            <label className="w-full h-32 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/50 hover:border-purple-500 transition-colors group">
                                <CloudArrowDownIcon className="w-10 h-10 text-gray-500 group-hover:text-purple-400 mb-2" />
                                <span className="text-gray-400 group-hover:text-white font-medium">Click to upload draft (Optional)</span>
                                <span className="text-xs text-gray-600 mt-1">Supports .pdf, .docx, .md (Max 5MB)</span>
                                <input type="file" className="hidden" />
                            </label>
                        </section>

                        <button 
                            type="submit" 
                            disabled={step === 'submitting'}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {step === 'submitting' ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Submitting Proposal...
                                </>
                            ) : (
                                <>
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                    Submit Proposal
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GuestPostForm;
