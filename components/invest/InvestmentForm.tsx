
import React, { useState } from 'react';
import { BuildingOfficeIcon, UserCircleIcon, EmailIcon, CurrencyDollarIcon, BriefcaseIcon, CheckCircleIcon } from '../Icons.tsx';

interface InvestmentFormProps {
    onRequestAccess?: () => void;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onRequestAccess }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        firm: '',
        email: '',
        linkedin: '',
        type: 'Angel',
        range: '$10k - $50k',
        interests: [] as string[]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (onRequestAccess) {
            onRequestAccess();
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest) 
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-10 bg-gray-800 rounded-xl border border-green-500/30 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Inquiry Received</h3>
                <p className="text-gray-300 mb-6">
                    Thank you for your interest in PyCom. Billy Jay has been notified of your request.
                </p>
                <p className="text-sm text-purple-300 animate-pulse mb-4">Waiting for approval to unlock deck...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-purple-500/30 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BriefcaseIcon className="w-6 h-6 text-yellow-400" />
                Strategic Investment Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <UserCircleIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input 
                                type="text" 
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 p-2.5 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Professional Role</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 focus:outline-none"
                            placeholder="Managing Partner, Angel Investor..."
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Firm / Organization</label>
                        <div className="relative">
                            <BuildingOfficeIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input 
                                type="text" 
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 p-2.5 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="Acme Ventures"
                                value={formData.firm}
                                onChange={e => setFormData({...formData, firm: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Business Email</label>
                        <div className="relative">
                            <EmailIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input 
                                type="email" 
                                required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 p-2.5 text-white focus:border-purple-500 focus:outline-none"
                                placeholder="john@acme.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Investor Type</label>
                        <select 
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 focus:outline-none"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Angel Investor</option>
                            <option>Venture Capital (VC)</option>
                            <option>Family Office</option>
                            <option>Corporate Venture Arm</option>
                            <option>Institutional Grant</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-1">Investment Capacity (USD)</label>
                        <div className="relative">
                            <CurrencyDollarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <select 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 p-2.5 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.range}
                                onChange={e => setFormData({...formData, range: e.target.value})}
                            >
                                <option>$10k - $50k</option>
                                <option>$50k - $250k</option>
                                <option>$250k - $1M</option>
                                <option>$1M+</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Areas of Interest</label>
                    <div className="flex flex-wrap gap-2">
                        {['EdTech', 'Generative AI', 'SaaS', 'B2B Enterprise', 'Social Impact'].map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => toggleInterest(interest)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                                    formData.interests.includes(interest)
                                    ? 'bg-purple-600 border-purple-500 text-white'
                                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all"
                >
                    Request Pitch Deck & Access
                </button>
                <p className="text-xs text-gray-500 text-center">
                    By requesting access, a notification will be sent to Billy Jay (Sales Director) for instant approval.
                </p>
            </form>
        </div>
    );
};

export default InvestmentForm;
