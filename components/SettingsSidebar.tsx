'use client';

import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import { usePreferencesStore, ThemeConfig } from '@/store/usePreferencesStore';
import { PRESET_THEMES } from '@/lib/themes';
import { 
  X, Settings, Clock, Quote, RotateCcw, SlidersHorizontal, 
  GripVertical, Upload, Image as ImageIcon, Video, 
  Trash2, Check, Sparkles, Tv, Command, Palette,
  Volume2, Bell, Smile, Download, FileUp
} from 'lucide-react';
import { Reorder } from 'framer-motion';
import { ALERT_SOUND_PRESETS, playAlertSound } from '@/lib/alertSounds';
import { normalizeImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { CurvedScrollContainer } from '@/components/ui/CurvedScrollContainer';

const POPULAR_TALLIES = [
  { id: 'tomatoes', icon: '🍅', label: 'Tomatoes' },
  { id: 'dots', icon: '⚪', label: 'Dots' },
  { id: 'hearts', icon: '❤️', label: 'Hearts' },
  { id: 'stars', icon: '⭐️', label: 'Stars' },
  { id: 'fire', icon: '🔥', label: 'Fire' },
  { id: 'coffee', icon: '☕', label: 'Coffee' },
  { id: 'lightning', icon: '⚡', label: 'Lightning' },
  { id: 'leaf', icon: '🌿', label: 'Leaf' },
  { id: 'diamond', icon: '💎', label: 'Diamond' },
  { id: 'target', icon: '🎯', label: 'Target' },
  { id: 'rocket', icon: '🚀', label: 'Rocket' },
  { id: 'code', icon: '💻', label: 'Code' },
] as const;

const PRESETS = [
  { 
    id: 'oled' as const, 
    name: 'OLED Black', 
    desc: 'Deep black background',
    bg: '#000000',
    text: '#ffffff',
    accent: '#ffffff'
  },
  { 
    id: 'lo-fi' as const, 
    name: 'Charcoal Dark', 
    desc: 'Subtle charcoal',
    bg: '#121212',
    text: '#f4f4f5',
    accent: '#ffffff'
  },
  { 
    id: 'pastel-purple' as const, 
    name: 'Pastel Purple', 
    desc: 'Soft lavender & lilac',
    bg: '#ebe4f6',
    text: '#241933',
    accent: '#7c3aed'
  },
  { 
    id: 'pastel-cream' as const, 
    name: 'Pastel Cream', 
    desc: 'Warm vanilla & linen',
    bg: '#f7f2e8',
    text: '#2a2421',
    accent: '#b85d19'
  },
  { 
    id: 'custom' as const, 
    name: 'Custom Theme', 
    desc: 'Custom studio palette',
    bg: '#09090b',
    text: '#ffffff',
    accent: '#38bdf8'
  }
];

interface YouTubePreset {
  id: string;
  name: string;
  creator: string;
  icon: string;
  desc: string;
}

const YOUTUBE_PRESETS: YouTubePreset[] = [
  { 
    id: '50kEuC0Z4Ew', 
    name: 'Ghibli Island', 
    creator: 'Mei Time', 
    icon: '🌿', 
    desc: 'Masakijima Island & coastal Japan' 
  },
  { 
    id: 'M_TOglkN_W0', 
    name: 'Japanese Garden', 
    creator: 'fukuPhotographer', 
    icon: '🏯', 
    desc: 'Rainy garden & reflection walk' 
  },
  { 
    id: 'UQ7xkmSFjqo', 
    name: 'Countryside', 
    creator: 'Gawx Art', 
    icon: '🖼️', 
    desc: 'Cinematic countryside tranquility' 
  },
  { 
    id: 'EoR4CswJIMs', 
    name: 'Mountain Biking', 
    creator: 'Mahalo my Dude', 
    icon: '🚴🏽‍♂️', 
    desc: 'Relaxing sounds of MTB trail' 
  },
  { 
    id: 'gL1Yg0a2-lw', 
    name: 'My Trail Dog', 
    creator: 'Jason Lucas', 
    icon: '🐕', 
    desc: 'Maya trail dog adventure' 
  },
  { 
    id: 'CrgbbMJwNrg', 
    name: 'Wildlife America', 
    creator: 'Nat Geo Animals', 
    icon: '🐺', 
    desc: 'North American wildlife & nature' 
  },
  { 
    id: 'iLs04Z6uBqU', 
    name: 'Tropical Storm Window', 
    creator: 'Relaxation Windows 4K', 
    icon: '⛈️', 
    desc: 'Rain, thunder & lush nature' 
  },
  { 
    id: 'wFKsZHWnrxE', 
    name: 'Morning Ride POV', 
    creator: 'Luis.Media_', 
    icon: '🚴', 
    desc: '4K morning bike ride sound POV' 
  },
  { 
    id: 'WqdgMWJWboc', 
    name: 'Rainforest Camp', 
    creator: 'Rob Hamilton', 
    icon: '🏍️', 
    desc: 'Motorcycle camping in rainforest' 
  },
  { 
    id: 'RDZlmelth7I', 
    name: 'Moody Rainy City', 
    creator: 'coolwallpaperz', 
    icon: '🏙️', 
    desc: 'Rain drops city live wallpaper 4K' 
  },
];

const YT_QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto (Recommended)', badge: 'Auto' },
  { value: 'highres', label: '4K Ultra HD (2160p)', badge: '4K' },
  { value: 'hd1440', label: '2K Quad HD (1440p)', badge: '1440p' },
  { value: 'hd1080', label: 'Full HD (1080p)', badge: '1080p' },
  { value: 'hd720', label: 'Standard HD (720p)', badge: '720p' },
  { value: 'large', label: 'SD (480p)', badge: '480p' },
  { value: 'medium', label: 'Data Saver (360p)', badge: '360p' },
] as const;

interface ImagePreset {
  url: string;
  name: string;
  author: string;
  icon: string;
  desc: string;
}

