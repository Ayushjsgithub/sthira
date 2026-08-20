'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Target, Plus, Minus, RotateCcw, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useFullscreenInactivityStore } from '@/hooks/useFullscreenInactivity';
import { triggerFullPageConfetti } from '@/lib/confetti';
import { useCelebrationStore } from '@/store/useCelebrationStore';

const TALLY_ICONS: Record<string, string> = {
  tomatoes: '🍅',
  dots: '⚪',
  hearts: '❤️',
  stars: '⭐️',
  fire: '🔥',
  coffee: '☕',
  lightning: '⚡',
  leaf: '🌿',
  diamond: '💎',
  target: '🎯',
  rocket: '🚀',
  code: '💻',
};

export const PomodoroGoalTracker = () => {
  const {
    goal,
    setGoal,
    completedPomodoros,
    setCompletedPomodoros,
    resetCompleted,
    sessionTally,
    setSessionTally,
    showGoalTracker,
    userName,
  } = usePreferencesStore();

  const { isFullscreen, isInactive } = useFullscreenInactivityStore();

  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) return null;
  // If the user has disabled the floating Goal Tracker HUD, do not render on screen
  if (!showGoalTracker) return null;

  const currentTallyIcon = TALLY_ICONS[sessionTally] || sessionTally || '🍅';
  const effectiveGoal = Math.max(1, goal || 4);
  const maxDisplay = Math.max(effectiveGoal, completedPomodoros);

  const handleTallyClick = (index: number) => {
    // If clicking on an already completed item, toggle it off or adjust count
    if (index + 1 === completedPomodoros) {
      setCompletedPomodoros(index);
    } else {
      const nextCount = index + 1;
      setCompletedPomodoros(nextCount);
      if (nextCount >= effectiveGoal && nextCount > completedPomodoros) {
        triggerFullPageConfetti();
        const name = userName?.trim();
        useCelebrationStore.getState().showCelebration({
          icon: '🏆',
          title: name ? `Goal achieved, ${name}!` : `Goal achieved!`,
          subtitle: `You reached your daily goal of ${effectiveGoal} Pomodoros! Keep shining.`,
          type: 'goal',
        });
      }
    }
  };

  return (
    <div 
      ref={popoverRef} 
      className="relative select-none"
    >
      {/* Popover Editor Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            className="absolute bottom-full left-0 mb-3 w-[290px] p-4 rounded-3xl liquid-glass text-foreground shadow-2xl flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-foreground/80" />
                <span className="text-sm font-bold tracking-tight">Edit Daily Goals</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target Goal Setting */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-foreground/60">Target Goal</span>
                <span className="font-mono font-bold text-foreground text-sm">{effectiveGoal} sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGoal(Math.max(1, effectiveGoal - 1))}
                  className="w-8 h-8 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
                  aria-label="Decrease Goal"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={effectiveGoal}
                  onChange={(e) => setGoal(parseInt(e.target.value, 10) || 1)}
                  className="flex-1 accent-accent h-1.5 bg-foreground/20 rounded-full cursor-pointer"
                />
                <button
                  onClick={() => setGoal(Math.min(20, effectiveGoal + 1))}
                  className="w-8 h-8 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
                  aria-label="Increase Goal"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Completed Sessions Setting */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-foreground/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-foreground/60">Completed</span>
                <span className="font-mono font-bold text-foreground text-sm">{completedPomodoros} done</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompletedPomodoros(Math.max(0, completedPomodoros - 1))}
                  className="w-8 h-8 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
                  aria-label="Decrease Completed"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={completedPomodoros}
                  onChange={(e) => setCompletedPomodoros(parseInt(e.target.value, 10) || 0)}
                  className="flex-1 accent-accent h-1.5 bg-foreground/20 rounded-full cursor-pointer"
                />
                <button
                  onClick={() => setCompletedPomodoros(completedPomodoros + 1)}
                  className="w-8 h-8 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
                  aria-label="Increase Completed"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={resetCompleted}
                  className="w-8 h-8 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground/70 hover:text-foreground transition-all active:scale-95"
                  aria-label="Reset to 0"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Icon Picker */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-foreground/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Tally Icon</span>
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(TALLY_ICONS).map(([key, icon]) => (
                  <button
                    key={key}
                    onClick={() => setSessionTally(key)}
                    className={`py-1.5 rounded-xl flex items-center justify-center text-base transition-all ${
                      sessionTally === key
                        ? 'bg-foreground/[0.18] border border-foreground/30 shadow-sm scale-105'
                        : 'bg-foreground/[0.05] border border-transparent hover:bg-foreground/[0.10]'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Pill with Liquid Glass Blur Effect */}
      <div className="flex items-center gap-2 liquid-glass text-foreground rounded-full p-1.5 px-3.5 shadow-lg transition-all duration-300">
        {/* Tallies List */}
        <div
          className="flex items-center gap-1.5 cursor-pointer"
          aria-label="Completed sessions tallies"
        >
          {Array.from({ length: maxDisplay }).map((_, i) => {
            const isCompleted = i < completedPomodoros;
            return (
              <button
                key={i}
                onClick={() => handleTallyClick(i)}
                className={`text-base leading-none transition-all duration-200 hover:scale-125 active:scale-95 cursor-pointer ${
                  isCompleted
                    ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]'
                    : 'opacity-25 grayscale scale-90 hover:opacity-60'
                }`}
                aria-label={`Tomato #${i + 1} (${isCompleted ? 'Completed' : 'Pending'})`}
              >
                {currentTallyIcon}
              </button>
            );
          })}
        </div>

        {/* Counter Badge */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/[0.08] hover:bg-foreground/[0.16] text-xs font-mono font-bold text-foreground transition-all cursor-pointer"
          aria-label="Click to edit goals"
        >
          <span>
            {completedPomodoros}/{effectiveGoal}
          </span>
          <Edit2 size={11} className="opacity-60 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
