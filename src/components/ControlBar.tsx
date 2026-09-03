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
  Check,
  RotateCcw,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { ClockSettings, ClockStyle, ThemePreset } from '../types';
import { THEMES, ThemeDefinition } from '../utils/themeConfig';

interface ControlBarProps {
  settings: ClockSettings;
  updateSettings: (partial: Partial<ClockSettings>) => void;
  resetSettings: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  currentTheme: ThemeDefinition;
  isVisible: boolean;
}

// 8 Curated, high-contrast & elegant themes for quick selection
const CURATED_THEMES: { id: ThemePreset; nameTh: string; nameEn: string; bg: string; text: string }[] = [
  { id: 'pastel-canvas-lavender', nameTh: 'ลาเวนเดอร์', nameEn: 'Lavender', bg: '#e4dcf7', text: '#2c223c' },
  { id: 'pastel-canvas-matcha', nameTh: 'มัทฉะ', nameEn: 'Matcha', bg: '#d7ece0', text: '#1a2d20' },
  { id: 'pastel-canvas-sky', nameTh: 'สกายบลู', nameEn: 'Sky Blue', bg: '#d4e9f7', text: '#1a2936' },
  { id: 'pastel-canvas-peach', nameTh: 'พีช', nameEn: 'Peach', bg: '#fce0d2', text: '#382218' },
  { id: 'oled', nameTh: 'OLED ดำ', nameEn: 'OLED Dark', bg: '#000000', text: '#ffffff' },
  { id: 'clean-light', nameTh: 'ขาวคลีน', nameEn: 'Clean White', bg: '#ffffff', text: '#18181b' },
  { id: 'nordic-slate', nameTh: 'นอร์ดิก', nameEn: 'Nordic', bg: '#1e2430', text: '#94a3b8' },
  { id: 'warm-paper', nameTh: 'กระดาษอุ่น', nameEn: 'Warm Paper', bg: '#f7f4ee', text: '#292524' },
];

