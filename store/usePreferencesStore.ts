import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export const DEFAULT_LAYOUTS: Record<string, LayoutItem[]> = {
  lg: [
    { i: 'greeting', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'quotes', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'timer', x: 3, y: 0, w: 6, h: 6, minW: 4, minH: 4, maxH: 6 },
  ],
  md: [
    { i: 'greeting', x: 0, y: 0, w: 5, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'quotes', x: 5, y: 0, w: 5, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'timer', x: 2, y: 2, w: 6, h: 4, minW: 4, minH: 4, maxH: 6 },
  ],
  sm: [
    { i: 'greeting', x: 0, y: 0, w: 6, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'timer', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 4, maxH: 6 },
    { i: 'quotes', x: 0, y: 6, w: 6, h: 2, minW: 2, minH: 1, maxH: 4 },
  ],
  xs: [
    { i: 'greeting', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'timer', x: 0, y: 2, w: 4, h: 4, minW: 3, minH: 3, maxH: 6 },
    { i: 'quotes', x: 0, y: 6, w: 4, h: 2, minW: 2, minH: 1, maxH: 4 },
  ],
  xxs: [
    { i: 'greeting', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 1, maxH: 4 },
    { i: 'timer', x: 0, y: 2, w: 2, h: 4, minW: 2, minH: 3, maxH: 6 },
    { i: 'quotes', x: 0, y: 6, w: 2, h: 2, minW: 2, minH: 1, maxH: 4 },
  ],
};

export const DEFAULT_LAYOUT: LayoutItem[] = DEFAULT_LAYOUTS.lg;

