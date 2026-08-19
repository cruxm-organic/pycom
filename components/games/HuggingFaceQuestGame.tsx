

import React, { useState, useEffect, useRef } from 'react';
import type { HFLessonStep, DifficultyLevel } from '../../types.ts';
import { BrainIcon, CodeBracketIcon, ClockIcon } from '../Icons.tsx';

const LESSONS: HFLessonStep[] = [
    {
        id: 'pipeline',
        title: 'The Pipeline',
        teachContent: "The `pipeline()` function is the easiest way to use a pre-trained model for inference. It handles tokenization, model prediction, and post-processing in one line.",
        practiceQuestion: "You want to analyze the sentiment (positive/negative) of a review. Complete the code:",
        codeSnippet: `from transformers import pipeline\nclassifier = pipeline("_____")\nresult = classifier("This game is amazing!")`,
        options: ['sentiment-analysis', 'text-generation', 'image-classification', 'translation'],
        correctAnswer: 'sentiment-analysis',
        logOutput: [
            '[INFO] Initializing pipeline...',
            '[INFO] Downloading configuration from hf.co...',
            '[INFO] Model weights loaded: distilbert-base-uncased-finetuned-sst-2-english',
            '[SUCCESS] Pipeline ready for inference.'
        ]
    },
    {
        id: 'hub_search',
        title: 'The Model Hub',
        teachContent: "The Hugging Face Hub hosts over 500k models. Models are essentially files (weights, config, tokenizer.json). To use a specific model, you need its `model_id` (e.g., 'facebook/bart-large-cnn').",
        practiceQuestion: "Which function loads a tokenizer for a specific model ID?",
        options: ['AutoTokenizer.from_pretrained()', 'Model.load()', 'Tokenizer.get()', 'Hub.download()'],
        correctAnswer: 'AutoTokenizer.from_pretrained()',
        logOutput: [
            '[INFO] Connecting to Hugging Face Hub...',
            '[INFO] Resolving model_id...',
            '[INFO] Downloading tokenizer.json...',
            '[SUCCESS] Tokenizer loaded into memory.'
        ]
    },
    {
        id: 'spaces',
        title: 'Spaces & Deployment',
        teachContent: "Spaces are a way to host your ML demo apps. You can write your app in Python using `Gradio` or `Streamlit` and push it to a Space repo.",
        practiceQuestion: "Which file is required in a Space to tell Hugging Face which Python libraries to install?",
        options: ['requirements.txt', 'package.json', 'install.py', 'config.yml'],
        correctAnswer: 'requirements.txt',
        logOutput: [
            '[BUILD] Cloning repository...',
            '[BUILD] Found requirements.txt',
            '[BUILD] Installing dependencies: transformers, torch, gradio...',
            '[SUCCESS] App is running on port 7860.'
        ]
    },
    {
        id: 'training',
        title: 'Fine-Tuning',
        teachContent: "Fine-tuning takes a base model and updates its weights on your specific dataset. The `Trainer` API abstracts the training loop complexity.",
        practiceQuestion: "What argument in `TrainingArguments` automatically uploads your model to the Hub after training?",
        options: ['push_to_hub=True', 'upload=True', 'share_model=True', 'save_online=True'],
        correctAnswer: 'push_to_hub=True',
        logOutput: [
            '[TRAIN] Epoch 1/3 - Loss: 0.45',
            '[TRAIN] Epoch 2/3 - Loss: 0.32',
            '[TRAIN] Epoch 3/3 - Loss: 0.18',
            '[UPLOAD] Pushing model weights to user/my-new-model...',
            '[SUCCESS] Model available on Hugging Face Hub.'
        ]
    }
];

interface HuggingFaceQuestGameProps {
    difficulty?: DifficultyLevel;
    onComplete?: () => void;
}

