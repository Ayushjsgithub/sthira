'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCelebrationStore } from '@/store/useCelebrationStore';

export const CelebrationToast = () => {
  const { currentCelebration, clearCelebration } = useCelebrationStore();

  useEffect(() => {
    if (currentCelebration) {
      const timer = setTimeout(() => {
        clearCelebration();
      }, 6500);
      return () => clearTimeout(timer);
    }
  }, [currentCelebration, clearCelebration]);

  return (
    <div className="fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none select-none max-w-xl w-[94vw] sm:w-auto px-2">
      <AnimatePresence>
        {currentCelebration && (
          <motion.div
            key={currentCelebration.id}
            initial={{ opacity: 0, y: -25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-auto liquid-glass text-foreground p-3.5 sm:p-4 px-4 sm:px-6 rounded-2xl sm:rounded-3xl shadow-2xl flex items-start sm:items-center gap-3.5 border border-foreground/20 backdrop-blur-2xl max-w-xl"
          >
            <span className="text-2xl sm:text-3xl shrink-0 drop-shadow-md mt-0.5 sm:mt-0">
              {currentCelebration.icon}
            </span>
            <div className="flex-1 min-w-0 pr-1">
              <div className="text-sm sm:text-base font-bold text-foreground leading-snug break-words">
                {currentCelebration.title}
              </div>
              <div className="text-xs sm:text-sm text-foreground/80 leading-normal mt-0.5 break-words">
                {currentCelebration.subtitle}
              </div>
            </div>
            <button
              onClick={clearCelebration}
              className="p-1.5 rounded-full hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors cursor-pointer shrink-0 ml-1 mt-0.5 sm:mt-0"
              aria-label="Dismiss celebration"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
