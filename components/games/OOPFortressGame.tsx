

import React, { useState, useEffect } from 'react';

const GAME_DATA = {
    classes: [
        { id: 'c1', name: 'class Player:' },
        { id: 'c2', name: 'class Enemy:' },
        { id: 'c3', name: 'class Weapon:' },
    ],
    methods: [
        { id: 'm1', text: 'def move(self, direction):', classId: 'c1' },
        { id: 'm2', text: 'def attack(self):', classId: 'c2' },
        { id: 'm3', text: 'def swing(self):', classId: 'c3' },
        { id: 'm4', text: 'def collect_item(self, item):', classId: 'c1' },
        { id: 'm5', text: 'def take_damage(self, amount):', classId: 'c2' },
        { id: 'm6', text: 'def upgrade(self):', classId: 'c3' },
    ]
};

interface OOPFortressGameProps {
    onComplete?: () => void;
}

const OOPFortressGame: React.FC<OOPFortressGameProps> = ({ onComplete }) => {
    const [methods, setMethods] = useState(GAME_DATA.methods);
    const [placedMethods, setPlacedMethods] = useState<{ [key: string]: string[] }>({ c1: [], c2: [], c3: [] });
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSelectMethod = (methodId: string) => {
        setSelectedMethodId(methodId);
    };

    const handlePlaceMethod = (classId: string) => {
        if (!selectedMethodId) return;

        const method = methods.find(m => m.id === selectedMethodId);
        if (!method) return;

        if (method.classId === classId) {
            setScore(prev => prev + 10);
            setFeedback('Correct! Method belongs to this class.');
            setPlacedMethods(prev => ({
                ...prev,
                [classId]: [...prev[classId], method.text]
            }));
            setMethods(prev => prev.filter(m => m.id !== selectedMethodId));
        } else {
            setScore(prev => Math.max(0, prev - 5));
            setFeedback('Incorrect! This method belongs elsewhere.');
        }
        setSelectedMethodId(null);

        setTimeout(() => setFeedback(''), 1500);
    };

    useEffect(() => {
        if (methods.length === 0) {
            setFeedback('Fortress built! All methods placed correctly!');
            if (onComplete) onComplete();
        }
    }, [methods, onComplete]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">Score: {score}</h3>
                {feedback && <p className="text-purple-300 animate-pulse">{feedback}</p>}
            </div>
            <p className="text-center text-gray-300 mb-4">Match the methods to the correct class to build your OOP Fortress!</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GAME_DATA.classes.map(cls => (
                    <div key={cls.id} onClick={() => handlePlaceMethod(cls.id)} className="bg-black p-4 rounded-lg font-mono text-green-400 border-2 border-dashed border-gray-600 hover:border-purple-500 cursor-pointer min-h-[150px]">
                        <p>{cls.name}</p>
                        {placedMethods[cls.id].map((text, i) => (
                            <p key={i} className="ml-4 text-sm animate-pop-in text-yellow-300">  {text}</p>
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <h4 className="font-bold text-center mb-2">Available Methods:</h4>
                {methods.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {methods.map(method => (
                            <button
                                key={method.id}
                                onClick={() => handleSelectMethod(method.id)}
                                className={`p-2 rounded-md font-mono text-sm transition-colors ${selectedMethodId === method.id ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {method.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                         <p className="text-green-400 font-bold text-xl mb-4 animate-pop-in">You did it!</p>
                         <button onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-white underline">Reset Game</button>
                    </div>
                )}
            </div>
             <p className="text-xs text-slate-500 mt-6 text-center italic">Game Dev: Jeyabal Anthony</p>
        </div>
    );
};

export default OOPFortressGame;
