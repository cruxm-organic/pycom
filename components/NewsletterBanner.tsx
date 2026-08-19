import React, { useState } from 'react';
import { EnvelopeIcon } from './Icons.tsx';

const NewsletterBanner: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            setStatus('error');
            return;
        }
        // This is a demo, so we just simulate success.
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 4000);
    };

    return (
        <div className="bg-gray-800/50 border border-purple-500/20 p-8 rounded-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-white flex items-center justify-center lg:justify-start gap-3">
                        <EnvelopeIcon className="w-7 h-7 text-purple-400" />
                        <span>Stay Ahead of the Curve</span>
                    </h3>
                    <p className="text-gray-300 mt-2">
                        Subscribe to the PyCom monthly newsletter for the latest game releases, new courses, and Python tips.
                    </p>
                </div>
                <div className="w-full max-w-md">
                    {status === 'success' ? (
                        <p className="text-center text-green-400 font-bold animate-pop-in">
                            Thank you for subscribing!
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                                aria-label="Email address"
                                className="flex-grow bg-gray-700 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                    {status === 'error' && <p className="text-red-400 text-sm mt-2 text-center sm:text-left">Please enter a valid email address.</p>}
                </div>
            </div>
        </div>
    );
};

export default NewsletterBanner;
