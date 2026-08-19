

import React, { useState } from 'react';

const SCENARIOS = [
    {
        code: `my_dict = {'key': 'value'}\nprint(my_dict['wrong_key'])`,
        options: ['TypeError', 'KeyError', 'ValueError', 'IndexError'],
        answer: 'KeyError'
    },
    {
        code: `result = 'hello' + 5`,
        options: ['TypeError', 'SyntaxError', 'ValueError', 'NameError'],
        answer: 'TypeError'
    },
    {
        code: `my_list = [1, 2, 3]\nprint(my_list[5])`,
        options: ['KeyError', 'ValueError', 'IndexError', 'TypeError'],
        answer: 'IndexError'
    },
    {
        code: `print(x)`,
        options: ['ValueError', 'TypeError', 'SyntaxError', 'NameError'],
        answer: 'NameError'
    }
];

interface ExceptionEscapistGameProps {
    onComplete?: () => void;
}

const ExceptionEscapistGame: React.FC<ExceptionEscapistGameProps> = ({ onComplete }) => {
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameOver, setGameOver] = useState(false);

    const currentScenario = SCENARIOS[currentScenarioIndex];

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(option);
        const correct = option === currentScenario.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 25);
        }

        setTimeout(() => {
            const nextIndex = currentScenarioIndex + 1;
            if (nextIndex < SCENARIOS.length) {
                setCurrentScenarioIndex(nextIndex);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameOver(true);
                if (onComplete) onComplete();
            }
        }, 1500);
    };

    const restartGame = () => {
        setCurrentScenarioIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setGameOver(false);
    }

    if (gameOver) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Escaped!</h3>
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
                <p className="text-purple-400 font-semibold">Scenario {currentScenarioIndex + 1} / {SCENARIOS.length}</p>
            </div>
            <p className="text-gray-300 text-center mb-4">What exception will this code raise?</p>
            <div className="p-4 bg-black rounded-md font-mono text-left text-sm text-red-400 whitespace-pre-wrap">
                {currentScenario.code}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {currentScenario.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedAnswer === null
                                ? 'bg-gray-700 border-gray-600 hover:bg-purple-800 hover:border-purple-500'
                                : option === currentScenario.answer
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

export default ExceptionEscapistGame;
