'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

export const DotMatrixTimer: React.FC<TimerStyleProps> = ({
  minutes,
  seconds,
  progress,
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

  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();

  // 60 LED dots total (e.g. 5 rows of 12 dots)
  const totalDots = 60;
  const activeDotCount = Math.round(clampedProgress * totalDots);

  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-transparent max-w-[360px] w-full select-none">
      {/* Center Time Display */}
      {isEditing ? (
        <div className="flex flex-col items-center mb-2 sm:mb-3">
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
            className="bg-foreground/5 border-2 border-accent rounded-xl px-3 py-1 text-center font-mono text-5xl font-bold tracking-widest text-foreground outline-none w-[200px]"
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
          className={`cursor-pointer group/digits relative inline-flex flex-col items-center justify-center text-foreground mb-2 sm:mb-3 w-fit mx-auto ${
            isWarning ? 'animate-pulse text-accent drop-shadow-[0_0_25px_var(--color-accent)]' : ''
          }`}
          aria-label="Edit timer"
        >
          <div className={`flex items-center text-5xl sm:text-6xl tracking-wider leading-none ${wrapperClass}`}>
            <span className={`tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] ${digitsClass}`} style={customStyle}>{minStr}</span>
            <motion.span
              animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
              transition={
                isRunning
                  ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
              className={`text-accent mx-0.5 relative -translate-y-[0.12em] select-none inline-flex items-center leading-none ${digitsClass}`}
              style={customStyle}
            >
              :
            </motion.span>
            <span className={`tabular-nums drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] opacity-95 ${digitsClass}`} style={customStyle}>{secStr}</span>
          </div>

          {/* Hover edit keycap badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/digits:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none">
            <span>click or</span>
            <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
            <span>to edit</span>
          </div>
        </motion.div>
      )}

      {/* 60 LED Matrix Grid (12 columns x 5 rows) */}
      <div className="grid grid-cols-12 gap-1 sm:gap-1.5 p-2 bg-foreground/[0.04] rounded-xl w-full">
        {Array.from({ length: totalDots }).map((_, i) => {
          const isActive = i < activeDotCount;
          return (
            <div
              key={i}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-500 ${
                isActive
                  ? 'bg-accent shadow-[0_0_8px_var(--color-accent)] scale-105'
                  : 'bg-foreground/10 border border-foreground/5'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

