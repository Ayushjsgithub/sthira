'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

export const PieTimer: React.FC<TimerStyleProps> = ({
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

  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();

  const size = 200;
  const center = size / 2;
  const outerR = 90;
  const clampedProgress = Math.max(0.0001, Math.min(0.9999, progress));

  // Render pie using thick stroke method to allow perfect CSS transitions
  // To get a filled circle of radius 90, we use a circle of radius 45 with strokeWidth 90.
  const pieRadius = outerR / 2;
  const pieCircumference = 2 * Math.PI * pieRadius;
  const pieDashoffset = pieCircumference - clampedProgress * pieCircumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none gap-3 sm:gap-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] pointer-events-none flex-shrink-0"
      >
        {/* Outer track ring */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="var(--color-foreground)"
          strokeWidth="1"
          className="opacity-20"
        />

        {/* Background track fill */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="var(--color-foreground)"
          className="opacity-5"
        />

        {/* Active Pie Sector (Thick Stroke Method) */}
        <circle
          cx={center}
          cy={center}
          r={pieRadius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={outerR}
          strokeDasharray={pieCircumference}
          strokeDashoffset={pieDashoffset}
          className="opacity-90 transition-all duration-1000 ease-linear origin-center -rotate-90"
        />
      </svg>

      {/* Timer Display Below */}
      <div className="z-10 flex flex-col items-center justify-center text-center">
        {isEditing ? (
          <div className="flex flex-col items-center">
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
              className="bg-foreground/5 border-2 border-accent rounded-xl px-4 py-1.5 text-center font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-foreground outline-none w-[150px] focus:ring-2 focus:ring-accent/20"
              autoFocus
            />
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-foreground/45 select-none">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">↵</kbd>
                <span>save</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">esc</kbd>
                <span>cancel</span>
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            onClick={onStartEditing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer group/digits relative inline-flex flex-col items-center w-fit mx-auto ${
              isWarning ? 'animate-pulse text-accent drop-shadow-[0_0_20px_var(--color-accent)]' : ''
            }`}
            aria-label="Edit timer"
          >
            <div className={`flex items-center text-4xl sm:text-5xl leading-none text-foreground ${wrapperClass}`}>
              <span className={`tabular-nums ${digitsClass}`} style={customStyle}>{minStr}</span>
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
              <span className={`tabular-nums opacity-95 ${digitsClass}`} style={customStyle}>{secStr}</span>
            </div>
            {/* Subtitle / Hover Prompt Slot */}
            <div className="relative mt-1.5 h-4 flex items-center justify-center">
              <span className="text-[10px] font-mono text-foreground/45 uppercase tracking-widest group-hover/digits:opacity-0 transition-opacity whitespace-nowrap">
                {Math.round(clampedProgress * 100)}% REMAINING
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none opacity-0 group-hover/digits:opacity-100 transition-opacity">
                <span>click or</span>
                <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
                <span>to edit</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
