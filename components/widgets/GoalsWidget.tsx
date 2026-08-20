'use client';

import React from 'react';
import { Target, Plus, Minus, RotateCcw } from 'lucide-react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
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

export const GoalsWidget = () => {
  const {
    goal,
    setGoal,
    completedPomodoros,
    setCompletedPomodoros,
    resetCompleted,
    sessionTally,
    userName,
  } = usePreferencesStore();

  const effectiveGoal = Math.max(1, goal || 4);
  const maxDisplay = Math.max(effectiveGoal, completedPomodoros);
  const currentTallyIcon = TALLY_ICONS[sessionTally] || sessionTally || '🍅';
  const percent = Math.min(100, Math.round((completedPomodoros / effectiveGoal) * 100));

  const handleTallyClick = (index: number) => {
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
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-5 rounded-3xl liquid-glass text-foreground transition-all select-none shadow-sm">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={15} className="text-foreground/70" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Daily Pomodoro Goal
          </span>
        </div>
        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-foreground/[0.08] text-foreground">
          {completedPomodoros}/{effectiveGoal} ({percent}%)
        </span>
      </div>

      {/* Interactive Tallies Row */}
      <div className="w-full flex items-center justify-center gap-2 py-2 flex-wrap min-h-[44px]">
        {Array.from({ length: maxDisplay }).map((_, i) => {
          const isCompleted = i < completedPomodoros;
          return (
            <button
              key={i}
              onClick={() => handleTallyClick(i)}
              className={`text-2xl leading-none transition-all duration-200 hover:scale-125 active:scale-95 ${
                isCompleted
                  ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : 'opacity-20 grayscale scale-90 hover:opacity-50'
              }`}
              aria-label={`Session #${i + 1} (${isCompleted ? 'Completed' : 'Pending'})`}
            >
              {currentTallyIcon}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden my-3">
        <div
          className="h-full bg-accent transition-all duration-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-foreground/10 text-xs">
        {/* Goal Setting Stepper */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60">Goal:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setGoal(Math.max(1, effectiveGoal - 1))}
              className="w-7 h-7 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
              aria-label="Decrease Goal"
            >
              <Minus size={12} />
            </button>
            <span className="font-mono font-bold px-1.5 text-foreground">{effectiveGoal}</span>
            <button
              onClick={() => setGoal(Math.min(20, effectiveGoal + 1))}
              className="w-7 h-7 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
              aria-label="Increase Goal"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>

        {/* Completed Stepper & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCompletedPomodoros(Math.max(0, completedPomodoros - 1))}
            className="w-7 h-7 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground transition-all active:scale-95"
            aria-label="Decrease Completed"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => setCompletedPomodoros(completedPomodoros + 1)}
            className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1 hover:bg-white/90 transition-all active:scale-95 shadow-sm cursor-pointer"
            aria-label="Add +1 Completed Session"
          >
            <Plus size={13} />
            <span>+1 Done</span>
          </button>
          <button
            onClick={resetCompleted}
            className="w-7 h-7 rounded-xl bg-foreground/[0.08] hover:bg-foreground/[0.18] flex items-center justify-center text-foreground/60 hover:text-foreground transition-all active:scale-95"
            aria-label="Reset to 0"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
