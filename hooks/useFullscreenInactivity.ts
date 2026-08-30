'use client';

import { create } from 'zustand';
import { useEffect } from 'react';

interface FullscreenInactivityState {
  isFullscreen: boolean;
  isInactive: boolean;
  setIsFullscreen: (val: boolean) => void;
  setIsInactive: (val: boolean) => void;
  toggleFullscreen: () => Promise<void>;
}

export const useFullscreenInactivityStore = create<FullscreenInactivityState>((set, get) => ({
  isFullscreen: false,
  isInactive: false,
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  setIsInactive: (isInactive) => set({ isInactive }),
  toggleFullscreen: async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle error:', err);
    }
  },
}));

export function useFullscreenInactivity() {
  const { isFullscreen, setIsFullscreen, setIsInactive, toggleFullscreen } = useFullscreenInactivityStore();

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active) {
        setIsInactive(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen, setIsInactive]);

  useEffect(() => {
    if (!isFullscreen) {
      setIsInactive(false);
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const resetInactivityTimer = () => {
      setIsInactive(false);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsInactive(true);
      }, 10000); // 10 seconds of inactivity in fullscreen
    };

    // Start 10s timer on entering fullscreen
    resetInactivityTimer();

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivityTimer, { passive: true }));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetInactivityTimer));
    };
  }, [isFullscreen, setIsInactive]);

  return { isFullscreen, toggleFullscreen };
}
