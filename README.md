# sthira (स्थिर)

[![sthira UI](public/screenshot.png)](https://sth1ra.vercel.app)

**Make the Focus Environment Adapt to You**

## 📋 Overview

Most Pomodoro timers give you one fixed layout and call it done.

**sthira** is built differently. It's a high-fidelity focus dashboard where every element is yours to configure — swap timer styles, reorder widgets, set custom fonts, drop in a YouTube loop or a local wallpaper, and tune ambient sounds. All in a single-screen, zero-scroll interface that scales to fit any display automatically.

---

## 🏆 Features

- **9 timer styles** — Default, Flip Clock, Analog, Radial Gauge, Pie, Progress Bar, Dot Matrix, Concentric, Typographic
- **Custom fonts** — Ndot57, Press Start 2P, Workbench, HaloHandletter, Geist
- **Reorderable widget dashboard** with per-widget size controls
- **Dynamic backgrounds** — YouTube video loops, image URLs, drag-and-drop upload, direct video URLs
- **Ambient sounds** — Rain, Cafe & Fireplace
- **Curated themes** + custom hex color picker with live preview
- **Rotating quotes** — auto-cycles every 20 seconds while timer is running
- **Keyboard shortcut-first** — full control without touching the mouse

---

## 🥅 Tech Stack

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat-square)](https://github.com/pmndrs/zustand)

---

## 👟 How to set it up

1. Clone the repository:

   ```bash
   git clone https://github.com/Ayushjsgithub/sthira.git
   cd sthira
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎽 Project Architecture

```text
├── app/                  # Next.js App Router & main entry point
├── components/
│   ├── ui/               # Reusable base elements (curved scrollbars, glass FX)
│   ├── widgets/          # Modular dashboard blocks (Quotes, Timer, etc.)
│   └── SettingsSidebar.tsx # Master configuration drawer & background engine
├── store/                # Zustand global state (Preferences, Timer, Music)
└── public/               # Static assets (Curated wallpapers & ambient audio)
```
