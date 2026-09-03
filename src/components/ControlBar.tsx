import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  Settings,
  Volume2,
  VolumeX,
  Languages,
  Clock,
  FlipVertical,
  Palette,
  Watch,
  Sparkles,
  SunMoon,
} from 'lucide-react';
import { ClockSettings, ClockStyle, ThemePreset } from '../types';
import { THEMES, ThemeDefinition } from '../utils/themeConfig';

interface ControlBarProps {
  settings: ClockSettings;
  updateSettings: (partial: Partial<ClockSettings>) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  openSettings: () => void;
  currentTheme: ThemeDefinition;
  isVisible: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  settings,
  updateSettings,
  isFullscreen,
  toggleFullscreen,
  openSettings,
  currentTheme,
  isVisible,
}) => {
  const isTh = settings.language === 'th';

  const [themeToast, setThemeToast] = useState<{
    show: boolean;
    index: number;
    total: number;
    name: string;
    color: string;
  } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const styles: { id: ClockStyle; labelTh: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'digital-modern',
      labelTh: 'นาฬิกาดิจิทัล',
      labelEn: 'Digital Clock',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'flip',
      labelTh: 'นาฬิกาฟลิปการ์ด',
      labelEn: 'Flip Clock',
      icon: <FlipVertical className="w-4 h-4" />,
    },
    {
      id: 'analog-minimal',
      labelTh: 'นาฬิกาเข็มคลาสสิก',
      labelEn: 'Analog Clock',
      icon: <Watch className="w-4 h-4" />,
    },
    {
      id: 'minimalist',
      labelTh: 'นาฬิกามินิมอล',
      labelEn: 'Minimalist Clock',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const themeKeys = Object.keys(THEMES) as ThemePreset[];

  const cycleTheme = () => {
    const currentIndex = themeKeys.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const nextThemeKey = themeKeys[nextIndex];
    const nextThemeObj = THEMES[nextThemeKey];
    updateSettings({ theme: nextThemeKey });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setThemeToast({
      show: true,
      index: nextIndex + 1,
      total: themeKeys.length,
      name: isTh ? nextThemeObj.nameTh : nextThemeObj.nameEn,
      color: nextThemeObj.progressColor,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setThemeToast((prev) => (prev ? { ...prev, show: false } : null));
    }, 2800);
  };

  return (
    <div
      id="clock-control-bar"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 max-w-[95vw] ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Floating Theme Counter Toast Box above the control bar */}
      <div
        id="theme-counter-toast"
        role="status"
        aria-live="polite"
        className={`absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none z-50 ${
          themeToast?.show
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
        }`}
      >
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xl backdrop-blur-xl text-xs font-medium ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-300/90 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-700/90 text-zinc-100 shadow-black/80'
          }`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/20 shadow-xs"
            style={{ backgroundColor: themeToast?.color || currentTheme.progressColor }}
          />
          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/15 text-purple-700 dark:text-purple-300">
            {themeToast?.index || (themeKeys.indexOf(settings.theme) + 1)}/{themeToast?.total || themeKeys.length}
          </span>
          <span className="truncate max-w-[170px] sm:max-w-none text-zinc-800 dark:text-zinc-200 font-medium">
            {themeToast?.name || (isTh ? currentTheme.nameTh : currentTheme.nameEn)}
          </span>
        </div>
      </div>
      <div
        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          currentTheme.isLight
            ? 'bg-white/85 border-zinc-300/80 text-zinc-800 shadow-zinc-400/20'
            : 'bg-zinc-900/85 border-zinc-700/80 text-zinc-100 shadow-black/60'
        }`}
      >
        {/* Style Selector Tabs (Icon-only) */}
        <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-xl p-0.5 border border-white/5">
          {styles.map((s) => {
            const isActive = settings.clockStyle === s.id;
            return (
              <button
                key={s.id}
                id={`style-btn-${s.id}`}
                onClick={() => updateSettings({ clockStyle: s.id })}
                className={`p-1.5 sm:p-2 rounded-lg transition-all flex items-center justify-center ${
                  isActive
                    ? currentTheme.isLight
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white text-zinc-900 shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={isTh ? s.labelTh : s.labelEn}
                aria-label={isTh ? s.labelTh : s.labelEn}
              >
                {s.icon}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-4 bg-zinc-700/40 mx-0.5" />

        {/* 12H / 24H Toggle (Icon) */}
        <button
          id="btn-toggle-12-24"
          onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
          className={`p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
            !settings.is24Hour ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
          }`}
          title={
            settings.is24Hour
              ? isTh
                ? 'โหมด 24 ชั่วโมง (คลิกเพื่อเปลี่ยนเป็น 12 ชั่วโมง AM/PM)'
                : '24-Hour Format (Click for 12-Hour AM/PM)'
              : isTh
              ? 'โหมด 12 ชั่วโมง AM/PM (คลิกเพื่อเปลี่ยนเป็น 24 ชั่วโมง)'
              : '12-Hour AM/PM (Click for 24-Hour)'
          }
          aria-label="Toggle 12/24 hour mode"
        >
          <SunMoon className="w-4 h-4" />
        </button>

        {/* Language Toggle (TH / EN Icon) */}
        <button
          id="btn-toggle-lang"
          onClick={() =>
            updateSettings({ language: settings.language === 'th' ? 'en' : 'th' })
          }
          className="p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center text-zinc-300 hover:text-white"
          title={
            isTh
              ? 'ภาษา: ไทย (คลิกเพื่อเปลี่ยนเป็น English)'
              : 'Language: English (Click for Thai)'
          }
          aria-label="Switch Language"
        >
          <Languages className="w-4 h-4" />
        </button>

        {/* Theme Cycle Button (Icon-only) */}
        <button
          id="btn-cycle-theme"
          onClick={cycleTheme}
          className="p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center relative group"
          title={`${isTh ? 'เปลี่ยนธีมสี' : 'Switch Theme'}: ${isTh ? currentTheme.nameTh : currentTheme.nameEn}`}
          aria-label="Switch Theme"
        >
          <Palette className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color: currentTheme.progressColor }} />
          <span 
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-black/40"
            style={{ backgroundColor: currentTheme.progressColor }}
          />
        </button>

        {/* Sound Toggle (Icon) */}
        <button
          id="btn-toggle-sound"
          onClick={() => updateSettings({ enableTickSound: !settings.enableTickSound })}
          className={`p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
            settings.enableTickSound ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={
            settings.enableTickSound
              ? isTh
                ? 'เปิดเสียงติ๊กอยู่ (คลิกเพื่อปิด)'
                : 'Tick Sound ON'
              : isTh
              ? 'ปิดเสียงติ๊กอยู่ (คลิกเพื่อเปิด)'
              : 'Tick Sound OFF'
          }
          aria-label="Toggle Tick Sound"
        >
          {settings.enableTickSound ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Settings Drawer Button (Icon) */}
        <button
          id="btn-open-settings"
          onClick={openSettings}
          className="p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all text-zinc-300 hover:text-white flex items-center justify-center"
          title={isTh ? 'ตั้งค่าเพิ่มเติม' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen Button (Icon) */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-600/40 shadow-sm transition-all flex items-center justify-center"
          title={
            isFullscreen
              ? isTh
                ? 'ออกจากเต็มจอ (Esc)'
                : 'Exit Fullscreen'
              : isTh
              ? 'แสดงเต็มหน้าจอ'
              : 'Enter Fullscreen'
          }
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>
    </div>
  );
};
