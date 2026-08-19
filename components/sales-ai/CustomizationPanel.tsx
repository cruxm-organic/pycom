import React from 'react';

interface CustomizationPanelProps {
    personality: string;
    setPersonality: (personality: string) => void;
}

const PERSONALITIES = ['Professional', 'Enthusiastic', 'Concise'];

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ personality, setPersonality }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
            <h3 className="text-lg font-bold text-center text-white mb-3">AI Agent Personality</h3>
            <div className="flex justify-center gap-2">
                {PERSONALITIES.map(p => (
                    <button
                        key={p}
                        onClick={() => setPersonality(p)}
                        className={`px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
                            personality === p
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CustomizationPanel;