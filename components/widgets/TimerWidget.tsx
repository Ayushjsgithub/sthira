'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '@/store/useTimerStore';
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

const MODE_LABELS: Record<'work' | 'shortBreak' | 'longBreak', string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

export const TimerWidget = () => {
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isRunning = useTimerStore((state) => state.isRunning);
  const mode = useTimerStore((state) => state.mode);
  const storeIsEditing = useTimerStore((state) => state.isEditing);
  const setTimeLeft = useTimerStore((state) => state.setTimeLeft);
  const setStoreIsEditing = useTimerStore((state) => state.setIsEditing);

  const timerStyle = usePreferencesStore((state) => state.timerStyle);
  const timerDurations = usePreferencesStore((state) => state.timerDurations);
  const setTimerDurations = usePreferencesStore((state) => state.setTimerDurations);

  // Local editing sync
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [wheelDeltaToast, setWheelDeltaToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync store editing state (e.g. from 'E' shortcut)
  useEffect(() => {
    if (storeIsEditing !== isEditing) {
      setIsEditing(storeIsEditing);
    }
  }, [storeIsEditing]);

  const totalDurationSeconds = (timerDurations[mode] || 25) * 60;
  const progress = totalDurationSeconds > 0 ? timeLeft / totalDurationSeconds : 0;

  // Sync timeLeft when duration settings change (e.g. from SettingsSidebar) or on initial hydration
  const previousDurationRef = useRef(totalDurationSeconds);
  useEffect(() => {
    if (previousDurationRef.current !== totalDurationSeconds) {
      if (!isRunning) {
        setTimeLeft(totalDurationSeconds);
      }
      previousDurationRef.current = totalDurationSeconds;
    }
  }, [totalDurationSeconds, isRunning, setTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const minStr = minutes.toString().padStart(2, '0');
  const secStr = seconds.toString().padStart(2, '0');
  const displayTime = `${minStr}:${secStr}`;
  const isWarning = timeLeft <= 5 && timeLeft > 0 && isRunning;

  const handleStartEditing = () => {
    setEditValue(displayTime);
    setIsEditing(true);
    setStoreIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setStoreIsEditing(false);
  };

  const handleEditSubmit = () => {
    setIsEditing(false);
    setStoreIsEditing(false);
    if (!editValue.trim()) return;

    let mins = 0;
    let secs = 0;

    const trimmed = editValue.trim();
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      mins = parseInt(parts[0], 10) || 0;
      secs = parseInt(parts[1], 10) || 0;
    } else {
      mins = parseInt(trimmed, 10) || 0;
    }

    const newTotalSeconds = Math.max(1, mins * 60 + secs);
    setTimeLeft(newTotalSeconds);

    // Sync back to global settings so progress bar and sidebar match
    setTimerDurations({
      ...timerDurations,
      [mode]: Math.ceil(newTotalSeconds / 60)
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Only adjust time on scroll when user is actively in editing mode
    if (!isEditing) return;

    e.preventDefault();
    const isUp = e.deltaY < 0;
    const deltaMins = e.shiftKey ? 5 : 1;
    const deltaSecs = (isUp ? deltaMins : -deltaMins) * 60;

    let currentTotalSeconds = timeLeft;
    const trimmed = editValue.trim();
    if (trimmed) {
      if (trimmed.includes(':')) {
        const parts = trimmed.split(':');
        const mins = parseInt(parts[0], 10) || 0;
        const secs = parseInt(parts[1], 10) || 0;
        currentTotalSeconds = mins * 60 + secs;
      } else {
        const mins = parseInt(trimmed, 10) || 0;
        currentTotalSeconds = mins * 60;
      }
    }

    const newSeconds = Math.max(0, currentTotalSeconds + deltaSecs);
    const newMins = Math.floor(newSeconds / 60);
    const newSecs = newSeconds % 60;
    const newDisplay = `${newMins.toString().padStart(2, '0')}:${newSecs.toString().padStart(2, '0')}`;

    setEditValue(newDisplay);
    setTimeLeft(newSeconds);

    // Show temporary toast feedback
    setWheelDeltaToast(`${isUp ? '+' : '-'}${deltaMins}m`);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setWheelDeltaToast(null), 1200);
  };



  const timerProps = {
    displayTime,
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
    onStartEditing: handleStartEditing,
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full transition-all duration-300 select-none gap-4 sm:gap-6 max-w-4xl mx-auto"
      onWheel={handleWheel}
    >

      {/* Minimal Wheel Delta Indicator */}
      <AnimatePresence>
        {wheelDeltaToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute -top-6 z-40 pointer-events-none"
          >
            <div className="px-2.5 py-0.5 rounded-full bg-foreground/[0.08] backdrop-blur-md border border-foreground/15 text-foreground font-mono text-[11px] font-semibold tabular-nums tracking-wide shadow-sm">
              {wheelDeltaToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Display Section */}
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
          {timerStyle === 'default' && <DefaultTimer key="default" {...timerProps} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

