'use client';

import { create } from 'zustand';

export interface CelebrationMessage {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: 'pomo' | 'goal' | 'todo';
}

interface CelebrationState {
  currentCelebration: CelebrationMessage | null;
  showCelebration: (msg: Omit<CelebrationMessage, 'id'>) => void;
  clearCelebration: () => void;
}

export const useCelebrationStore = create<CelebrationState>((set) => ({
  currentCelebration: null,
  showCelebration: (msg) => {
    const id = Math.random().toString(36).substring(2, 9);
    set({ currentCelebration: { ...msg, id } });
  },
  clearCelebration: () => set({ currentCelebration: null }),
}));
