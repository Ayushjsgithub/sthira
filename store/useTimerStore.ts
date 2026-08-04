import { create } from 'zustand';
import { usePreferencesStore } from './usePreferencesStore';
import { playAlertSound } from '@/lib/alertSounds';
import { useCelebrationStore } from './useCelebrationStore';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface TimerState {
  mode: TimerMode;
  timeLeft: number; // in seconds
  isRunning: boolean;
  isEditing: boolean;
  setMode: (mode: TimerMode) => void;
  setTimeLeft: (time: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setIsEditing: (isEditing: boolean) => void;
  tick: () => void;
  completeSession: () => void;
  skipSession: () => void;
  adjustTime: (deltaSeconds: number) => void;
  resetTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'work',
  timeLeft: 25 * 60, // will be instantly synced by component
  isRunning: false,
  isEditing: false,
  
  setMode: (mode) => {
    const duration = usePreferencesStore.getState().timerDurations[mode] * 60;
    set({ mode, timeLeft: duration });
  },
  
  setTimeLeft: (time) => set({ timeLeft: Math.max(0, time) }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsEditing: (isEditing) => set({ isEditing }),
  
  tick: () => set((state) => ({ timeLeft: Math.max(0, state.timeLeft - 1) })),
  
  completeSession: () => {
    const { mode } = get();
    const prefs = usePreferencesStore.getState();
    
    // Play alert sound
    if (prefs.alertSound && prefs.alertSound !== 'none') {
      playAlertSound(prefs.alertSound);
    }
    
    set({ isRunning: prefs.autoStart });
    
    if (mode === 'work') {
      prefs.incrementCompleted();
      const currentCompleted = prefs.completedPomodoros;
      const name = prefs.userName?.trim();

      // Check if all goals reached
      if (currentCompleted > 0 && currentCompleted % prefs.goal === 0) {
        useCelebrationStore.getState().showCelebration({
          icon: '🏆',
          title: name ? `Incredible achievement, ${name}!` : `Incredible achievement!`,
          subtitle: `All ${prefs.goal} daily Pomodoro goals completed! Enjoy your long break.`,
          type: 'goal'
        });
        get().setMode('longBreak');
      } else {
        useCelebrationStore.getState().showCelebration({
          icon: '🎉',
          title: name ? `Great job, ${name}!` : `Great job!`,
          subtitle: `Focus session completed (${currentCompleted}/${prefs.goal}). Time for a break.`,
          type: 'pomo'
        });
        get().setMode('shortBreak');
      }
    } else {
      // Break is over, go back to work
      get().setMode('work');
    }
  },
  
  skipSession: () => {
    const { mode } = get();
    const prefs = usePreferencesStore.getState();
    if (mode === 'work') {
      const currentCompleted = prefs.completedPomodoros + 1;
      if (currentCompleted > 0 && currentCompleted % prefs.goal === 0) {
        get().setMode('longBreak');
      } else {
        get().setMode('shortBreak');
      }
    } else {
      get().setMode('work');
    }
  },

  adjustTime: (deltaSeconds) => {
    set((state) => ({ timeLeft: Math.max(10, state.timeLeft + deltaSeconds) }));
  },
  
  resetTimer: () => {
    const duration = usePreferencesStore.getState().timerDurations.work * 60;
    set({
      mode: 'work',
      timeLeft: duration,
      isRunning: false,
      isEditing: false
    });
  }
}));
