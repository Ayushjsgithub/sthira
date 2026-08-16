'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

export const GaugeTimer: React.FC<TimerStyleProps> = ({
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

  const size = 300;
  const center = size / 2;
  const radius = 115;
  const circumference = 2 * Math.PI * radius;
  // Progress clamped between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference - clampedProgress * circumference;

  // Angle for leading tip dot (starts at top, which is -90 deg)
  const angleDeg = -90 + clampedProgress * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const dotX = Math.round((center + radius * Math.cos(angleRad)) * 100) / 100;
  const dotY = Math.round((center + radius * Math.sin(angleRad)) * 100) / 100;

  return (
    <div className="relative flex items-center justify-center w-[220px] h-[220px] xs:w-[260px] xs:h-[260px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] max-w-full max-h-full aspect-square select-none">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-md"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-foreground)"
          strokeWidth="10"
          className="opacity-10"
        />

        {/* 60 Micro Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const tickAngle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const innerR = isMajor ? radius - 16 : radius - 10;
          const outerR = radius - 6;
          const x1 = Math.round((center + innerR * Math.cos(tickAngle)) * 100) / 100;
          const y1 = Math.round((center + innerR * Math.sin(tickAngle)) * 100) / 100;
          const x2 = Math.round((center + outerR * Math.cos(tickAngle)) * 100) / 100;
          const y2 = Math.round((center + outerR * Math.sin(tickAngle)) * 100) / 100;
          const tickPassed = (60 - i) / 60 <= clampedProgress;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-foreground)"
              strokeWidth={isMajor ? 1.5 : 1}
              className={`transition-opacity duration-500 ${
                tickPassed ? 'opacity-35' : 'opacity-10'
              }`}
            />
          );
        })}

        {/* Active progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_var(--color-accent)]"
        />

        {/* Glowing tip indicator */}
        {clampedProgress > 0.01 && clampedProgress < 0.99 && (
          <circle
            cx={dotX}
            cy={dotY}
            r="5"
            fill="var(--color-accent)"
            className={`filter drop-shadow-[0_0_6px_var(--color-accent)] ${
              isRunning ? 'animate-pulse' : ''
            }`}
          />
        )}
      </svg>

      {/* Center content */}
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
              className="bg-foreground/5 border-2 border-accent rounded-xl px-2 py-1 text-center font-mono text-3xl sm:text-4xl font-semibold tracking-tight text-foreground outline-none w-[150px]"
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
