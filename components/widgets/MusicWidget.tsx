'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Music } from 'lucide-react';
import { useMusicStore, AMBIENT_TRACKS } from '@/store/useMusicStore';

export const MusicWidget = () => {
  const { playingTrack, isPlaying, volume, setVolume, togglePlayTrack, togglePlay } = useMusicStore();

  const currentTrack = AMBIENT_TRACKS.find((t) => t.id === playingTrack) || AMBIENT_TRACKS[0];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center p-4 rounded-2xl bg-foreground/[0.04] hover:bg-foreground/[0.06] backdrop-blur-xl border border-foreground/10 hover:border-foreground/20 text-foreground transition-all select-none shadow-sm">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music size={15} className="text-foreground/70" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/80">Ambient Sound</span>
        </div>

        {/* Live Audio Visualizer Bars */}
        <div className="flex items-end gap-1 h-3.5 px-2 py-0.5 rounded-full bg-foreground/[0.06]">
          {[0.6, 1.0, 0.4, 0.8].map((delay, i) => (
            <motion.div
              key={i}
              animate={
                isPlaying
                  ? { height: ['3px', '12px', '4px', '10px', '3px'] }
                  : { height: '3px' }
              }
              transition={
                isPlaying
                  ? { duration: 0.8 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
              className="w-1 bg-foreground rounded-full opacity-80"
            />
          ))}
        </div>
      </div>

      {/* Sound Chips Row */}
      <div className="w-full grid grid-cols-3 gap-2 mb-3">
        {AMBIENT_TRACKS.map((track) => {
          const isThisActive = playingTrack === track.id;
          const isThisPlaying = isThisActive && isPlaying;

          return (
            <button
              key={track.id}
              onClick={() => togglePlayTrack(track.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                isThisPlaying
                  ? 'bg-white text-black font-bold border-white shadow-md scale-[1.02]'
                  : isThisActive
                  ? 'bg-foreground/15 text-foreground border-foreground/30'
                  : 'bg-foreground/[0.04] text-foreground/70 border-transparent hover:bg-foreground/[0.08] hover:text-foreground'
              }`}
            >
              <span className="text-sm">{track.icon}</span>
              <span>{track.label}</span>
            </button>
          );
        })}
      </div>

      {/* Player Controls & Volume */}
      <div className="w-full flex items-center justify-between pt-2 border-t border-foreground/10 gap-3">
        {/* Play/Pause Master Button */}
        <button
          onClick={togglePlay}
          className="px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs flex items-center gap-1.5 hover:bg-white/90 transition-all active:scale-95 shadow-sm"
        >
          {isPlaying ? (
            <>
              <Pause size={13} fill="currentColor" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play size={13} fill="currentColor" className="ml-0.5" />
              <span>Play {currentTrack.label}</span>
            </>
          )}
        </button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 flex-1 max-w-[160px]">
          <Volume2 size={13} className="text-foreground/50 shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-foreground/20 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <span className="font-mono text-[10px] text-foreground/50 w-6 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
