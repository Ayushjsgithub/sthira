'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Sparkles, Play, SkipForward, RotateCcw, Maximize, Edit3, Music, Sliders, Settings, HelpCircle, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { CurvedScrollContainer } from '@/components/ui/CurvedScrollContainer';

interface ShortcutGroup {
  category: string;
  items: {
    key: string | string[];
    description: string;
    icon?: React.ReactNode;
  }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: 'Timer Controls',
    items: [
      { key: 'Space', description: 'Start / Pause Timer', icon: <Play size={14} /> },
      { key: 'C', description: 'Toggle Real-Time Clock / Focus Timer', icon: <Clock size={14} /> },
      { key: 'H', description: 'Toggle 12-Hour (AM/PM) vs 24-Hour Clock' },
      { key: 'S', description: 'Skip to Next Session (Work / Break)', icon: <SkipForward size={14} /> },
      { key: 'R', description: 'Reset Timer to Initial State', icon: <RotateCcw size={14} /> },
      { key: ['↑', '+'], description: 'Add 1 Minute (+5m with Shift)', icon: <ArrowUp size={14} /> },
      { key: ['↓', '-'], description: 'Subtract 1 Minute (-5m with Shift)', icon: <ArrowDown size={14} /> },
      { key: 'E', description: 'Edit Time Manually (mm:ss)', icon: <Edit3 size={14} /> },
    ],
  },
  {
    category: 'Session Modes',
    items: [
      { key: '1', description: 'Switch to Focus Mode (25m)' },
      { key: '2', description: 'Switch to Short Break (5m)' },
      { key: '3', description: 'Switch to Long Break (15m)' },
    ],
  },
  {
    category: 'Panels & Tools',
    items: [
      { key: 'M', description: 'Toggle Ambient Music Panel', icon: <Music size={14} /> },
      { key: 'A', description: 'Toggle Ambient Audio Play / Pause' },
      { key: 'L', description: 'Toggle Layout & Sizing Panel', icon: <Sliders size={14} /> },
      { key: ['O', ','], description: 'Open Settings Panel', icon: <Settings size={14} /> },
      { key: 'G', description: 'Toggle Goal Tracker HUD' },
      { key: 'F', description: 'Toggle Fullscreen Mode', icon: <Maximize size={14} /> },
      { key: '?', description: 'Show / Hide Keyboard Shortcuts', icon: <HelpCircle size={14} /> },
      { key: 'Esc', description: 'Close Open Drawers & Modals' },
    ],
  },
];

export const KeyboardShortcutsModal = () => {
  const { showShortcutsModal, setShowShortcutsModal } = usePreferencesStore();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showShortcutsModal) {
        setShowShortcutsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcutsModal, setShowShortcutsModal]);

  return (
    <AnimatePresence>
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowShortcutsModal(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl h-[85vh] md:h-[650px] max-h-[85vh] overflow-hidden rounded-[32px] liquid-glass text-foreground shadow-2xl border border-foreground/15 flex flex-col select-none"
          >
            <CurvedScrollContainer
              className="w-full h-full"
              contentClassName="p-6 sm:p-8 flex flex-col gap-6"
              borderRadius={32}
              thumbColor="#bfdbfe"
              thumbColorActive="#60a5fa"
              trackColor="transparent"
              trackColorActive="transparent"
              thumbWidth={4}
              thumbWidthActive={6}
              maxThumbLength={90}
              position="left"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-foreground/10 flex items-center justify-center text-foreground">
                  <Command size={22} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight">Keyboard Shortcuts</h2>
                  <p className="text-xs text-foreground/60">Navigate and control Sthira entirely hands-free</p>
                </div>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="p-2 rounded-2xl hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.category} className="flex flex-col gap-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50 px-1">
                    {group.category}
                  </h3>
                  <div className="flex flex-col gap-1.5 bg-foreground/[0.03] rounded-3xl p-3 border border-foreground/5">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-2.5 rounded-2xl hover:bg-foreground/[0.06] transition-colors"
                      >
                        <div className="flex items-center gap-2 text-xs font-medium text-foreground/90">
                          {item.icon && <span className="text-foreground/60">{item.icon}</span>}
                          <span>{item.description}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.isArray(item.key) ? (
                            item.key.map((k, kIdx) => (
                              <React.Fragment key={kIdx}>
                                <kbd className="px-2 py-0.5 min-w-[24px] text-center font-mono text-[11px] font-bold rounded-xl bg-foreground/10 border border-foreground/15 text-foreground shadow-sm">
                                  {k}
                                </kbd>
                                {kIdx < item.key.length - 1 && (
                                  <span className="text-[10px] text-foreground/40 font-mono">/</span>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <kbd className="px-2.5 py-0.5 min-w-[24px] text-center font-mono text-[11px] font-bold rounded-xl bg-foreground/10 border border-foreground/15 text-foreground shadow-sm">
                              {item.key}
                            </kbd>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-between text-xs text-foreground/50 border-t border-foreground/10 pt-4">
              <span className="flex items-center gap-1.5">
                 Press <kbd className="font-mono font-bold px-1.5 py-0.5 rounded bg-foreground/10">?</kbd> anytime to toggle this modal
              </span>
              <span>v1.0.0</span>
            </div>
            </CurvedScrollContainer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
