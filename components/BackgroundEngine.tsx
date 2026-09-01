'use client';

import React, { useRef, useEffect, useState } from 'react';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { useMusicStore, AMBIENT_TRACKS } from '@/store/useMusicStore';
import { normalizeImageUrl } from '@/lib/utils';

const NOISE_SVG_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export const BackgroundEngine = () => {
  const theme = usePreferencesStore((state) => state.theme);
  const { playingTrack, isPlaying, volume } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const bg = theme.background;
  const dimmerOpacity = (100 - (bg?.dimmer ?? 50)) / 100;

  // Reset image error state if URL changes
  useEffect(() => {
    setImageError(false);
    setVideoError(false);
  }, [bg?.url]);

  // Page visibility auto-pause
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current) videoRef.current.pause();
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      } else {
        if (videoRef.current) videoRef.current.play().catch(() => {});
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && playingTrack) {
      const track = AMBIENT_TRACKS.find((t) => t.id === playingTrack);
      if (track && track.url) {
        if (audio.getAttribute('src') !== track.url && !audio.src.endsWith(track.url)) {
          audio.src = track.url;
          audio.load();
        }
        audio.volume = volume;
        audio.loop = true;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            if (e.name !== 'AbortError') {
              console.warn('Ambient audio play error:', e);
            }
          });
        }
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, playingTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const hasBg = bg && bg.type && bg.type !== 'none' && typeof bg.url === 'string' && bg.url.trim().length > 0;
  const blurAmount = bg?.blur ?? 0;
  const filterStyle = blurAmount > 0 ? `blur(${blurAmount}px)` : undefined;
  const normalizedImageUrl = bg?.type === 'image' && bg.url ? normalizeImageUrl(bg.url) : (bg?.url || '');

  return (
    <>
      <audio ref={audioRef} preload="none" />
      {hasBg && (
        <div 
          className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none transition-opacity duration-1000 select-none"
          style={{ backgroundColor: 'var(--color-background)', willChange: 'opacity' }}
        >
          {(bg.type === 'image' || imageError || videoError) && (
            <img 
              src={imageError || videoError ? '/wallpapers/green-fern-fronds.jpg' : normalizedImageUrl} 
              alt="Background" 
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => {
                if (!imageError) setImageError(true);
              }}
              className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover scale-110 transition-all duration-500 pointer-events-none"
              style={{ opacity: dimmerOpacity, filter: filterStyle, willChange: 'transform, opacity, filter', zIndex: (imageError || videoError) && bg.type !== 'image' ? 10 : 0 }}
            />
          )}
          
          {bg.type === 'video' && !videoError && !imageError && (
            <video 
              ref={videoRef}
              src={bg.url} 
              autoPlay 
              loop 
              muted 
              playsInline
              onError={() => setVideoError(true)}
              className="absolute inset-0 w-full h-full min-w-full min-h-full object-cover scale-110 transition-all duration-500 pointer-events-none"
              style={{ opacity: dimmerOpacity, filter: filterStyle, willChange: 'transform, opacity, filter' }}
            />
          )}
          
          {bg.type === 'youtube' && (
            <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${bg.url}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${bg.url}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&cc_lang_pref=off&hl=en${bg.quality && bg.quality !== 'auto' ? `&vq=${bg.quality}` : ''}`}
                allow="autoplay; encrypted-media"
                tabIndex={-1}
                className="pointer-events-none transition-all duration-500 w-[max(140vw,250vh)] h-[max(80vw,140vh)] min-w-[120vw] min-h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute scale-110"
                style={{ border: 'none', opacity: dimmerOpacity, filter: filterStyle, willChange: 'transform, opacity, filter' }}
              />
            </div>
          )}

          {/* Organic Tactile Film Grain Overlay when Blurred */}
          {blurAmount > 0 && (
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay transition-opacity duration-500"
              style={{
                backgroundImage: NOISE_SVG_DATA_URI,
                opacity: Math.min(0.45, 0.15 + (blurAmount / 40) * 0.25),
              }}
            />
          )}
        </div>
      )}
    </>
  );
};
