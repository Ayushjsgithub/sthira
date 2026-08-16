'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { useTimerTypography } from '@/hooks/useTimerTypography';

export interface TimerStyleProps {
  displayTime: string;
  minutes: number;
  seconds: number;
  progress: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  isWarning: boolean;
  isEditing: boolean;
  editValue: string;
  setEditValue: (val: string) => void;
  handleEditSubmit: () => void;
  handleEditCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onStartEditing: () => void;
}

export const DefaultTimer: React.FC<TimerStyleProps> = ({
  minutes,
  seconds,
  isRunning,
  isWarning,
  isEditing,
  editValue,
  setEditValue,
  handleEditSubmit,
  handleEditCancel,
  inputRef,
  onStartEditing,
}) => {
  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();

  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');

  if (isEditing) {
    return (
      <div className="flex flex-col items-center justify-center w-full px-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleEditSubmit();
            if (e.key === 'Escape') handleEditCancel();
          }}
          placeholder="25:00"
          className="bg-foreground/5 border-2 border-accent/80 rounded-2xl px-4 py-2 text-center font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-foreground outline-none shadow-[0_0_30px_rgba(var(--color-accent),0.2)] focus:ring-4 focus:ring-accent/20 transition-all w-full max-w-[280px] sm:max-w-[360px] md:max-w-[420px]"
          autoFocus
        />
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono text-foreground/45 select-none">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">↵</kbd>
            <span>save</span>
          </span>
          <span className="opacity-30">•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">esc</kbd>
            <span>cancel</span>
          </span>
          <span className="opacity-30">•</span>
          <span>scroll to adjust</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <motion.div
        onClick={onStartEditing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group/digits cursor-pointer select-none relative inline-flex items-center justify-center text-foreground transition-all duration-300 w-fit mx-auto ${
          isWarning ? 'animate-pulse text-accent drop-shadow-[0_0_25px_var(--color-accent)]' : ''
        }`}
        aria-label="Edit timer"
      >
        <div className={`flex items-center text-[100px] sm:text-[140px] md:text-[160px] leading-none text-foreground ${wrapperClass}`}>
          <span className={`tabular-nums ${digitsClass}`} style={customStyle as React.CSSProperties}>{minStr}</span>
          
          <motion.span
            animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
            transition={
              isRunning
                ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
            className={`text-accent mx-2 relative -translate-y-[0.12em] select-none inline-flex items-center leading-none ${digitsClass}`}
            style={customStyle as React.CSSProperties}
          >
            :
          </motion.span>
          
          <span className={`tabular-nums opacity-95 ${digitsClass}`} style={customStyle as React.CSSProperties}>{secStr}</span>
        </div>

        {/* Hover edit keycap badge */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/digits:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none">
          <span>click or</span>
          <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
          <span>to edit</span>
        </div>
      </motion.div>
    </div>
  );
};
