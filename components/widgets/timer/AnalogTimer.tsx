'use client';

import React from 'react';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';
import { motion } from 'framer-motion';

export const AnalogTimer: React.FC<TimerStyleProps> = ({
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
  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();

  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none py-4 sm:py-8">
      
      <div 
        className={`relative flex items-center justify-center w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full shadow-2xl ${wrapperClass}`}
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        {/* Decorative Leaves (Green by default, adjusted to fit OLED dark mode) */}
        <div 
          className="absolute left-0 right-0 top-[-10%] m-auto w-[3%] h-[12%] bg-[#70bd63] rotate-[10deg] -z-10 rounded-sm"
        />
        <div 
          className="absolute left-0 right-[15%] top-[-10%] m-auto w-[8%] h-[16%] bg-[#70bd63] -rotate-[40deg] -z-10 rounded-[100%_30%_50%_0]"
        />

        {/* Orange Texture Dimples (Simulated with absolute dots) */}
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden opacity-20 pointer-events-none mix-blend-multiply">
          <div className="absolute w-[5%] h-[5%] rounded-full bg-black left-[20%] top-[30%]" />
          <div className="absolute w-[3%] h-[3%] rounded-full bg-black left-[40%] top-[15%]" />
          <div className="absolute w-[4%] h-[4%] rounded-full bg-black left-[70%] top-[25%]" />
          <div className="absolute w-[6%] h-[6%] rounded-full bg-black left-[80%] top-[60%]" />
          <div className="absolute w-[4%] h-[4%] rounded-full bg-black left-[50%] top-[80%]" />
          <div className="absolute w-[5%] h-[5%] rounded-full bg-black left-[25%] top-[70%]" />
          <div className="absolute w-[3%] h-[3%] rounded-full bg-black left-[10%] top-[50%]" />
        </div>

        {/* Clock Hands */}
        {!isEditing && (
          <div className="absolute inset-0 w-full h-full cursor-pointer group/analog" onClick={onStartEditing}>
            {/* Minute Hand (mapped to overall progress) */}
            <div 
              className="absolute left-[49%] bottom-[50%] w-[2%] h-[44%] bg-black/50 origin-[50%_100%] rounded-full transition-transform duration-1000 ease-linear"
              style={{ transform: `rotate(${clampedProgress * 360}deg)` }}
            />
            {/* Second Hand (mapped continuously to avoid snapback) */}
            <div 
              className="absolute left-[49.5%] bottom-[50%] w-[1%] h-[38%] bg-white origin-[50%_100%] rounded-full transition-transform duration-1000 ease-linear shadow-[0_0_4px_rgba(0,0,0,0.5),0_0_8px_rgba(255,255,255,0.5)] border-[0.5px] border-black/10"
              style={{ transform: `rotate(${(minutes * 60 + seconds) * 6}deg)` }}
            />
            {/* Center Pivot */}
            <div className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[5%] h-[5%] bg-black/60 rounded-full z-10" />
            <div className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[2%] h-[2%] bg-white rounded-full z-20 shadow-sm" />

            {/* Hover overlay to edit */}
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/analog:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
              <span className="text-white font-mono text-sm tracking-widest opacity-80 mb-1">{minStr}:{secStr}</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-normal text-white/70 whitespace-nowrap">
                <span>click to edit</span>
              </div>
            </div>
          </div>
        )}

        {/* Editing Mode Override */}
        {isEditing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-full z-30">
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
              className="bg-transparent border-b-2 border-white/50 px-2 py-1 text-center font-mono text-3xl font-bold text-white outline-none w-[120px] focus:border-white transition-colors"
              autoFocus
            />
            <div className="mt-3 flex flex-col items-center gap-1 text-[9px] font-mono text-white/50">
              <span>press <kbd className="bg-white/20 px-1 rounded">enter</kbd> to save</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
