
import React, { useState } from 'react';
import { BLOG_POSTS } from '../../constants.ts';
import type { BlogPost, PageNavigationProps } from '../../types.ts';
import BlogCard from '../BlogCard.tsx';
import AdBanner from '../AdBanner.tsx';
import GuestPostForm from '../blog/GuestPostForm.tsx';
import { TwitterIcon, LinkedInIcon, ShareIcon, ClipboardIcon } from '../Icons.tsx';

const BlogPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [copyStatus, setCopyStatus] = useState('Copy Link');
    const [isGuestPostModalOpen, setIsGuestPostModalOpen] = useState(false);

    const handleClosePost = () => {
        setSelectedPost(null);
    };
    
    const handleShare = (platform: 'twitter' | 'linkedin') => {
        const shareUrl = window.location.href; // This would be the specific post URL in a real app
        const shareTitle = selectedPost?.title || '';
        let url = '';
        if (platform === 'twitter') {
            url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        } else {
            url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Link'), 2000);
        });
    };


    if (selectedPost) {
        return (
            <div className="animate-fade-in-up">
                <button onClick={handleClosePost} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors mb-6">
                    &larr; Back to All Posts
                </button>
                <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl border border-purple-500/30">
                    <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg mb-6" />
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">{selectedPost.title}</h1>
                    <div className="flex flex-wrap items-center text-gray-400 text-sm mb-4 border-b border-t border-gray-700 py-2 gap-x-4 gap-y-2">
                        <span>Published by: <span className="font-semibold text-gray-300">{selectedPost.author}</span></span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span>Date: <span className="font-semibold text-gray-300">{new Date(selectedPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></span>
                        <span className="hidden sm:inline">&bull;</span>
                        <span>{selectedPost.readTime}</span>
                         <span className="hidden sm:inline">&bull;</span>
                        <span>{selectedPost.wordCount} words</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedPost.tags.map(tag => (
                            <span key={tag} className="bg-gray-700 text-xs text-gray-200 px-3 py-1 rounded-full">{tag}</span>
                        ))}
                    </div>
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br />') }}>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShareIcon className="w-5 h-5" /> Share this post:</h3>
                        <div className="flex items-center gap-2">
                             <button onClick={() => handleShare('twitter')} className="bg-gray-700 p-2 rounded-full hover:bg-blue-500 transition-colors"><TwitterIcon className="w-5 h-5" /></button>
                             <button onClick={() => handleShare('linkedin')} className="bg-gray-700 p-2 rounded-full hover:bg-blue-700 transition-colors"><LinkedInIcon className="w-5 h-5" /></button>
                             <button onClick={handleCopyLink} className="flex items-center gap-2 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                                <ClipboardIcon className="w-4 h-4" />
                                <span>{copyStatus}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in-up space-y-16">
            <GuestPostForm 
                isOpen={isGuestPostModalOpen} 
                onClose={() => setIsGuestPostModalOpen(false)} 
            />

            <div>
                 <div className="relative rounded-xl overflow-hidden mb-12 h-64 flex items-center justify-center text-center p-4 shadow-2xl shadow-purple-900/50">
                    <img
                        src="https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1964&auto=format&fit=crop"
                        alt="Blog Banner"
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10"></div>
                    <div className="relative z-20 animate-fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate-text-glow">PyCom Blog</h1>
                        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                            Insights, tutorials, and best practices for Python developers, from core concepts to advanced tooling.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard key={post.id} post={post} onReadMore={() => setSelectedPost(post)} />
                    ))}
                </div>
            </div>
            <AdBanner
              title="Publish a Guest Post"
              description="Share your expertise with our community. We welcome guest posts from Python professionals. Get visibility and backlinks."
              buttonText="Submit Proposal"
              onAction={() => setIsGuestPostModalOpen(true)}
            />
        </div>
    );
};

export default BlogPage;
