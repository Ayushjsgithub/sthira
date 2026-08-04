import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AmbientTrack {
  id: string;
  label: string;
  icon: string;
  url: string;
}

export const AMBIENT_TRACKS: AmbientTrack[] = [
  { id: 'rain', label: 'Rain', icon: '🌧️', url: '/sounds/rain.mp3' },
  { id: 'forest', label: 'Forest', icon: '🌲', url: '/sounds/forest.mp3' },
  { id: 'fire', label: 'Fireplace', icon: '🔥', url: '/sounds/fireplace.mp3' },
];

interface MusicState {
  playingTrack: string | null;
  isPlaying: boolean;
  volume: number;
  setPlayingTrack: (trackId: string | null) => void;
  togglePlayTrack: (trackId: string) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      playingTrack: null,
      isPlaying: false,
      volume: 0.35,

      setPlayingTrack: (trackId) => {
        set({
          playingTrack: trackId,
          isPlaying: trackId !== null,
        });
      },

      togglePlayTrack: (trackId) => {
        const { playingTrack, isPlaying } = get();
        if (playingTrack === trackId) {
          set({ isPlaying: !isPlaying });
        } else {
          set({ playingTrack: trackId, isPlaying: true });
        }
      },

      togglePlay: () => {
        const { isPlaying, playingTrack } = get();
        if (!playingTrack) {
          set({ playingTrack: AMBIENT_TRACKS[0].id, isPlaying: true });
        } else {
          set({ isPlaying: !isPlaying });
        }
      },

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    }),
    {
      name: 'sthira-music-settings',
    }
  )
);
