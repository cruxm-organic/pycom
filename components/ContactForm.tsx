
import React, { useState } from 'react';

const SERVICES = [
    "AI-Powered Web Application",
    "Generative AI & Chatbot Development",
    "AI-Powered Social Marketing",
    "Cloud Solutions & DevOps",
    "General Inquiry"
];

const ContactForm: React.FC = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Thank you for your message! We will get back to you shortly. (This is a demo)');
        const form = e.target as HTMLFormElement;
        form.reset();
        setTimeout(() => setStatus(''), 5000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input type="text" name="name" id="name" required className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" name="email" id="email" required className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" />
            </div>
             <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-1">Service of Interest</label>
                <select name="service" id="service" required className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none">
                    <option value="" disabled>Select a service...</option>
                    {SERVICES.map(service => (
                        <option key={service} value={service}>{service}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                <textarea name="message" id="message" rows={4} required className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white" placeholder="Tell us about your project..."></textarea>
            </div>
            <div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    Send Message
                </button>
            </div>
            {status && <p className="text-center text-green-400 animate-pop-in">{status}</p>}
        </form>
    );
};

export default ContactForm;
