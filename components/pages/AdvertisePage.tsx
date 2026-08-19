import React, { useState, useEffect } from 'react';
import type { PageNavigationProps } from '../../types.ts';
import { AD_PRICING, SPONSORSHIP_DATA, OFFERS_DATA } from '../../constants.ts';
import AdModal from '../AdModal.tsx';
import { MegaphoneIcon, TagIcon } from '../Icons.tsx';

const AdvertisePage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Open the ad modal once when the page loads to showcase it
    const timer = setTimeout(() => setIsModalOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const NameYourPriceForm = () => {
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const suggestedPrice = parseFloat(price);
        if (isNaN(suggestedPrice) || suggestedPrice <= 0) {
            setMessage('Please enter a valid price.');
            return;
        }
        
        // Surprise logic
        const discountedPrice = Math.floor(suggestedPrice * 0.9);
        setMessage(`SURPRISE! We love your enthusiasm. We can offer you an exclusive deal at ₹${discountedPrice.toLocaleString('en-IN')}! Our team will be in touch.`);
    };

    return (
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-yellow-400/30">
            <h3 className="text-2xl font-bold text-center text-yellow-300 mb-4">Name Your Price</h3>
            <p className="text-center text-slate-300 mb-6 max-w-xl mx-auto">Have a different budget in mind? Propose your monthly spending (in INR), and we might surprise you with an even better deal!</p>
            {!message ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g., 8000"
                        className="flex-grow bg-slate-700 text-white rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button type="submit" className="bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                        Submit Offer
                    </button>
                </form>
            ) : (
                <p className="text-center text-green-400 font-bold text-lg animate-pop-in">{message}</p>
            )}
        </div>
    );
  };
  
  return (
    <div className="animate-fade-in-up space-y-20">
      <AdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Advertise on PyCom</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          Connect with a highly engaged audience of Python developers, learners, and tech enthusiasts.
        </p>
      </div>
      
      {/* Banner Placeholders */}
      <section>
        <h2 className="text-3xl font-bold text-center text-white mb-10">Digital Banner Ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
                <div>
                    <h3 className="font-semibold text-purple-300 mb-2">Top/Bottom Banner (728x90)</h3>
                    <div className="bg-slate-800 h-24 flex items-center justify-center rounded-lg border border-slate-700 text-slate-500">Your Display Ad (728x90)</div>
                </div>
                 <div>
                    <h3 className="font-semibold text-purple-300 mb-2">In-Content Banner (300x250)</h3>
                    <div className="bg-slate-800 h-64 w-full max-w-[300px] mx-auto flex items-center justify-center rounded-lg border border-slate-700 text-slate-500">Your Display Ad (300x250)</div>
                </div>
            </div>
            <div>
                 <h3 className="font-semibold text-purple-300 mb-2 text-center md:text-left">Pop-up Banner (500x500)</h3>
                 <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <img src="https://modernbusinessnetwork.com/wp-content/uploads/2023/10/mbn-logo.png" alt="Modern Business Network" className="w-full rounded-md"/>
                 </div>
                 <p className="text-center text-sm text-slate-500 mt-2">Clickable pop-up ads capture user attention effectively.</p>
            </div>
        </div>
      </section>

      {/* Pricing Chart */}
      <section>
        <h2 className="text-3xl font-bold text-center text-white mb-10">Our Pricing</h2>
        <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th className="p-4 font-semibold">Ad Type</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold text-right">Price/Month</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {AD_PRICING.map(ad => (
                            <tr key={ad.type} className="hover:bg-slate-800 transition-colors">
                                <td className="p-4 font-bold text-purple-300">{ad.type}</td>
                                <td className="p-4 text-slate-300 text-sm">{ad.description}</td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-white">₹{ad.inr}</div>
                                    <div className="text-xs text-slate-400">${ad.usd} / €{ad.eur}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </section>

      <section>
        <NameYourPriceForm />
      </section>

      {/* Sponsorship & Offers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <MegaphoneIcon className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{SPONSORSHIP_DATA.title}</h3>
              <p className="text-slate-300 mb-6">{SPONSORSHIP_DATA.description}</p>
              <button onClick={() => setActivePage('contact')} className="bg-purple-600 font-bold text-white py-2 px-6 rounded-lg hover:bg-purple-700">{SPONSORSHIP_DATA.cta}</button>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <TagIcon className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Exclusive Partner Offers</h3>
              <div className="space-y-6">
                  {OFFERS_DATA.map(offer => (
                      <div key={offer.title} className="border-t border-slate-700 pt-4">
                          <p className="font-semibold text-green-300">{offer.partner}</p>
                          <h4 className="font-bold text-lg text-white">{offer.title}</h4>
                          <p className="text-sm text-slate-300 mt-1 mb-3">{offer.description}</p>
                          <button onClick={() => setActivePage('contact')} className="text-sm bg-green-600 font-semibold text-white py-1 px-4 rounded-full hover:bg-green-700">{offer.cta}</button>
                      </div>
                  ))}
              </div>
          </div>
      </section>

    </div>
  );
};

export default AdvertisePage;
