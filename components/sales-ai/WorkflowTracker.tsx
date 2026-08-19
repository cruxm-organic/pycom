import React from 'react';
import type { LeadStatus } from '../../types.ts';
import { WORKFLOW_STAGES } from '../../constants.ts';

interface WorkflowTrackerProps {
  status: LeadStatus;
}

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ status }) => {
  const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.name === status);

  return (
    <div className="flex items-center justify-between overflow-x-auto p-2">
      {WORKFLOW_STAGES.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isActive = index === currentStageIndex;
        const Icon = stage.icon;
        
        return (
          <React.Fragment key={stage.name}>
            <div className="flex flex-col items-center text-center w-24 flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isActive ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-900/50' :
                isCompleted ? 'bg-green-600 border-green-400' :
                'bg-gray-700 border-gray-600'
              }`}>
                <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <p className={`mt-2 text-xs font-bold transition-colors ${
                isActive ? 'text-purple-300' :
                isCompleted ? 'text-green-300' :
                'text-gray-400'
              }`}>{stage.name}</p>
            </div>
            {index < WORKFLOW_STAGES.length - 1 && (
              <div className={`flex-grow h-1 rounded-full mx-2 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-700'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WorkflowTracker;
