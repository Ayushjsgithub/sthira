'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, X, Clock, Quote, GripVertical, Check } from "lucide-react";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { Reorder } from "framer-motion";
import { CurvedScrollContainer } from "@/components/ui/CurvedScrollContainer";

const ALL_AVAILABLE_WIDGETS = [
  { id: 'focusBreak', name: 'Focus / Break Switcher', icon: '🔄' },
  { id: 'timer', name: 'Focus Timer', icon: '⏱️' },
  { id: 'clock', name: 'Real-Time Clock', icon: '🕒' },
  { id: 'controls', name: 'Timer Controls', icon: '⏯️' },
  { id: 'quotes', name: 'Daily Quote', icon: '💬' },
  { id: 'goals', name: 'Pomodoro Goals', icon: '🎯' },
] as const;

export const LayoutToggleButton = () => {
  const { 
    activeWidgets, toggleWidget,
    widgetOrder, setWidgetOrder,
    timerScale, setTimerScale,
    quoteScale, setQuoteScale,
    showGoalTracker, showTodoPill, showMusicButton, showLayoutButton, showFullscreenButton,
    toggleHudButton,
    clockIs24h, toggleClockIs24h,
    clockShowDate, toggleClockShowDate,
    activeSidebar, setActiveSidebar,
  } = usePreferencesStore();

  const isOpen = activeSidebar === 'layout';
  const setIsOpen = (open: boolean) => setActiveSidebar(open ? 'layout' : 'none');

  const orderedWidgets = (() => {
    const list = [...(widgetOrder || ['focusBreak', 'timer', 'quotes', 'goals'])].filter((id) =>
      ALL_AVAILABLE_WIDGETS.some((w) => w.id === id)
    );
    ALL_AVAILABLE_WIDGETS.forEach((w) => {
      if (!list.includes(w.id)) {
        list.push(w.id);
      }
    });
    return list;
  })();

  const sizePresets = [
    { label: '75%', scale: 0.75 },
    { label: '100%', scale: 1.0 },
    { label: '130%', scale: 1.3 },
    { label: '160%', scale: 1.6 },
    { label: '200%', scale: 2.0 },
  ];

  const handleCustomPercentChange = (valStr: string, setter: (val: number) => void) => {
    const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setter(Math.max(0.4, Math.min(2.5, num / 100)));
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Slide-over Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[380px] max-w-[90vw] z-50 overflow-hidden transition-transform duration-300 ease-in-out select-none rounded-l-3xl ${
          isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+60px)]'
        }`}
        style={{
          background: 'rgba(12, 12, 14, 0.95)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 1px 0 0 0 rgba(255, 255, 255, 0.08), -12px 0 40px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
        }}
      >
        <CurvedScrollContainer
           className="w-full h-full"
           contentClassName="p-6 pb-32"
           borderRadius={24}
           thumbColor="#e9d5ff"
           thumbColorActive="#c084fc"
           trackColor="transparent"
           trackColorActive="transparent"
           thumbWidth={4}
           thumbWidthActive={6}
           maxThumbLength={60}
           position="left"
        >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={18} className="text-white" />
            <h2 className="text-xl font-bold tracking-tight text-white">Layout & Sizing</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Focus Timer Size (Independent) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Clock size={14} className="opacity-80" />
                <label className="text-xs font-semibold uppercase opacity-60">Focus Timer Size</label>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-0.5 border border-white/10">
                <input
                  type="number"
                  min="40"
                  max="250"
                  step="5"
                  value={Math.round((timerScale || 1.0) * 100)}
                  onChange={(e) => handleCustomPercentChange(e.target.value, setTimerScale)}
                  className="w-10 bg-transparent text-right font-mono text-xs font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[11px] font-mono text-white/60">%</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {sizePresets.map(preset => {
                const isCurrent = Math.abs((timerScale || 1.0) - preset.scale) < 0.04;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setTimerScale(preset.scale)}
                    className={`py-1.5 px-0.5 rounded-xl text-xs font-semibold transition-all text-center ${
                      isCurrent
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimerScale(Math.max(0.4, (timerScale || 1.0) - 0.05))}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all"
                aria-label="Decrease 5%"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={timerScale || 1.0}
                onChange={(e) => setTimerScale(parseFloat(e.target.value))}
                className="flex-1 accent-white h-1.5 bg-white/20 rounded-full cursor-pointer"
              />
              <button
                onClick={() => setTimerScale(Math.min(2.5, (timerScale || 1.0) + 0.05))}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all"
                aria-label="Increase 5%"
              >
                +
              </button>
            </div>
          </div>

          {/* Daily Quote Size (Independent) */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Quote size={14} className="opacity-80" />
                <label className="text-xs font-semibold uppercase opacity-60">Daily Quote Size</label>
              </div>
              <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-0.5 border border-white/10">
                <input
                  type="number"
                  min="40"
                  max="250"
                  step="5"
                  value={Math.round((quoteScale || 1.0) * 100)}
                  onChange={(e) => handleCustomPercentChange(e.target.value, setQuoteScale)}
                  className="w-10 bg-transparent text-right font-mono text-xs font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-[11px] font-mono text-white/60">%</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-3">
              {sizePresets.map(preset => {
                const isCurrent = Math.abs((quoteScale || 1.0) - preset.scale) < 0.04;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setQuoteScale(preset.scale)}
                    className={`py-1.5 px-0.5 rounded-xl text-xs font-semibold transition-all text-center ${
                      isCurrent
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuoteScale(Math.max(0.4, (quoteScale || 1.0) - 0.05))}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all"
                aria-label="Decrease 5%"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.2"
                step="0.05"
                value={quoteScale || 1.0}
                onChange={(e) => setQuoteScale(parseFloat(e.target.value))}
                className="flex-1 accent-white h-1.5 bg-white/20 rounded-full cursor-pointer"
              />
              <button
                onClick={() => setQuoteScale(Math.min(2.5, (quoteScale || 1.0) + 0.05))}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all"
                aria-label="Increase 5%"
              >
                +
              </button>
            </div>
          </div>

          {/* Real-Time Clock Settings */}
          <div className="pt-4 border-t border-white/10">
            <div className="mb-2.5">
              <label className="text-xs font-semibold uppercase opacity-60 block">Real-Time Clock Options</label>
              <p className="text-[11px] opacity-40">Customize your full-screen clock display format and subtitle.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-transparent hover:border-white/15 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🕒</span>
                  <div>
                    <div className="text-sm font-semibold opacity-90">24-Hour Format</div>
                    <div className="text-[10px] opacity-50">{clockIs24h ? 'Military / 24-hour time' : '12-hour AM/PM time'}</div>
                  </div>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={clockIs24h}
                  onClick={toggleClockIs24h}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    clockIs24h
                      ? 'bg-white border-white text-black shadow-sm'
                      : 'bg-white/5 border-white/20 hover:border-white/40'
                  }`}
                >
                  {clockIs24h && <Check size={12} strokeWidth={3.5} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-transparent hover:border-white/15 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📅</span>
                  <div>
                    <div className="text-sm font-semibold opacity-90">Date & Day Subtitle</div>
                    <div className="text-[10px] opacity-50">Show weekday & date under the clock digits</div>
                  </div>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={clockShowDate}
                  onClick={toggleClockShowDate}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    clockShowDate
                      ? 'bg-white border-white text-black shadow-sm'
                      : 'bg-white/5 border-white/20 hover:border-white/40'
                  }`}
                >
                  {clockShowDate && <Check size={12} strokeWidth={3.5} />}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Floating HUD Buttons */}
          <div className="pt-4 border-t border-white/10">
            <div className="mb-2.5">
              <label className="text-xs font-semibold uppercase opacity-60 block">Bottom HUD Buttons</label>
              <p className="text-[11px] opacity-40">Toggle the floating buttons at the bottom corners of your screen.</p>
            </div>
            <div className="space-y-2">
              {[
                {
                  id: 'goal',
                  name: 'Pomodoro Goal Tracker',
                  desc: 'Bottom-Left floating tomato tally & goal pill',
                  icon: '🍅',
                  checked: showGoalTracker,
                  onChange: () => toggleHudButton('goal')
                },
                {
                  id: 'todo',
                  name: 'Todo Tasks Pill',
                  desc: 'Bottom-Left floating session tasks pill',
                  icon: '📝',
                  checked: showTodoPill,
                  onChange: () => toggleHudButton('todo')
                },
                {
                  id: 'music',
                  name: 'Ambient Sounds Button',
                  desc: 'Bottom-Right floating audio player button',
                  icon: '🎵',
                  checked: showMusicButton,
                  onChange: () => toggleHudButton('music')
                },
                {
                  id: 'fullscreen',
                  name: 'Fullscreen Button',
                  desc: 'Bottom-Right floating fullscreen toggle button',
                  icon: '⛶',
                  checked: showFullscreenButton,
                  onChange: () => toggleHudButton('fullscreen')
                },
                {
                  id: 'layout',
                  name: 'Layout & Sizing Button',
                  desc: 'Bottom-Right floating layout panel button',
                  icon: '🎛️',
                  checked: showLayoutButton,
                  onChange: () => toggleHudButton('layout')
                },
              ].map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-transparent hover:border-white/15 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{b.icon}</span>
                    <div>
                      <div className="text-sm font-semibold opacity-90">{b.name}</div>
                      <div className="text-[10px] opacity-50">{b.desc}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={b.checked}
                    onClick={b.onChange}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      b.checked
                        ? 'bg-white border-white text-black shadow-sm'
                        : 'bg-white/5 border-white/20 hover:border-white/40'
                    }`}
                  >
                    {b.checked && <Check size={12} strokeWidth={3.5} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Widgets (Drag to Reorder & Toggle) */}
          <div className="pt-4 border-t border-white/10">
            <div className="mb-3">
              <label className="text-xs font-semibold uppercase opacity-60 block">Dashboard Widgets</label>
              <p className="text-[11px] opacity-40">Drag items up or down to reorder, and toggle checkboxes to show/hide.</p>
            </div>
            <Reorder.Group
              axis="y"
              values={orderedWidgets}
              onReorder={(newOrder) => setWidgetOrder(newOrder)}
              className="space-y-2 select-none"
            >
              {orderedWidgets.map((widgetId) => {
                const w = ALL_AVAILABLE_WIDGETS.find((item) => item.id === widgetId);
                if (!w) return null;
                const isActive = activeWidgets.includes(w.id);

                return (
                  <Reorder.Item
                    key={w.id}
                    value={w.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                      isActive
                        ? 'bg-white/10 border-white/20 text-white shadow-sm'
                        : 'bg-white/[0.03] border-white/5 text-white/40'
                    }`}
                    whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 50 }}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-white/40 hover:text-white/80 cursor-grab" />
                      <span className="text-base">{w.icon}</span>
                      <span className="text-sm font-semibold">{w.name}</span>
                    </div>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWidget(w.id);
                      }}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-white border-white text-black shadow-sm'
                          : 'bg-white/5 border-white/20 hover:border-white/40'
                      }`}
                    >
                      {isActive && <Check size={12} strokeWidth={3.5} />}
                    </button>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </div>
          </div>
        </CurvedScrollContainer>
      </div>
    </>
  );
};