export const ControlBar: React.FC<ControlBarProps> = ({
  settings,
  updateSettings,
  resetSettings,
  isFullscreen,
  toggleFullscreen,
  currentTheme,
  isVisible,
}) => {
  const isTh = settings.language === 'th';
  const [activePopover, setActivePopover] = useState<'none' | 'theme' | 'settings'>('none');
  const [showAllThemes, setShowAllThemes] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover('none');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopover('none');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const clockStyles: { id: ClockStyle; labelTh: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'digital-modern',
      labelTh: 'ดิจิทัล',
      labelEn: 'Digital',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'flip',
      labelTh: 'ฟลิปการ์ด',
      labelEn: 'Flip',
      icon: <FlipVertical className="w-4 h-4" />,
    },
    {
      id: 'analog-minimal',
      labelTh: 'เข็มนาฬิกา',
      labelEn: 'Analog',
      icon: <Watch className="w-4 h-4" />,
    },
    {
      id: 'minimalist',
      labelTh: 'มินิมอล',
      labelEn: 'Minimal',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const allThemesList = Object.entries(THEMES) as [ThemePreset, ThemeDefinition][];
  const timeScalePercent = Math.min(100, Math.max(0, Math.round((settings.fontSizeScale ?? 1.0) * 100)));
  const dateScalePercent = Math.min(100, Math.max(0, Math.round((settings.dateFontSizeScale ?? 1.0) * 100)));

  // Text color helpers for popovers ensuring pure white in dark themes
  const textHeading = currentTheme.isLight ? 'text-zinc-950 font-bold' : 'text-white font-bold';
  const textLabel = currentTheme.isLight ? 'text-zinc-800 font-medium' : 'text-white font-medium';
  const textValue = currentTheme.isLight ? 'text-indigo-600 font-bold' : 'text-white font-bold';
  const hoverRow = currentTheme.isLight ? 'hover:bg-zinc-100/70' : 'hover:bg-white/10';
  const borderDivider = currentTheme.isLight ? 'border-zinc-200/60' : 'border-zinc-800';

  return (
    <div
      ref={containerRef}
      id="clock-control-bar"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 max-w-[95vw] ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. THEME PICKER POPOVER (Floats directly above the bar)                    */}
      {/* ========================================================================= */}
      {activePopover === 'theme' && (
        <div
          id="popover-theme-picker"
          className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-[310px] sm:w-[340px] p-3.5 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-800 text-white shadow-black/90'
          }`}
        >
          <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${borderDivider}`}>
            <div className={`flex items-center gap-1.5 text-xs ${textHeading}`}>
              <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.progressColor }} />
              <span>{isTh ? 'เลือกธีมสี' : 'Color Theme'}</span>
            </div>
            <span className={`text-[11px] font-mono ${currentTheme.isLight ? 'text-zinc-400' : 'text-zinc-300'}`}>
              {CURATED_THEMES.findIndex((t) => t.id === settings.theme) >= 0
                ? `${CURATED_THEMES.findIndex((t) => t.id === settings.theme) + 1}/${CURATED_THEMES.length}`
                : ''}
            </span>
          </div>

          {/* Curated 8 Themes Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {CURATED_THEMES.map((th) => {
              const isSelected = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  id={`theme-select-${th.id}`}
                  type="button"
                  onClick={() => updateSettings({ theme: th.id })}
                  className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-white font-semibold ring-1 ring-indigo-500/30'
                      : `border-zinc-200/70 dark:border-zinc-800/80 ${hoverRow} ${textLabel}`
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: th.bg, color: th.text }}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span className="text-xs truncate">{isTh ? th.nameTh : th.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* More themes accordion */}
          <div className={`mt-2.5 pt-2 border-t ${borderDivider}`}>
            <button
              id="btn-expand-all-themes"
              type="button"
              onClick={() => setShowAllThemes(!showAllThemes)}
              className={`w-full flex items-center justify-between text-[11px] ${currentTheme.isLight ? 'text-zinc-500 hover:text-zinc-800' : 'text-zinc-300 hover:text-white'} py-1 transition-colors`}
            >
              <span>{showAllThemes ? (isTh ? 'ซ่อนธีมเพิ่มเติม' : 'Hide extra') : (isTh ? `ดูธีมทั้งหมด (${allThemesList.length})` : `All themes (${allThemesList.length})`)}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllThemes ? 'rotate-180' : ''}`} />
            </button>

            {showAllThemes && (
              <div className={`mt-2 max-h-36 overflow-y-auto space-y-1 p-1 rounded-xl ${currentTheme.isLight ? 'bg-zinc-100/60 border-zinc-200/50' : 'bg-zinc-800/60 border-zinc-700/60'} border`}>
                {allThemesList.map(([k, def]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => updateSettings({ theme: k })}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded-lg text-xs transition-all ${
                      settings.theme === k
                        ? 'bg-indigo-600 text-white font-medium'
                        : `${hoverRow} ${textLabel}`
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: def.previewColors.bg }} />
                      <span className="truncate">{isTh ? def.nameTh : def.nameEn}</span>
                    </div>
                    {settings.theme === k && <Check className="w-3 h-3 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUICK SETTINGS POPOVER (Floats directly above the bar)                 */}
      {/* ========================================================================= */}
      {activePopover === 'settings' && (
        <div
          id="popover-settings-menu"
          className={`absolute bottom-full mb-3 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-[290px] sm:w-[320px] max-h-[82vh] overflow-y-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-800 text-white shadow-black/90'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${borderDivider}`}>
            <div className={`flex items-center gap-1.5 text-xs ${textHeading}`}>
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isTh ? 'การตั้งค่า' : 'Settings'}</span>
            </div>
            <button
              id="btn-reset-quick-settings"
              type="button"
              onClick={resetSettings}
              className={`flex items-center gap-1 text-[11px] ${currentTheme.isLight ? 'text-zinc-400 hover:text-rose-500' : 'text-zinc-300 hover:text-rose-400'} transition-colors`}
              title={isTh ? 'คืนค่าเริ่มต้น' : 'Reset defaults'}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isTh ? 'รีเซ็ต' : 'Reset'}</span>
            </button>
          </div>

          {/* Quick Toggles List */}
          <div className="space-y-1.5 text-xs">
            {/* Show Seconds */}
            <label className={`flex items-center justify-between p-2 rounded-xl ${hoverRow} cursor-pointer transition-colors ${textLabel}`}>
              <span>{isTh ? 'แสดงตัวเลขวินาที' : 'Show Seconds'}</span>
              <input
                type="checkbox"
                id="toggle-show-seconds"
                checked={settings.showSeconds}
                onChange={(e) => updateSettings({ showSeconds: e.target.checked })}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
            </label>

            {/* Show Date */}
            <label className={`flex items-center justify-between p-2 rounded-xl ${hoverRow} cursor-pointer transition-colors ${textLabel}`}>
              <span>{isTh ? 'แสดงข้อความวันที่' : 'Show Date'}</span>
              <input
                type="checkbox"
                id="toggle-show-date"
                checked={settings.showFullDateText}
                onChange={(e) => updateSettings({ showFullDateText: e.target.checked })}
                className="w-4 h-4 rounded accent-indigo-600 cursor-pointer"
              />
            </label>

            {/* Calendar Era (BE / CE) */}
            <div className={`flex items-center justify-between p-2 rounded-xl ${textLabel}`}>
              <span>{isTh ? 'ปี พ.ศ. / ค.ศ.' : 'Era'}</span>
              <div className={`flex rounded-lg ${currentTheme.isLight ? 'bg-zinc-200/70' : 'bg-zinc-800'} p-0.5 text-[11px] font-semibold`}>
                <button
                  type="button"
                  onClick={() => updateSettings({ calendarSystem: 'be' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    settings.calendarSystem === 'be'
                      ? 'bg-white text-zinc-950 font-bold shadow-xs'
                      : currentTheme.isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  พ.ศ.
                </button>
                <button
                  type="button"
                  onClick={() => updateSettings({ calendarSystem: 'ce' })}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    settings.calendarSystem === 'ce'
                      ? 'bg-white text-zinc-950 font-bold shadow-xs'
                      : currentTheme.isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  ค.ศ.
                </button>
              </div>
            </div>

            {/* Background Pattern */}
            <div className={`flex items-center justify-between p-2 rounded-xl ${textLabel}`}>
              <span>{isTh ? 'พื้นหลัง' : 'Pattern'}</span>
              <div className={`flex rounded-lg ${currentTheme.isLight ? 'bg-zinc-200/70' : 'bg-zinc-800'} p-0.5 text-[11px] font-semibold`}>
                {[
                  { id: 'none', label: isTh ? 'เรียบ' : 'None' },
                  { id: 'dots', label: isTh ? 'จุด' : 'Dots' },
                  { id: 'grid', label: isTh ? 'ตาราง' : 'Grid' },
                ].map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => updateSettings({ backgroundPattern: pt.id as any })}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      (settings.backgroundPattern || 'none') === pt.id
                        ? 'bg-white text-zinc-950 font-bold shadow-xs'
                        : currentTheme.isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Group (Time Size, Date Size, Brightness) */}
            <div className={`pt-2.5 mt-1.5 border-t ${borderDivider} space-y-3`}>
              {/* 1. Main Time Size Slider */}
              <div>
                <div className="flex justify-between items-center text-[12px] mb-1.5">
                  <span className={`text-[12px] ${textHeading}`}>{isTh ? 'ขนาดเวลาหลัก' : 'Main Time Size'}</span>
                  <span className={`font-mono text-xs ${textValue}`}>{timeScalePercent}%</span>
                </div>
                <input
                  type="range"
                  id="slider-time-size"
                  min="0"
                  max="100"
                  value={timeScalePercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateSettings({ fontSizeScale: Math.max(0, val / 100) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* 2. Full Date Size Slider */}
              <div>
                <div className="flex justify-between items-center text-[12px] mb-1.5">
                  <span className={`text-[12px] ${textHeading}`}>{isTh ? 'ขนาดวันที่แบบเต็ม' : 'Full Date Size'}</span>
                  <span className={`font-mono text-xs ${textValue}`}>{dateScalePercent}%</span>
                </div>
                <input
                  type="range"
                  id="slider-date-size"
                  min="0"
                  max="100"
                  value={dateScalePercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateSettings({ dateFontSizeScale: Math.max(0, val / 100) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* 3. Screen Brightness Slider */}
              <div>
                <div className="flex justify-between items-center text-[12px] mb-1.5">
                  <span className={`text-[12px] ${textHeading}`}>{isTh ? 'ความสว่างหน้าจอ' : 'Screen Brightness'}</span>
                  <span className={`font-mono text-xs ${textValue}`}>{settings.dimmerBrightness}%</span>
                </div>
                <input
                  type="range"
                  id="slider-quick-brightness"
                  min="0"
                  max="100"
                  value={settings.dimmerBrightness}
                  onChange={(e) => updateSettings({ dimmerBrightness: parseInt(e.target.value, 10) })}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN TAB BAR (Pill Container)                                          */}
      {/* ========================================================================= */}
      <div
        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
          currentTheme.isLight
            ? 'bg-white/85 border-zinc-300/80 text-zinc-800 shadow-zinc-400/20'
            : 'bg-zinc-900/85 border-zinc-700/80 text-zinc-100 shadow-black/60'
        }`}
      >
        {/* Clock Style Selector Pills (Icon-only) */}
        <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-xl p-0.5 border border-white/5">
          {clockStyles.map((s) => {
            const isActive = settings.clockStyle === s.id;
            return (
              <button
                key={s.id}
                id={`style-btn-${s.id}`}
                type="button"
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

        {/* Divider */}
        <div className="w-[1px] h-4 bg-zinc-500/30 mx-0.5" />

        {/* 12H / 24H Toggle */}
        <button
          id="btn-toggle-12-24"
          type="button"
          onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
          className={`p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
            !settings.is24Hour ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={
            settings.is24Hour
              ? isTh
                ? 'โหมด 24 ชั่วโมง (คลิกเปลี่ยนเป็น 12 ชั่วโมง AM/PM)'
                : '24-Hour (Click for 12-Hour)'
              : isTh
              ? 'โหมด 12 ชั่วโมง AM/PM (คลิกเปลี่ยนเป็น 24 ชั่วโมง)'
              : '12-Hour AM/PM (Click for 24-Hour)'
          }
          aria-label="Toggle 12/24 hour format"
        >
          <SunMoon className="w-4 h-4" />
        </button>

        {/* Language Toggle (TH / EN) */}
        <button
          id="btn-toggle-lang"
          type="button"
          onClick={() => updateSettings({ language: settings.language === 'th' ? 'en' : 'th' })}
          className="p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center text-zinc-400 hover:text-zinc-200"
          title={isTh ? 'ภาษา: ไทย (คลิกสลับเป็น EN)' : 'Language: English (Click for TH)'}
          aria-label="Switch Language"
        >
          <Languages className="w-4 h-4" />
        </button>

        {/* Theme Picker Popover Toggle Button */}
        <button
          id="btn-theme-popover-toggle"
          type="button"
          onClick={() => setActivePopover(activePopover === 'theme' ? 'none' : 'theme')}
          className={`p-1.5 rounded-lg border transition-all flex items-center justify-center relative ${
            activePopover === 'theme'
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
              : 'border-transparent hover:border-zinc-500/30 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isTh ? 'เลือกธีมสี' : 'Color Themes'}
          aria-label="Select Theme"
        >
          <Palette className="w-4 h-4" style={{ color: currentTheme.progressColor }} />
          <span
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-black/40"
            style={{ backgroundColor: currentTheme.progressColor }}
          />
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={() => updateSettings({ enableTickSound: !settings.enableTickSound })}
          className={`p-1.5 rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
            settings.enableTickSound ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={settings.enableTickSound ? (isTh ? 'เปิดเสียงติ๊ก' : 'Tick ON') : (isTh ? 'ปิดเสียงติ๊ก' : 'Tick OFF')}
          aria-label="Toggle Tick Sound"
        >
          {settings.enableTickSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Quick Settings Popover Toggle Button */}
        <button
          id="btn-quick-settings-toggle"
          type="button"
          onClick={() => setActivePopover(activePopover === 'settings' ? 'none' : 'settings')}
          className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
            activePopover === 'settings'
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
              : 'border-transparent hover:border-zinc-500/30 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isTh ? 'การตั้งค่าเพิ่มเติม' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          id="btn-toggle-fullscreen"
          type="button"
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
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </div>
  );
};