const IMAGE_PRESETS: ImagePreset[] = [
  { 
    url: '/wallpapers/tropical-banana-leaves.jpg', 
    name: 'Tropical Banana Leaves', 
    author: 'Leo Chane', 
    icon: '🍃', 
    desc: 'Lush tropical green banana fronds' 
  },
  { 
    url: '/wallpapers/botanical-monstera-foliage.jpg', 
    name: 'Banana Foliage', 
    author: 'Michail Dementiev', 
    icon: '🌿', 
    desc: 'Vibrant organic botanical leaf' 
  },
  { 
    url: '/wallpapers/minimal-palm-leaves.jpg', 
    name: 'Minimal Palm Leaves', 
    author: 'Studio Kealaula', 
    icon: '🌴', 
    desc: 'Clean aesthetic palm leaf shadows' 
  },
  { 
    url: '/wallpapers/green-fern-fronds.jpg', 
    name: 'Green Fern Fronds', 
    author: 'Danny Strutt', 
    icon: '🌱', 
    desc: 'Intricate wild fern textures' 
  },
  { 
    url: '/wallpapers/lush-emerald-fern.jpg', 
    name: 'Lush Emerald Fern', 
    author: 'Mohamed Musthafa', 
    icon: '☘️', 
    desc: 'Lush green fern fronds in daylight' 
  },
  { 
    url: '/wallpapers/dense-botanical-layers.jpg', 
    name: 'Dense Botanical Layers', 
    author: 'Natalie Kovach', 
    icon: '🪴', 
    desc: 'Deep overlapping green foliage' 
  },
  { 
    url: '/wallpapers/tropical-palm-frond.jpg', 
    name: 'Lush Palm Frond', 
    author: 'Rashmi Bhatia', 
    icon: '🌴', 
    desc: 'Sunlit tropical palm leaf detail' 
  },
  { 
    url: '/wallpapers/macro-forest-fern.jpg', 
    name: 'Forest Fern Macro', 
    author: 'Rowan Heuvel', 
    icon: '🌿', 
    desc: 'Serene woodland fern close-up' 
  },
  { 
    url: '/wallpapers/geometric-succulent-garden.jpg', 
    name: 'Geometric Succulents', 
    author: 'Yen Vu', 
    icon: '🌵', 
    desc: 'Satisfying geometric succulent cluster' 
  },
  { 
    url: '/wallpapers/misty-canopy-forest.jpg', 
    name: 'Misty Canopy Forest', 
    author: 'Le Tan', 
    icon: '🌲', 
    desc: 'Atmospheric misty treetops and woods' 
  },
  { 
    url: '/wallpapers/forest-gravel-riders.jpg', 
    name: 'Forest Gravel Riders', 
    author: 'Patrick Hendry', 
    icon: '🚴', 
    desc: 'Cyclists riding through dense pine forest' 
  },
  { 
    url: '/wallpapers/woods-cycling-trail.jpg', 
    name: 'Woods Cycling Trail', 
    author: 'Divyanshi Verma', 
    icon: '🌲', 
    desc: 'Solo ride on serene woodland dirt path' 
  },
  { 
    url: '/wallpapers/floating-torii-lake.jpg', 
    name: 'Floating Torii Shrine', 
    author: 'Ahmed Zalabany', 
    icon: '⛩️', 
    desc: 'Sacred water shrine at peaceful dawn' 
  },
  { 
    url: '/wallpapers/kyoto-traditional-village.jpg', 
    name: 'Historic Kyoto Alley', 
    author: 'Nuno Antunes', 
    icon: '🏮', 
    desc: 'Traditional wooden houses and lanterns' 
  },
  { 
    url: '/wallpapers/himalayan-village-peak.jpg', 
    name: 'Himalayan Village Peak', 
    author: 'S C', 
    icon: '🏔️', 
    desc: 'Snow-capped peak rising above mountain village' 
  },
  { 
    url: '/wallpapers/alpine-kayak-lake.jpg', 
    name: 'Alpine Kayak Lake', 
    author: 'Anh Phan', 
    icon: '🛶', 
    desc: 'Golden hour paddle on alpine lake' 
  },
  { 
    url: '/wallpapers/swiss-alpine-meadow.jpg', 
    name: 'Swiss Alpine Meadow', 
    author: 'Daniel Sessler', 
    icon: '⛰️', 
    desc: 'Seealpsee mountain valley' 
  },
  { 
    url: '/wallpapers/mount-fuji-pagoda.jpg', 
    name: 'Mount Fuji Pagoda', 
    author: 'David Edelstein', 
    icon: '🌸', 
    desc: 'Chureito Pagoda & Mt. Fuji' 
  },
  { 
    url: '/wallpapers/himalayan-toy-train.jpg', 
    name: 'Himalayan Toy Train', 
    author: 'Dibyendu Sekhar Das', 
    icon: '🚂', 
    desc: 'Kalka-Shimla heritage railway' 
  },
  { 
    url: '/wallpapers/lakeside-wilderness-camp.jpg', 
    name: 'Lakeside Wilderness Camp', 
    author: 'Kyle McLeod', 
    icon: '🏕️', 
    desc: 'Rustic camp by misty forest lake' 
  },
  { 
    url: '/wallpapers/coastal-palms-boulevard.jpg', 
    name: 'Coastal Palms Boulevard', 
    author: 'Lance Asper', 
    icon: '🌴', 
    desc: 'Aerial tropical beach promenade' 
  },
  { 
    url: '/wallpapers/alpine-snow-peaks.jpg', 
    name: 'Alpine Snow Peaks', 
    author: 'Marco Pregnolato', 
    icon: '❄️', 
    desc: 'Crisp snow-covered summit peaks' 
  },
  { 
    url: '/wallpapers/rainy-window-garden.jpg', 
    name: 'Rainy Window Garden', 
    author: 'Olga Kovalski', 
    icon: '🌧️', 
    desc: 'Raindrops on glass & greenery' 
  },
];

const sizePresets = [
  { label: '75%', scale: 0.75 },
  { label: '100%', scale: 1.0 },
  { label: '130%', scale: 1.3 },
  { label: '160%', scale: 1.6 },
  { label: '200%', scale: 2.0 },
];

const ALL_AVAILABLE_WIDGETS = [
  { id: 'focusBreak', name: 'Focus / Break Switcher', icon: '🔄' },
  { id: 'timer', name: 'Focus Timer', icon: '⏱️' },
  { id: 'controls', name: 'Timer Controls', icon: '⏯️' },
  { id: 'quotes', name: 'Daily Quote', icon: '💬' },
  { id: 'goals', name: 'Pomodoro Goals', icon: '🎯' },
] as const;

function getContrastTextColor(hexColor: string): string {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) return '#ffffff';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 130 ? '#000000' : '#ffffff';
}

