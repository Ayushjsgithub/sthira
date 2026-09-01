'use client';

import { DashboardGrid } from "@/components/widgets/DashboardGrid";
import { BackgroundEngine } from "@/components/BackgroundEngine";
import { SettingsSidebar } from "@/components/SettingsSidebar";
import { MusicSidebar } from "@/components/MusicSidebar";
import { LayoutToggleButton } from "@/components/LayoutToggleButton";
import { BottomLeftHud } from "@/components/BottomLeftHud";
import { BottomRightHud } from "@/components/BottomRightHud";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { CelebrationToast } from "@/components/CelebrationToast";
import { useFullscreenInactivityStore } from "@/hooks/useFullscreenInactivity";

export default function Home() {
  const { isFullscreen, isInactive } = useFullscreenInactivityStore();

  return (
    <>
      <BackgroundEngine />
      <CelebrationToast />
      <SettingsSidebar />
      <MusicSidebar />
      <LayoutToggleButton />
      <BottomLeftHud />
      <BottomRightHud />
      <KeyboardShortcutsModal />

      <div 
        className={`h-screen w-screen flex flex-col p-3 sm:p-5 md:p-8 relative z-0 overflow-hidden box-border ${
          isFullscreen && isInactive ? 'cursor-none' : ''
        }`}
      >
        <header 
          className={`flex-none mb-2 sm:mb-3 flex justify-between items-center max-w-[1200px] w-full mx-auto transition-opacity duration-700 ${
            isFullscreen && isInactive ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-halo font-bold tracking-wide text-foreground">sthira</h1>
        </header>
      
        <main className="flex-1 min-h-0 min-w-0 max-w-[1200px] w-full mx-auto relative overflow-hidden flex flex-col items-center justify-center">
          <DashboardGrid />
        </main>
      </div>
    </>
  );
}
