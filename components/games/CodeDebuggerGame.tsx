

import React, { useState } from 'react';

const BUGS = [
    {
        lines: [
            'def calculate_area(length, width):',
            '    area = length * width',
            '    print(area)'
        ],
        buggyLine: 2,
        explanation: 'A function should `return` a value, not just print it, to be reusable.'
    },
    {
        lines: [
            'numbers = [1, 2, 3, 4, 5]',
            'for number in numbers:',
            '    if number % 2 == 0',
            '        print(number)'
        ],
        buggyLine: 2,
        explanation: 'The `if` statement is missing a colon `:` at the end.'
    },
    {
        lines: [
            'name = "PyCom"',
            'if name = "PyCom":',
            '    print("Welcome!")'
        ],
        buggyLine: 1,
        explanation: 'Use `==` for comparison. A single `=` is for assignment.'
    }
];

interface CodeDebuggerGameProps {
    onComplete?: () => void;
}

const CodeDebuggerGame: React.FC<CodeDebuggerGameProps> = ({ onComplete }) => {
    const [currentBugIndex, setCurrentBugIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [solved, setSolved] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const currentBug = BUGS[currentBugIndex];

    const handleLineClick = (lineIndex: number) => {
        if (solved) return;

        if (lineIndex === currentBug.buggyLine) {
            setScore(prev => prev + 30);
            setFeedback(`Correct! ${currentBug.explanation}`);
            setSolved(true);
        } else {
            setFeedback('Not quite, that line looks okay. Try another!');
        }
    };

    const nextBug = () => {
        setSolved(false);
        setFeedback('');
        const nextIndex = currentBugIndex + 1;
        if (nextIndex < BUGS.length) {
            setCurrentBugIndex(nextIndex);
        } else {
            setGameOver(true);
            if (onComplete) onComplete();
        }
    };

    const restartGame = () => {
        setCurrentBugIndex(0);
        setScore(0);
        setFeedback('');
        setSolved(false);
        setGameOver(false);
    }

    if (gameOver) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Debugging Complete!</h3>
                <p className="text-lg text-purple-300 my-2">Final Score: {score}</p>
                <button onClick={restartGame} className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Score: {score}</h3>
            <p className="text-gray-300 mb-4">Find and click on the buggy line of code!</p>
            
            <div className="p-4 bg-black rounded-md font-mono text-left text-lg text-green-400">
                {currentBug.lines.map((line, index) => (
                    <p key={index} onClick={() => handleLineClick(index)} className={`cursor-pointer hover:bg-gray-700/50 rounded px-2 ${solved && index === currentBug.buggyLine ? 'bg-red-700/50' : ''}`}>
                        {line}
                    </p>
                ))}
            </div>

            {feedback && <p className={`mt-4 font-semibold ${solved ? 'text-green-400' : 'text-red-400'}`}>{feedback}</p>}

            {solved && (
                <button onClick={nextBug} className="w-full mt-4 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">
                    Next Bug
                </button>
            )}
            <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
        </div>
    );
};

export default CodeDebuggerGame;
