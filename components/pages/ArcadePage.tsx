

import React, { useState, useEffect } from 'react';
import { GAME_CATEGORIES } from '../../constants.ts';
import type { PageNavigationProps, GameCategory, GameTopic, DifficultyLevel, GameStatus } from '../../types.ts';
import DataStructureDilemmaGame from '../games/DataStructureDilemmaGame.tsx';
import IndentationInvadersGame from '../games/IndentationInvadersGame.tsx';
import OOPFortressGame from '../games/OOPFortressGame.tsx';
import FrameworkFuryGame from '../games/FrameworkFuryGame.tsx';
import FunctionFrenzyGame from '../games/FunctionFrenzyGame.tsx';
import ComprehensionCrafterGame from '../games/ComprehensionCrafterGame.tsx';
import ExceptionEscapistGame from '../games/ExceptionEscapistGame.tsx';
import CodeDebuggerGame from '../games/CodeDebuggerGame.tsx';
import RegexRaptorGame from '../games/RegexRaptorGame.tsx';
import HuggingFaceQuestGame from '../games/HuggingFaceQuestGame.tsx';
import GenericQuizGame from '../games/GenericQuizGame.tsx';
import { ChevronDownIcon, TrophyIcon, CheckCircleIcon, PlayIcon, StopIcon } from '../Icons.tsx';

// We store the component class/function instead of the instance to allow prop injection
const FEATURED_GAMES = [
    { id: 'hf-quest', title: 'Hugging Face Quest', Component: HuggingFaceQuestGame, description: 'Learn AI/ML concepts, Pipelines, and Spaces in this interactive simulation.' },
    { id: 'dilemma', title: 'Data Structure Dilemma', Component: DataStructureDilemmaGame, description: 'Choose the right data structure for the job in this AI-powered quiz.' },
    { id: 'invaders', title: 'Indentation Invaders', Component: IndentationInvadersGame, description: 'Master Python\'s syntax by setting the correct indentation level.' },
    { id: 'fortress', title: 'OOP Fortress', Component: OOPFortressGame, description: 'Build your Object-Oriented Programming fortress by matching methods to classes.' },
    { id: 'fury', title: 'Framework Fury', Component: FrameworkFuryGame, description: 'Learn the core components of web frameworks like Django and Flask.' },
    { id: 'frenzy', title: 'Function Frenzy', Component: FunctionFrenzyGame, description: 'Test your knowledge of function calls, returns, and scopes.' },
    { id: 'crafter', title: 'Comprehension Crafter', Component: ComprehensionCrafterGame, description: 'Construct list comprehensions to create lists in a Pythonic way.' },
    { id: 'escapist', title: 'Exception Escapist', Component: ExceptionEscapistGame, description: 'Identify the correct exception that the buggy code will raise.' },
    { id: 'debugger', title: 'Code Debugger', Component: CodeDebuggerGame, description: 'Find the single buggy line in various snippets of Python code.' },
    { id: 'raptor', title: 'Regex Raptor', Component: RegexRaptorGame, description: 'Match strings to the correct regular expression pattern.' },
];

const GameModal: React.FC<{ topic: GameTopic, difficulty: DifficultyLevel, onClose: () => void }> = ({ topic, difficulty, onClose }) => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="relative bg-slate-900 border border-purple-500 rounded-2xl w-full max-w-2xl shadow-2xl animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{topic.title}</h2>
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${difficulty === 'Hard' ? 'bg-red-900 text-red-200' : difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'}`}>
                        {difficulty}
                    </span>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
            </div>
            <div className="p-4">
                <GenericQuizGame topic={topic} difficulty={difficulty} />
            </div>
        </div>
    </div>
);

