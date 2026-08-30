'use client';

import { useEffect } from 'react';
import { useTimerStore } from '@/store/useTimerStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useMusicStore } from '@/store/useMusicStore';

export function useKeyboardShortcuts() {
  const {
    isRunning,
    setIsRunning,
    isEditing,
    setIsEditing,
    resetTimer,
    skipSession,
    setMode,
    adjustTime,
  } = useTimerStore();

  const {
    activeSidebar,
    setActiveSidebar,
    showShortcutsModal,
    setShowShortcutsModal,
    showGoalTracker,
    setShowGoalTracker,
  } = usePreferencesStore();

  const { togglePlay } = useMusicStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. If typing inside an input or textarea, only handle Escape & Enter
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          if (isEditing) setIsEditing(false);
          (e.target as HTMLElement).blur();
        }
        if (e.key === 'Enter') {
          if (isEditing) setIsEditing(false);
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // 2. Help Modal Toggle ('?' or Shift + '/')
      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        setShowShortcutsModal(!showShortcutsModal);
        return;
      }

      // 3. Escape: Close modals, drawers, edit mode
      if (e.key === 'Escape') {
        if (showShortcutsModal) {
          setShowShortcutsModal(false);
          return;
        }
        if (activeSidebar !== 'none') {
          setActiveSidebar('none');
          return;
        }
        if (isEditing) {
          setIsEditing(false);
          return;
        }
      }

      // 4. Number keys for mode switching (1: Work, 2: Short Break, 3: Long Break)
      if (e.code === 'Digit1' || e.key === '1') {
        e.preventDefault();
        setMode('work');
        return;
      }
      if (e.code === 'Digit2' || e.key === '2') {
        e.preventDefault();
        setMode('shortBreak');
        return;
      }
      if (e.code === 'Digit3' || e.key === '3') {
        e.preventDefault();
        setMode('longBreak');
        return;
      }

      // 5. Arrow keys / Plus / Minus for quick time adjustments
      if (e.code === 'ArrowUp' || e.key === '=' || e.key === '+') {
        e.preventDefault();
        adjustTime(e.shiftKey ? 300 : 60);
        return;
      }
      if (e.code === 'ArrowDown' || e.key === '-' || e.key === '_') {
        e.preventDefault();
        adjustTime(e.shiftKey ? -300 : -60);
        return;
      }

      // 6. Action Keys
      switch (e.code) {
        // Space: Start / Pause
        case 'Space':
          e.preventDefault();
          setIsRunning(!isRunning);
          break;

        // S: Skip session to next mode
        case 'KeyS':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            skipSession();
          }
          break;

        // R: Reset timer
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            resetTimer();
          }
          break;

        // F: Toggle Fullscreen
        case 'KeyF':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Fullscreen error: ${err.message}`);
              });
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
          break;

        // E: Toggle inline edit mode
        case 'KeyE':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setIsEditing(!isEditing);
          }
          break;

        // M: Toggle Ambient Music Panel
        case 'KeyM':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setActiveSidebar(activeSidebar === 'music' ? 'none' : 'music');
          }
          break;

        // A: Toggle Ambient Audio Play/Pause directly
        case 'KeyA':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            togglePlay();
          }
          break;

        // L: Toggle Layout & Sizing Panel
        case 'KeyL':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setActiveSidebar(activeSidebar === 'layout' ? 'none' : 'layout');
          }
          break;

        // O or Comma: Toggle Master Settings Panel
        case 'KeyO':
        case 'Comma':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setActiveSidebar(activeSidebar === 'settings' ? 'none' : 'settings');
          }
          break;

        // G: Toggle Goal Tracker HUD pill
        case 'KeyG':
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            setShowGoalTracker(!showGoalTracker);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isRunning,
    setIsRunning,
    isEditing,
    setIsEditing,
    resetTimer,
    skipSession,
    setMode,
    adjustTime,
    activeSidebar,
    setActiveSidebar,
    showShortcutsModal,
    setShowShortcutsModal,
    showGoalTracker,
    setShowGoalTracker,
    togglePlay,
  ]);
}
