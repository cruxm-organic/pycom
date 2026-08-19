
import React from 'react';
import { AGENTS } from '../../constants.ts';
import type { Agent } from '../../types.ts';
import { UserCircleIcon, CheckCircleIcon } from '../Icons.tsx';

interface OrgNode {
    agent: Agent;
    subordinates: OrgNode[];
}

const OrgChart: React.FC<{ activeAgentId: string }> = ({ activeAgentId }) => {
    
    const buildTree = () => {
        // Explicitly type the accumulator for reduce to avoid TypeScript errors
        const agentMap = AGENTS.reduce<Record<string, OrgNode>>((acc, agent) => {
            acc[agent.id] = { agent, subordinates: [] };
            return acc;
        }, {});
        
        const root: OrgNode[] = [];
        
        AGENTS.forEach(agent => {
            if (agent.reportsTo && agentMap[agent.reportsTo]) {
                agentMap[agent.reportsTo].subordinates.push(agentMap[agent.id]);
            } else {
                // If no manager (CEO) or manager not found, add to root
                root.push(agentMap[agent.id]);
            }
        });
        return root;
    };

    const tree = buildTree();

    const renderNode = (node: OrgNode, level: number = 0) => {
        const isActive = node.agent.id === activeAgentId;
        const isManager = node.subordinates.length > 0;
        const isCEO = node.agent.role === 'CEO';

        return (
            <div key={node.agent.id} className="flex flex-col items-center relative">
                <div 
                    className={`
                        relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 min-w-[200px] transition-all hover:-translate-y-1 hover:shadow-lg
                        ${isActive ? 'bg-purple-900/30 border-purple-500 shadow-purple-900/20' : 'bg-slate-900 border-slate-700'}
                        ${isCEO ? 'border-yellow-500/50 bg-yellow-900/10' : ''}
                    `}
                >
                    {isActive && (
                        <div className="absolute -top-3 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            You
                        </div>
                    )}
                    <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-slate-600">
                        {node.agent.avatarUrl ? (
                            <img src={node.agent.avatarUrl} alt={node.agent.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-full h-full text-slate-400 p-1" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className={`font-bold text-sm ${isCEO ? 'text-yellow-400' : 'text-white'}`}>{node.agent.name}</p>
                        <p className="text-xs text-slate-400">{node.agent.role}</p>
                    </div>
                    <div className="w-full border-t border-slate-700/50 pt-2 mt-1 flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">{node.agent.loginId}</span>
                        <div className="flex items-center gap-1 text-green-500">
                            <CheckCircleIcon className="w-3 h-3" /> Active
                        </div>
                    </div>
                </div>

                {isManager && (
                    <div className="relative flex flex-col items-center w-full">
                        {/* Vertical line connecting manager to subordinates line */}
                        <div className="h-8 w-px bg-slate-600"></div>
                        
                        {/* Horizontal line connecting subordinates */}
                        <div className="relative flex justify-center gap-8 pt-4 border-t border-slate-600 w-full">
                            {/* Render Subordinates */}
                            {node.subordinates.map(sub => (
                                <div key={sub.agent.id} className="relative flex flex-col items-center">
                                    {/* Small vertical line going up to the horizontal bar */}
                                    <div className="absolute -top-4 w-px h-4 bg-slate-600"></div>
                                    {renderNode(sub, level + 1)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white">Organization Hierarchy</h2>
                <p className="text-slate-400 text-sm mt-1">Visual reporting lines and agent availability status.</p>
            </div>
            <div className="flex-grow overflow-auto p-10 flex justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
                <div className="min-w-max">
                    {tree.map(rootNode => renderNode(rootNode))}
                </div>
            </div>
        </div>
    );
};

export default OrgChart;
