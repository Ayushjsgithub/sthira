import { usePreferencesStore } from '@/store/usePreferencesStore';

const FONT_CLASSES = {
  'default': { wrapper: 'font-mono font-light tracking-tighter', digits: 'font-semibold' },
  'minimal': { wrapper: 'font-sans tracking-tight', digits: 'font-medium' },
  'serif': { wrapper: 'font-serif tracking-normal', digits: 'font-medium' },
  'handwritten': { wrapper: 'font-halo tracking-wider', digits: 'font-normal' },
  'minimal-light': { wrapper: 'font-sans tracking-widest', digits: 'font-extralight' },
  'serif-condensed': { wrapper: 'font-serif tracking-tighter', digits: 'font-light' },
  'press-start': { wrapper: 'font-press-start tracking-normal', digits: 'font-normal' },
  'workbench': { wrapper: 'font-workbench tracking-normal', digits: 'font-normal' },
  'ndot': { wrapper: 'font-ndot tracking-normal', digits: 'font-normal' }
};

export const useTimerTypography = () => {
  const timerFont = usePreferencesStore((state) => state.timerFont || 'default');
  const timerFontWeight = usePreferencesStore((state) => state.timerFontWeight || 0);
  const fontStyle = FONT_CLASSES[timerFont as keyof typeof FONT_CLASSES] || FONT_CLASSES['default'];
  
  const isVariableFont = timerFont === 'default' || timerFont === 'minimal' || timerFont === 'minimal-light';
  let syntheticWeightStyle: React.CSSProperties = {};
  if (!isVariableFont && timerFontWeight > 400) {
    const extraWeight = timerFontWeight - 400;
    const strokePx = (extraWeight / 500) * 2.5; 
    syntheticWeightStyle = { WebkitTextStroke: `${strokePx}px currentColor` } as any;
  }

  const customWeightStyle: React.CSSProperties = {
    ...(timerFontWeight > 0 ? { fontWeight: timerFontWeight, ...syntheticWeightStyle } : {}),
    ...(timerFont === 'press-start' ? { zoom: 0.65 } as any : {}),
    ...(timerFont === 'workbench' ? { zoom: 0.85 } as any : {})
  };

  const weightClass = timerFontWeight === 0 ? fontStyle.digits : '';

  return {
    wrapperClass: fontStyle.wrapper,
    digitsClass: weightClass,
    customStyle: customWeightStyle,
  };
};