export interface ThemeConfig {
  preset: 'oled' | 'lo-fi' | 'minimal' | 'pastel-purple' | 'pastel-cream' | 'purple' | 'cream' | 'custom';
  variables?: {
    '--bg-primary': string;
    '--text-primary': string;
    '--accent-color': string;
    '--glass-opacity'?: string;
    '--glass-border'?: string;
  };
  background?: {
    type: 'none' | 'image' | 'video' | 'youtube';
    url?: string;
    dimmer?: number;
    blur?: number;
    textColor?: 'light' | 'dark';
    quality?: 'auto' | 'highres' | 'hd1440' | 'hd1080' | 'hd720' | 'large' | 'medium';
  };
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface PreferencesState {
  theme: ThemeConfig;
  goal: number;
  userName: string;
  completedPomodoros: number;
  timerDurations: {
    work: number;
    shortBreak: number;
    longBreak: number;
  };
  autoStart: boolean;
  alertSound: string;
  sessionTally: string;
  timerStyle: 'default' | 'flip' | 'progress' | 'gauge' | 'dotMatrix' | 'pie' | 'concentric' | 'typographic' | 'analog';
  timerFont: 'default' | 'minimal' | 'serif' | 'handwritten' | 'minimal-light' | 'serif-condensed' | 'press-start' | 'workbench' | 'ndot';
  timerFontWeight: number;
  isEditingLayout: boolean;
  activeWidgets: string[];
  widgetOrder: string[];
  layout: LayoutItem[];
  layouts: Record<string, LayoutItem[]>;
  widgetScale: number;
  timerScale: number;
  quoteScale: number;
  showGoalTracker: boolean;
  showTodoPill: boolean;
  showMusicButton: boolean;
  showLayoutButton: boolean;
  showFullscreenButton: boolean;
  showShortcutsModal: boolean;
  todos: TodoItem[];
  activeSidebar: 'none' | 'settings' | 'music' | 'layout';
  setActiveSidebar: (sidebar: 'none' | 'settings' | 'music' | 'layout') => void;
  setShowShortcutsModal: (show: boolean) => void;
  setShowGoalTracker: (show: boolean) => void;
  setShowTodoPill: (show: boolean) => void;
  setShowMusicButton: (show: boolean) => void;
  setShowLayoutButton: (show: boolean) => void;
  setShowFullscreenButton: (show: boolean) => void;
  toggleHudButton: (key: 'goal' | 'todo' | 'music' | 'layout' | 'fullscreen') => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompletedTodos: () => void;
  updateLayout: (layout: LayoutItem[]) => void;
  updateLayouts: (layouts: Record<string, LayoutItem[]>) => void;
  resetLayout: () => void;
  setWidgetOrder: (order: string[]) => void;
  swapWidgets: () => void;
  setWidgetScale: (scale: number) => void;
  setTimerScale: (scale: number) => void;
  setQuoteScale: (scale: number) => void;
  setTheme: (theme: ThemeConfig) => void;
  setGoal: (goal: number) => void;
  setUserName: (name: string) => void;
  incrementCompleted: () => void;
  setCompletedPomodoros: (count: number) => void;
  resetCompleted: () => void;
  setTimerDurations: (durations: { work: number; shortBreak: number; longBreak: number; }) => void;
  setAutoStart: (autoStart: boolean) => void;
  setAlertSound: (sound: string) => void;
  setSessionTally: (tally: string) => void;
  setTimerStyle: (style: 'default' | 'flip' | 'progress' | 'gauge' | 'dotMatrix' | 'pie') => void;
  setTimerFont: (font: 'default' | 'minimal' | 'serif' | 'handwritten' | 'minimal-light' | 'serif-condensed' | 'press-start' | 'workbench' | 'ndot') => void;
  setTimerFontWeight: (weight: number) => void;
  setIsEditingLayout: (isEditing: boolean) => void;
  toggleWidget: (widgetId: string) => void;
  setBgDimmer: (dimmer: number) => void;
  setBgBlur: (blur: number) => void;
  setYtQuality: (quality: 'auto' | 'highres' | 'hd1440' | 'hd1080' | 'hd720' | 'large' | 'medium') => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      layout: DEFAULT_LAYOUTS.lg,
      layouts: DEFAULT_LAYOUTS,
      theme: {
        preset: 'oled',
        variables: {
          '--bg-primary': '#302c31',
          '--text-primary': '#ffffff',
          '--accent-color': '#f8f1ea',
          '--glass-opacity': '0.05',
          '--glass-border': 'rgba(255, 255, 255, 0.1)'
        },
        background: { type: 'image', url: '/wallpapers/green-fern-fronds.jpg', dimmer: 0, blur: 0 }
      },
      goal: 4,
      userName: 'messi',
      completedPomodoros: 0,
      timerDurations: { work: 25, shortBreak: 5, longBreak: 15 },
      autoStart: true,
      alertSound: 'success',
      sessionTally: 'leaf',
      timerStyle: 'flip',
      timerFont: 'default',
      timerFontWeight: 0,
      isEditingLayout: false,
      showGoalTracker: true,
      showTodoPill: true,
      showMusicButton: true,
      showLayoutButton: true,
      showFullscreenButton: true,
      showShortcutsModal: false,
      todos: [],
      activeWidgets: ['greeting', 'timer', 'quotes', 'controls', 'focusBreak'],
      widgetOrder: ['focusBreak', 'timer', 'controls', 'quotes', 'goals'],
      widgetScale: 1.35,
      timerScale: 1.45,
      quoteScale: 1.9,
      activeSidebar: 'none',
      setActiveSidebar: (sidebar) => set({ activeSidebar: sidebar }),
      setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),
      setShowGoalTracker: (show) => set({ showGoalTracker: show }),
      setShowTodoPill: (show) => set({ showTodoPill: show }),
      setShowMusicButton: (show) => set({ showMusicButton: show }),
      setShowLayoutButton: (show) => set({ showLayoutButton: show }),
      setShowFullscreenButton: (show) => set({ showFullscreenButton: show }),
      toggleHudButton: (key) => set((state) => {
        if (key === 'goal') return { showGoalTracker: !state.showGoalTracker };
        if (key === 'todo') return { showTodoPill: !state.showTodoPill };
        if (key === 'music') return { showMusicButton: !state.showMusicButton };
        if (key === 'layout') return { showLayoutButton: !state.showLayoutButton };
        if (key === 'fullscreen') return { showFullscreenButton: !state.showFullscreenButton };
        return {};
      }),
      addTodo: (text) => set((state) => ({
        todos: [
          ...state.todos,
          { id: Math.random().toString(36).substring(2, 9), text: text.trim(), completed: false, createdAt: Date.now() }
        ]
      })),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      })),
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((t) => t.id !== id)
      })),
      clearCompletedTodos: () => set((state) => ({
        todos: state.todos.filter((t) => !t.completed)
      })),
      setWidgetOrder: (order) => set({ widgetOrder: order }),
      swapWidgets: () => set((state) => ({
        widgetOrder: state.widgetOrder.length > 1
          ? [state.widgetOrder[1], state.widgetOrder[0], ...state.widgetOrder.slice(2)]
          : state.widgetOrder
      })),
      setWidgetScale: (scale) => set({ widgetScale: Math.max(0.4, Math.min(2.5, scale)) }),
      setTimerScale: (scale) => set({ timerScale: Math.max(0.4, Math.min(2.5, scale)) }),
      setQuoteScale: (scale) => set({ quoteScale: Math.max(0.4, Math.min(2.5, scale)) }),
      updateLayout: (layout) => set((state) => ({ 
        layout, 
        layouts: { ...state.layouts, lg: layout } 
      })),
      updateLayouts: (layouts) => set({ layouts, layout: layouts.lg || DEFAULT_LAYOUTS.lg }),
      resetLayout: () => set({ 
        layout: DEFAULT_LAYOUTS.lg, 
        layouts: DEFAULT_LAYOUTS, 
        showGoalTracker: true,
        showTodoPill: true,
        showMusicButton: true,
        showLayoutButton: true,
        showFullscreenButton: true,
        activeWidgets: ['focusBreak', 'timer', 'controls', 'quotes'],
        widgetOrder: ['focusBreak', 'timer', 'controls', 'quotes', 'goals'],
        widgetScale: 1.0,
        timerScale: 1.0,
        quoteScale: 1.0,
      }),
      setTheme: (theme) => set({ theme }),
      setGoal: (goal) => set({ goal }),
      setUserName: (name) => set({ userName: name }),
      incrementCompleted: () => set((state) => ({ completedPomodoros: state.completedPomodoros + 1 })),
      setCompletedPomodoros: (count) => set({ completedPomodoros: Math.max(0, count) }),
      resetCompleted: () => set({ completedPomodoros: 0 }),
      setTimerDurations: (timerDurations) => set({ timerDurations }),
      setAutoStart: (autoStart) => set({ autoStart }),
      setAlertSound: (alertSound) => set({ alertSound }),
      setSessionTally: (sessionTally) => set({ sessionTally }),
      setTimerStyle: (timerStyle) => set({ timerStyle }),
      setTimerFont: (timerFont) => set({ timerFont }),
      setTimerFontWeight: (timerFontWeight) => set({ timerFontWeight }),
      setIsEditingLayout: (isEditing) => set({ isEditingLayout: isEditing }),
      toggleWidget: (widgetId) => set((state) => ({
        activeWidgets: state.activeWidgets.includes(widgetId)
          ? state.activeWidgets.filter(id => id !== widgetId)
          : [...state.activeWidgets, widgetId]
      })),
      setBgDimmer: (dimmer) => set((state) => ({
        theme: {
          ...state.theme,
          background: state.theme.background 
            ? { ...state.theme.background, dimmer }
            : { type: 'none', url: '', dimmer, blur: 0 }
        }
      })),
      setBgBlur: (blur) => set((state) => ({
        theme: {
          ...state.theme,
          background: state.theme.background 
            ? { ...state.theme.background, blur }
            : { type: 'none', url: '', dimmer: 50, blur }
        }
      })),
      setYtQuality: (quality) => set((state) => ({
        theme: {
          ...state.theme,
          background: state.theme.background
            ? { ...state.theme.background, quality }
            : { type: 'none', url: '', dimmer: 50, blur: 0, quality }
        }
      }))
    }),
    {
      name: 'sthira-preferences',
      version: 3,
      partialize: (state) => {
        const bgUrl = state.theme.background?.url;
        if (bgUrl?.startsWith('data:image/') || bgUrl?.startsWith('blob:')) {
          return {
            ...state,
            theme: {
              ...state.theme,
              background: {
                ...state.theme.background,
                url: '/wallpapers/green-fern-fronds.jpg'
              }
            }
          };
        }
        return state;
      },
      migrate: (persistedState: any, version: number) => {
        const state = {
          ...persistedState,
          layouts: DEFAULT_LAYOUTS,
          layout: DEFAULT_LAYOUTS.lg,
        };

        if (version < 3) {
          const active: string[] = state.activeWidgets ? [...state.activeWidgets] : ['focusBreak', 'timer', 'quotes'];
          if (!active.includes('controls')) {
            const timerIdx = active.indexOf('timer');
            if (timerIdx !== -1) {
              active.splice(timerIdx + 1, 0, 'controls');
            } else {
              active.push('controls');
            }
          }

          const order: string[] = state.widgetOrder ? [...state.widgetOrder] : ['focusBreak', 'timer', 'quotes', 'goals'];
          if (!order.includes('controls')) {
            const timerIdx = order.indexOf('timer');
            if (timerIdx !== -1) {
              order.splice(timerIdx + 1, 0, 'controls');
            } else {
              order.push('controls');
            }
          }

          state.activeWidgets = active;
          state.widgetOrder = order;
        }

        return state;
      }
    }
  )
);