export const SettingsSidebar = () => {
  const { 
    theme, setTheme, 
    userName, setUserName,
    timerDurations, setTimerDurations,
    autoStart, setAutoStart,
    alertSound, setAlertSound,
    sessionTally, setSessionTally,
    timerStyle, setTimerStyle,
    timerFont, setTimerFont,
    timerFontWeight, setTimerFontWeight,
    activeWidgets, toggleWidget,
    widgetOrder, swapWidgets, setWidgetOrder,
    timerScale, setTimerScale,
    quoteScale, setQuoteScale,
    quoteFont, setQuoteFont,
    showGoalTracker, setShowGoalTracker,
    showTodoPill, setShowTodoPill,
    showMusicButton, setShowMusicButton,
    showLayoutButton, setShowLayoutButton,
    showFullscreenButton, setShowFullscreenButton,
    toggleHudButton,
    resetLayout,
    activeSidebar, setActiveSidebar,
    setShowShortcutsModal,
    setBgDimmer, setBgBlur, setYtQuality
  } = usePreferencesStore();

  const isOpen = activeSidebar === 'settings';
  const setIsOpen = (open: boolean) => setActiveSidebar(open ? 'settings' : 'none');
  const [activeTab, setActiveTab] = useState<'general' | 'timer' | 'appearance' | 'widgets'>('general');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const soundFileInputRef = useRef<HTMLInputElement>(null);
  const settingsInputRef = useRef<HTMLInputElement>(null);
  const [mediaSource, setMediaSource] = useState<'youtube' | 'image' | 'video'>('youtube');
  const [inputYtUrl, setInputYtUrl] = useState('');
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [inputVideoUrl, setInputVideoUrl] = useState('');
  const [customSoundUrl, setCustomSoundUrl] = useState('');
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [customColorTarget, setCustomColorTarget] = useState<'clock' | 'accent' | 'background'>('clock');
  
  const [localDimmer, setLocalDimmer] = useState<number | null>(null);
  const [localBlur, setLocalBlur] = useState<number | null>(null);
  const [localFontWeight, setLocalFontWeight] = useState<number | null>(null);

  const handleExportSettings = () => {
    const state = usePreferencesStore.getState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sthira-settings.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportSettings = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        usePreferencesStore.setState(parsed);
        alert('Settings imported successfully!');
      } catch (err) {
        alert('Failed to import settings. Invalid file format.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file (MP3, WAV, OGG, M4A, etc.).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Audio = event.target?.result as string;
      if (base64Audio) {
        setAlertSound(base64Audio);
        playAlertSound(base64Audio);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (presetId: ThemeConfig['preset']) => {
    if (presetId === 'custom') {
      const baseVars = theme.variables?.['--bg-primary'] 
        ? theme.variables 
        : (PRESET_THEMES[theme.preset] || PRESET_THEMES['oled']);

      setTheme({
        ...theme,
        preset: 'custom',
        variables: {
          '--bg-primary': baseVars['--bg-primary'] || '#09090b',
          '--text-primary': baseVars['--text-primary'] || '#ffffff',
          '--accent-color': baseVars['--accent-color'] || '#38bdf8',
          '--glass-opacity': baseVars['--glass-opacity'] || '0.07',
          '--glass-border': baseVars['--glass-border'] || 'rgba(255, 255, 255, 0.12)',
        },
        background: {
          ...theme.background,
          type: 'none',
        }
      });
      return;
    }

    const presetVars = PRESET_THEMES[presetId];
    setTheme({ 
      ...theme, 
      preset: presetId,
      variables: presetVars || theme.variables,
      background: {
        ...theme.background,
        type: 'none',
      }
    });
  };

  const handleCustomColorChange = (key: keyof NonNullable<ThemeConfig['variables']>, value: string) => {
    const basePresetVars = PRESET_THEMES[theme.preset] || PRESET_THEMES['oled'];
    const currentVars = theme.variables || basePresetVars;
    
    const updatedVars: Record<string, string> = Object.assign(
      {
        '--bg-primary': '#09090b',
        '--text-primary': '#ffffff',
        '--accent-color': '#38bdf8',
        '--glass-opacity': '0.07',
        '--glass-border': 'rgba(255, 255, 255, 0.12)',
      },
      currentVars,
      { [key]: value }
    );

    if (key === '--bg-primary') {
      const isLight = getContrastTextColor(value) === '#000000';
      updatedVars['--glass-opacity'] = isLight ? '0.07' : '0.05';
      updatedVars['--glass-border'] = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
    }

    setTheme({
      ...theme,
      preset: 'custom',
      variables: updatedVars as any
    });
  };

  const handleApplyStarterTheme = (bg: string, text: string, accent: string) => {
    const isLight = getContrastTextColor(bg) === '#000000';
    setTheme({
      ...theme,
      preset: 'custom',
      variables: {
        '--bg-primary': bg,
        '--text-primary': text,
        '--accent-color': accent,
        '--glass-opacity': isLight ? '0.07' : '0.05',
        '--glass-border': isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      },
      background: {
        ...theme.background,
        type: 'none',
      }
    });
  };

  const handleBgChange = (type: NonNullable<ThemeConfig['background']>['type'], url: string = '') => {
    let finalUrl = url.trim();
    
    if (type === 'youtube' && finalUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = finalUrl.match(regExp);
      if (match && match[2].length === 11) {
        finalUrl = match[2];
      }
    }

    if (type === 'image' && finalUrl) {
      finalUrl = normalizeImageUrl(finalUrl);
    }

    setTheme({
      ...theme,
      background: { 
        type, 
        url: finalUrl,
        dimmer: theme.background?.dimmer ?? 50,
        blur: theme.background?.blur ?? 0,
      }
    });
  };

  const handleClearBackground = () => {
    setTheme({
      ...theme,
      background: {
        type: 'none',
        url: '',
        dimmer: 50,
        blur: 0,
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const blobUrl = URL.createObjectURL(file);
      handleBgChange('video', blobUrl);
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image or video file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (base64Url) {
        handleBgChange('image', base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomPercentChange = (valStr: string, setter: (val: number) => void) => {
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 30 && parsed <= 300) {
      setter(parsed / 100);
    }
  };

  const orderedWidgets = (() => {
    const list = [...(widgetOrder || ['focusBreak', 'timer', 'quotes', 'goals'])].filter((id) =>
      ALL_AVAILABLE_WIDGETS.some((w) => w.id === id)
    );
    ALL_AVAILABLE_WIDGETS.forEach((w) => {
      if (!list.includes(w.id)) {
        list.push(w.id);
      }
    });
    return list;
  })();

  const bgType = theme.background?.type || 'none';
  const bgUrl = theme.background?.url || '';
  const bgDimmer = theme.background?.dimmer ?? 50;
  const bgBlur = theme.background?.blur ?? 0;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity" onClick={() => setIsOpen(false)} />
      )}

      <div 
        className="fixed top-0 right-0 h-full w-[420px] max-w-full z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden shadow-2xl border-l border-white/10 text-white rounded-l-3xl select-none"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(calc(100% + 60px))',
          backgroundColor: 'rgba(9, 9, 11, 0.82)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          boxShadow: 'inset 1px 0 0 0 rgba(255, 255, 255, 0.08), -12px 0 40px rgba(0, 0, 0, 0.6)',
          color: '#ffffff'
        }}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors cursor-pointer z-10">
          <X size={24} />
        </button>

        <CurvedScrollContainer
           className="w-full h-full"
           contentClassName="p-8 pb-32"
           borderRadius={24}
           thumbColor="#fbcfe8"
           thumbColorActive="#f472b6"
           trackColor="transparent"
           trackColorActive="transparent"
           thumbWidth={4}
           thumbWidthActive={6}
           maxThumbLength={120}
           position="left"
        >

        <h2 className="text-2xl font-light mb-8 text-white tracking-tight">Settings</h2>

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-2 flex-wrap">
          {(['general', 'timer', 'appearance', 'widgets'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold uppercase tracking-wider transition-colors capitalize pb-1 cursor-pointer ${
                activeTab === tab 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {activeTab === 'general' && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
            <div>
              <label className="text-xs font-semibold uppercase opacity-60 mb-2 block">Your Name</label>
              <input 
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all"
                placeholder="Enter your name"
              />
            </div>

            {/* Keyboard Shortcuts Section */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold opacity-90">Keyboard Shortcuts</h3>
                  <p className="text-[10px] opacity-60">Control your focus session completely hands-free.</p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowShortcutsModal(true);
                  }}
                  className="px-3 py-1.5 text-[11px] font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  aria-label="Open Full Shortcuts Cheat Sheet (?)"
                >
                  <Command size={12} />
                  <span>Cheat Sheet</span>
                </button>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-3xl h-[320px] max-h-[320px] overflow-hidden flex flex-col relative">
                <CurvedScrollContainer
                  className="w-full h-full"
                  contentClassName="flex flex-col gap-1 p-3.5 pb-8"
                  borderRadius={24}
                  thumbColor="#bbf7d0"
                  thumbColorActive="#4ade80"
                  trackColor="transparent"
                  trackColorActive="transparent"
                  thumbWidth={3}
                  thumbWidthActive={5}
                  maxThumbLength={40}
                  position="left"
                >
                {[
                  { key: 'Space', desc: 'Start / Pause Timer' },
                  { key: 'S', desc: 'Skip Current Session' },
                  { key: 'R', desc: 'Reset Timer' },
                  { key: '↑ / ↓', desc: 'Adjust Time ±1m (Shift for ±5m)' },
                  { key: '1 / 2 / 3', desc: 'Focus / Short / Long Break' },
                  { key: 'E', desc: 'Direct Time Edit Mode' },
                  { key: 'M', desc: 'Ambient Sound Panel' },
                  { key: 'A', desc: 'Toggle Ambient Audio' },
                  { key: 'L', desc: 'Layout & Sizing Panel' },
                  { key: 'O / ,', desc: 'Open Settings Panel' },
                  { key: 'G', desc: 'Toggle Goal Tracker HUD' },
                  { key: 'F', desc: 'Toggle Fullscreen' },
                  { key: '?', desc: 'View Shortcuts Modal' },
                  { key: 'Esc', desc: 'Close Open Drawers & Modals' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/5 transition-colors">
                    <span className="text-xs text-white/80">{item.desc}</span>
                    <kbd className="px-2 py-0.5 text-[11px] font-mono font-bold bg-white/10 border border-white/15 rounded-xl text-white shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
                </CurvedScrollContainer>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold opacity-90">Data Management</h3>
                <p className="text-[10px] opacity-60">Backup or transfer your preferences to another device.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExportSettings}
                  className="flex-1 py-2 px-3 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download size={13} />
                  <span>Export</span>
                </button>
                <input
                  type="file"
                  ref={settingsInputRef}
                  onChange={handleImportSettings}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => settingsInputRef.current?.click()}
                  className="flex-1 py-2 px-3 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileUp size={13} />
                  <span>Import</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="flex flex-col gap-8 animate-in fade-in zoom-in duration-300">
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold opacity-90 mb-1">Timer Style</h3>
                <p className="text-[10px] opacity-60">Choose how the time remaining is displayed.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'default', label: 'Precision', icon: <div className="text-lg font-mono font-bold tracking-tight">25:00</div> },
                  { id: 'flip', label: 'Split-Flap', icon: <div className="flex gap-1 items-center"><div className="bg-white/10 px-1.5 py-0.5 rounded-lg font-mono font-bold text-xs border-b border-white/30">25</div><span className="text-white text-xs font-bold">:</span><div className="bg-white/10 px-1.5 py-0.5 rounded-lg font-mono font-bold text-xs border-b border-white/30">00</div></div> },
                  { id: 'progress', label: 'Horizon', icon: <div className="flex flex-col items-center gap-1 w-14"><div className="text-[11px] font-mono font-semibold">25:00</div><div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]"><div className="w-3/4 h-full bg-white rounded-full" /></div></div> },
                  { id: 'gauge', label: 'Gauge', icon: <div className="w-9 h-9 rounded-full border-2 border-white/20 border-t-white border-r-white flex items-center justify-center text-[8px] font-mono font-bold tracking-tighter">25:00</div> },
                  { id: 'dotMatrix', label: 'LED Matrix', icon: <div className="flex flex-col items-center gap-1"><div className="text-[10px] font-mono font-bold tracking-wider">25:00</div><div className="grid grid-cols-6 gap-0.5"><div className="w-1 h-1 bg-white rounded-full"/><div className="w-1 h-1 bg-white rounded-full"/><div className="w-1 h-1 bg-white rounded-full"/><div className="w-1 h-1 bg-white/20 rounded-full"/><div className="w-1 h-1 bg-white/20 rounded-full"/><div className="w-1 h-1 bg-white/20 rounded-full"/></div></div> },
                  { id: 'pie', label: 'Zen Dial', icon: <div className="flex flex-col items-center gap-1"><div className="w-6 h-6 rounded-full border border-white/20 relative overflow-hidden"><div className="absolute inset-0 bg-white/40 [clip-path:polygon(50%_50%,50%_0%,100%_0%,100%_100%,0%_100%,0%_50%)]" /></div><div className="text-[8px] font-mono font-bold tracking-tighter mt-0.5">25:00</div></div> },
                  { id: 'concentric', label: 'Concentric', icon: <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center relative"><div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center"><span className="text-[8px] font-mono font-black">25</span></div></div> },
                  { id: 'typographic', label: 'Typographic', icon: <div className="w-10 h-10 flex items-center justify-center relative"><div className="absolute w-full h-full border border-white/10 rounded-full"/><div className="text-[10px] font-mono font-black border border-white/30 px-1 rounded bg-black">25:00</div><span className="absolute -top-1 text-[5px] font-bold">TICK</span><span className="absolute -bottom-1 text-[5px] font-bold opacity-30">TOCK</span></div> },
                  { id: 'analog', label: 'Fruit Dial', icon: <div className="w-8 h-8 rounded-full bg-white/90 relative shadow flex items-center justify-center"><div className="absolute -top-1.5 w-1.5 h-2 bg-green-500 rounded-sm rotate-12"/><div className="w-0.5 h-3 bg-black absolute bottom-4 origin-bottom rotate-45"/><div className="w-0.5 h-3.5 bg-black/40 absolute bottom-4 origin-bottom -rotate-12"/></div> }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setTimerStyle(style.id as any)}
                    className={`flex flex-col items-center justify-center p-3 h-24 rounded-2xl border transition-all cursor-pointer ${
                      timerStyle === style.id 
                        ? 'border-white bg-white/15 ring-2 ring-white/30 text-white font-bold scale-[1.02]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <div className="flex-1 flex items-center justify-center mb-1">
                      {style.icon}
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold opacity-90 mb-1">Clock Typography</h3>
                <p className="text-[10px] opacity-60">Customize the font style of the main clock digits.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'default', label: 'Default', fontClass: 'font-mono font-semibold tracking-tighter' },
                  { id: 'minimal', label: 'Minimal', fontClass: 'font-sans font-medium tracking-tight' },
                  { id: 'serif', label: 'Serif', fontClass: 'font-serif font-medium tracking-normal' },
                  { id: 'handwritten', label: 'Handwritten', fontClass: 'font-halo tracking-wider' },
                  { id: 'minimal-light', label: 'Minimal Light', fontClass: 'font-sans font-extralight tracking-widest' },
                  { id: 'serif-condensed', label: 'Serif Condensed', fontClass: 'font-serif font-light tracking-tighter' },
                  { id: 'press-start', label: '8-Bit Retro', fontClass: 'font-press-start tracking-normal text-sm' },
                  { id: 'workbench', label: 'Workbench', fontClass: 'font-workbench tracking-normal' },
                  { id: 'ndot', label: 'Ndot', fontClass: 'font-ndot tracking-normal' }
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setTimerFont(font.id as any)}
                    className={`flex flex-col items-center justify-center p-3 h-20 rounded-2xl border transition-all cursor-pointer ${
                      timerFont === font.id 
                        ? 'border-white bg-white/15 ring-2 ring-white/30 text-white font-bold scale-[1.02]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <div 
                      className={`text-xl mb-1 ${font.fontClass}`}
                      style={{ zoom: font.id === 'press-start' ? 0.65 : (font.id === 'workbench' ? 0.85 : 1) }}
                    >
                      25:00
                    </div>
                    <span className="text-[10px] opacity-70 truncate">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold opacity-90 mb-1">Font Weight</h3>
                <p className="text-[10px] opacity-60">Adjust the thickness of the clock digits.</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { id: 0, label: 'Auto' },
                  { id: 300, label: 'Light' },
                  { id: 400, label: 'Regular' },
                  { id: 700, label: 'Bold' }
                ].map((weight) => (
                  <button
                    key={weight.id}
                    onClick={() => setTimerFontWeight(weight.id)}
                    className={`flex-1 min-w-[60px] py-2 px-1 rounded-xl border transition-all cursor-pointer text-[10px] font-medium ${
                      timerFontWeight === weight.id
                        ? 'border-white bg-white/15 ring-1 ring-white/30 text-white shadow-sm'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    {weight.label}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono opacity-50 w-6">100</span>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  value={localFontWeight !== null ? localFontWeight : (timerFontWeight === 0 ? 400 : timerFontWeight)}
                  onChange={(e) => setLocalFontWeight(parseInt(e.target.value))}
                  onMouseUp={() => {
                    if (localFontWeight !== null) {
                      setTimerFontWeight(localFontWeight);
                      setLocalFontWeight(null);
                    }
                  }}
                  onTouchEnd={() => {
                    if (localFontWeight !== null) {
                      setTimerFontWeight(localFontWeight);
                      setLocalFontWeight(null);
                    }
                  }}
                  className="flex-1 accent-white h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-mono opacity-50 w-6 text-right">900</span>
              </div>
            </div>

            {/* Daily Quote Typography */}
            <div className="pt-2 border-t border-white/10">
              <div className="mb-4">
                <h3 className="text-sm font-semibold opacity-90 mb-1">Quote Typography</h3>
                <p className="text-[10px] opacity-60">Choose the typeface for your daily quote.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'default', label: 'Default', fontClass: 'font-mono font-semibold tracking-tighter' },
                  { id: 'minimal', label: 'Minimal', fontClass: 'font-sans font-medium tracking-tight' },
                  { id: 'serif', label: 'Serif', fontClass: 'font-serif font-medium tracking-normal' },
                  { id: 'handwritten', label: 'Handwritten', fontClass: 'font-halo tracking-wider' },
                  { id: 'minimal-light', label: 'Minimal Light', fontClass: 'font-sans font-extralight tracking-widest' },
                  { id: 'serif-condensed', label: 'Serif Condensed', fontClass: 'font-serif font-light tracking-tighter' },
                  { id: 'press-start', label: '8-Bit Retro', fontClass: 'font-press-start tracking-normal' },
                  { id: 'workbench', label: 'Workbench', fontClass: 'font-workbench tracking-normal' },
                  { id: 'ndot', label: 'Ndot', fontClass: 'font-ndot tracking-normal' }
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setQuoteFont(font.id as any)}
                    className={`flex flex-col items-center justify-center p-3 h-20 rounded-2xl border transition-all cursor-pointer ${
                      quoteFont === font.id 
                        ? 'border-white bg-white/15 ring-2 ring-white/30 text-white font-bold scale-[1.02]' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'
                    }`}
                  >
                    <div 
                      className={`text-[11px] mb-1 leading-tight text-center ${font.fontClass}`}
                      style={{ zoom: font.id === 'press-start' ? 0.65 : (font.id === 'workbench' ? 0.85 : 1) }}
                    >
                      "Focus is power"
                    </div>
                    <span className="text-[10px] opacity-70 truncate mt-auto">{font.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase opacity-60 mb-2 block">Focus (min)</label>
                <input 
                  type="number" min="1" max="120"
                  value={timerDurations.work}
                  onChange={(e) => setTimerDurations({ ...timerDurations, work: parseInt(e.target.value) || 25 })}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-2.5 text-sm text-white focus:outline-none focus:border-white text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase opacity-60 mb-2 block">Short Break</label>
                <input 
                  type="number" min="1" max="60"
                  value={timerDurations.shortBreak}
                  onChange={(e) => setTimerDurations({ ...timerDurations, shortBreak: parseInt(e.target.value) || 5 })}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-2.5 text-sm text-white focus:outline-none focus:border-white text-center font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase opacity-60 mb-2 block">Long Break</label>
                <input 
                  type="number" min="1" max="60"
                  value={timerDurations.longBreak}
                  onChange={(e) => setTimerDurations({ ...timerDurations, longBreak: parseInt(e.target.value) || 15 })}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-2.5 text-sm text-white focus:outline-none focus:border-white text-center font-mono"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label 
                className="text-sm font-semibold opacity-80 cursor-pointer"
                onClick={() => setAutoStart(!autoStart)}
              >
                Auto-start next session
              </label>
              <button
                type="button"
                role="checkbox"
                aria-checked={autoStart}
                onClick={() => setAutoStart(!autoStart)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  autoStart
                    ? 'bg-white border-white text-black shadow-sm'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                {autoStart && <Check size={12} strokeWidth={3.5} />}
              </button>
            </div>

            {/* Alert Sound Section */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bell size={13} className="text-amber-400" />
                  <span className="text-xs font-semibold uppercase opacity-60">Alert Sound</span>
                </div>
                <span className="text-[10px] font-medium opacity-50">Plays on completion</span>
              </div>

              {/* Grid of Preset Sounds */}
              <div className="grid grid-cols-2 gap-2">
                {ALERT_SOUND_PRESETS.map((preset) => {
                  const isActive = alertSound === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setAlertSound(preset.id);
                        playAlertSound(preset.id);
                      }}
                      className={`group relative flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white/20 border-white/50 text-white font-semibold shadow-sm ring-1 ring-white/30'
                          : 'bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <span className="text-base shrink-0">{preset.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{preset.name}</div>
                          <div className="text-[10px] opacity-50 truncate">{preset.desc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {preset.id !== 'none' && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              playAlertSound(preset.id);
                            }}
                            className="p-1.5 rounded-xl hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                            aria-label="Preview sound"
                          >
                            <Volume2 size={13} />
                          </div>
                        )}
                        {isActive && <Check size={13} className="text-emerald-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Audio Upload & Direct URL */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold opacity-70">Custom Alert Sound</span>
                  {alertSound && !ALERT_SOUND_PRESETS.some(p => p.id === alertSound) && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Custom Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={soundFileInputRef}
                    onChange={handleSoundUpload}
                    accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,audio/m4a,audio/*"
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => soundFileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-2xl bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>Upload Audio File</span>
                    </button>
                    {alertSound && !ALERT_SOUND_PRESETS.some(p => p.id === alertSound) && (
                      <button
                        onClick={() => playAlertSound(alertSound)}
                        className="py-2 px-3.5 rounded-2xl bg-white text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer"
                        aria-label="Preview custom sound"
                      >
                        <Volume2 size={13} />
                        <span>Test</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSoundUrl}
                      onChange={(e) => setCustomSoundUrl(e.target.value)}
                      placeholder="Or paste direct audio URL (https://...)"
                      className="flex-1 bg-white/5 border border-white/15 rounded-2xl p-2.5 text-xs text-white placeholder:opacity-30 focus:outline-none focus:border-white/40 font-mono"
                    />
                    <button
                      disabled={!customSoundUrl.trim()}
                      onClick={() => {
                        if (customSoundUrl.trim()) {
                          setAlertSound(customSoundUrl.trim());
                          playAlertSound(customSoundUrl.trim());
                          setCustomSoundUrl('');
                        }
                      }}
                      className={`px-4 py-2 font-bold text-xs rounded-2xl transition-all active:scale-95 ${
                        customSoundUrl.trim()
                          ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer opacity-100'
                          : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Tally Icon Section */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smile size={13} className="text-amber-400" />
                  <span className="text-xs font-semibold uppercase opacity-60">Session Tally Icon</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] opacity-50">Current:</span>
                  <span className="text-sm font-bold bg-white/10 px-2.5 py-0.5 rounded-xl border border-white/10">
                    {POPULAR_TALLIES.find(t => t.id === sessionTally)?.icon || sessionTally || '🍅'}
                  </span>
                </div>
              </div>

              {/* Quick Preset Emojis Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {POPULAR_TALLIES.map((tally) => {
                  const isActive = sessionTally === tally.id || sessionTally === tally.icon;
                  return (
                    <button
                      key={tally.id}
                      onClick={() => setSessionTally(tally.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white/20 border-white/50 text-white shadow-sm ring-1 ring-white/30 scale-105'
                          : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{tally.icon}</span>
                      <span className="text-[9px] font-medium opacity-60 truncate w-full">{tally.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Emoji Input */}
              <div className="pt-1">
                <label className="text-[11px] font-semibold opacity-70 mb-1.5 block">
                  Custom Emoji / Symbol
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customEmojiInput}
                    onChange={(e) => {
                      setCustomEmojiInput(e.target.value);
                      if (e.target.value.trim()) {
                        setSessionTally(e.target.value.trim());
                      }
                    }}
                    placeholder="Type or paste any emoji (e.g. 🦊, 🌻, 🧘, ⚡)"
                    className="flex-1 bg-white/5 border border-white/15 rounded-2xl p-2.5 text-xs text-white placeholder:opacity-30 focus:outline-none focus:border-white/40"
                  />
                  <button
                    disabled={!customEmojiInput.trim()}
                    onClick={() => {
                      if (customEmojiInput.trim()) {
                        setSessionTally(customEmojiInput.trim());
                      }
                    }}
                    className={`px-4 py-2 font-bold text-xs rounded-2xl transition-all active:scale-95 ${
                      customEmojiInput.trim()
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer opacity-100'
                        : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
            {/* Color Theme Presets */}
            <div>
              <label className="text-xs font-semibold uppercase opacity-60 mb-3 block">Color Theme Presets</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PRESETS.map(preset => {
                  const isSelected = theme.preset === preset.id ||
                    (preset.id === 'pastel-purple' && theme.preset === 'purple') ||
                    (preset.id === 'pastel-cream' && theme.preset === 'cream');

                  const presetBg = preset.id === 'custom' && theme.preset === 'custom'
                    ? (theme.variables?.['--bg-primary'] || preset.bg)
                    : preset.bg;
                  const presetText = preset.id === 'custom' && theme.preset === 'custom'
                    ? (theme.variables?.['--text-primary'] || preset.text)
                    : preset.text;
                  const presetAccent = preset.id === 'custom' && theme.preset === 'custom'
                    ? (theme.variables?.['--accent-color'] || preset.accent)
                    : preset.accent;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-2.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-2.5 group relative ${
                        isSelected 
                          ? 'border-white bg-white/10 shadow-xl ring-2 ring-white/30 scale-[1.02]' 
                          : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 hover:scale-[1.01]'
                      }`}
                      aria-label={`Select ${preset.name} theme`}
                    >
                      {/* Mini Live Clock Preview Canvas */}
                      <div 
                        className="w-full h-18 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-transform duration-300 shadow-inner"
                        style={{ 
                          background: presetBg,
                          borderColor: 'rgba(255, 255, 255, 0.12)'
                        }}
                      >
                        {/* Mini Digits */}
                        <div className="flex items-center gap-0.5 font-mono font-bold text-xl sm:text-2xl tracking-tight select-none drop-shadow-sm">
                          <span style={{ color: presetText }}>25</span>
                          <span style={{ color: presetAccent }}>:</span>
                          <span style={{ color: presetText }}>00</span>
                        </div>

                        {/* Mini Color Dots Preview */}
                        <div className="flex items-center gap-1.5 mt-1 opacity-70">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: presetText }} />
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: presetAccent }} />
                        </div>

                        {/* Active Checkmark Pill Badge */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                            <Check size={11} className="stroke-[3.5]" />
                          </div>
                        )}
                      </div>

                      {/* Preset Meta Labels */}
                      <div className="px-1 flex items-center justify-between w-full">
                        <div className="min-w-0 pr-1">
                          <div className="font-bold text-xs text-white truncate">{preset.name}</div>
                          <div className="text-[10px] text-white/50 truncate mt-0.5">{preset.desc}</div>
                        </div>
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/25 shrink-0 shadow-sm" 
                          style={{ background: presetAccent }} 
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {theme.preset === 'custom' && (() => {
                const customBg = theme.variables?.['--bg-primary'] || '#09090b';
                const customClock = theme.variables?.['--text-primary'] || '#ffffff';
                const customAccent = theme.variables?.['--accent-color'] || '#38bdf8';

                const STARTER_THEMES = [
                  { id: 'cyberpunk', name: 'Cyberpunk', bg: '#08080c', clock: '#00f5ff', accent: '#ff0055' },
                  { id: 'emerald', name: 'Matrix', bg: '#050d0a', clock: '#22c55e', accent: '#10b981' },
                  { id: 'amber', name: 'Amber', bg: '#0c0a06', clock: '#fbbf24', accent: '#f97316' },
                  { id: 'tokyo', name: 'Tokyo', bg: '#0e0915', clock: '#e879f9', accent: '#818cf8' },
                  { id: 'frost', name: 'Nordic', bg: '#0f172a', clock: '#f8fafc', accent: '#38bdf8' },
                  { id: 'linen', name: 'Linen', bg: '#f7f2e8', clock: '#2a2421', accent: '#b85d19' },
                ];

                const currentKey: keyof NonNullable<ThemeConfig['variables']> = 
                  customColorTarget === 'clock' 
                    ? '--text-primary' 
                    : customColorTarget === 'accent' 
                    ? '--accent-color' 
                    : '--bg-primary';

                const currentColor = 
                  customColorTarget === 'clock' 
                    ? customClock 
                    : customColorTarget === 'accent' 
                    ? customAccent 
                    : customBg;

                const swatches = 
                  customColorTarget === 'clock'
                    ? ['#ffffff', '#00f5ff', '#22c55e', '#fbbf24', '#f43f5e', '#c084fc', '#f5f5f4', '#18181b']
                    : customColorTarget === 'accent'
                    ? ['#38bdf8', '#7c3aed', '#ff0055', '#10b981', '#f97316', '#eab308', '#ec4899', '#ffffff']
                    : ['#000000', '#0a0a0c', '#18181b', '#0b1120', '#120d18', '#f7f2e8', '#ebe4f6', '#f4f4f5'];

                const targetLabel = 
                  customColorTarget === 'clock'
                    ? 'Clock & Text Color'
                    : customColorTarget === 'accent'
                    ? 'Accent & Highlights'
                    : 'Canvas Background';

                const targetDesc = 
                  customColorTarget === 'clock'
                    ? 'Controls timer digits, quotes, and primary text across the app'
                    : customColorTarget === 'accent'
                    ? 'Controls timer colon separator, progress bars, rings, and glows'
                    : 'Controls solid dashboard background and canvas';

                return (
                  <div className="flex flex-col gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/10 mt-3 animate-in fade-in duration-200">
                    {/* Header with icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette size={16} className="text-white/80" />
                        <span className="font-bold text-sm text-white">Custom Theme Studio</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        Live Preview
                      </span>
                    </div>

                    {/* Active Wallpaper Warning if background media is active */}
                    {bgType !== 'none' && (
                      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-2 text-xs text-amber-200">
                        <div className="flex items-center gap-2">
                          <Sparkles size={13} className="text-amber-400 shrink-0" />
                          <span className="text-[11px] leading-tight">Wallpaper active. Clock & accent colors are live.</span>
                        </div>
                        <button
                          onClick={handleClearBackground}
                          className="px-2.5 py-1 rounded-xl bg-amber-400 text-black font-bold text-[10px] hover:bg-amber-300 transition-all shrink-0 cursor-pointer"
                          aria-label="Switch to solid background"
                        >
                          Solid View
                        </button>
                      </div>
                    )}

                    {/* Live Mini Clock Preview Card */}
                    <div 
                      className="p-5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 shadow-xl relative overflow-hidden"
                      style={{ 
                        background: customBg,
                        borderColor: 'rgba(255, 255, 255, 0.12)'
                      }}
                    >
                      <div className="flex items-center gap-1 font-mono font-bold text-4xl sm:text-5xl tracking-tight select-none drop-shadow-sm">
                        <span style={{ color: customClock }}>25</span>
                        <span style={{ color: customAccent }} className="animate-pulse">:</span>
                        <span style={{ color: customClock }}>00</span>
                      </div>
                      <div className="flex items-center gap-2.5 mt-2.5 text-[10px] font-mono opacity-60">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: customClock }} />
                          Digits
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: customAccent }} />
                          Accent
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full border border-white/30" style={{ background: customBg }} />
                          Canvas
                        </span>
                      </div>
                    </div>

                    {/* Starter Theme Combos */}
                    <div>
                      <label className="text-[11px] font-semibold uppercase opacity-60 mb-2 block">
                        Quick Starter Palettes
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {STARTER_THEMES.map((st) => (
                          <button
                            key={st.id}
                            onClick={() => handleApplyStarterTheme(st.bg, st.clock, st.accent)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left flex flex-col gap-1 cursor-pointer group"
                            aria-label={`Apply ${st.name} palette`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: st.bg }} />
                              <span className="w-2.5 h-2.5 rounded-full" style={{ background: st.clock }} />
                              <span className="w-2.5 h-2.5 rounded-full" style={{ background: st.accent }} />
                            </div>
                            <span className="text-[10px] font-bold opacity-80 group-hover:opacity-100 truncate">
                              {st.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3 Color Target Tabs */}
                    <div>
                      <label className="text-[11px] font-semibold uppercase opacity-60 mb-2 block">
                        Select Color to Customize
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
                        <button
                          onClick={() => setCustomColorTarget('clock')}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            customColorTarget === 'clock'
                              ? 'bg-white text-black shadow-md'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                          aria-label="Customize Clock and Text Color"
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" 
                            style={{ background: customClock }} 
                          />
                          <span className="truncate">Clock</span>
                        </button>
                        <button
                          onClick={() => setCustomColorTarget('accent')}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            customColorTarget === 'accent'
                              ? 'bg-white text-black shadow-md'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                          aria-label="Customize Accent Color"
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" 
                            style={{ background: customAccent }} 
                          />
                          <span className="truncate">Accent</span>
                        </button>
                        <button
                          onClick={() => setCustomColorTarget('background')}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            customColorTarget === 'background'
                              ? 'bg-white text-black shadow-md'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                          aria-label="Customize Background Color"
                        >
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20" 
                            style={{ background: customBg }} 
                          />
                          <span className="truncate">Canvas</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Target Inspector */}
                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{targetLabel}</div>
                          <div className="text-[10px] text-white/50">{targetDesc}</div>
                        </div>
                        {/* Direct Hex Input Box */}
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-xl px-2.5 py-1">
                          <span className="w-3 h-3 rounded-full shrink-0 border border-white/30" style={{ background: currentColor }} />
                          <input
                            type="text"
                            value={currentColor}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleCustomColorChange(currentKey, val);
                            }}
                            className="w-16 bg-transparent text-xs font-mono font-bold text-white uppercase outline-none"
                            placeholder="#ffffff"
                            aria-label={`Hex code for ${targetLabel}`}
                          />
                        </div>
                      </div>

                      {/* Hex Color Picker */}
                      <HexColorPicker
                        color={currentColor}
                        onChange={(color) => handleCustomColorChange(currentKey, color)}
                      />

                      {/* Quick Swatches */}
                      <div className="flex items-center justify-between gap-1 pt-1">
                        {swatches.map((hex) => (
                          <button
                            key={hex}
                            onClick={() => handleCustomColorChange(currentKey, hex)}
                            className={`w-7 h-7 rounded-full border transition-all cursor-pointer hover:scale-110 flex items-center justify-center ${
                              currentColor.toLowerCase() === hex.toLowerCase()
                                ? 'border-white scale-110 ring-2 ring-white/40 shadow-md'
                                : 'border-white/20 hover:border-white/50'
                            }`}
                            style={{ background: hex }}
                            aria-label={`Pick color ${hex}`}
                          >
                            {currentColor.toLowerCase() === hex.toLowerCase() && (
                              <Check 
                                size={12} 
                                className={getContrastTextColor(hex) === '#000000' ? 'text-black stroke-[3]' : 'text-white stroke-[3]'} 
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Background Media Section */}
            <div className="pt-6 border-t border-white/10 space-y-6">
              {/* Active Background Status Card */}
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-lg">
                    {bgType === 'youtube' && '📺'}
                    {bgType === 'image' && '🖼️'}
                    {bgType === 'video' && '🎥'}
                    {bgType === 'none' && '⬛'}
                  </div>
                  <div>
                    <div className="text-xs font-mono opacity-50 uppercase tracking-wider">Active Background</div>
                    <div className="text-sm font-bold text-white capitalize">
                      {bgType === 'none' ? 'Solid Theme Background' : `${bgType} Background`}
                    </div>
                  </div>
                </div>

                {bgType !== 'none' && (
                  <button
                    onClick={handleClearBackground}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                    aria-label="Remove background and revert to solid theme"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              {/* Source Mode Selector Tabs */}
              <div>
                <label className="text-xs font-semibold uppercase opacity-60 mb-2 block">Choose Media Background</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
                  {[
                    { id: 'youtube' as const, label: 'YouTube', icon: <Tv size={14} /> },
                    { id: 'image' as const, label: 'Image', icon: <ImageIcon size={14} /> },
                    { id: 'video' as const, label: 'Direct Video', icon: <Video size={14} /> },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMediaSource(tab.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        mediaSource === tab.id
                          ? 'bg-white text-black shadow-sm'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* YouTube Video Section */}
              {mediaSource === 'youtube' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase opacity-60 mb-1.5 block">
                      YouTube URL or Video ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputYtUrl}
                        onChange={(e) => setInputYtUrl(e.target.value)}
                        placeholder="e.g. https://youtu.be/jfKfPfyJRdk"
                        className="flex-1 bg-white/5 border border-white/15 rounded-2xl p-2.5 text-xs text-white placeholder:opacity-30 focus:outline-none focus:border-white/40 font-mono"
                      />
                      <button
                        disabled={!inputYtUrl.trim()}
                        onClick={() => {
                          if (inputYtUrl.trim()) {
                            handleBgChange('youtube', inputYtUrl);
                            setInputYtUrl('');
                          }
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-2xl transition-all active:scale-95 ${
                          inputYtUrl.trim()
                            ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer opacity-100'
                            : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* YouTube Quality Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <SlidersHorizontal size={13} className="text-amber-400" />
                        <span className="text-xs font-semibold uppercase opacity-60">Playback Quality</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/10">
                        {YT_QUALITY_OPTIONS.find(q => q.value === (theme.background?.quality || 'auto'))?.badge || 'Auto'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {YT_QUALITY_OPTIONS.map((q) => {
                        const currentQuality = theme.background?.quality || 'auto';
                        const isSelected = currentQuality === q.value;
                        return (
                          <button
                            key={q.value}
                            onClick={() => setYtQuality(q.value)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white/20 border-white/50 text-white font-bold shadow-sm ring-1 ring-white/30'
                                : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <span className="text-xs truncate">{q.label}</span>
                            {isSelected && <Check size={13} className="text-emerald-400 shrink-0 ml-1.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Curated YouTube Presets */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={13} className="text-amber-400" />
                      <span className="text-xs font-semibold uppercase opacity-60">Curated Video Themes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {YOUTUBE_PRESETS.map((preset) => {
                        const isActive = bgType === 'youtube' && bgUrl === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => handleBgChange('youtube', preset.id)}
                            className={`group relative flex flex-col p-2.5 rounded-3xl border text-left transition-all cursor-pointer overflow-hidden ${
                              isActive
                                ? 'bg-white/15 border-white/40 text-white shadow-lg ring-1 ring-white/30 scale-[1.02]'
                                : 'bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:scale-[1.01]'
                            }`}
                          >
                            {/* Video Thumbnail */}
                            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-2 bg-white/5 border border-white/10 shadow-inner">
                              <img
                                src={`https://img.youtube.com/vi/${preset.id}/hqdefault.jpg`}
                                alt={preset.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover scale-[1.35] group-hover:scale-[1.42] transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                              
                              <span className="absolute bottom-1.5 left-2 text-sm drop-shadow-md">
                                {preset.icon}
                              </span>
                              
                              {isActive && (
                                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-black shadow-md">
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              )}
                            </div>

                            {/* Card Content & Creator */}
                            <div className="px-1 min-w-0 flex flex-col w-full">
                              <div className="text-xs font-bold text-white truncate tracking-tight">
                                {preset.name}
                              </div>
                              <div className="text-[10px] text-white/55 line-clamp-1 leading-tight mt-0.5">
                                {preset.desc}
                              </div>
                              <div className="text-[9px] text-white/40 font-medium truncate mt-1">
                                by {preset.creator}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Image Section */}
              {mediaSource === 'image' && (
                <div className="space-y-4">
                  {/* File Upload Drop Zone */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const dt = new DataTransfer();
                          dt.items.add(e.dataTransfer.files[0]);
                          if (fileInputRef.current) {
                            fileInputRef.current.files = dt.files;
                            const event = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleFileUpload(event);
                          }
                        }
                      }}
                      className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={18} className="text-white/80" />
                      </div>
                      <p className="text-xs font-bold text-white mb-0.5">
                        Click to browse or drop an image here
                      </p>
                      <p className="text-[10px] opacity-40">
                        Supports JPG, PNG, WEBP, GIF, SVG
                      </p>
                    </div>
                  </div>

                  {/* Direct Image URL */}
                  <div>
                    <label className="text-xs font-semibold uppercase opacity-60 mb-1.5 block">
                      Or Paste Image URL / Unsplash Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputImageUrl}
                        onChange={(e) => setInputImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or photo ID"
                        className="flex-1 bg-white/5 border border-white/15 rounded-2xl p-2.5 text-xs text-white placeholder:opacity-30 focus:outline-none focus:border-white/40 font-mono"
                      />
                      <button
                        disabled={!inputImageUrl.trim()}
                        onClick={() => {
                          if (inputImageUrl.trim()) {
                            handleBgChange('image', inputImageUrl);
                            setInputImageUrl('');
                          }
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-2xl transition-all active:scale-95 ${
                          inputImageUrl.trim()
                            ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer opacity-100'
                            : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Apply
                      </button>
                    </div>

                    {inputImageUrl.trim().includes('unsplash.com/photos/') && 
                     !inputImageUrl.match(/(?:premium_photo-\d+|photo-\d+|\d{10,}-)/i) && (
                      <div className="mt-2.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
                        <span className="text-base shrink-0">💡</span>
                        <div>
                          <div className="font-bold text-amber-100 mb-0.5">Unsplash Webpage Link Detected</div>
                          <span>
                            You copied the link from your browser&apos;s address bar. On Unsplash, <strong>right-click the photo</strong> and choose <strong>&ldquo;Copy image address&rdquo;</strong> (starts with <code>images.unsplash.com</code>), then paste it here!
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-white/45 mt-1.5 leading-relaxed">
                      Supports Unsplash (direct image addresses, photo IDs, or page URLs), Pexels, Imgur, Google Drive, and direct JPG/PNG links.
                    </p>
                  </div>

                  {/* Curated Wallpaper Presets */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles size={13} className="text-amber-400" />
                      <span className="text-xs font-semibold uppercase opacity-60">Aesthetic Wallpapers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {IMAGE_PRESETS.map((preset) => {
                        const isActive = bgType === 'image' && bgUrl === preset.url;
                        return (
                          <button
                            key={preset.name}
                            onClick={() => handleBgChange('image', preset.url)}
                            className={`group relative flex flex-col p-2.5 rounded-3xl border text-left transition-all cursor-pointer overflow-hidden ${
                              isActive
                                ? 'bg-white/15 border-white/40 text-white shadow-lg ring-1 ring-white/30 scale-[1.02]'
                                : 'bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:scale-[1.01]'
                            }`}
                          >
                            {/* Visual Thumbnail */}
                            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-2 bg-white/5 border border-white/10 shadow-inner">
                              <Image
                                src={preset.url}
                                alt={preset.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                              
                              <span className="absolute bottom-1.5 left-2 text-sm drop-shadow-md">
                                {preset.icon}
                              </span>
                              
                              {isActive && (
                                <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-black shadow-md">
                                  <Check size={11} strokeWidth={3} />
                                </div>
                              )}
                            </div>

                            {/* Card Content & Photographer */}
                            <div className="px-1 min-w-0 flex flex-col w-full">
                              <div className="text-xs font-bold text-white truncate tracking-tight">
                                {preset.name}
                              </div>
                              <div className="text-[10px] text-white/55 line-clamp-1 leading-tight mt-0.5">
                                {preset.desc}
                              </div>
                              <div className="text-[9px] text-white/40 font-medium truncate mt-1">
                                by {preset.author}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Video Section */}
              {mediaSource === 'video' && (
                <div className="space-y-4">
                  {/* File Upload Drop Zone */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="video/mp4,video/webm"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          const dt = new DataTransfer();
                          dt.items.add(e.dataTransfer.files[0]);
                          if (fileInputRef.current) {
                            fileInputRef.current.files = dt.files;
                            const event = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleFileUpload(event);
                          }
                        }
                      }}
                      className="border-2 border-dashed border-white/20 hover:border-white/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload size={18} className="text-white/80" />
                      </div>
                      <p className="text-xs font-bold text-white mb-0.5">
                        Click to browse or drop a video here
                      </p>
                      <p className="text-[10px] opacity-40">
                        Supports MP4, WEBM
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase opacity-60 mb-1.5 block">
                      Direct Video URL (.mp4 / .webm)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputVideoUrl}
                        onChange={(e) => setInputVideoUrl(e.target.value)}
                        placeholder="https://example.com/ambient-loop.mp4"
                        className="flex-1 bg-white/5 border border-white/15 rounded-2xl p-2.5 text-xs text-white placeholder:opacity-30 focus:outline-none focus:border-white/40 font-mono"
                      />
                      <button
                        disabled={!inputVideoUrl.trim()}
                        onClick={() => {
                          if (inputVideoUrl.trim()) {
                            handleBgChange('video', inputVideoUrl);
                            setInputVideoUrl('');
                          }
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-2xl transition-all active:scale-95 ${
                          inputVideoUrl.trim()
                            ? 'bg-white text-black hover:bg-zinc-200 shadow-sm cursor-pointer opacity-100'
                            : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed opacity-50'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tuning Controls (Dimmer, Blur & Text Contrast) */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                {/* Dimmer Overlay Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase opacity-60">Dark Dimmer Overlay</label>
                    <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                      {bgDimmer}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="95"
                    step="5"
                    value={localDimmer !== null ? localDimmer : bgDimmer}
                    onChange={(e) => setLocalDimmer(parseInt(e.target.value, 10))}
                    onMouseUp={(e) => {
                      setBgDimmer(parseInt(e.currentTarget.value, 10));
                      setLocalDimmer(null);
                    }}
                    onTouchEnd={(e) => {
                      setBgDimmer(parseInt(e.currentTarget.value, 10));
                      setLocalDimmer(null);
                    }}
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-white mb-2.5"
                  />
                  <div className="grid grid-cols-4 gap-1.5">
                    {[20, 40, 60, 80].map((val) => (
                      <button
                        key={val}
                        onClick={() => setBgDimmer(val)}
                        className={`py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          bgDimmer === val
                            ? 'bg-white text-black font-bold shadow-sm'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blur Slider */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase opacity-60">Background Blur</label>
                    <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
                      {bgBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="2"
                    value={localBlur !== null ? localBlur : bgBlur}
                    onChange={(e) => setLocalBlur(parseInt(e.target.value, 10))}
                    onMouseUp={(e) => {
                      setBgBlur(parseInt(e.currentTarget.value, 10));
                      setLocalBlur(null);
                    }}
                    onTouchEnd={(e) => {
                      setBgBlur(parseInt(e.currentTarget.value, 10));
                      setLocalBlur(null);
                    }}
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-white mb-2.5"
                  />
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 5, 10, 20, 30].map((val) => (
                      <button
                        key={val}
                        onClick={() => setBgBlur(val)}
                        className={`py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          bgBlur === val
                            ? 'bg-white text-black font-bold shadow-sm'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {val === 0 ? 'Off' : `${val}px`}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] opacity-40 mt-2">
                    Applies optical blur with organic film grain for a soft, analog frosted glass texture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'widgets' && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
            {/* Header / Reset */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-white/80" />
                <span className="text-sm font-bold tracking-tight">Widget Preferences</span>
              </div>
              <button
                onClick={resetLayout}
                className="flex items-center gap-1 text-xs font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
                aria-label="Reset layout & widgets to default"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            </div>

            {/* Focus Timer Size */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="opacity-80" />
                  <label className="text-xs font-semibold uppercase opacity-60">Focus Timer Size</label>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-0.5 border border-white/10">
                  <input
                    type="number"
                    min="40"
                    max="250"
                    step="5"
                    value={Math.round((timerScale || 1.0) * 100)}
                    onChange={(e) => handleCustomPercentChange(e.target.value, setTimerScale)}
                    className="w-10 bg-transparent text-right font-mono text-xs font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[11px] font-mono text-white/60">%</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {sizePresets.map(preset => {
                  const isCurrent = Math.abs((timerScale || 1.0) - preset.scale) < 0.04;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setTimerScale(preset.scale)}
                      className={`py-1.5 px-0.5 rounded-xl text-xs font-semibold transition-all text-center ${
                        isCurrent
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTimerScale(Math.max(0.4, (timerScale || 1.0) - 0.05))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  aria-label="Decrease 5%"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="2.2"
                  step="0.05"
                  value={timerScale || 1.0}
                  onChange={(e) => setTimerScale(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-1.5 bg-white/20 rounded-full cursor-pointer"
                />
                <button
                  onClick={() => setTimerScale(Math.min(2.5, (timerScale || 1.0) + 0.05))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  aria-label="Increase 5%"
                >
                  +
                </button>
              </div>
            </div>

            {/* Daily Quote Size */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <Quote size={14} className="opacity-80" />
                  <label className="text-xs font-semibold uppercase opacity-60">Daily Quote Size</label>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2.5 py-0.5 border border-white/10">
                  <input
                    type="number"
                    min="40"
                    max="250"
                    step="5"
                    value={Math.round((quoteScale || 1.0) * 100)}
                    onChange={(e) => handleCustomPercentChange(e.target.value, setQuoteScale)}
                    className="w-10 bg-transparent text-right font-mono text-xs font-bold text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[11px] font-mono text-white/60">%</span>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {sizePresets.map(preset => {
                  const isCurrent = Math.abs((quoteScale || 1.0) - preset.scale) < 0.04;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setQuoteScale(preset.scale)}
                      className={`py-1.5 px-0.5 rounded-xl text-xs font-semibold transition-all text-center ${
                        isCurrent
                          ? 'bg-white text-black font-bold shadow-md'
                          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuoteScale(Math.max(0.4, (quoteScale || 1.0) - 0.05))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  aria-label="Decrease 5%"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="2.2"
                  step="0.05"
                  value={quoteScale || 1.0}
                  onChange={(e) => setQuoteScale(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-1.5 bg-white/20 rounded-full cursor-pointer"
                />
                <button
                  onClick={() => setQuoteScale(Math.min(2.5, (quoteScale || 1.0) + 0.05))}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  aria-label="Increase 5%"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dashboard Widgets (Drag to Reorder & Toggle) */}
            <div className="pt-4 border-t border-white/10">
              <div className="mb-3">
                <label className="text-xs font-semibold uppercase opacity-60 block">
                  Dashboard Widgets
                </label>
                <p className="text-[11px] opacity-40">
                  Drag items up or down to reorder, and toggle checkboxes to show/hide.
                </p>
              </div>

              <Reorder.Group
                axis="y"
                values={orderedWidgets}
                onReorder={(newOrder) => setWidgetOrder(newOrder)}
                className="space-y-2 select-none"
              >
                {orderedWidgets.map((widgetId) => {
                  const w = ALL_AVAILABLE_WIDGETS.find((item) => item.id === widgetId);
                  if (!w) return null;
                  const isActive = activeWidgets.includes(w.id);

                  return (
                    <Reorder.Item
                      key={w.id}
                      value={w.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-grab active:cursor-grabbing ${
                        isActive
                          ? 'bg-white/10 border-white/20 text-white shadow-sm'
                          : 'bg-white/[0.03] border-white/5 text-white/40'
                      }`}
                      whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 50 }}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-white/40 hover:text-white/80 cursor-grab" />
                        <span className="text-base">{w.icon}</span>
                        <span className="text-sm font-semibold">{w.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isActive}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWidget(widgetId);
                          }}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            isActive
                              ? 'bg-white border-white text-black shadow-sm'
                              : 'bg-white/5 border-white/20 hover:border-white/40'
                          }`}
                        >
                          {isActive && <Check size={12} strokeWidth={3.5} />}
                        </button>
                      </div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>

            {/* Bottom Floating HUD Buttons */}
            <div className="pt-4 border-t border-white/10">
              <div className="mb-2.5">
                <label className="text-xs font-semibold uppercase opacity-60 block">Bottom Floating HUD Buttons</label>
                <p className="text-[11px] opacity-40">Toggle the floating buttons at the bottom corners of your screen.</p>
              </div>
              <div className="space-y-2">
                {[
                  {
                    id: 'goal',
                    name: 'Pomodoro Goal Tracker',
                    desc: 'Bottom-Left floating tomato tally & goal pill',
                    icon: '🍅',
                    checked: showGoalTracker,
                    onChange: () => toggleHudButton('goal')
                  },
                  {
                    id: 'todo',
                    name: 'Todo Tasks Pill',
                    desc: 'Bottom-Left floating session tasks pill',
                    icon: '📝',
                    checked: showTodoPill,
                    onChange: () => toggleHudButton('todo')
                  },
                  {
                    id: 'music',
                    name: 'Ambient Sounds Button',
                    desc: 'Bottom-Right floating audio player button',
                    icon: '🎵',
                    checked: showMusicButton,
                    onChange: () => toggleHudButton('music')
                  },
                  {
                    id: 'fullscreen',
                    name: 'Fullscreen Button',
                    desc: 'Bottom-Right floating fullscreen toggle button',
                    icon: '⛶',
                    checked: showFullscreenButton,
                    onChange: () => toggleHudButton('fullscreen')
                  },
                  {
                    id: 'layout',
                    name: 'Layout & Sizing Button',
                    desc: 'Bottom-Right floating layout panel button',
                    icon: '🎛️',
                    checked: showLayoutButton,
                    onChange: () => toggleHudButton('layout')
                  },
                ].map(b => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-transparent hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{b.icon}</span>
                      <div>
                        <div className="text-sm font-semibold opacity-90">{b.name}</div>
                        <div className="text-[10px] opacity-50">{b.desc}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={b.checked}
                      onClick={b.onChange}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        b.checked
                          ? 'bg-white border-white text-black shadow-sm'
                          : 'bg-white/5 border-white/20 hover:border-white/40'
                      }`}
                    >
                      {b.checked && <Check size={12} strokeWidth={3.5} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-12 flex justify-center pb-4">
          <a
            href="https://github.com/Ayushjsgithub/sthira"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 text-white/30 hover:text-white/70 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="text-[10px] font-mono tracking-widest uppercase">
              sthira v1.0.0
            </span>
          </a>
        </div>
        </CurvedScrollContainer>
      </div>
    </>
  );
};
