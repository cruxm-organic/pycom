import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MinusIcon, Square2StackIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, ViewColumnsIcon, XMarkIcon } from '../Icons.tsx';

export type WindowMode = 'normal' | 'minimized' | 'maximized' | 'fullscreen';

interface WindowFrameProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    mode: WindowMode;
    onModeChange: (mode: WindowMode) => void;
    onClose?: () => void;
    splitActive?: boolean;
    onToggleSplit?: () => void;
    canSplit?: boolean;
}

/**
 * Real window chrome for a workspace panel: minimize, maximize (fill parent container),
 * fullscreen (native browser Fullscreen API, takes over the whole viewport), and an optional
 * split-screen toggle so two panels can sit side by side.
 *
 * "Maximize" and "fullscreen" are deliberately different: maximize fills the workspace area
 * within the app's own chrome (nav bar still visible), fullscreen leaves the browser chrome
 * entirely, matching how real desktop and enterprise web apps distinguish the two.
 */
const WindowFrame: React.FC<WindowFrameProps> = ({
    title, icon, children, mode, onModeChange, onClose, splitActive, onToggleSplit, canSplit,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

    useEffect(() => {
        const handleFsChange = () => {
            const active = document.fullscreenElement === containerRef.current;
            setIsNativeFullscreen(active);
            if (!active && mode === 'fullscreen') {
                onModeChange('normal');
            }
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => document.removeEventListener('fullscreenchange', handleFsChange);
    }, [mode, onModeChange]);

    const enterFullscreen = useCallback(async () => {
        try {
            await containerRef.current?.requestFullscreen();
            onModeChange('fullscreen');
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    }, [onModeChange]);

    const exitFullscreen = useCallback(async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen().catch(() => {});
        }
        onModeChange('normal');
    }, [onModeChange]);

    const handleFullscreenToggle = () => {
        if (mode === 'fullscreen' || isNativeFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    };

    if (mode === 'minimized') {
        return (
            <button
                onClick={() => onModeChange('normal')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                title={`Restore ${title}`}
            >
                {icon}
                <span className="font-medium">{title}</span>
                <Square2StackIcon className="w-3.5 h-3.5 opacity-60" />
            </button>
        );
    }

    const containerClasses = [
        'flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-200',
        mode === 'fullscreen' ? 'fixed inset-0 z-[100] rounded-none' : '',
        mode === 'maximized' ? 'absolute inset-0 z-30' : '',
        mode === 'normal' ? 'relative h-full' : '',
    ].filter(Boolean).join(' ');

    return (
        <div ref={containerRef} className={containerClasses}>
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0 select-none">
                <div className="flex items-center gap-2 min-w-0">
                    {icon}
                    <span className="text-sm font-bold text-white truncate">{title}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {canSplit && (
                        <button
                            onClick={onToggleSplit}
                            className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${splitActive ? 'text-purple-400 bg-slate-800' : 'text-slate-400 hover:text-white'}`}
                            title={splitActive ? 'Exit split view' : 'Split view'}
                        >
                            <ViewColumnsIcon className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onModeChange('minimized')}
                        className="p-1.5 rounded text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        title="Minimize"
                    >
                        <MinusIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onModeChange(mode === 'maximized' ? 'normal' : 'maximized')}
                        className="p-1.5 rounded text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        title={mode === 'maximized' ? 'Restore' : 'Maximize'}
                    >
                        {mode === 'maximized' ? <ArrowsPointingInIcon className="w-4 h-4" /> : <Square2StackIcon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleFullscreenToggle}
                        className="p-1.5 rounded text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        title={mode === 'fullscreen' ? 'Exit full screen' : 'Full screen'}
                    >
                        {mode === 'fullscreen' ? <ArrowsPointingInIcon className="w-4 h-4" /> : <ArrowsPointingOutIcon className="w-4 h-4" />}
                    </button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded text-slate-400 hover:bg-red-600 hover:text-white transition-colors"
                            title="Close"
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-grow min-h-0 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default WindowFrame;
