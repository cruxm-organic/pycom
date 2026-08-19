

import React, { useState, useEffect } from 'react';
import { InformationCircleIcon } from '../Icons.tsx';

const TASKS = [
    {
        problem: 'A user signs up. Where do you define the structure of the `User` table in the database?',
        options: ['Views', 'Models (ORM)', 'Templates'],
        answer: 'Models (ORM)'
    },
    {
        problem: 'You need to display a user\'s profile page with their name and email. What creates the final HTML?',
        options: ['Models (ORM)', 'Database', 'Templates'],
        answer: 'Templates'
    },
    {
        problem: 'A request comes to `/profile/123`. What part of the framework handles this URL and calls the right code?',
        options: ['Routing/URLConf', 'Middleware', 'Admin Panel'],
        answer: 'Routing/URLConf'
    },
    {
        problem: 'Where should the business logic to fetch a user from the database and prepare data for the template reside?',
        options: ['Views', 'Templates', 'Static Files'],
        answer: 'Views'
    },
    {
        problem: 'You need a quick way to manage your app\'s data without writing a custom interface. What Django feature is perfect for this?',
        options: ['The ORM', 'The Shell', 'Admin Panel'],
        answer: 'Admin Panel'
    }
];

interface FrameworkFuryGameProps {
    onComplete?: () => void;
}

const FrameworkFuryGame: React.FC<FrameworkFuryGameProps> = ({ onComplete }) => {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
    
    useEffect(() => {
        if (!process.env.API_KEY) {
            console.warn("API_KEY environment variable not set for the application. Some features may not work.");
            setApiKeyMissing(true);
        }
    }, []);

    const currentTask = TASKS[currentTaskIndex];

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return;
        
        setSelectedAnswer(option);
        const correct = option === currentTask.answer;
        setIsCorrect(correct);

        if (correct) {
            setScore(prev => prev + 20);
        }

        setTimeout(() => {
            const nextIndex = currentTaskIndex + 1;
            if (nextIndex < TASKS.length) {
                setCurrentTaskIndex(nextIndex);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameOver(true);
                if (onComplete) onComplete();
            }
        }, 1500);
    };
    
    const restartGame = () => {
        setCurrentTaskIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setGameOver(false);
    }

    if (gameOver) {
        return (
             <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Simulation Complete!</h3>
                <p className="text-lg text-purple-300 my-2">Your final optimization score is: {score}</p>
                <button onClick={restartGame} className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Run Again
                </button>
                <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             {apiKeyMissing && (
                <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 text-sm rounded-lg p-4 mb-6 flex items-start gap-3" role="alert">
                    <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold">API Key Missing or Invalid</p>
                        <p>While this game works offline, please ensure your API key is set up correctly to use all AI-powered features across PyCom.</p>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">Score: {score}</h3>
                <p className="text-purple-400 font-semibold">Task {currentTaskIndex + 1} / {TASKS.length}</p>
            </div>
            <div className="p-4 bg-black rounded-md text-center">
                <p className="text-lg text-gray-300">{currentTask.problem}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mt-6">
                {currentTask.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedAnswer === null
                                ? 'bg-gray-700 border-gray-600 hover:bg-purple-800 hover:border-purple-500'
                                : option === currentTask.answer
                                ? 'bg-green-700 border-green-500 text-white'
                                : option === selectedAnswer
                                ? 'bg-red-700 border-red-500 text-white'
                                : 'bg-gray-700 border-gray-600 opacity-50'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
        </div>
    );
};

export default FrameworkFuryGame;
