'use client';

import React from 'react';
import { TodoPill } from './TodoPill';
import { PomodoroGoalTracker } from './PomodoroGoalTracker';
import { useFullscreenInactivityStore } from '@/hooks/useFullscreenInactivity';

export const BottomLeftHud = () => {
  const { isFullscreen, isInactive } = useFullscreenInactivityStore();

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2.5 select-none pointer-events-auto transition-opacity duration-700 ${
        isFullscreen && isInactive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <TodoPill />
      <PomodoroGoalTracker />
    </div>
  );
};
