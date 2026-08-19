
import React from 'react';
import type { PageNavigationProps } from '../../types.ts';
import { SearchIcon, UserGroupIcon, AcademicCapIcon, BuildingLibraryIcon, IdentificationIcon, PresentationChartLineIcon, RocketLaunchIcon, CheckCircleIcon } from '../Icons.tsx';

const PARTNER_OPTIONS = [
    {
        icon: <SearchIcon className="w-10 h-10 text-blue-400" />,
        title: "Find a Partner",
        description: "Find the perfect partner from our network of experts to support your business needs, from development to marketing.",
        cta: "Find a Partner",
    },
    {
        icon: <UserGroupIcon className="w-10 h-10 text-green-400" />,
        title: "Become a Partner",
        description: "Join our partner program. Help your customers automate and innovate with PyCom's powerful platform and resources.",
        cta: "Apply to Join",
    },
    {
        icon: <AcademicCapIcon className="w-10 h-10 text-purple-400" />,
        title: "Digital Education Program",
        description: "Empower the next generation. Get free professional access to the PyCom platform for all your students.",
        cta: "Learn More",
    }
];

const PartnerCard: React.FC<{ data: typeof PARTNER_OPTIONS[0], onCTAClick: () => void }> = ({ data, onCTAClick }) => (
    <div className="interactive-card bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-left h-full flex flex-col items-center text-center">
        <div className="flex-shrink-0">{data.icon}</div>
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-white mt-4 mb-2">{data.title}</h3>
            <p className="text-gray-400 text-sm">{data.description}</p>
        </div>
        <button 
            onClick={onCTAClick}
            className="w-full mt-6 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
            {data.cta}
        </button>
    </div>
);

const UniversityTierSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => (
    <div className="mt-24 relative group">
        {/* Decorative Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative rounded-2xl overflow-hidden border border-yellow-500/50 shadow-2xl bg-slate-950">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

            <div className="p-8 lg:p-12 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-yellow-900/30 border border-yellow-500/50 rounded-full mb-6">
                        <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">B2B Enterprise Tier</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        PyCom <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">University Alliance</span>
                    </h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Bridge the gap between academia and industry. Deploy our AI-Native infrastructure directly into your Computer Science curriculum with a white-label partnership.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 group/card">
                        <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover/card:bg-yellow-900/20 transition-colors">
                            <IdentificationIcon className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Co-Branded Degrees</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Issue joint certifications backed by PyCom's industry recognition. Students receive digital badges verifiable on LinkedIn and GitHub.
                        </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 group/card">
                        <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover/card:bg-purple-900/20 transition-colors">
                            <RocketLaunchIcon className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">White-Label LMS</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Deploy our entire Gamezone and AI Lab under your university's domain (e.g., <code>lab.stanford.edu</code>) with custom branding.
                        </p>
                    </div>

                    <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-slate-800 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 group/card">
                        <div className="bg-slate-900 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover/card:bg-blue-900/20 transition-colors">
                            <PresentationChartLineIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Faculty Dashboard</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Real-time analytics on student code performance, automated grading assistance, and "At-Risk" student alerts powered by Gemini.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                    <button 
                        onClick={onContactClick}
                        className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-xl shadow-yellow-900/20 flex items-center gap-3"
                    >
                        <BuildingLibraryIcon className="w-6 h-6" />
                        Join as Education Partner
                    </button>
                    <button 
                        onClick={onContactClick}
                        className="px-8 py-4 bg-transparent border-2 border-slate-600 hover:border-white text-slate-300 hover:text-white font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center gap-3"
                    >
                        <span>Download Syllabus & Pricing</span>
                    </button>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                        Currently powering CS101 curriculums at top institutions worldwide.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const PartnerPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Partner with PyCom</h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                    Join our ecosystem of innovators, educators, and experts. Together, we can build the future of AI and development.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
                {PARTNER_OPTIONS.map(option => (
                    <PartnerCard key={option.title} data={option} onCTAClick={() => setActivePage('contact')} />
                ))}
            </div>

            <div className="max-w-7xl mx-auto">
                <UniversityTierSection onContactClick={() => setActivePage('contact')} />
            </div>
        </div>
    );
};

export default PartnerPage;
