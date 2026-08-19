import React, { useState, useEffect } from 'react';
import { TIMEZONES } from '../../constants.ts';
import { ClockIcon } from '../Icons.tsx';

const TimezoneClocks: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const getTimeForZone = (timezone: string) => {
        return time.toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                {TIMEZONES.map(tz => (
                    <div key={tz.label} className="flex flex-col items-center">
                        <p className="text-sm font-bold text-purple-300">{tz.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <ClockIcon className="w-4 h-4 text-slate-400" />
                            <p className="text-lg font-mono font-semibold text-white">
                                {getTimeForZone(tz.timezone)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimezoneClocks;