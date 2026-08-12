'use client';

import { useEffect } from 'react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { PRESET_THEMES } from '@/lib/themes';

export function useThemeEngine() {
  const { theme } = usePreferencesStore();

  useEffect(() => {
    const root = document.documentElement;
    let variables = theme.variables;

    if (theme.preset !== 'custom') {
      variables = PRESET_THEMES[theme.preset];
    }

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, [theme]);
}
