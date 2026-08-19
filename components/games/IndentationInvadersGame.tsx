

import React, { useState, useEffect, useCallback } from 'react';
import type { DifficultyLevel } from '../../types.ts';

const CODE_SNIPPETS = [
  { line: 'if name == "Player1":', indent: 1 },
  { line: 'print("Welcome!")', indent: 2 },
  { line: 'for i in range(5):', indent: 1 },
  { line: 'print(i)', indent: 2 },
  { line: 'def my_function():', indent: 0 },
  { line: 'print("Hello from a function")', indent: 1 },
  { line: 'else:', indent: 1 },
  { line: 'print("Access denied.")', indent: 2 },
  { line: 'class Player:', indent: 0 },
  { line: 'def __init__(self):', indent: 1 },
  { line: 'self.score = 0', indent: 2 },
];

interface IndentationInvadersGameProps {
    difficulty?: DifficultyLevel;
    onComplete?: () => void;
}

const IndentationInvadersGame: React.FC<IndentationInvadersGameProps> = ({ difficulty = 'Medium', onComplete }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentSnippet, setCurrentSnippet] = useState(CODE_SNIPPETS[0]);
  const [userIndent, setUserIndent] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | ''>('');

  // Difficulty configurations
  const getInitialTime = () => {
      switch(difficulty) {
          case 'Easy': return 60;
          case 'Medium': return 30;
          case 'Hard': return 15;
          default: return 30;
      }
  };

  const getPenalty = () => {
      switch(difficulty) {
          case 'Easy': return 1;
          case 'Medium': return 3;
          case 'Hard': return 5;
          default: return 3;
      }
  };

  const getScoreMultiplier = () => {
      switch(difficulty) {
          case 'Easy': return 1;
          case 'Medium': return 2;
          case 'Hard': return 3;
          default: return 2;
      }
  };

  const nextSnippet = useCallback(() => {
    const newSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
    setCurrentSnippet(newSnippet);
    setUserIndent(0);
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(getInitialTime());
    nextSnippet();
  };

  const handleIndent = () => {
    if (gameState !== 'playing') return;
    setUserIndent(prev => prev + 1);
  };

  const handleSubmit = () => {
    if (gameState !== 'playing') return;
    if (userIndent === currentSnippet.indent) {
      setScore(prev => prev + (10 * getScoreMultiplier()));
      setFeedback('correct');
    } else {
      setTimeLeft(prev => Math.max(0, prev - getPenalty())); // Penalty for wrong answer
      setFeedback('incorrect');
    }
    
    setTimeout(() => {
        setFeedback('');
        nextSnippet();
    }, 500);
  };
  
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('over');
      if (onComplete) onComplete();
    }
  }, [timeLeft, gameState, onComplete]);

  const feedbackColor = feedback === 'correct' ? 'border-green-500' : feedback === 'incorrect' ? 'border-red-500' : 'border-gray-700';

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-400">Score: {score}</h3>
        <div className="text-right">
             <h3 className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-purple-400'}`}>Time: {timeLeft}s</h3>
             <p className="text-xs text-slate-500 uppercase">{difficulty} Mode</p>
        </div>
      </div>

      {gameState === 'playing' ? (
        <div className="animate-fade-in-up">
          <p className="text-gray-300 mb-4">Indent this line correctly!</p>
          <div className={`p-4 bg-black rounded-md font-mono text-left text-lg text-green-400 transition-all border-2 ${feedbackColor}`}>
            <p>
              <span className="text-purple-400">{'>'.repeat(userIndent)}</span>
              {currentSnippet.line}
            </p>
          </div>
          <div className="mt-4 flex gap-4">
            <button onClick={handleIndent} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700">
              Indent (Space)
            </button>
            <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
              Submit (Enter)
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px]">
          {gameState === 'over' && (
             <div className="mb-4 animate-pop-in">
                <h3 className="text-2xl font-bold text-white">Game Over!</h3>
                <p className="text-lg text-purple-300">Your final score is: {score}</p>
             </div>
          )}
          <button onClick={startGame} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
            {gameState === 'over' ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      )}
      <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
    </div>
  );
};

export default IndentationInvadersGame;
