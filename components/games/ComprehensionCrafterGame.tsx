

import React, { useState } from 'react';

const PUZZLES = [
  {
    target: '[0, 1, 4, 9, 16]',
    parts: ['i * i', 'for i in range(5)'],
    blanks: 2
  },
  {
    target: "['P', 'Y', 'T', 'H', 'O', 'N']",
    parts: ['char', 'for char in "PYTHON"'],
    blanks: 2
  },
  {
    target: '[0, 2, 4, 6, 8]',
    parts: ['i', 'for i in range(10)', 'if i % 2 == 0'],
    blanks: 3
  },
];

interface ComprehensionCrafterGameProps {
    onComplete?: () => void;
}

const ComprehensionCrafterGame: React.FC<ComprehensionCrafterGameProps> = ({ onComplete }) => {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [userInputs, setUserInputs] = useState<string[]>([]);
    const [feedback, setFeedback] = useState('');
    const [gameOver, setGameOver] = useState(false);

    const currentPuzzle = PUZZLES[currentPuzzleIndex];
    
    // Initialize inputs when puzzle changes
    React.useEffect(() => {
        if (!gameOver) {
            setUserInputs(Array(currentPuzzle.blanks).fill(''));
        }
    }, [currentPuzzleIndex, gameOver]);

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...userInputs];
        newInputs[index] = value;
        setUserInputs(newInputs);
    };

    const handleSubmit = () => {
        const solution = currentPuzzle.parts.join(' ');
        const userAnswer = userInputs.join(' ').trim();

        if (solution === userAnswer) {
            setScore(prev => prev + 50);
            setFeedback('Perfectly Pythonic! Correct!');
            setTimeout(() => {
                const nextIndex = currentPuzzleIndex + 1;
                if (nextIndex < PUZZLES.length) {
                    setCurrentPuzzleIndex(nextIndex);
                    setFeedback('');
                } else {
                    setGameOver(true);
                    if (onComplete) onComplete();
                }
            }, 1500);
        } else {
            setScore(prev => Math.max(0, prev - 10));
            setFeedback('Not quite right. Give it another try!');
        }
    };
    
    const restartGame = () => {
        setCurrentPuzzleIndex(0);
        setScore(0);
        setFeedback('');
        setGameOver(false);
    };

    if (gameOver) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">All Puzzles Crafted!</h3>
                <p className="text-lg text-purple-300 my-2">Your Pythonic Score: {score}</p>
                <button onClick={restartGame} className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Score: {score}</h3>
            <p className="text-gray-300 mb-2">Complete the list comprehension to produce the target list:</p>
            <p className="font-mono text-2xl text-purple-400 bg-black p-2 rounded-md mb-4">{currentPuzzle.target}</p>
            
            <div className="bg-black p-4 rounded-md font-mono text-lg flex items-center justify-center gap-2 flex-wrap">
                <span className="text-white">[</span>
                {Array.from({ length: currentPuzzle.blanks }).map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        value={userInputs[i] || ''}
                        onChange={(e) => handleInputChange(i, e.target.value)}
                        className="bg-gray-700 text-yellow-300 rounded p-1 w-48 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                ))}
                <span className="text-white">]</span>
            </div>

            <button onClick={handleSubmit} className="w-full mt-6 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700">
                Craft It!
            </button>
            {feedback && <p className="mt-4 font-semibold text-lg animate-pop-in">{feedback}</p>}
            <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
        </div>
    );
};

export default ComprehensionCrafterGame;