const HuggingFaceQuestGame: React.FC<HuggingFaceQuestGameProps> = ({ difficulty = 'Medium', onComplete }) => {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [mode, setMode] = useState<'teach' | 'practice'>('teach');
    const [logs, setLogs] = useState<string[]>(['> System initialized.', '> Waiting for user input...']);
    const [feedback, setFeedback] = useState('');
    const [timeLeft, setTimeLeft] = useState(0); // For practice mode
    const [isActive, setIsActive] = useState(false);
    
    const logContainerRef = useRef<HTMLDivElement>(null);

    const currentLesson = LESSONS[currentLessonIndex];
    const isGameOver = currentLessonIndex >= LESSONS.length;

    const getTimeLimit = () => {
        if (difficulty === 'Easy') return 0; // Unlimited
        if (difficulty === 'Medium') return 20;
        return 10;
    };

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        if (isGameOver && onComplete) {
            onComplete();
        }
    }, [isGameOver, onComplete]);

    // Timer Logic for Practice Mode
    useEffect(() => {
        let interval: number;
        if (mode === 'practice' && isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                         // Time's up logic
                         setIsActive(false);
                         handleTimeUp();
                         return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [mode, isActive, timeLeft]);

    const addLog = (lines: string[]) => {
        const timestampedLines = lines.map(line => `> ${line}`);
        setLogs(prev => [...prev, ...timestampedLines]);
    };

    const handleTimeUp = () => {
        setFeedback('Time limit exceeded! Process terminated.');
        addLog(['[ERROR] Timeout.', '> Please retry module.']);
        // Force restart of lesson after delay
        setTimeout(() => {
             setMode('teach');
             setFeedback('');
        }, 2000);
    };

    const handleAnswer = (option: string) => {
        setIsActive(false); // Stop timer
        if (option === currentLesson.correctAnswer) {
            setFeedback('Correct! Initializing process...');
            addLog([`User selected: ${option}`, ...currentLesson.logOutput]);
            
            setTimeout(() => {
                if (currentLessonIndex < LESSONS.length - 1) {
                    setCurrentLessonIndex(prev => prev + 1);
                    setMode('teach');
                    setFeedback('');
                    addLog(['--------------------------------', `> Loaded Lesson: ${LESSONS[currentLessonIndex + 1].title}`]);
                } else {
                    setCurrentLessonIndex(prev => prev + 1); // Trigger game over
                    addLog(['[COMPLETE] All modules finished.', '[SUCCESS] You are now an HF Practitioner.']);
                }
            }, 3000);
        } else {
            setFeedback('Incorrect parameter. Process failed.');
            addLog([`[ERROR] Invalid argument: ${option}`, '> Please retry.']);
        }
    };

    const startPractice = () => {
        setMode('practice');
        const time = getTimeLimit();
        setTimeLeft(time);
        if (time > 0) setIsActive(true);
        addLog([`> Starting Practice Mode for: ${currentLesson.title}`]);
    }

    const restartGame = () => {
        setCurrentLessonIndex(0);
        setMode('teach');
        setLogs(['> System rebooted.', '> Ready for Lesson 1.']);
        setFeedback('');
    };

    if (isGameOver) {
        return (
            <div className="bg-gray-800 p-8 rounded-lg border border-yellow-500/50 flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="text-6xl mb-4">🤗</div>
                <h3 className="text-3xl font-bold text-white mb-2">Certification Complete!</h3>
                <p className="text-gray-300 mb-6">You have mastered the basics of Models, Spaces, and Pipelines on {difficulty} mode.</p>
                <div className="w-full bg-black p-4 rounded-lg font-mono text-left text-sm text-green-400 h-48 overflow-y-auto mb-6 border border-gray-700">
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
                <button onClick={restartGame} className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors">
                    Restart Simulation
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
            {/* Left Panel: Content */}
            <div className="bg-gray-800 p-6 rounded-lg border border-purple-500/30 flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BrainIcon className="w-6 h-6 text-yellow-400" />
                        {currentLesson.title}
                    </h3>
                    <div className="flex gap-2">
                         <div className="bg-gray-700 rounded-full px-3 py-1 text-xs font-mono text-gray-300">
                            Module {currentLessonIndex + 1}/{LESSONS.length}
                        </div>
                        {mode === 'practice' && difficulty !== 'Easy' && (
                             <div className={`bg-gray-900 border border-gray-600 rounded-full px-3 py-1 text-xs font-mono flex items-center gap-1 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                                <ClockIcon className="w-3 h-3" />
                                {timeLeft}s
                            </div>
                        )}
                    </div>
                   
                </div>

                <div className="flex-grow">
                    {mode === 'teach' ? (
                        <div className="animate-fade-in-up">
                            <h4 className="text-purple-300 font-bold mb-2 uppercase tracking-wide text-sm">Teach Mode</h4>
                            <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                                {currentLesson.teachContent}
                            </p>
                            <button 
                                onClick={startPractice}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CodeBracketIcon className="w-5 h-5" />
                                Start Practice
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <h4 className="text-green-400 font-bold mb-2 uppercase tracking-wide text-sm">Practice Mode ({difficulty})</h4>
                            <p className="text-gray-300 mb-4">{currentLesson.practiceQuestion}</p>
                            
                            {currentLesson.codeSnippet && (
                                <div className="bg-black p-4 rounded-md font-mono text-sm text-blue-300 mb-6 border-l-4 border-yellow-500">
                                    {currentLesson.codeSnippet}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-3">
                                {currentLesson.options.map(option => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        disabled={!isActive && timeLeft === 0 && difficulty !== 'Easy'}
                                        className="text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-white font-mono text-sm transition-colors border border-transparent hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {feedback && <p className={`mt-4 font-bold text-center ${feedback.includes('Correct') ? 'text-green-400' : 'text-red-400'}`}>{feedback}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Built-in Log */}
            <div className="bg-black rounded-lg border border-gray-700 flex flex-col h-[400px] lg:h-auto shadow-2xl overflow-hidden">
                <div className="bg-gray-900 p-2 border-b border-gray-700 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-400 ml-2 font-mono">user@pycom-terminal:~/huggingface</span>
                </div>
                <div 
                    ref={logContainerRef}
                    className="flex-grow p-4 font-mono text-xs sm:text-sm text-green-500 overflow-y-auto space-y-1"
                >
                    {logs.map((log, index) => (
                        <div key={index} className="break-words">
                            {log}
                            {index === logs.length - 1 && <span className="animate-pulse">_</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HuggingFaceQuestGame;
