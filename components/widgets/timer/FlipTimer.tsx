'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerStyleProps } from './DefaultTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

interface FlipCardHalfProps {
  digit: string | number;
  position: 'upper' | 'lower';
  digitsClass: string;
  wrapperClass: string;
  customStyle: any;
}

const FlipCardHalf: React.FC<FlipCardHalfProps> = ({ digit, position, digitsClass, wrapperClass, customStyle }) => {
  return (
    <div
      className={`relative w-full h-1/2 overflow-hidden flex justify-center border border-foreground/15 backdrop-blur-xl ${
        position === 'upper'
          ? 'items-end rounded-t-xl sm:rounded-t-2xl bg-foreground/[0.08] border-b-black/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
          : 'items-start rounded-b-xl sm:rounded-b-2xl bg-foreground/[0.04] border-t-black/40 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.25)]'
      }`}
    >
      <span
        className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground tabular-nums select-none drop-shadow-sm ${digitsClass} ${wrapperClass} ${
          position === 'upper' ? 'translate-y-1/2' : '-translate-y-1/2'
        }`}
        style={customStyle}
      >
        {digit}
      </span>
    </div>
  );
};

const SingleFlapDigit = ({ value }: { value: number }) => {
  const { wrapperClass, digitsClass, customStyle } = useTimerTypography();
  
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== current) {
      setPrevious(current);
      setCurrent(value);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [value, current]);

  return (
    <div className="relative w-[46px] h-[64px] xs:w-[54px] xs:h-[74px] sm:w-[66px] sm:h-[90px] md:w-[78px] md:h-[104px] lg:w-[88px] lg:h-[118px] flex flex-col perspective-[600px] shadow-2xl rounded-xl sm:rounded-2xl select-none flex-shrink-0">
      {/* Background static cards */}
      <FlipCardHalf digit={current} position="upper" digitsClass={digitsClass} wrapperClass={wrapperClass} customStyle={customStyle} />
      <FlipCardHalf digit={isFlipping ? previous : current} position="lower" digitsClass={digitsClass} wrapperClass={wrapperClass} customStyle={customStyle} />

      {/* Animated falling upper card (folds down from 0 to -90 deg) */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={`fold-${previous}-${current}`}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeIn' }}
            style={{
              transformOrigin: 'bottom',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
            className="absolute top-0 left-0 w-full h-1/2 overflow-hidden flex justify-center items-end rounded-t-xl sm:rounded-t-2xl border border-foreground/20 bg-foreground/[0.12] backdrop-blur-xl border-b-black/40 z-20 shadow-md"
          >
            <span 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground tabular-nums translate-y-1/2 select-none drop-shadow-sm ${digitsClass} ${wrapperClass}`}
              style={customStyle}
            >
              {previous}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated unfolding lower card (unfolds down from +90 to 0 deg) */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={`unfold-${current}-${previous}`}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.25, ease: 'easeOut' }}
            style={{
              transformOrigin: 'top',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
            className="absolute top-1/2 left-0 w-full h-1/2 overflow-hidden flex justify-center items-start rounded-b-xl sm:rounded-b-2xl border border-foreground/20 bg-foreground/[0.07] backdrop-blur-xl border-t-black/50 z-20 shadow-2xl"
          >
            <span 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground tabular-nums -translate-y-1/2 select-none drop-shadow-sm ${digitsClass} ${wrapperClass}`}
              style={customStyle}
            >
              {current}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Split Seam & Hinge Notches */}
      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-black/40 dark:bg-black/60 z-30 pointer-events-none" />
      <div className="absolute top-1/2 -left-0.5 w-1.5 h-2.5 -translate-y-1/2 bg-foreground/30 rounded-r-sm z-40 pointer-events-none" />
      <div className="absolute top-1/2 -right-0.5 w-1.5 h-2.5 -translate-y-1/2 bg-foreground/30 rounded-l-sm z-40 pointer-events-none" />
    </div>
  );
};

export const FlipTimer: React.FC<TimerStyleProps> = ({
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
  const m1 = Math.floor(minutes / 10);
  const m2 = minutes % 10;
  const s1 = Math.floor(seconds / 10);
  const s2 = seconds % 10;

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
          className="bg-foreground/5 border-2 border-accent rounded-2xl px-4 py-2 text-center font-mono text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground outline-none w-full max-w-[260px] sm:max-w-[300px]"
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
        className={`cursor-pointer group/digits relative inline-flex items-center justify-center gap-2 sm:gap-3 md:gap-4 select-none shrink-0 w-fit mx-auto ${
          isWarning ? 'animate-pulse drop-shadow-[0_0_25px_var(--color-accent)]' : ''
        }`}
        aria-label="Edit timer"
      >
        {/* Minutes Pair */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <SingleFlapDigit value={m1} />
          <SingleFlapDigit value={m2} />
        </div>

        {/* Twin Pulsating Colon Dots */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 justify-center items-center flex-shrink-0 px-0.5 sm:px-1">
          <motion.div
            animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
            transition={
              isRunning
                ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
          />
          <motion.div
            animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
            transition={
              isRunning
                ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
          />
        </div>

        {/* Seconds Pair */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <SingleFlapDigit value={s1} />
          <SingleFlapDigit value={s2} />
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

