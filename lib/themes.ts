import { ThemeConfig } from '@/store/usePreferencesStore';

export const PRESET_THEMES: Record<string, NonNullable<ThemeConfig['variables']>> = {
  oled: {
    '--bg-primary': '#000000',
    '--text-primary': '#ffffff',
    '--accent-color': '#ffffff',
    '--glass-opacity': '5%',
    '--glass-border': 'rgba(255, 255, 255, 0.1)',
  },
  'lo-fi': {
    '--bg-primary': '#121212',
    '--text-primary': '#f4f4f5',
    '--accent-color': '#ffffff',
    '--glass-opacity': '6%',
    '--glass-border': 'rgba(255, 255, 255, 0.08)',
  },
  'pastel-purple': {
    '--bg-primary': '#ebe4f6',
    '--text-primary': '#241933',
    '--accent-color': '#7c3aed',
    '--glass-opacity': '8%',
    '--glass-border': 'rgba(36, 25, 51, 0.12)',
  },
  purple: {
    '--bg-primary': '#ebe4f6',
    '--text-primary': '#241933',
    '--accent-color': '#7c3aed',
    '--glass-opacity': '8%',
    '--glass-border': 'rgba(36, 25, 51, 0.12)',
  },
  'pastel-cream': {
    '--bg-primary': '#f7f2e8',
    '--text-primary': '#2a2421',
    '--accent-color': '#b85d19',
    '--glass-opacity': '7%',
    '--glass-border': 'rgba(42, 36, 33, 0.12)',
  },
  cream: {
    '--bg-primary': '#f7f2e8',
    '--text-primary': '#2a2421',
    '--accent-color': '#b85d19',
    '--glass-opacity': '7%',
    '--glass-border': 'rgba(42, 36, 33, 0.12)',
  },
};
