

import React, { useState, useEffect } from 'react';

const QUESTIONS = [
  {
    code: `def greet(name):\n  return f"Hello, {name}!"\n\ngreet("PyCom")`,
    options: ['"Hello, PyCom!"', 'Hello, PyCom!', 'None', 'Error'],
    answer: '"Hello, PyCom!"'
  },
  {
    code: `def calculate(a, b=5):\n  return a * b\n\ncalculate(3)`,
    options: ['8', '15', '3', 'Error'],
    answer: '15'
  },
  {
    code: `(lambda x: x + 10)(5)`,
    options: ['5', '10', '15', 'lambda'],
    answer: '15'
  },
  {
    code: `def get_first(items):\n  return items[0]\n\nget_first([])`,
    options: ['[]', 'None', '0', 'IndexError'],
    answer: 'IndexError'
  }
];

interface FunctionFrenzyGameProps {
    onComplete?: () => void;
}

const FunctionFrenzyGame: React.FC<FunctionFrenzyGameProps> = ({ onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [gameOver, setGameOver] = useState(false);
    
    const currentQuestion = QUESTIONS[currentQuestionIndex];

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return;

        setSelectedAnswer(option);
        const correct = option === currentQuestion.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 25);
        }

        setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < QUESTIONS.length) {
                setCurrentQuestionIndex(nextIndex);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                setGameOver(true);
                if (onComplete) onComplete();
            }
        }, 1500);
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setGameOver(false);
    };

    if (gameOver) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Frenzy Finished!</h3>
                <p className="text-lg text-purple-300 my-2">Your score: {score}</p>
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
                <p className="text-purple-400 font-semibold">Question {currentQuestionIndex + 1} / {QUESTIONS.length}</p>
            </div>
            <p className="text-gray-300 text-center mb-4">What is the output of this code?</p>
            <div className="p-4 bg-black rounded-md font-mono text-left text-sm text-green-400 whitespace-pre-wrap">
                {currentQuestion.code}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                            selectedAnswer === null
                                ? 'bg-gray-700 border-gray-600 hover:bg-purple-800 hover:border-purple-500'
                                : option === currentQuestion.answer
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

export default FunctionFrenzyGame;
