import React, { useState } from 'react';
import type { Agent } from '../../types.ts';
import AgentLoginPage from '../sales-ai/AgentLoginPage.tsx';
import AgentWorkstation from '../agentic-ai/AgentWorkstation.tsx';

const AgenticAIPage: React.FC = () => {
    const [loggedInAgent, setLoggedInAgent] = useState<Agent | null>(null);

    const handleLogin = (agent: Agent) => {
        setLoggedInAgent(agent);
    };

    const handleLogout = () => {
        setLoggedInAgent(null);
    };

    return (
        <div className="animate-fade-in-up">
            {loggedInAgent ? (
                <AgentWorkstation 
                    agent={loggedInAgent} 
                    onLogout={handleLogout}
                />
            ) : (
                <AgentLoginPage onLogin={handleLogin} />
            )}
        </div>
    );
};

export default AgenticAIPage;
