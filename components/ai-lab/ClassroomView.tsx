
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, PlayIcon, XMarkIcon, CodeBracketIcon, SpeakerWaveIcon } from '../Icons.tsx';
import { generateSpeech } from '../../services/geminiLabService.ts';

interface ClassroomViewProps {
    courseTitle: string;
}

// --- Audio Helper Functions (reused) ---
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ClassroomView: React.FC<ClassroomViewProps> = ({ courseTitle }) => {
    const [lessonHistory, setLessonHistory] = useState<{ type: 'chalk' | 'code' | 'log', content: string }[]>([]);
    const [userCode, setUserCode] = useState('print("Hello, World!")');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const blackboardRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Initialize the AI Professor
    useEffect(() => {
        const startClass = async () => {
            if (!process.env.API_KEY) {
                setLessonHistory([{ type: 'chalk', content: 'Error: API Key missing. The Professor cannot enter the room. Please ensure your environment is configured correctly.' }]);
                setIsInitializing(false);
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
            } catch (error: any) {
                console.error("Classroom Init Error:", error);
                setLessonHistory(prev => [...prev, { type: 'chalk', content: `Connection to the Professor failed. ${error.message || "Please check your internet."}` }]);
            } finally {
                setIsLoading(false);
                setIsInitializing(false);
            }
        };

        startClass();
    }, [courseTitle]);

    // Scroll to bottom
    useEffect(() => {
        if (blackboardRef.current) {
            blackboardRef.current.scrollTop = blackboardRef.current.scrollHeight;
        }
    }, [lessonHistory]);

    const handleRunCode = async () => {
        if (!userCode.trim() || !process.env.API_KEY) return;

        setIsLoading(true);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Context construction
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
                    3. OUTPUT 2 (The Teacher): After the log, step back to the blackboard (start a new paragraph starting with "Teacher:") and comment on their result. If correct, praise them and move to the next concept/lesson. If incorrect, give a hint.`
                }
            });

            setLessonHistory(prev => [
                ...prev, 
                { type: 'code', content: userCode },
                { type: 'log', content: response.text || "Error: No response." }
            ]);

        } catch (error: any) {
            setLessonHistory(prev => [...prev, { type: 'log', content: `Error executing simulation: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const playAudio = async (text: string) => {
        if (isPlayingAudio) return;
        setIsPlayingAudio(true);
        try {
            const base64Audio = await generateSpeech(text.substring(0, 500)); // Limit length for demo
            const audioBytes = decode(base64Audio);
            
            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioCtx = audioCtxRef.current;
            const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.onended = () => setIsPlayingAudio(false);
            source.start();
        } catch (err) {
            console.error("TTS Error:", err);
            setIsPlayingAudio(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 h-full overflow-hidden">
            
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
                                    <div key={index} className="mb-8 animate-fade-in-up border-b border-white/10 pb-4 group relative">
                                        <div className="whitespace-pre-wrap">{item.content}</div>
                                        <button 
                                            onClick={() => playAudio(item.content)}
                                            disabled={isPlayingAudio}
                                            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Read Aloud"
                                        >
                                            <SpeakerWaveIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                );
                            } else if (item.type === 'log') {
                                const parts = item.content.split('Teacher:');
                                const logPart = parts[0];
                                const teacherPart = parts.length > 1 ? parts[1] : null;

                                return (
                                    <div key={index} className="mb-8 animate-fade-in-up">
                                        <div className="bg-black p-4 rounded border-l-4 border-green-500 font-mono text-green-400 text-sm mb-4 shadow-inner">
                                            {logPart}
                                        </div>
                                        {teacherPart && (
                                            <div className="text-yellow-100 group relative">
                                                <div className="whitespace-pre-wrap">{teacherPart}</div>
                                                <button 
                                                    onClick={() => playAudio(teacherPart)}
                                                    disabled={isPlayingAudio}
                                                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Read Aloud"
                                                >
                                                    <SpeakerWaveIcon className="w-5 h-5" />
                                                </button>
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
    );
};

export default ClassroomView;
