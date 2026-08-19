

import React, { useState } from 'react';

const CHALLENGES = [
    {
        pattern: `r'\\d{3}-\\d{3}-\\d{4}'`,
        description: 'Find the US Phone Number',
        options: ['1234567890', '123-456-7890', '123-456-ABCD', '555-5555'],
        answer: '123-456-7890'
    },
    {
        pattern: `r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'`,
        description: 'Find the Valid Email',
        options: ['user@domain', 'user@domain.com', 'user@.com', 'user.domain.com'],
        answer: 'user@domain.com'
    },
    {
        pattern: `r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'`,
        description: 'Find the Hex Color Code',
        options: ['#FFF', '#12345G', '123456', '#ABCDEF'],
        answer: '#ABCDEF'
    },
];

interface RegexRaptorGameProps {
    onComplete?: () => void;
}

const RegexRaptorGame: React.FC<RegexRaptorGameProps> = ({ onComplete }) => {
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameOver, setGameOver] = useState(false);

    const currentChallenge = CHALLENGES[currentChallengeIndex];

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(option);
        const correct = option === currentChallenge.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 25);
        }

        setTimeout(() => {
            const nextIndex = currentChallengeIndex + 1;
            if (nextIndex < CHALLENGES.length) {
                setCurrentChallengeIndex(nextIndex);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameOver(true);
                if (onComplete) onComplete();
            }
        }, 1500);
    };

    const restartGame = () => {
        setCurrentChallengeIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setGameOver(false);
    };

    if (gameOver) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Patterns Matched!</h3>
                <p className="text-lg text-purple-300 my-2">Final Score: {score}</p>
                <button onClick={restartGame} className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">Score: {score}</h3>
                <p className="text-purple-400 font-semibold">Challenge {currentChallengeIndex + 1} / {CHALLENGES.length}</p>
            </div>
            <p className="text-gray-300 text-center mb-2">{currentChallenge.description}</p>
            <div className="p-4 bg-black rounded-md font-mono text-center text-lg text-yellow-300 mb-4">
                {currentChallenge.pattern}
            </div>
             <div className="grid grid-cols-2 gap-4 mt-6">
                {currentChallenge.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedAnswer === null
                                ? 'bg-gray-700 border-gray-600 hover:bg-purple-800 hover:border-purple-500'
                                : option === currentChallenge.answer
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

export default RegexRaptorGame;
