'use client';

import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';

import { DefaultTimer } from './timer/DefaultTimer';
import { FlipTimer } from './timer/FlipTimer';
import { ProgressTimer } from './timer/ProgressTimer';
import { GaugeTimer } from './timer/GaugeTimer';
import { DotMatrixTimer } from './timer/DotMatrixTimer';
import { PieTimer } from './timer/PieTimer';
import { ConcentricTimer } from './timer/ConcentricTimer';
import { TypographicTimer } from './timer/TypographicTimer';
import { AnalogTimer } from './timer/AnalogTimer';
import { useTimerTypography } from '@/hooks/useTimerTypography';

export const ClockWidget = () => {
  const timerStyle = usePreferencesStore((state) => state.timerStyle || 'flip');
  const clockIs24h = usePreferencesStore((state) => state.clockIs24h);
  const clockShowDate = usePreferencesStore((state) => state.clockShowDate);
  const toggleClockIs24h = usePreferencesStore((state) => state.toggleClockIs24h);
  const { wrapperClass, customStyle } = useTimerTypography();

  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fake editing props to satisfy the timer components without breaking them
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState('');

  // Use 12:00 as server placeholder for perfect hydration matching
  const rawHours = mounted ? currentTime.getHours() : 12;
  const isPM = rawHours >= 12;
  const period = isPM ? 'PM' : 'AM';

  // 12-hour or 24-hour hour value
  const displayHours = clockIs24h ? rawHours : (rawHours % 12 || 12);
  const minutes = displayHours; // Passed as "minutes" to the timer components (left pair)
  const seconds = mounted ? currentTime.getMinutes() : 0; // Passed as "seconds" (right pair)
  const progress = mounted ? currentTime.getSeconds() / 60 : 0;

  const minStr = displayHours.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');
  const displayTime = `${minStr}:${secStr}`;

  // Formatted date string (e.g., "Saturday, September 19")
  const dateStr = mounted
    ? currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      })
    : 'Saturday, Sep 19';

  const timerProps = {
    displayTime,
    minutes,
    seconds,
    progress,
    totalDurationSeconds: 60, // Arbitrary, not actually running a countdown
    isRunning: true,
    isWarning: false,
    isEditing: false,
    editValue,
    setEditValue,
    handleEditSubmit: () => {},
    handleEditCancel: () => {},
    inputRef,
    onStartEditing: () => {}, // Disable editing on the clock
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full transition-all duration-300 select-none gap-3 sm:gap-4 max-w-4xl mx-auto">
      {/* Real-time Clock Face with AM/PM pill */}
      <div className="relative flex items-center justify-center w-full flex-shrink-0 my-1">
        <AnimatePresence mode="wait">
          {timerStyle === 'flip' && <FlipTimer key="flip" {...timerProps} />}
          {timerStyle === 'gauge' && <GaugeTimer key="gauge" {...timerProps} />}
          {timerStyle === 'progress' && <ProgressTimer key="progress" {...timerProps} />}
          {timerStyle === 'dotMatrix' && <DotMatrixTimer key="dotMatrix" {...timerProps} />}
          {timerStyle === 'pie' && <PieTimer key="pie" {...timerProps} />}
          {timerStyle === 'concentric' && <ConcentricTimer key="concentric" {...timerProps} />}
          {timerStyle === 'typographic' && <TypographicTimer key="typographic" {...timerProps} />}
          {timerStyle === 'analog' && <AnalogTimer key="analog" {...timerProps} />}
          {(timerStyle === 'default' || !['flip', 'gauge', 'progress', 'dotMatrix', 'pie', 'concentric', 'typographic', 'analog'].includes(timerStyle)) && (
            <DefaultTimer key="default" {...timerProps} />
          )}
        </AnimatePresence>
      </div>

      {/* Date & Day Subtitle inheriting clock typeface without extra boldness */}
      {clockShowDate && (
        <div 
          style={{
            ...customStyle,
            fontWeight: 400,
            WebkitTextStroke: '0px transparent',
          }}
          className={`flex items-center gap-2 px-3.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/10 text-xs sm:text-sm tracking-wide text-foreground/80 font-normal backdrop-blur-md shadow-sm transition-all ${wrapperClass}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
          <span className="font-normal">{dateStr}</span>
        </div>
      )}
    </div>
  );
};
