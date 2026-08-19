

import React, { useState, useEffect } from 'react';
// Fix: Add .ts extension to module path
import { generateDataStructureDilemma } from '../../services/dilemmaService.ts';
// Fix: Add .ts extension to module path
import type { Dilemma } from '../../types.ts';

interface DataStructureDilemmaGameProps {
  onComplete?: () => void;
}

const DataStructureDilemmaGame: React.FC<DataStructureDilemmaGameProps> = ({ onComplete }) => {
  const [dilemma, setDilemma] = useState<Dilemma | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [key, setKey] = useState(0); // Add key to force re-render for animations
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const QUESTIONS_PER_SESSION = 5;

  const fetchDilemma = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setDilemma(null);
    const newDilemma = await generateDataStructureDilemma();
    setDilemma(newDilemma);
    setLoading(false);
    setKey(prevKey => prevKey + 1); // Increment key to trigger animations
  };

  useEffect(() => {
    fetchDilemma();
  }, []);

  const handleAnswer = (option: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    setIsCorrect(option === dilemma?.answer);
    
    if (questionsAnswered + 1 >= QUESTIONS_PER_SESSION) {
        setIsSessionComplete(true);
        if (onComplete) onComplete();
    } else {
        setQuestionsAnswered(prev => prev + 1);
    }
  };

  const startNewSession = () => {
      setQuestionsAnswered(0);
      setIsSessionComplete(false);
      fetchDilemma();
  };

  if (isSessionComplete) {
      return (
          <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700 flex flex-col items-center justify-center h-[300px] animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-2">Session Complete!</h3>
              <p className="text-purple-300 mb-6">You've successfully tackled {QUESTIONS_PER_SESSION} dilemmas.</p>
              <button onClick={startNewSession} className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors">
                  Start New Session
              </button>
          </div>
      );
  }

  if (loading) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-purple-300 animate-pulse">Summoning AI for a new dilemma...</p>
        <p className="text-xs text-gray-500 mt-2">Question {questionsAnswered + 1} of {QUESTIONS_PER_SESSION}</p>
      </div>
    );
  }

  if (!dilemma) {
    return <div className="text-center text-red-400 p-8">Failed to load dilemma. Please try again.</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700" key={key}>
      <div className="flex justify-end mb-2">
          <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">Question {questionsAnswered + 1} / {QUESTIONS_PER_SESSION}</span>
      </div>
      <p className="text-gray-300 mb-4 text-lg text-center leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{dilemma.problem}</p>
      <div className="grid grid-cols-2 gap-4 my-6">
        {dilemma.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
            className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 animate-pop-in ${
              selectedAnswer === null
                ? 'bg-gray-700 border-gray-600 hover:bg-purple-800 hover:border-purple-500'
                : option === dilemma.answer
                ? 'bg-green-700 border-green-500 text-white'
                : option === selectedAnswer
                ? 'bg-red-700 border-red-500 text-white'
                : 'bg-gray-700 border-gray-600 opacity-50'
            }`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className={`p-4 rounded-lg text-center animate-fade-in-up ${isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
          <h4 className="font-bold text-xl">{isCorrect ? 'Correct!' : 'Not Quite!'}</h4>
          <p className="mt-2">{dilemma.explanation}</p>
        </div>
      )}
      {!isSessionComplete && (
          <button onClick={fetchDilemma} className="w-full mt-6 bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Next Question
          </button>
      )}
      <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
    </div>
  );
};

export default DataStructureDilemmaGame;
