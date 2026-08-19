
import React, { useEffect, useState } from 'react';
import { WhatsAppIcon, EmailIcon, CheckCircleIcon } from '../Icons.tsx';

interface SimulatedNotificationProps {
    type: 'whatsapp' | 'email';
    sender: string;
    message: string;
    onDismiss: () => void;
}

const SimulatedNotification: React.FC<SimulatedNotificationProps> = ({ type, sender, message, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        const timer = setTimeout(() => setVisible(true), 100);
        
        // Auto dismiss after 5 seconds
        const dismissTimer = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 500); // Wait for slide out animation
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(dismissTimer);
        };
    }, [onDismiss]);

    return (
        <div 
            className={`fixed top-6 right-6 z-[100] transition-all duration-500 transform ${
                visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm w-full flex items-start gap-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${type === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {type === 'whatsapp' ? (
                        <WhatsAppIcon className="w-6 h-6 text-white" />
                    ) : (
                        <EmailIcon className="w-6 h-6 text-white" />
                    )}
                </div>
                <div className="flex-grow">
                    <h4 className="font-bold text-sm">{sender}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
                    <p className="text-sm mt-1">{message}</p>
                    <div className="mt-2 flex gap-2">
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <CheckCircleIcon className="w-3 h-3" /> Access Granted
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulatedNotification;
