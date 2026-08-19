import React from 'react';
import type { BlogPost } from '../types.ts';

interface BlogCardProps {
    post: BlogPost;
    onReadMore: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
    return (
        <div className="interactive-card bg-gray-800/70 p-6 rounded-xl border border-purple-500/30 flex flex-col h-full overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <div className="flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 flex-grow">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{post.summary}</p>
                 <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
                    <span>By {post.author}</span>
                    <span className="font-semibold">{post.readTime}</span>
                </div>
            </div>
            <button onClick={onReadMore} className="w-full mt-auto bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Read More
            </button>
        </div>
    );
};

export default BlogCard;