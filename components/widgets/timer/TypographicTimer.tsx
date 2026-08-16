'use client';

import React from 'react';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';
import { motion } from 'framer-motion';

export const TypographicTimer: React.FC<TimerStyleProps> = ({
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

  // We need 60 indicators for the Tick Tock circle
  const indicators = Array.from({ length: 60 });

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full select-none py-8">
      
      {/* Clock Container */}
      <div 
        className={`relative flex items-center justify-center w-[400px] h-[400px] scale-75 sm:scale-90 lg:scale-100 flex-shrink-0 ${wrapperClass}`}
      >
        
        {/* TICK TOCK Indicators */}
        {indicators.map((_, i) => {
          const isActive = i === seconds;
          const isEven = i % 2 === 0;
          const rotateDeg = i * (360 / 60);

          return (
            <div
              key={i}
              className="absolute left-0 right-0 mx-auto w-0 origin-bottom"
              style={{
                height: isEven ? '200px' : '180px',
                top: isEven ? '0' : '20px',
                transform: `rotate(${rotateDeg}deg)`,
              }}
            >
              <div
                className={`absolute left-1/2 -translate-x-1/2 -top-[5%] text-[1rem] sm:text-[1.1rem] font-black tracking-widest transition-colors duration-300 ${digitsClass}`}
                style={{
                  ...customStyle,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-foreground)',
                  opacity: isActive ? 1 : 0.15,
                  textShadow: isActive ? '0px 0px 10px var(--color-accent)' : 'none'
                }}
              >
                {isEven ? 'TICK' : 'TOCK'}
              </div>
            </div>
          );
        })}

        {/* Center Time Box */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {isEditing ? (
            <div className="flex flex-col items-center bg-background/80 backdrop-blur-md p-4 rounded-3xl border border-foreground/10">
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
              </div>
            </div>
          ) : (
            <motion.div 
              className={`relative cursor-pointer group/digits flex items-center justify-center ${wrapperClass}`}
              onClick={onStartEditing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRunning ? { scale: [1, 1.02, 1], opacity: [1, 0.9, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div 
                className={`text-[72px] sm:text-[84px] font-black tabular-nums whitespace-nowrap tracking-wider drop-shadow-md relative z-10 ${digitsClass} ${isWarning ? 'text-accent animate-pulse' : 'text-foreground'}`}
                style={customStyle}
              >
                {minStr}
                <motion.span
                  animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
                  transition={isRunning ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                  className="text-accent mx-1 relative -translate-y-[0.08em] inline-flex items-center leading-none"
                >
                  :
                </motion.span>
                <span className="opacity-95">{secStr}</span>
              </div>

              {/* Edit Hover Prompt */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/digits:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-normal text-foreground/45 whitespace-nowrap pointer-events-none select-none bg-background/90 px-3 py-1.5 rounded-full border border-foreground/10">
                <span>click or</span>
                <kbd className="px-1 py-[1px] rounded bg-foreground/10 border border-foreground/10 text-[9px] text-foreground/75 font-mono">e</kbd>
                <span>to edit</span>
              </div>
            </motion.div>
          )}
        </div>
        
      </div>
    </div>
  );
};
