
import React, { useState, useEffect, useCallback } from 'react';
// Fix: Add .tsx extension to module paths
import HomePage from './components/pages/HomePage.tsx';
import CareerPathsPage from './components/pages/CareerPathsPage.tsx';
import GamezonePage from './components/pages/ArcadePage.tsx'; // Renamed component
import AILabPage from './components/pages/AILabPage.tsx';
import SourceKitPage from './components/pages/SourceKitPage.tsx';
import ContactPage from './components/pages/ContactPage.tsx';
import CoursesPage from './components/pages/CoursesPage.tsx';
import BlogPage from './components/pages/BlogPage.tsx';
import AdvertisePage from './components/pages/AdvertisePage.tsx';
import AgenticAIPage from './components/pages/AgenticAIPage.tsx';
import ResourcesPage from './components/pages/ResourcesPage.tsx';
import PartnerPage from './components/pages/PartnerPage.tsx';
import AIMLPage from './components/pages/AIMLPage.tsx';
import InvestPage from './components/pages/InvestPage.tsx'; // Import InvestPage
import HostPage from './components/pages/HostPage.tsx';
import DocsPage from './components/pages/DocsPage.tsx';
import AuthModal from './components/AuthModal.tsx';
import PromotionalBanner from './components/PromotionalBanner.tsx';
import AILabBanner from './components/AILabBanner.tsx';
import NewsletterBanner from './components/NewsletterBanner.tsx';
import { PyComLogoIcon, GitHubIcon, LinkedInIcon, TwitterIcon, InformationCircleIcon } from './components/Icons.tsx';
import type { Page } from './types.ts';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>('home');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Usage Tracking State
    const [interactions, setInteractions] = useState(0);
    const [timeSpent, setTimeSpent] = useState(0);
    const MAX_INTERACTIONS = 20;
    const MAX_TIME_SECONDS = 120; // 2 minutes

    useEffect(() => {
        if (isAuthenticated) return;

        const timer = setInterval(() => {
            setTimeSpent(prev => {
                if (prev >= MAX_TIME_SECONDS) {
                    setIsAuthModalOpen(true);
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isAuthenticated]);

    const trackInteraction = useCallback(() => {
        if (isAuthenticated) return;
        setInteractions(prev => {
            if (prev >= MAX_INTERACTIONS) {
                setIsAuthModalOpen(true);
                return prev;
            }
            return prev + 1;
        });
    }, [isAuthenticated]);

    const handleAuthSuccess = () => {
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        // Optional: Reset counters if you want re-locking logic after logout, or keep them
    };

    const NavLinkWithTooltip: React.FC<{ page: Page, tooltip: string, children: React.ReactNode, isHighlight?: boolean }> = ({ page, tooltip, children, isHighlight }) => (
      <div className="tooltip-container" onClick={trackInteraction}>
        <button
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
                activePage === page 
                ? 'bg-blue-500/20 text-blue-300' 
                : isHighlight ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/20' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
        >
            {children}
        </button>
        <div className="tooltip-text">{tooltip}</div>
      </div>
    );

    const renderPage = () => {
        const pageProps = { setActivePage };
        switch (activePage) {
            case 'home': return <HomePage {...pageProps} />;
            case 'careers': return <CareerPathsPage {...pageProps} />;
            case 'gamezone': return <GamezonePage {...pageProps} />;
            case 'lab': return <AILabPage />;
            case 'sourcekit': return <SourceKitPage {...pageProps} />;
            case 'courses': return <CoursesPage {...pageProps} />;
            case 'contact': return <ContactPage />;
            case 'blog': return <BlogPage {...pageProps} />;
            case 'advertise': return <AdvertisePage {...pageProps} />;
            case 'agentic-ai': return <AgenticAIPage />;
            case 'resources': return <ResourcesPage {...pageProps} />;
            case 'partner': return <PartnerPage {...pageProps} />;
            case 'aiml': return <AIMLPage {...pageProps} />;
            case 'invest': return <InvestPage {...pageProps} />;
            case 'host': return <HostPage />;
            case 'docs': return <DocsPage />;
            default: return <HomePage {...pageProps} />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans" onClick={trackInteraction}>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onAuthSuccess={handleAuthSuccess}
            />
            <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700/50">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
                    <button onClick={() => setActivePage('home')} className="flex items-center gap-2 text-2xl font-bold text-white transition-transform hover:scale-105 group">
                        <PyComLogoIcon className="h-10 w-10 text-blue-400 group-hover:animate-wiggle-on-hover" />
                        <span>Py<span className="text-blue-400">Com</span></span>
                    </button>
                    <div className="hidden xl:flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700 overflow-x-auto">
                        <NavLinkWithTooltip page="home" tooltip="Go to Homepage">Home</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="aiml" tooltip="Learn Hugging Face & AI/ML">AI/ML</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="careers" tooltip="Explore Python careers">Careers</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="gamezone" tooltip="Play learning games">Gamezone</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="lab" tooltip="Use AI tools">AI Lab</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="agentic-ai" tooltip="Automated Business Agents">Agentic AI</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="host" tooltip="Self-Hosting & Automation">Host</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="docs" tooltip="Documentation & Guides">Docs</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="sourcekit" tooltip="Get dev resources">SourceKit</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="courses" tooltip="View our courses">Courses</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="blog" tooltip="Read our articles">Blog</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="invest" tooltip="Support PyCom's Future" isHighlight={true}>Invest</NavLinkWithTooltip>
                        <NavLinkWithTooltip page="contact" tooltip="Get in touch">Contact</NavLinkWithTooltip>
                    </div>
                    <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-900/50">
                        {isAuthenticated ? 'My Account' : 'Sign In'}
                    </button>
                </nav>
                {/* Mobile Nav Placeholder (Basic) */}
                <div className="xl:hidden overflow-x-auto py-2 px-4 flex space-x-2 bg-slate-900 border-b border-slate-800">
                     <button onClick={() => setActivePage('gamezone')} className="text-sm text-slate-300 whitespace-nowrap">Gamezone</button>
                     <button onClick={() => setActivePage('lab')} className="text-sm text-slate-300 whitespace-nowrap">AI Lab</button>
                     <button onClick={() => setActivePage('agentic-ai')} className="text-sm text-slate-300 whitespace-nowrap">Agentic AI</button>
                     <button onClick={() => setActivePage('host')} className="text-sm text-slate-300 whitespace-nowrap">Host</button>
                     <button onClick={() => setActivePage('docs')} className="text-sm text-slate-300 whitespace-nowrap">Docs</button>
                     <button onClick={() => setActivePage('invest')} className="text-sm text-yellow-400 whitespace-nowrap">Invest</button>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {activePage === 'home' && <PromotionalBanner onCTAClick={() => setActivePage('contact')} />}
                {activePage === 'lab' && <AILabBanner />}
                {renderPage()}
            </main>
            <footer className="bg-slate-800/50 border-t border-slate-700/50 mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                   <div className="mb-10">
                    <NewsletterBanner />
                   </div>
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                             <button onClick={() => setActivePage('home')} className="flex items-center gap-2 text-xl font-bold text-white mb-2 mx-auto md:mx-0">
                                <PyComLogoIcon className="h-7 w-7 text-blue-400" />
                                <span>PyCom</span>
                            </button>
                            <p className="text-slate-400">The AI-Powered Platform to Master Python.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-blue-400 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-blue-400 transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                            <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-blue-400 transition-colors"><GitHubIcon className="w-6 h-6" /></a>
                        </div>
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-700/50 text-center text-slate-500 text-sm">
                     <p>&copy; 2025 PyCom. A project by Jeyabal Anthony. All rights reserved.</p>
                   </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
