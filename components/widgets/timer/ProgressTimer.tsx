'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

export const ProgressTimer: React.FC<TimerStyleProps> = ({
  minutes,
  seconds,
  progress,
  totalDurationSeconds,
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
  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clampedProgress * 100);
  const totalMins = Math.round(totalDurationSeconds / 60);

  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[440px] px-4 select-none">
      {/* Time Display */}
      {isEditing ? (
        <div className="flex flex-col items-center mb-4 w-full">
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
            className="bg-foreground/5 border-2 border-accent rounded-2xl px-4 py-2 text-center font-mono text-5xl sm:text-6xl font-semibold tracking-tight text-foreground outline-none w-full max-w-[260px]"
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
      ) : (
        <motion.div
          onClick={onStartEditing}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`cursor-pointer group/digits relative z-20 inline-flex flex-col items-center justify-center text-foreground mb-5 sm:mb-6 w-fit mx-auto ${
            isWarning ? 'animate-pulse text-accent drop-shadow-[0_0_20px_var(--color-accent)]' : ''
          }`}
          aria-label="Edit timer"
        >
          <div className={`flex items-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none ${wrapperClass}`}>
            <span className={`tabular-nums ${digitsClass}`} style={customStyle}>{minStr}</span>
            <motion.span
              animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
              transition={
                isRunning
                  ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
              className={`text-accent mx-0.5 sm:mx-1 relative -translate-y-[0.12em] select-none inline-flex items-center leading-none ${digitsClass}`}
              style={customStyle}
            >
              :
            </motion.span>
            <span className={`tabular-nums opacity-95 ${digitsClass}`} style={customStyle}>{secStr}</span>
          </div>

          {/* Hover edit keycap badge */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover/digits:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none z-30">
            <span>click or</span>
            <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
            <span>to edit</span>
          </div>
        </motion.div>
      )}

      {/* Horizon Progress Bar */}
      <div className="w-full relative flex flex-col gap-2">
        <div className="relative w-full h-1.5 sm:h-2 bg-foreground/10 rounded-full">
          <motion.div
            className="absolute top-0 left-0 h-full bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"
            style={{ width: `${clampedProgress * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {/* Glowing tip */}
            {clampedProgress > 0.01 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full shadow-[0_0_8px_#ffffff] translate-x-1/2" />
            )}
          </motion.div>
        </div>

        {/* Micro stats under bar */}
        <div className="flex items-center justify-between text-[10px] font-mono opacity-40 uppercase tracking-widest mt-1">
          <span>00:00</span>
          <span className="text-accent font-semibold opacity-90">{percent}% REMAINING</span>
          <span>{totalMins.toString().padStart(2, '0')}:00</span>
        </div>
      </div>
    </div>
  );
};
