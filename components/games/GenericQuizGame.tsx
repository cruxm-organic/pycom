
import React, { useState, useEffect } from 'react';
import type { GameTopic, DifficultyLevel } from '../../types.ts';
import { ClockIcon } from '../Icons.tsx';

interface GenericQuizGameProps {
  topic: GameTopic;
  difficulty?: DifficultyLevel;
}

const GenericQuizGame: React.FC<GenericQuizGameProps> = ({ topic, difficulty = 'Medium' }) => {
    const [questions, setQuestions] = useState(topic.questions);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    const getScoreMultiplier = () => {
        switch(difficulty) {
            case 'Easy': return 1;
            case 'Medium': return 2;
            case 'Hard': return 3;
            default: return 2;
        }
    };

    const getTimeLimit = () => {
        switch(difficulty) {
            case 'Easy': return 0; // Infinite
            case 'Medium': return 30;
            case 'Hard': return 15;
            default: return 30;
        }
    };

    // Shuffle questions when the topic changes
    useEffect(() => {
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        
        const initialTime = getTimeLimit();
        if (initialTime > 0) {
            setTimeLeft(initialTime);
            setTimerActive(true);
        } else {
            setTimerActive(false);
        }
    }, [topic, difficulty]);

    // Timer Effect
    useEffect(() => {
        let interval: number;
        if (timerActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        // Time is up!
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const handleTimeUp = () => {
        setTimerActive(false);
        setSelectedAnswer('TIME_UP');
        setIsCorrect(false);
        // Automatically move to next question after delay
        setTimeout(() => {
            advanceQuestion();
        }, 2000);
    };

    if (!questions || questions.length === 0) {
        return <div className="text-center p-4">No questions available for this topic yet.</div>
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const isGameOver = currentQuestionIndex >= questions.length;

    const advanceQuestion = () => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        
        // Reset timer
        const t = getTimeLimit();
        if (t > 0) {
            setTimeLeft(t);
            setTimerActive(true);
        } else {
            setTimerActive(false);
        }
    };

    const handleAnswer = (option: string) => {
        if (selectedAnswer) return; // Prevent double clicking or clicking after time up

        setTimerActive(false); // Stop timer
        setSelectedAnswer(option);
        const correct = option === currentQuestion.answer;
        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + (10 * getScoreMultiplier()));
        }

        setTimeout(() => {
            advanceQuestion();
        }, 1500);
    };
    
    const restartGame = () => {
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
        setScore(0);
        
        const initialTime = getTimeLimit();
        if (initialTime > 0) {
            setTimeLeft(initialTime);
            setTimerActive(true);
        }
    }

    if (isGameOver) {
        return (
             <div className="bg-gray-800 p-6 rounded-lg text-center flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                <p className="text-lg text-purple-300 my-2">Your final score is: {score}</p>
                <button onClick={restartGame} className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
                    Play Again
                </button>
            </div>
        )
    }

    return (
        <div className="bg-gray-800 p-6 rounded-b-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">Score: {score}</h3>
                <div className="text-right">
                    <p className="text-purple-400 font-semibold text-xs mb-1">Q {currentQuestionIndex + 1} / {questions.length}</p>
                    {getTimeLimit() > 0 && (
                        <div className={`flex items-center gap-1 font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-300'}`}>
                            <ClockIcon className="w-4 h-4" />
                            {timeLeft}s
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 bg-black rounded-md text-center">
                <p className="text-lg text-gray-300">{currentQuestion.question}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {currentQuestion.options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-lg font-bold transition-all duration-300 border-2 text-sm ${
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
            {selectedAnswer === 'TIME_UP' && (
                <p className="text-red-400 font-bold text-center mt-4">Time's Up!</p>
            )}
        </div>
    );
};

export default GenericQuizGame;
