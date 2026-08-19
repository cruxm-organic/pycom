import React from 'react';
import type { ActivityLog } from '../../types.ts';
import { ListBulletIcon } from '../Icons.tsx';

interface ActivityLogPanelProps {
    activityLog: ActivityLog[];
}

const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ activityLog }) => {
    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ListBulletIcon className="w-6 h-6" />
                Activity Log
            </h2>
            <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
                {activityLog.length > 0 ? (
                    activityLog.map(log => (
                        <div key={log.id} className="text-sm">
                            <p className="text-slate-300">{log.description}</p>
                            <p className="text-xs text-slate-500">
                                {log.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 text-sm italic">No activity recorded yet.</p>
                )}
            </div>
        </div>
    );
};

export default ActivityLogPanel;