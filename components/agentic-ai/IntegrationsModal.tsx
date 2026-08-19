
import React, { useState } from 'react';
import { XMarkIcon, GoogleIcon, MicrosoftIcon, LinkedInIcon, HubSpotIcon, CheckCircleIcon, SlackIcon, JiraIcon, GitHubIcon, StripeIcon, ChartBarSquareIcon } from '../Icons.tsx';

interface IntegrationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (service: string) => void;
    connectedServices: string[];
}

const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose, onConnect, connectedServices }) => {
    const [loadingService, setLoadingService] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleConnect = (service: string) => {
        if (connectedServices.includes(service)) return;
        
        setLoadingService(service);
        // Simulate auth delay
        setTimeout(() => {
            onConnect(service);
            setLoadingService(null);
        }, 1200);
    };

    const services = [
        { name: 'Google', icon: <GoogleIcon className="w-6 h-6" />, desc: 'Gmail, Calendar, Drive access.' },
        { name: 'Microsoft', icon: <MicrosoftIcon className="w-6 h-6 text-blue-400" />, desc: 'Outlook, Teams, Office 365.' },
        { name: 'LinkedIn', icon: <LinkedInIcon className="w-6 h-6 text-blue-600" />, desc: 'Sales Navigator & Networking.' },
        { name: 'HubSpot', icon: <HubSpotIcon className="w-6 h-6 text-orange-500" />, desc: 'CRM contact syncing.' },
        { name: 'Slack', icon: <SlackIcon className="w-6 h-6 text-pink-500" />, desc: 'Team communication & alerts.' },
        { name: 'GitHub', icon: <GitHubIcon className="w-6 h-6 text-white" />, desc: 'Code repositories & issues.' },
        { name: 'Jira', icon: <JiraIcon className="w-6 h-6 text-blue-500" />, desc: 'Project tracking & tickets.' },
        { name: 'Stripe', icon: <StripeIcon className="w-6 h-6 text-indigo-400" />, desc: 'Payments & billing data.' },
        { name: 'Power BI', icon: <ChartBarSquareIcon className="w-6 h-6 text-yellow-500" />, desc: 'Analytics & data visualization.' },
        { name: 'Notion', icon: <div className="w-6 h-6 bg-white text-black rounded flex items-center justify-center font-bold">N</div>, desc: 'Knowledge base & docs.' },
        { name: 'Salesforce', icon: <div className="w-6 h-6 text-blue-400 font-bold">SF</div>, desc: 'Enterprise CRM data.' },
        { name: 'Zendesk', icon: <div className="w-6 h-6 text-green-400 font-bold">Z</div>, desc: 'Customer support tickets.' },
        { name: 'Shopify', icon: <div className="w-6 h-6 text-green-500 font-bold">S</div>, desc: 'E-commerce store data.' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in-up" onClick={onClose}>
            <div 
                className="bg-gray-900 border border-purple-500 rounded-2xl w-full max-w-3xl shadow-2xl p-6 relative max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h2 className="text-2xl font-bold text-white">Connect Integrations</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-6 shrink-0">
                    Connect your tools to unlock autonomous capabilities. Credentials are encrypted and stored securely.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto p-1">
                    {services.map(service => {
                        const isConnected = connectedServices.includes(service.name);
                        const isLoading = loadingService === service.name;

                        return (
                            <div key={service.name} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:border-gray-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 p-2 rounded-lg">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm">{service.name}</h3>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">{service.desc}</p>
                                <button
                                    onClick={() => handleConnect(service.name)}
                                    disabled={isConnected || isLoading}
                                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center mt-auto ${
                                        isConnected 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' 
                                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                                    }`}
                                >
                                    {isLoading ? (
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : isConnected ? (
                                        <span className="flex items-center gap-1"><CheckCircleIcon className="w-3 h-3" /> Connected</span>
                                    ) : (
                                        'Connect'
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-800 text-center shrink-0">
                    <button onClick={onClose} className="text-sm text-purple-400 hover:text-purple-300 font-semibold">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsModal;
