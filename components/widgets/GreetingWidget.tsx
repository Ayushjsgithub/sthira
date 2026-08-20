'use client';

import React, { useState, useEffect } from 'react';
import { usePreferencesStore } from '@/store/usePreferencesStore';

export const GreetingWidget = () => {
  const { userName } = usePreferencesStore();
  const [greeting, setGreeting] = useState('Good day');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const trimmedName = userName?.trim();

  return (
    <div className="flex items-center justify-center h-full w-full transition-all duration-500">
      <h2 className="text-3xl font-light tracking-wide text-foreground opacity-90 drop-shadow-sm">
        {greeting}{trimmedName ? <>, <span className="font-medium">{trimmedName}</span></> : ''}.
      </h2>
    </div>
  );
};
