'use client';

import React from 'react';
import { Settings, Music, SlidersHorizontal, Maximize2, Minimize2 } from 'lucide-react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useFullscreenInactivityStore, useFullscreenInactivity } from '@/hooks/useFullscreenInactivity';

export const BottomRightHud = () => {
  const {
    showMusicButton,
    showLayoutButton,
    showFullscreenButton,
    activeSidebar,
    setActiveSidebar,
  } = usePreferencesStore();

  useFullscreenInactivity();
  const { isFullscreen, isInactive, toggleFullscreen } = useFullscreenInactivityStore();

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 select-none pointer-events-auto transition-opacity duration-700 ${
        isFullscreen && isInactive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fullscreen Toggle Button */}
      {showFullscreenButton && (
        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-full liquid-glass text-foreground hover:scale-105 active:scale-95 transition-all shadow-lg drop-shadow-sm flex items-center justify-center cursor-pointer"
          aria-label={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}

      {/* Layout & Sizing Customizer Button */}
      {showLayoutButton && (
        <button
          onClick={() => setActiveSidebar(activeSidebar === 'layout' ? 'none' : 'layout')}
          className="p-3 rounded-full liquid-glass text-foreground hover:scale-105 active:scale-95 transition-all shadow-lg drop-shadow-sm flex items-center justify-center cursor-pointer"
          aria-label="Customize Layout & Sizing (L)"
        >
          <SlidersHorizontal size={20} />
        </button>
      )}

      {/* Ambient Sounds Button */}
      {showMusicButton && (
        <button
          onClick={() => setActiveSidebar(activeSidebar === 'music' ? 'none' : 'music')}
          className="p-3 rounded-full liquid-glass text-foreground hover:scale-105 active:scale-95 transition-all shadow-lg drop-shadow-sm flex items-center justify-center cursor-pointer"
          aria-label="Ambient Sounds (M)"
        >
          <Music size={20} />
        </button>
      )}

      {/* Master Settings Button */}
      <button
        onClick={() => setActiveSidebar(activeSidebar === 'settings' ? 'none' : 'settings')}
        className="p-3 rounded-full liquid-glass text-foreground hover:scale-105 active:scale-95 transition-all shadow-lg drop-shadow-sm flex items-center justify-center cursor-pointer"
        aria-label="Settings (O)"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};
