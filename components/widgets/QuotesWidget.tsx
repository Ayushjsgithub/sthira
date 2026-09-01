'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerStore } from '@/store/useTimerStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';

const FONT_CLASSES = {
  'default': 'font-mono tracking-tight leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl',
  'minimal': 'font-sans tracking-tight leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl text-pretty',
  'serif': 'font-serif tracking-normal leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl text-pretty',
  'handwritten': 'font-halo tracking-wider leading-[0.9] text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  'minimal-light': 'font-sans tracking-widest font-extralight leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl text-pretty',
  'serif-condensed': 'font-serif tracking-tighter font-light leading-relaxed text-base sm:text-lg md:text-xl lg:text-2xl text-pretty',
  'press-start': 'font-press-start tracking-normal leading-loose text-[10px] sm:text-xs md:text-sm lg:text-base',
  'workbench': 'font-workbench tracking-normal leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg text-pretty',
  'ndot': 'font-ndot tracking-normal leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl text-pretty'
};

const QUOTES = [
  { text: "You can overcome anything, if and only if you love something enough.", author: "Lionel Messi" },
  { text: "I start early, and I stay late, day after day, year after year. It took me 17 years and 114 days to become an overnight success.", author: "Lionel Messi" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Focus is a matter of deciding what things you're not going to do.", author: "John Carmack" },
  { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

export const QuotesWidget = () => {
  const { isRunning } = useTimerStore();
  const quoteFont = usePreferencesStore((state) => state.quoteFont || 'handwritten');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setQuoteIndex((prev) => {
          let next = Math.floor(Math.random() * QUOTES.length);
          while (next === prev) {
            next = Math.floor(Math.random() * QUOTES.length);
          }
          return next;
        });
      }, 20000); // Rotate every 20 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const currentQuote = QUOTES[quoteIndex];
  const fontClass = FONT_CLASSES[quoteFont as keyof typeof FONT_CLASSES] || FONT_CLASSES['handwritten'];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl lg:max-w-5xl px-4 py-2 sm:py-3 text-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col items-center w-full"
        >
          <p className={`${fontClass} text-foreground/90 drop-shadow-sm w-full`}>
            "{currentQuote.text}"
          </p>
          <span className="mt-2 text-[9px] sm:text-[10px] text-foreground/50 tracking-widest uppercase font-mono font-medium italic drop-shadow-sm">
            — {currentQuote.author}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
