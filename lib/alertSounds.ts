'use client';

export interface AlertSoundOption {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

export const ALERT_SOUND_PRESETS: AlertSoundOption[] = [
  { id: 'chime', name: 'Crystal Chime', icon: '🔔', desc: 'Bright bell harmonic tone' },
  { id: 'bowl', name: 'Tibetan Singing Bowl', icon: '🥣', desc: 'Deep meditative resonance' },
  { id: 'piano', name: 'Soft Piano', icon: '🎹', desc: 'Gentle acoustic chord' },
  { id: 'marimba', name: 'Marimba Melody', icon: '🪵', desc: 'Warm acoustic percussion' },
  { id: 'digital', name: 'Digital Pulse', icon: '⚡', desc: 'Modern soft double beep' },
  { id: 'success', name: 'Victory Chime', icon: '🏆', desc: 'Triumphant rising fanfare' },
  { id: '/sounds/call-of-duty-modern-warfare-2-level-up-track-2.mp3', name: 'CoD Level Up', icon: '🎖️', desc: 'Modern Warfare 2 Level Up' },
  { id: '/sounds/fallout-3-level-up-sound-effects-download-link.mp3', name: 'Fallout Level Up', icon: '☢️', desc: 'Fallout 3 Level Up' },
  { id: '/sounds/final-fantasy-v-music-victory-fanfare_2.mp3', name: 'FFV Victory', icon: '⚔️', desc: 'Final Fantasy V Fanfare' },
  { id: '/sounds/final-fantasy-vii-victory-fanfare-1_dZiSUE7.mp3', name: 'FFVII Victory', icon: '🗡️', desc: 'Final Fantasy VII Fanfare' },
  { id: '/sounds/minecraft-levelup_AMhMQvb.mp3', name: 'Minecraft Level Up', icon: '🟩', desc: 'Minecraft XP Level Up' },
  { id: '/sounds/ragnarok-online-level-up-sound.mp3', name: 'Ragnarok Level Up', icon: '👼', desc: 'Ragnarok Online Level Up' },
  { id: '/sounds/super-mario-bros_DhUAiGM.mp3', name: 'Mario Clear', icon: '🍄', desc: 'Super Mario Bros Level Clear' },
  { id: 'none', name: 'Silent / Muted', icon: '🔕', desc: 'Visual only, no audio' },
];

export function playAlertSound(soundKeyOrUrl: string) {
  if (!soundKeyOrUrl || soundKeyOrUrl === 'none') return;

  // Custom audio URL or Data URI
  if (
    soundKeyOrUrl.startsWith('data:') || 
    soundKeyOrUrl.startsWith('http://') || 
    soundKeyOrUrl.startsWith('https://') || 
    soundKeyOrUrl.startsWith('/') ||
    soundKeyOrUrl.startsWith('blob:')
  ) {
    try {
      const audio = new Audio(soundKeyOrUrl);
      audio.volume = 0.85;
      audio.play().catch((err) => console.warn('Custom alert sound error:', err));
    } catch (e) {
      console.warn('Custom sound playback failed:', e);
    }
    return;
  }

  // Synthesized Web Audio API Chimes
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    switch (soundKeyOrUrl) {
      case 'chime':
      case 'sparkle': {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0, now + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.24, now + i * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.9);
        });
        break;
      }
      case 'bowl':
      case 'zen': {
        const freqs = [216, 432, 864];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.32 / (idx + 1), now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 3.3);
        });
        break;
      }
      case 'marimba': {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.35, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.65);
        });
        break;
      }
      case 'piano': {
        const freqs = [329.63, 392.00, 493.88, 659.25];
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.28, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 2.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 2.3);
        });
        break;
      }
      case 'digital': {
        [0, 0.12].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1046.5, now + offset);
          gain.gain.setValueAtTime(0.12, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.09);
        });
        break;
      }
      case 'success': {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.25, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.3);
        });
        break;
      }
      default: {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.1);
        break;
      }
    }
  } catch (err) {
    console.warn('Synthesized audio playback error:', err);
  }
}
