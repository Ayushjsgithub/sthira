'use client';

import React from 'react';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { useTimerStore } from '@/store/useTimerStore';

export const ControlsWidget = () => {
  const {
    isRunning,
    setIsRunning,
    resetTimer,
    mode,
    setMode,
  } = useTimerStore();

  const handleSkipSession = () => {
    if (mode === 'work') {
      setMode('shortBreak');
    } else {
      setMode('work');
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 select-none py-1">
      {/* Reset Button */}
      <button
        onClick={resetTimer}
        className="p-3 rounded-full hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Reset (R)"
      >
        <RotateCcw size={17} />
      </button>

      {/* Primary Play / Pause Button */}
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="px-7 py-2.5 rounded-full flex items-center justify-center gap-2 bg-white text-black font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
        aria-label={isRunning ? 'Pause (Space)' : 'Start (Space)'}
      >
        {isRunning ? (
          <>
            <Pause size={17} fill="currentColor" />
            <span className="text-xs uppercase tracking-wider font-bold text-black">Pause</span>
          </>
        ) : (
          <>
            <Play size={17} fill="currentColor" className="ml-0.5" />
            <span className="text-xs uppercase tracking-wider font-bold text-black">Start</span>
          </>
        )}
      </button>

      {/* Skip Session Button */}
      <button
        onClick={handleSkipSession}
        className="p-3 rounded-full hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Skip Session (S)"
      >
        <FastForward size={17} />
      </button>
    </div>
  );
};
