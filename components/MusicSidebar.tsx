'use client';

import React, { useState } from 'react';
import { X, Music, Play, Pause, Volume2 } from 'lucide-react';
import { useMusicStore, AMBIENT_TRACKS } from '@/store/useMusicStore';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';

export const MusicSidebar = () => {
  const { playingTrack, isPlaying, volume, setVolume, togglePlayTrack } = useMusicStore();
  const { activeSidebar, setActiveSidebar } = usePreferencesStore();

  const isOpen = activeSidebar === 'music';
  const setIsOpen = (open: boolean) => setActiveSidebar(open ? 'music' : 'none');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      <div 
        className="fixed top-0 right-0 h-full w-[350px] max-w-full z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto p-8 shadow-2xl border-l border-white/10 text-white rounded-l-3xl select-none"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 60px))',
          backgroundColor: 'rgba(9, 9, 11, 0.82)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: 'inset 1px 0 0 0 rgba(255, 255, 255, 0.08), -12px 0 40px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
        }}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="flex items-center gap-2.5 mb-8">
          <Music size={20} className="text-white" />
          <h2 className="text-2xl font-light text-white tracking-tight">Ambient Sounds</h2>
        </div>
        
        <div className="flex flex-col gap-3">
          {AMBIENT_TRACKS.map(track => {
            const isThisPlaying = isPlaying && playingTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => togglePlayTrack(track.id)}
                className={`p-4 rounded-2xl text-left font-semibold transition-all border flex items-center justify-between ${
                  isThisPlaying 
                    ? 'bg-white text-black border-white shadow-xl scale-[1.02]' 
                    : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{track.icon}</span>
                  <span>{track.label}</span>
                </div>
                {isThisPlaying ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/10 text-black">
                      Playing
                    </span>
                    <Pause size={16} />
                  </div>
                ) : (
                  <Play size={16} className="opacity-40" />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-white/60 font-bold tracking-wider flex items-center gap-1.5">
              <Volume2 size={14} /> Volume
            </span>
            <span className="font-mono text-xs text-white/70">{Math.round(volume * 100)}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>
    </>
  );
};