const CategorySection: React.FC<{ category: GameCategory, onTopicSelect: (topic: GameTopic) => void }> = ({ category, onTopicSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-700/50 transition-colors">
                <div>
                    <h3 className="text-xl font-bold text-purple-300">{category.title}</h3>
                    <p className="text-sm text-slate-400">{category.description}</p>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {category.topics.map(topic => (
                            <button key={topic.id} onClick={() => onTopicSelect(topic)} className="bg-slate-700 p-3 rounded-lg text-left hover:bg-purple-800 hover:border-purple-500 border-2 border-transparent transition-all">
                                <h4 className="font-semibold text-white">{topic.title}</h4>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const GamezonePage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    const [selectedGame, setSelectedGame] = useState<(typeof FEATURED_GAMES)[0] | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<GameTopic | null>(null);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
    const [gameStatuses, setGameStatuses] = useState<{ [key: string]: GameStatus }>({});

    // Load statuses from local storage on mount
    useEffect(() => {
        const savedStatuses = localStorage.getItem('pycom_game_statuses');
        if (savedStatuses) {
            setGameStatuses(JSON.parse(savedStatuses));
        }
    }, []);

    const updateGameStatus = (gameId: string, status: GameStatus) => {
        setGameStatuses(prev => {
            const newStatuses = { ...prev, [gameId]: status };
            localStorage.setItem('pycom_game_statuses', JSON.stringify(newStatuses));
            return newStatuses;
        });
    };

    const handleDifficultyChange = (level: DifficultyLevel) => {
        setDifficulty(level);
    };

    const handleGameSelect = (game: typeof FEATURED_GAMES[0]) => {
        setSelectedGame(game);
        // Only set to 'In Progress' if it hasn't been started or completed yet
        if (!gameStatuses[game.id] || gameStatuses[game.id] === 'Not Started') {
            updateGameStatus(game.id, 'In Progress');
        }
    };
    
    const handleGameComplete = () => {
        if (selectedGame) {
            updateGameStatus(selectedGame.id, 'Completed');
        }
    };

    const StatusBadge: React.FC<{ status?: GameStatus }> = ({ status }) => {
        if (!status || status === 'Not Started') {
            return (
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-900/50 px-2 py-1 rounded">
                    <StopIcon className="w-3 h-3" />
                    <span>Not Started</span>
                </div>
            );
        }
        if (status === 'In Progress') {
             return (
                <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                    <PlayIcon className="w-3 h-3" />
                    <span>In Progress</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                <CheckCircleIcon className="w-3 h-3" />
                <span>Completed</span>
            </div>
        );
    };

    if (selectedGame) {
        // We render the component dynamically and pass the difficulty prop
        const GameComponent = selectedGame.Component;
        return (
            <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setSelectedGame(null)} className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                        &larr; Back to Gamezone
                    </button>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={gameStatuses[selectedGame.id]} />
                        <div className="px-3 py-1 bg-gray-800 rounded-lg border border-gray-700 text-sm">
                            Difficulty: <span className={`${difficulty === 'Hard' ? 'text-red-400' : difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'} font-bold`}>{difficulty}</span>
                        </div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-4">{selectedGame.title}</h2>
                {/* @ts-ignore - Assuming all game components can accept difficulty even if not strictly typed yet */}
                <GameComponent difficulty={difficulty} onComplete={handleGameComplete} />
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in-up">
            {selectedTopic && <GameModal topic={selectedTopic} difficulty={difficulty} onClose={() => setSelectedTopic(null)} />}
            
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Gamezone Arcade</h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8">
                    Select a difficulty level to adjust game speed, complexity, and scoring.
                </p>

                {/* Difficulty Selector */}
                <div className="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700 shadow-lg mb-8">
                    {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((level) => (
                        <button
                            key={level}
                            onClick={() => handleDifficultyChange(level)}
                            className={`px-6 py-2 rounded-md font-bold transition-all duration-200 ${
                                difficulty === level 
                                    ? level === 'Easy' ? 'bg-green-600 text-white shadow' : level === 'Medium' ? 'bg-yellow-600 text-white shadow' : 'bg-red-600 text-white shadow'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mb-16">
                 <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
                    <TrophyIcon className="w-8 h-8 text-yellow-500" />
                    Featured Games
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_GAMES.map(game => (
                        <button key={game.id} onClick={() => handleGameSelect(game)} className="interactive-card bg-gray-800/70 p-6 rounded-xl border border-purple-500/30 text-left h-full flex flex-col group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{game.title}</h3>
                                <StatusBadge status={gameStatuses[game.id]} />
                            </div>
                            <p className="text-gray-400 text-sm flex-grow">{game.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <h2 className="text-3xl font-bold text-center text-white mb-8">Full Python Curriculum</h2>
                 <div className="space-y-4">
                    {GAME_CATEGORIES.map(category => (
                        <CategorySection key={category.id} category={category} onTopicSelect={setSelectedTopic} />
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default GamezonePage;
