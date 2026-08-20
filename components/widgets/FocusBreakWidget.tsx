'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTimerStore } from '@/store/useTimerStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { Zap, Coffee, Sparkles } from 'lucide-react';

const MODE_CONFIG = {
  work: { label: 'Focus', icon: Zap },
  shortBreak: { label: 'Short Break', icon: Coffee },
  longBreak: { label: 'Long Break', icon: Sparkles },
} as const;

export const FocusBreakWidget = () => {
  const { mode, setMode, isRunning } = useTimerStore();
  const { timerDurations } = usePreferencesStore();

  return (
    <div className="flex flex-col items-center justify-center gap-2 select-none w-full max-w-lg mx-auto px-4">
      {/* Mode Selector Pill Bar with Liquid Glass Blur Effect */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full liquid-glass shadow-sm">
        {(['work', 'shortBreak', 'longBreak'] as const).map((m) => {
          const isActive = mode === m;
          const config = MODE_CONFIG[m];
          const Icon = config.icon;
          const duration = timerDurations[m] || 25;

          return (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative px-4 py-2 text-xs font-semibold tracking-wider rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                isActive ? 'text-black font-bold' : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFocusBreakPill"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={13} className={isActive ? 'text-black' : 'text-foreground/70'} />
                <span>{config.label}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-black/75' : 'opacity-60'}`}>
                  {duration}m
                </span>
              </span>
            </button>
          );
        })}

        {/* Status Indicator Green Dot */}
        <div 
          className="px-2 py-1 flex items-center justify-center"
          aria-label={isRunning ? 'Session Active' : 'Session Paused'}
        >
          <span 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isRunning 
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse' 
                : 'bg-emerald-500/40'
            }`} 
          />
        </div>
      </div>
    </div>
  );
};
