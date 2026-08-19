import React from 'react';
import type { PageNavigationProps } from '../../types.ts';
import { 
    TrophyIcon, 
    BookOpenIcon, 
    RectangleStackIcon, 
    AcademicCapIcon, 
    ChatBubbleLeftRightIcon, 
    LifebuoyIcon, 
    VideoCameraIcon 
} from '../Icons.tsx';

const RESOURCES_DATA = [
    {
        icon: <TrophyIcon className="w-10 h-10 text-yellow-400" />,
        title: "Success Stories",
        description: "Read about how organizations just like yours have achieved their goals with automation and Python.",
        link: "#"
    },
    {
        icon: <BookOpenIcon className="w-10 h-10 text-blue-400" />,
        title: "How-to Guides",
        description: "Explore our step-by-step tutorials to master new skills and succeed with our tools.",
        link: "#"
    },
    {
        icon: <RectangleStackIcon className="w-10 h-10 text-green-400" />,
        title: "Templates Library",
        description: "Get a head start on your projects with our extensive library of pre-built templates.",
        link: "#"
    },
    {
        icon: <AcademicCapIcon className="w-10 h-10 text-purple-400" />,
        title: "PyCom Academy",
        description: "Access exclusive eLearning content, courses, and materials to accelerate your learning.",
        link: "#"
    },
    {
        icon: <ChatBubbleLeftRightIcon className="w-10 h-10 text-indigo-400" />,
        title: "PyCom Community",
        description: "Connect with fellow PyComrades. Exchange ideas, ask questions, and share tips.",
        link: "#"
    },
    {
        icon: <LifebuoyIcon className="w-10 h-10 text-red-400" />,
        title: "Help Center",
        description: "Find answers fast by exploring our comprehensive documentation and resources.",
        link: "#"
    },
    {
        icon: <VideoCameraIcon className="w-10 h-10 text-pink-400" />,
        title: "Webinars",
        description: "Join live, expert-led learning sessions and workshops on a variety of topics.",
        link: "#"
    }
];

const ResourceCard: React.FC<{ resource: typeof RESOURCES_DATA[0] }> = ({ resource }) => (
    <a
        href={resource.link}
        className="interactive-card bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-left h-full flex flex-col items-center text-center"
    >
        <div className="flex-shrink-0">{resource.icon}</div>
        <h3 className="text-xl font-bold text-white mt-4 mb-2">{resource.title}</h3>
        <p className="text-gray-400 text-sm flex-grow">{resource.description}</p>
    </a>
);


const ResourcesPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">PyCom Resources</h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                    Your central hub for learning materials, community support, and expert guidance to help you succeed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {RESOURCES_DATA.map(resource => (
                    <ResourceCard key={resource.title} resource={resource} />
                ))}
            </div>
        </div>
    );
};

export default ResourcesPage;