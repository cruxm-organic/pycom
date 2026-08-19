
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, PlayIcon, XMarkIcon, CodeBracketIcon } from '../Icons.tsx';

interface AIClassroomProps {
    courseTitle: string;
    onLeaveClass: () => void;
}

const AIClassroom: React.FC<AIClassroomProps> = ({ courseTitle, onLeaveClass }) => {
    const [lessonHistory, setLessonHistory] = useState<{ type: 'chalk' | 'code' | 'log', content: string }[]>([]);
    const [userCode, setUserCode] = useState('print("Hello, World!")');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const blackboardRef = useRef<HTMLDivElement>(null);

    // Initialize the AI Professor
    useEffect(() => {
        const startClass = async () => {
            if (!process.env.API_KEY) {
                setLessonHistory([{ type: 'chalk', content: 'Error: API Key missing. The Professor cannot enter the room.' }]);
                return;
            }

            setIsLoading(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: "Start the first lesson. Introduce yourself and the topic, then draw a diagram on the blackboard explaining the first concept.",
                    config: {
                        systemInstruction: `You are Professor Py, a friendly, encouraging, and highly visual computer science teacher. 
                        You are teaching the course: "${courseTitle}".
                        
                        STYLE GUIDELINES:
                        1. You are writing on a BLACKBOARD. Use markdown heavily.
                        2. Use ASCII art or diagrams where possible to explain concepts visually.
                        3. Keep explanations concise but interesting.
                        4. Always end your turn by asking the student to write specific code in their notebook to practice the concept.
                        5. Do not give the full answer code, let the student try.`
                    }
                });
                
                if (response.text) {
                    setLessonHistory(prev => [...prev, { type: 'chalk', content: response.text! }]);
                } else {
                    throw new Error("No content generated");
                }
            } catch (error) {
                setLessonHistory(prev => [...prev, { type: 'chalk', content: "Connection to the Professor failed. Please check your internet." }]);
            } finally {
                setIsLoading(false);
                setIsInitializing(false);
            }
        };

        startClass();
    }, [courseTitle]);

    // Scroll to bottom of blackboard on new content
    useEffect(() => {
        if (blackboardRef.current) {
            blackboardRef.current.scrollTop = blackboardRef.current.scrollHeight;
        }
    }, [lessonHistory]);

    const handleRunCode = async () => {
        if (!userCode.trim() || !process.env.API_KEY) return;

        setIsLoading(true);
        // Add user code to history for context (visually we separate it)
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Context construction (simplified for this demo)
            const lastLesson = lessonHistory.filter(l => l.type === 'chalk').pop()?.content || "";
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    { role: 'model', parts: [{ text: lastLesson }] },
                    { role: 'user', parts: [{ text: `Here is my code:\n\`\`\`python\n${userCode}\n\`\`\`` }] }
                ],
                config: {
                    systemInstruction: `You are simulating a Python terminal/interpreter AND a teacher.
                    
                    INPUT: The student's code.
                    
                    YOUR TASK:
                    1. Analyze the code.
                    2. OUTPUT 1 (The Log): Simulate exactly what this code would output in a terminal. If there is an error, simulate the Python traceback.
                    3. OUTPUT 2 (The Teacher): After the log, step back to the blackboard (start a new paragraph) and comment on their result. If correct, praise them and move to the next concept/lesson. If incorrect, give a hint.`
                }
            });

            setLessonHistory(prev => [
                ...prev, 
                { type: 'code', content: userCode },
                { type: 'log', content: response.text || "Execution failed." } 
            ]);

        } catch (error) {
            setLessonHistory(prev => [...prev, { type: 'log', content: "Error executing code simulation." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-slate-900 -m-4 sm:-m-6 lg:-m-8 p-4 gap-4">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
                <h2 className="text-white font-bold flex items-center gap-2">
                    <span className="text-2xl">🎓</span>
                    {courseTitle} <span className="text-slate-500 text-sm font-normal">| AI Interactive Session</span>
                </h2>
                <button onClick={onLeaveClass} className="bg-red-500/20 text-red-300 hover:bg-red-500/40 p-2 rounded-full transition-colors">
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden">
                
                {/* Left: The Blackboard (Teacher) */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-[#1e2e1e] border-[8px] border-[#5d4037] rounded-xl shadow-2xl flex-grow overflow-hidden flex flex-col relative">
                        {/* Blackboard Header */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                        
                        <div ref={blackboardRef} className="flex-grow p-6 overflow-y-auto font-mono text-lg leading-relaxed text-[#e0e0e0]">
                            {isInitializing && (
                                <div className="text-center text-[#8fbc8f] animate-pulse mt-20">
                                    Professor Py is erasing the board...
                                </div>
                            )}
                            {lessonHistory.map((item, index) => {
                                if (item.type === 'chalk') {
                                    return (
                                        <div key={index} className="mb-8 animate-fade-in-up whitespace-pre-wrap border-b border-white/10 pb-4">
                                            {item.content}
                                        </div>
                                    );
                                } else if (item.type === 'log') {
                                    // Split the log/teacher response if possible, otherwise just show it
                                    return (
                                        <div key={index} className="mb-8 animate-fade-in-up">
                                            <div className="bg-black p-4 rounded border-l-4 border-green-500 font-mono text-green-400 text-sm mb-4 shadow-inner">
                                                {item.content.split('Teacher:')[0] || item.content} {/* Rudimentary split attempt */}
                                            </div>
                                            {item.content.includes('Teacher:') && (
                                                <div className="text-yellow-100">
                                                    {item.content.split('Teacher:')[1]}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            })}
                            {isLoading && (
                                <div className="flex items-center gap-2 text-[#8fbc8f]">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce delay-100">.</span>
                                    <span className="animate-bounce delay-200">.</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Chalk Tray */}
                        <div className="h-6 bg-[#4a332a] border-t border-[#3e2b23] flex items-center px-4 gap-4">
                            <div className="w-12 h-2 bg-white/80 rounded-sm shadow-sm transform rotate-3"></div>
                            <div className="w-8 h-2 bg-yellow-200/80 rounded-sm shadow-sm transform -rotate-6"></div>
                            <div className="w-16 h-6 bg-gray-700 rounded -mt-3 shadow-lg border border-gray-600"></div>
                        </div>
                    </div>
                </div>

                {/* Right: The Notebook (Student) */}
                <div className="lg:w-1/3 flex flex-col gap-4 min-h-0">
                    {/* Code Editor */}
                    <div className="bg-gray-900 rounded-xl border border-gray-700 flex flex-col flex-grow shadow-lg overflow-hidden">
                        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <CodeBracketIcon className="w-4 h-4" /> Student Notebook.py
                            </span>
                        </div>
                        <textarea 
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="flex-grow bg-[#0d1117] p-4 font-mono text-sm text-blue-300 focus:outline-none resize-none"
                            placeholder="# Write your code here..."
                            spellCheck={false}
                        />
                        <div className="p-4 bg-gray-800 border-t border-gray-700">
                            <button 
                                onClick={handleRunCode}
                                disabled={isLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <>
                                        <PlayIcon className="w-5 h-5" />
                                        Run Code & Check
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Terminal Log Output Preview (Short) */}
                    <div className="h-1/3 bg-black rounded-xl border border-gray-700 p-4 font-mono text-xs overflow-y-auto shadow-lg">
                        <div className="text-gray-500 mb-2">root@pycom-lab:~$ tail -f output.log</div>
                        {lessonHistory.filter(l => l.type === 'code' || l.type === 'log').slice(-4).map((item, i) => (
                            <div key={i} className={`mb-2 ${item.type === 'code' ? 'text-blue-400' : 'text-green-400'}`}>
                                {item.type === 'code' ? `> ${item.content}` : item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '')}
                            </div>
                        ))}
                        {lessonHistory.filter(l => l.type === 'code' || l.type === 'log').length === 0 && (
                            <div className="text-gray-600 italic">Ready to execute...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIClassroom;
