'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUp, ArrowDown, Check, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { usePreferencesStore } from '@/store/usePreferencesStore';

const ALL_WIDGETS = [
  { id: 'timer', label: 'Focus Timer', icon: '⏱️' },
  { id: 'controls', label: 'Timer Controls', icon: '⏯️' },
  { id: 'quotes', label: 'Daily Quote', icon: '💬' },
  { id: 'focusBreak', label: 'Focus / Break Switcher', icon: '🔄' },
  { id: 'goals', label: 'Pomodoro Goals', icon: '🎯' },
  { id: 'music', label: 'Ambient Sounds', icon: '🎵' },
  { id: 'editor', label: 'Widget Customizer', icon: '🎛️' },
] as const;

export const WidgetEditorWidget = () => {
  const {
    activeWidgets,
    widgetOrder,
    toggleWidget,
    setWidgetOrder,
    resetLayout,
  } = usePreferencesStore();

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const currentList = [...widgetOrder];
    // Ensure all active widgets are in order
    ALL_WIDGETS.forEach((w) => {
      if (!currentList.includes(w.id)) {
        currentList.push(w.id);
      }
    });

    const index = currentList.indexOf(id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = currentList[index - 1];
      currentList[index - 1] = currentList[index];
      currentList[index] = temp;
      setWidgetOrder(currentList);
    } else if (direction === 'down' && index < currentList.length - 1) {
      const temp = currentList[index + 1];
      currentList[index + 1] = currentList[index];
      currentList[index] = temp;
      setWidgetOrder(currentList);
    }
  };

  // Sorted list based on widgetOrder
  const sortedWidgets = [...ALL_WIDGETS].sort((a, b) => {
    const idxA = widgetOrder.indexOf(a.id);
    const idxB = widgetOrder.indexOf(b.id);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 rounded-3xl bg-foreground/[0.04] hover:bg-foreground/[0.06] backdrop-blur-xl border border-foreground/10 hover:border-foreground/20 text-foreground transition-all select-none shadow-sm">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-foreground/70" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">
            Active Widgets & Ordering
          </span>
        </div>
        <button
          onClick={resetLayout}
          className="flex items-center gap-1 text-[11px] font-mono opacity-60 hover:opacity-100 hover:text-foreground transition-all"
          aria-label="Reset widgets to default"
        >
          <RotateCcw size={11} />
          <span>Reset</span>
        </button>
      </div>

      {/* Widgets List */}
      <div className="w-full flex flex-col gap-1.5">
        {sortedWidgets.map((w, index) => {
          const isActive = activeWidgets.includes(w.id);

          return (
            <div
              key={w.id}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all border ${
                isActive
                  ? 'bg-foreground/[0.06] border-foreground/15 text-foreground'
                  : 'bg-foreground/[0.02] border-transparent text-foreground/40'
              }`}
            >
              {/* Toggle & Name */}
              <button
                onClick={() => toggleWidget(w.id)}
                className="flex items-center gap-2.5 flex-1 text-left"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-white border-white text-black' : 'border border-foreground/20'
                  }`}
                >
                  {isActive ? <Check size={11} strokeWidth={3.5} /> : null}
                </div>
                <span className="text-sm">{w.icon}</span>
                <span className="text-xs font-semibold">{w.label}</span>
              </button>

              {/* Move Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(w.id, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-foreground/[0.05] hover:bg-foreground/[0.15] disabled:opacity-20 text-foreground transition-all active:scale-95"
                  aria-label="Move Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => handleMove(w.id, 'down')}
                  disabled={index === sortedWidgets.length - 1}
                  className="p-1.5 rounded-lg bg-foreground/[0.05] hover:bg-foreground/[0.15] disabled:opacity-20 text-foreground transition-all active:scale-95"
                  aria-label="Move Down"
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
