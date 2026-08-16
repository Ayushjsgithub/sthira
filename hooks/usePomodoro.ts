'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { playChime } from '@/lib/audio';
import { triggerFullPageConfetti } from '@/lib/confetti';

export function usePomodoro() {
  const { isRunning, timeLeft, tick, completeSession, mode } = useTimerStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Time is up
      if (mode === 'work') {
        triggerFullPageConfetti();
      }
      playChime();
      completeSession();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, tick, completeSession, mode]);
}
