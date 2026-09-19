'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { TimerWidget } from './TimerWidget';
import { ClockWidget } from './ClockWidget';
import { ControlsWidget } from './ControlsWidget';
import { QuotesWidget } from './QuotesWidget';
import { FocusBreakWidget } from './FocusBreakWidget';
import { GoalsWidget } from './GoalsWidget';
import { usePomodoro } from '@/hooks/usePomodoro';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useThemeEngine } from '@/hooks/useThemeEngine';
import { useFullscreenInactivityStore } from '@/hooks/useFullscreenInactivity';

export const DashboardGrid = () => {
  usePomodoro();
  useKeyboardShortcuts();
  useThemeEngine();

  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);

  const { isFullscreen, isInactive } = useFullscreenInactivityStore();

  const {
    activeWidgets,
    widgetOrder = ['focusBreak', 'timer', 'controls', 'quotes'],
    timerScale = 1.0,
    quoteScale = 1.0,
    timerStyle,
  } = usePreferencesStore();

  const effectiveWidgets = mounted ? (activeWidgets || ['focusBreak', 'timer', 'controls', 'quotes']) : ['focusBreak', 'timer', 'controls', 'quotes'];
  const baseOrder = widgetOrder && widgetOrder.length > 0 ? widgetOrder : ['focusBreak', 'timer', 'controls', 'quotes', 'goals'];
  const mergedOrder = Array.from(new Set([...baseOrder, ...effectiveWidgets]));
  const currentOrder = mergedOrder.filter((id) => effectiveWidgets.includes(id));
  const effectiveTimerScale = mounted ? timerScale || 1.0 : 1.0;
  const effectiveQuoteScale = mounted ? quoteScale || 1.0 : 1.0;

  const checkFit = useCallback(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    // Available viewport bounds within <main>
    const availW = wrapper.clientWidth;
    const availH = wrapper.clientHeight;

    if (availW <= 0 || availH <= 0) return;

    // Safety margins (24px horizontal, 24px vertical) so widgets never touch edge/headers
    const safeW = Math.max(100, availW - 24);
    const safeH = Math.max(100, availH - 24);

    // Measure the actual maximum width and height across the container and all child elements
    let maxChildW = content.scrollWidth;
    let maxChildH = content.scrollHeight;

    Array.from(content.children).forEach((child) => {
      const el = child as HTMLElement;
      if (el) {
        maxChildW = Math.max(maxChildW, el.scrollWidth, el.offsetWidth, el.clientWidth);
        maxChildH = Math.max(maxChildH, el.scrollHeight, el.offsetHeight);
      }
    });

    const contentW = Math.max(content.offsetWidth, maxChildW);
    const contentH = Math.max(content.offsetHeight, maxChildH);

    if (contentW <= 0 || contentH <= 0) return;

    const scaleX = safeW / contentW;
    const scaleY = safeH / contentH;

    // Shrink if needed so content strictly fits within safe bounds both horizontally and vertically
    const calculatedScale = Math.min(1, scaleX, scaleY);
    const roundedScale = Math.round(calculatedScale * 1000) / 1000;

    setFitScale(roundedScale);
  }, []);

  useEffect(() => {
    setMounted(true);
    checkFit();

    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    const observer = new ResizeObserver(() => {
      checkFit();
    });

    if (wrapper) observer.observe(wrapper);
    if (content) observer.observe(content);

    window.addEventListener('resize', checkFit);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkFit);
    };
  }, [checkFit]);

  // Recalculate fit immediately whenever widget scale, count, or style changes
  useEffect(() => {
    // Run on next frame to ensure layout reflow has occurred
    const raf = requestAnimationFrame(() => {
      checkFit();
    });
    return () => cancelAnimationFrame(raf);
  }, [effectiveTimerScale, effectiveQuoteScale, effectiveWidgets, currentOrder, timerStyle, checkFit]);

  const renderWidget = (id: string) => {
    switch (id) {
      case 'timer':
        return (
          <div
            style={{
              zoom: effectiveTimerScale !== 1 ? effectiveTimerScale : undefined,
            }}
            className="w-full flex items-center justify-center"
          >
            <TimerWidget />
          </div>
        );
      case 'clock':
        return (
          <div
            style={{
              zoom: effectiveTimerScale !== 1 ? effectiveTimerScale : undefined,
            }}
            className="w-full flex items-center justify-center"
          >
            <ClockWidget />
          </div>
        );
      case 'controls':
        return (
          <div className="w-full flex items-center justify-center">
            <ControlsWidget />
          </div>
        );
      case 'quotes':
        return (
          <div
            style={{
              zoom: effectiveQuoteScale !== 1 ? effectiveQuoteScale : undefined,
            }}
            className="w-full flex items-center justify-center"
          >
            <QuotesWidget />
          </div>
        );
      case 'focusBreak':
        return (
          <div className="w-full flex items-center justify-center">
            <FocusBreakWidget />
          </div>
        );
      case 'goals':
        return (
          <div className="w-full flex items-center justify-center">
            <GoalsWidget />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center relative overflow-hidden select-none"
    >
      <div
        style={{
          transform: fitScale !== 1 ? `scale(${fitScale})` : undefined,
          transformOrigin: 'center center',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="w-full max-w-4xl lg:max-w-5xl flex items-center justify-center"
      >
        <div
          ref={contentRef}
          className="w-full max-w-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-4"
        >
          <AnimatePresence mode="popLayout">
            {currentOrder.map((widgetId) => (
              <motion.div
                key={widgetId}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={`w-full flex items-center justify-center transition-opacity duration-700 ${
                  isFullscreen && isInactive && widgetId !== 'timer' && widgetId !== 'clock'
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
              >
                {renderWidget(widgetId)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};





