import React, { useRef } from 'react';
// Fix: Add .ts extension to module path
import { PIONEERS_DATA } from '../../constants.ts';
// Fix: Add .ts extension to module path
import type { PioneerContact } from '../../types.ts';
// Fix: Add .tsx extension to module path
import { EmailIcon, WhatsAppIcon, LinkIcon, DocumentTextIcon } from '../Icons.tsx';
// Fix: Add .tsx extension to module path
import ContactForm from '../ContactForm.tsx';

interface PioneerCardProps {
  pioneer: PioneerContact;
  onEnquiryClick: () => void;
}

const PioneerCard: React.FC<PioneerCardProps> = ({ pioneer, onEnquiryClick }) => {
  return (
    <div className="interactive-card bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-purple-300 mb-1">{pioneer.role}</h3>
        <p className="text-lg text-white font-semibold">{pioneer.name}</p>
        {pioneer.description && <p className="text-gray-400 mt-2 text-sm italic">{pioneer.description}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {!pioneer.actions?.includes('contact') && (
          <>
            <a 
              href={`mailto:${pioneer.email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm min-w-[120px]"
            >
              <EmailIcon />
              <span>Email</span>
            </a>
            {pioneer.phone && (
              <a
                href={`https://wa.me/${pioneer.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm min-w-[120px]"
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </a>
            )}
          </>
        )}
        {pioneer.url && (
            <a 
              href={pioneer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm min-w-[120px]"
            >
              <LinkIcon />
              <span>Website</span>
            </a>
        )}
        {pioneer.actions?.includes('enquiry') && (
            <button
                onClick={onEnquiryClick}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm min-w-[120px]"
            >
              <DocumentTextIcon />
              <span>Enquiry Form</span>
            </button>
        )}
         {pioneer.actions?.includes('contact') && (
            <button
                onClick={onEnquiryClick}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <DocumentTextIcon />
              <span>Contact via Form</span>
            </button>
        )}
      </div>
    </div>
  );
};

const ContactPage: React.FC = () => {
  const contactFormRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate-text-glow">Meet Our Team of Experts</h1>
        <p className="text-lg text-gray-400 max-w-4xl mx-auto">
          PyCom is powered by a dedicated team of entrepreneurs, industry experts, and specialists. We provide 360° Digital and AI-Powered IT Services to help you succeed. Connect with a pioneer below.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600/20 to-indigo-700/20 p-8 rounded-xl border border-purple-500/30 mb-16 text-center">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Full-Spectrum Business Solutions</h2>
        <p className="text-lg text-gray-200 max-w-4xl mx-auto">
          Beyond development, PyCom offers 360° Digital Marketing, PR, Sales Support, and AI-Powered IT solutions to fuel your growth.
        </p>
      </div>
      
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Meet Our Team of Pioneers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PIONEERS_DATA.map((pioneer, index) => (
            <PioneerCard key={index} pioneer={pioneer} onEnquiryClick={handleScrollToForm} />
          ))}
        </div>
      </div>
      
      <div ref={contactFormRef} className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Have a General Question?</h2>
            <p className="text-lg text-gray-400 mt-2">If you're not sure who to contact, fill out the form below and we'll get back to you.</p>
        </div>
        <div className="bg-gray-800/50 p-8 rounded-xl border border-purple-500/30">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;