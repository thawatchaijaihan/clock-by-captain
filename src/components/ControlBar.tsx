import React from 'react';
import {
  Maximize2,
  Minimize2,
  Settings,
  Volume2,
  VolumeX,
  Languages,
  Clock,
  Palette,
  Watch,
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
  const styles: { id: ClockStyle; labelTh: string; labelEn: string }[] = [
    { id: 'digital-modern', labelTh: 'ดิจิทัล', labelEn: 'Digital' },
    { id: 'flip', labelTh: 'ฟลิป', labelEn: 'Flip' },
    { id: 'analog-minimal', labelTh: 'เข็ม', labelEn: 'Analog' },
    { id: 'minimalist', labelTh: 'มินิมอล', labelEn: 'Minimal' },
  ];

  const themeKeys = Object.keys(THEMES) as ThemePreset[];

  const cycleTheme = () => {
    const currentIndex = themeKeys.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    updateSettings({ theme: themeKeys[nextIndex] });
  };

  return (
    <div
      id="clock-control-bar"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 max-w-[95vw] ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
          currentTheme.isLight
            ? 'bg-white/85 border-zinc-300/80 text-zinc-800 shadow-zinc-400/20'
            : 'bg-zinc-900/85 border-zinc-700/80 text-zinc-100 shadow-black/60'
        }`}
      >
        {/* Style Selector Tabs */}
        <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-xl p-0.5 border border-white/5">
          {styles.map((s) => {
            const isActive = settings.clockStyle === s.id;
            return (
              <button
                key={s.id}
                id={`style-btn-${s.id}`}
                onClick={() => updateSettings({ clockStyle: s.id })}
                className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? currentTheme.isLight
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-white text-zinc-900 shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={settings.language === 'th' ? s.labelTh : s.labelEn}
              >
                {settings.language === 'th' ? s.labelTh : s.labelEn}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-5 bg-zinc-700/40 mx-0.5" />

        {/* 12H / 24H Toggle */}
        <button
          id="btn-toggle-12-24"
          onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all"
          title={settings.is24Hour ? 'Switch to 12-Hour' : 'Switch to 24-Hour'}
        >
          {settings.is24Hour ? '24H' : '12H'}
        </button>

        {/* Language Toggle (TH / EN) */}
        <button
          id="btn-toggle-lang"
          onClick={() =>
            updateSettings({ language: settings.language === 'th' ? 'en' : 'th' })
          }
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all"
          title="สลับภาษา / Change Language"
        >
          <Languages className="w-3.5 h-3.5 opacity-80" />
          <span>{settings.language === 'th' ? 'TH' : 'EN'}</span>
        </button>

        {/* Theme Cycle Button */}
        <button
          id="btn-cycle-theme"
          onClick={cycleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all"
          title={`ธีม: ${currentTheme.nameTh} (คลิกเพื่อเปลี่ยน)`}
        >
          <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.progressColor }} />
          <span className="hidden md:inline text-xs">
            {settings.language === 'th' ? currentTheme.nameTh : currentTheme.nameEn}
          </span>
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={() => updateSettings({ enableTickSound: !settings.enableTickSound })}
          className={`p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all ${
            settings.enableTickSound ? 'text-emerald-400' : 'text-zinc-400'
          }`}
          title={
            settings.enableTickSound
              ? settings.language === 'th'
                ? 'เปิดเสียงติ๊กอยู่ (คลิกเพื่อปิด)'
                : 'Tick Sound ON'
              : settings.language === 'th'
              ? 'ปิดเสียงติ๊กอยู่ (คลิกเพื่อเปิด)'
              : 'Tick Sound OFF'
          }
        >
          {settings.enableTickSound ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Settings Drawer Button */}
        <button
          id="btn-open-settings"
          onClick={openSettings}
          className="p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all text-zinc-300 hover:text-white"
          title={settings.language === 'th' ? 'ตั้งค่าเพิ่มเติม' : 'Settings'}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-600/40 shadow-sm transition-all"
          title={
            isFullscreen
              ? settings.language === 'th'
                ? 'ออกจากเต็มจอ (Esc)'
                : 'Exit Fullscreen'
              : settings.language === 'th'
              ? 'แสดงเต็มหน้าจอ'
              : 'Enter Fullscreen'
          }
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {settings.language === 'th' ? 'ย่อจอ' : 'Exit'}
              </span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {settings.language === 'th' ? 'เต็มจอ' : 'Fullscreen'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
