
import React, { useState } from 'react';
import type { PageNavigationProps } from '../../types.ts';
import { RocketLaunchIcon, ServerStackIcon, ChipIcon, BanknotesIcon, CheckCircleIcon, TrophyIcon, ArrowRightOnRectangleIcon } from '../Icons.tsx';
import InvestmentForm from '../invest/InvestmentForm.tsx';
import InvestorChatbot from '../invest/InvestorChatbot.tsx';
import InvestorDeckViewer from '../invest/InvestorDeckViewer.tsx';
import SimulatedNotification from '../invest/SimulatedNotification.tsx';

const InvestPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    const [activeTab, setActiveTab] = useState<'donate' | 'invest'>('donate');
    const [donationStatus, setDonationStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    
    // Deck Access State
    const [deckStatus, setDeckStatus] = useState<'locked' | 'pending' | 'unlocked'>('locked');
    const [isDeckOpen, setIsDeckOpen] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean, type: 'email' | 'whatsapp', sender: string, message: string } | null>(null);

    const handleDonate = () => {
        setDonationStatus('processing');
        setTimeout(() => {
            setDonationStatus('success');
            setTimeout(() => setDonationStatus('idle'), 3000);
        }, 1500);
    };

    const handleRequestAccess = () => {
        if (deckStatus === 'unlocked') {
            setIsDeckOpen(true);
            return;
        }

        setDeckStatus('pending');
        
        // Simulate the time it takes for Billy Jay to receive and approve
        setTimeout(() => {
            // Trigger the notification
            setNotification({
                show: true,
                type: 'whatsapp',
                sender: 'Billy Jay (Sales Director)',
                message: "Hey! I've reviewed your request. I've unlocked the Investor Deck for you. Let me know if you have questions!"
            });
            
            setDeckStatus('unlocked');
            // Automatically open deck after a brief delay upon approval
            setTimeout(() => setIsDeckOpen(true), 4000);
        }, 4000);
    };

    const DonationCard: React.FC<{ title: string, amount: string, benefits: string[], color: string, isPopular?: boolean }> = ({ title, amount, benefits, color, isPopular }) => (
        <div className={`relative bg-gray-800/50 border ${isPopular ? 'border-yellow-500' : 'border-slate-700'} rounded-xl p-6 flex flex-col h-full hover:bg-gray-800 transition-colors duration-300`}>
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                </div>
            )}
            <h3 className={`text-xl font-bold ${color} mb-2`}>{title}</h3>
            <div className="text-3xl font-extrabold text-white mb-6">{amount}</div>
            <ul className="space-y-3 mb-8 flex-grow">
                {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircleIcon className={`w-5 h-5 ${color} flex-shrink-0`} />
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
            <button 
                onClick={handleDonate}
                disabled={donationStatus !== 'idle'}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${donationStatus !== 'idle' ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105 shadow-lg'}`}
            >
                {donationStatus === 'processing' ? 'Processing...' : donationStatus === 'success' ? 'Thank You!' : 'Donate Now'}
            </button>
        </div>
    );

    return (
        <div className="animate-fade-in-up max-w-7xl mx-auto relative">
            <InvestorChatbot />
            <InvestorDeckViewer isOpen={isDeckOpen} onClose={() => setIsDeckOpen(false)} />
            
            {notification && (
                <SimulatedNotification 
                    type={notification.type}
                    sender={notification.sender}
                    message={notification.message}
                    onDismiss={() => setNotification(null)}
                />
            )}
            
            <div className="text-center mb-12">
                <div className="inline-block p-3 bg-yellow-500/10 rounded-full mb-4">
                    <RocketLaunchIcon className="w-12 h-12 text-yellow-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 animate-text-glow">
                    Fuel the Future of <span className="text-purple-400">Python Education</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
                    Whether you're a community supporter or a strategic investor, your contribution powers the AI infrastructure for the next generation of developers.
                </p>

                {/* Tabs */}
                <div className="inline-flex bg-gray-800 p-1 rounded-xl border border-gray-700">
                    <button 
                        onClick={() => setActiveTab('donate')}
                        className={`px-8 py-3 rounded-lg font-bold transition-all ${activeTab === 'donate' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Community Support
                    </button>
                    <button 
                        onClick={() => setActiveTab('invest')}
                        className={`px-8 py-3 rounded-lg font-bold transition-all ${activeTab === 'invest' ? 'bg-yellow-500 text-gray-900 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Strategic Investment
                    </button>
                </div>
            </div>

            {activeTab === 'donate' && (
                <div className="animate-fade-in-up">
                    {/* The "Why" Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-blue-500/20 text-center">
                            <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ServerStackIcon className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Cloud Infrastructure</h3>
                            <p className="text-slate-400 text-sm">
                                Hosting an interactive, real-time coding platform requires robust servers. Your funds cover high-performance GPU instances.
                            </p>
                        </div>
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-purple-500/20 text-center">
                            <div className="bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ChipIcon className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Advanced AI Models</h3>
                            <p className="text-slate-400 text-sm">
                                We use commercial-grade Gemini and Imagen models to power our Tutor and Gamezone. Support covers API token costs.
                            </p>
                        </div>
                        <div className="bg-gray-900/50 p-8 rounded-2xl border border-green-500/20 text-center">
                            <div className="bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BanknotesIcon className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Sustainable Growth</h3>
                            <p className="text-slate-400 text-sm">
                                Transitioning from a prototype to a live product involves software licenses, security compliance, and domain maintenance.
                            </p>
                        </div>
                    </div>

                    {/* Donation Tiers */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-10">Choose Your Impact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <DonationCard 
                                title="Community Supporter" 
                                amount="₹500" 
                                color="text-blue-400"
                                benefits={[
                                    "Help keep the servers running for a day",
                                    "Digital 'Supporter' Badge",
                                    "Our eternal gratitude"
                                ]}
                            />
                            <DonationCard 
                                title="Early Adopter" 
                                amount="₹5,000" 
                                color="text-yellow-400"
                                isPopular={true}
                                benefits={[
                                    "Lifetime access to all Premium Courses",
                                    "Early access to new AI features",
                                    "Name listed on our 'Founders Wall'",
                                    "Exclusive Discord Role"
                                ]}
                            />
                            <DonationCard 
                                title="Visionary Patron" 
                                amount="₹25,000" 
                                color="text-purple-400"
                                benefits={[
                                    "All Early Adopter perks",
                                    "Direct 1-on-1 mentorship session",
                                    "Input on future roadmap features",
                                    "Co-branded sponsorship opportunity"
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'invest' && (
                <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Pitch Teaser */}
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Why Invest in PyCom?</h2>
                        <div className="space-y-6">
                            <div className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-yellow-400">
                                <h3 className="text-xl font-bold text-white mb-2">Explosive Market Growth</h3>
                                <p className="text-slate-300">The global EdTech market is projected to reach $404B by 2025. AI-driven personalized learning is the fastest-growing segment.</p>
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-green-400">
                                <h3 className="text-xl font-bold text-white mb-2">Proprietary AI Technology</h3>
                                <p className="text-slate-300">Our specialized fine-tuned models for Python education outperform generic LLMs in code explanation and error debugging.</p>
                            </div>
                            <div className="bg-gray-800/50 p-6 rounded-xl border-l-4 border-blue-400">
                                <h3 className="text-xl font-bold text-white mb-2">Scalable B2B Model</h3>
                                <p className="text-slate-300">Beyond B2C, we are piloting white-label LMS solutions for universities and coding bootcamps.</p>
                            </div>
                        </div>

                        <div className="mt-10 bg-black/40 p-6 rounded-xl border border-slate-700 text-center backdrop-blur-sm relative overflow-hidden group">
                            {deckStatus === 'locked' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10 transition-colors">
                                    <div className="text-center">
                                        <TrophyIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                        <h4 className="text-xl font-bold text-gray-300">Investor Deck (Locked)</h4>
                                        <button 
                                            onClick={handleRequestAccess}
                                            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                        >
                                            Request Access
                                        </button>
                                    </div>
                                </div>
                            )}
                            {deckStatus === 'pending' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 z-10">
                                    <div className="text-center animate-pulse">
                                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <h4 className="text-xl font-bold text-white">Awaiting Approval</h4>
                                        <p className="text-sm text-gray-400 mt-2">Request sent to Billy Jay...</p>
                                    </div>
                                </div>
                            )}
                            {deckStatus === 'unlocked' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 z-10 group-hover:bg-gray-900/50 transition-colors">
                                    <button 
                                        onClick={() => setIsDeckOpen(true)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105 shadow-2xl flex items-center gap-2"
                                    >
                                        <RocketLaunchIcon className="w-5 h-5" />
                                        View Investor Deck
                                    </button>
                                </div>
                            )}
                            
                            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Blurry Chart" className="opacity-30 blur-sm w-full h-48 object-cover" />
                        </div>
                    </div>

                    {/* Right: Detailed Form */}
                    <div>
                        <InvestmentForm onRequestAccess={handleRequestAccess} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestPage;
