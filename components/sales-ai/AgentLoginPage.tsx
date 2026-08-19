
import React from 'react';
import type { Agent } from '../../types.ts';
import { AGENTS } from '../../constants.ts';
import { UserCircleIcon, RobotIcon } from '../Icons.tsx';

interface AgentLoginPageProps {
  onLogin: (agent: Agent) => void;
}

const AgentLoginPage: React.FC<AgentLoginPageProps> = ({ onLogin }) => {
  return (
    <div>
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-purple-600/10 rounded-full mb-4">
            <RobotIcon className="w-12 h-12 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Agentic AI Workspace</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          Select your agent profile to access your role-specific autonomous workflows.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {AGENTS.map(agent => (
          <div key={agent.id} className="interactive-card bg-gray-800/70 p-6 rounded-xl border border-purple-500/30 flex flex-col h-full items-start text-left hover:bg-gray-800">
            <div className="flex items-center gap-4 mb-4 w-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-purple-500">
                    {/* Placeholder for avatar if image fails, or use the icon */}
                    <UserCircleIcon className="w-full h-full text-slate-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                    <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/20 font-semibold uppercase tracking-wide">
                        {agent.role}
                    </span>
                </div>
            </div>
            
            <div className="mb-6 w-full">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Core Capabilities</p>
                <div className="flex flex-wrap gap-2">
                    {agent.specialties.map(spec => (
                        <span key={spec} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            {spec}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-auto w-full">
                <p className="text-xs text-slate-500 mb-1">Agent ID: <span className="font-mono text-yellow-500">{agent.loginId}</span></p>
                <button
                onClick={() => onLogin(agent)}
                className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                <span>Launch Workstation</span>
                <span className="text-lg">&rarr;</span>
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentLoginPage;
