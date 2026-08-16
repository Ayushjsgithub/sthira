'use client';

import React from 'react';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';
import { motion } from 'framer-motion';

export const ConcentricTimer: React.FC<TimerStyleProps> = ({
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

  const spikes = Array.from({ length: 60 });

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none overflow-hidden py-8">
      <style>{`
        @keyframes tick-tock-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
      
      {/* Clock Container */}
      <div 
        className={`relative flex items-center justify-center w-[360px] h-[360px] scale-75 sm:scale-90 md:scale-100 flex-shrink-0 ${wrapperClass}`}
        style={{
          '--dRotate-sec': `${6 * seconds}deg`,
        } as React.CSSProperties}
      >
        
        {/* Rings Wrapper with Bracket Hole Mask to prevent overflowing text */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            WebkitMaskImage: 'radial-gradient(ellipse 160px 60px at 100% 50%, transparent 60%, black 100%)',
            maskImage: 'radial-gradient(ellipse 160px 60px at 100% 50%, transparent 60%, black 100%)' 
          }}
        >
          {/* Outer Milliseconds Ring */}
          <div 
            className="absolute inset-0 m-auto text-[18px] font-bold"
            style={{ 
              animation: 'tick-tock-spin-reverse 6s linear infinite',
              animationPlayState: isRunning ? 'running' : 'paused'
            }}
          >
            {spikes.map((_, i) => (
              <div
                key={`sec-${i}`}
                className="absolute inset-0 m-auto w-[8px] h-[1px] bg-foreground/50 leading-[20px] origin-center z-10"
                style={{
                  transform: `rotate(${6 * i}deg) translateX(172px)`, // (360/2) - 8
                  boxShadow: i % 5 === 0 ? '-7px 0 var(--color-foreground)' : 'none',
                }}
              >
                {i % 5 === 0 && (
                  <div 
                    className={`absolute right-[22px] top-[-10px] opacity-10 ${wrapperClass} ${digitsClass}`}
                    style={{ transform: `rotate(${6 * i}deg)`, ...customStyle }}
                  >
                    {i}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Inner Seconds Ring */}
          <div 
            className="absolute inset-0 m-auto text-[16px] transition-transform duration-1000 ease-linear"
            style={{ transform: `rotate(-${6 * seconds}deg)` }}
          >
            {spikes.map((_, i) => (
              <div
                key={`min-${i}`}
                className="absolute inset-0 m-auto w-[8px] h-[1px] bg-foreground/20 leading-[20px] origin-center z-10"
                style={{
                  transform: `rotate(${6 * i}deg) translateX(115px)`, // (360/2) - 65
                  boxShadow: i % 5 === 0 ? '-7px 0 rgba(255,255,255,0.3)' : 'none',
                }}
              >
                {i % 5 === 0 && (
                  <div 
                    className={`absolute right-[22px] top-[-10px] transition-transform duration-1000 ease-linear opacity-50 ${wrapperClass} ${digitsClass}`}
                    style={{ transform: `rotate(calc(var(--dRotate-sec) - ${6 * i}deg))`, ...customStyle }}
                  >
                    {i}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center Main Minutes Display */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {isEditing ? (
            <div className="flex flex-col items-center bg-background/80 backdrop-blur-sm p-4 rounded-3xl">
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
            </div>
          ) : (
            <div 
              className={`relative cursor-pointer group/digits`}
              onClick={onStartEditing}
            >
              <div 
                className={`text-[70px] font-black tabular-nums drop-shadow-lg ${wrapperClass} ${digitsClass} ${isWarning ? 'text-accent animate-pulse' : 'text-foreground'}`}
                style={customStyle}
              >
                {minStr}
              </div>
              {/* Edit Hover Prompt */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/digits:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none bg-background/90 px-2 py-1 rounded-full">
                <span>click or</span>
                <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
                <span>to edit</span>
              </div>
            </div>
          )}
        </div>

        {/* Right side Seconds Lens (U-Shape Bracket) */}
        {!isEditing && (
          <div className="absolute right-[0px] top-1/2 -translate-y-1/2 z-30 flex items-center pointer-events-none">
            {/* The U-shape bracket touching the right edge exactly without overflowing */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[60px] w-[125px] border border-white/20 border-r-0 rounded-l-[40px] shadow-[inset_4px_0_20px_rgba(255,255,255,0.15)] bg-white/5 backdrop-blur-lg"
            />
            {/* The static seconds text sitting perfectly in the rounded part */}
            <div 
              className={`absolute right-[75px] top-1/2 -translate-y-1/2 text-[28px] font-black tabular-nums text-accent drop-shadow-lg ${wrapperClass} ${digitsClass}`}
              style={{ ...customStyle }}
            >
              {secStr}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};
