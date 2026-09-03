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
  ChevronLeft,
  ChevronRight,
  Type,
} from 'lucide-react';
import { ClockSettings, ClockStyle, ThemePreset } from '../types';
import { THEMES, ThemeDefinition } from '../utils/themeConfig';
import { TIME_FONTS } from '../utils/fontConfig';
import { getWatchCaseForTheme } from '../utils/watchCaseConfig';

interface ControlBarProps {
  settings: ClockSettings;
  updateSettings: (partial: Partial<ClockSettings>) => void;
  resetSettings: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  currentTheme: ThemeDefinition;
  isVisible: boolean;
}

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
  const [activePopover, setActivePopover] = useState<'none' | 'theme' | 'font' | 'settings'>('none');
  const containerRef = useRef<HTMLDivElement>(null);

  const allThemesList = Object.entries(THEMES) as [ThemePreset, ThemeDefinition][];

  // Theme Carousel Setup: Active theme is always in center, left is prev, right is next
  const currentThemeIdx = Math.max(
    0,
    allThemesList.findIndex(([id]) => id === settings.theme)
  );
  const prevThemeIdx = (currentThemeIdx - 1 + allThemesList.length) % allThemesList.length;
  const nextThemeIdx = (currentThemeIdx + 1) % allThemesList.length;

  const currentSlideThemes = [
    { entry: allThemesList[prevThemeIdx], isCurrent: false },
    { entry: allThemesList[currentThemeIdx], isCurrent: true },
    { entry: allThemesList[nextThemeIdx], isCurrent: false },
  ];

  const handlePrevTheme = () => {
    updateSettings({ theme: allThemesList[prevThemeIdx][0] });
  };

  const handleNextTheme = () => {
    updateSettings({ theme: allThemesList[nextThemeIdx][0] });
  };

  // Font Carousel Setup: Active font is always in center, left is prev, right is next
  const currentFontIdx = Math.max(
    0,
    TIME_FONTS.findIndex((f) => f.id === (settings.timeFont || 'inter'))
  );
  const prevFontIdx = (currentFontIdx - 1 + TIME_FONTS.length) % TIME_FONTS.length;
  const nextFontIdx = (currentFontIdx + 1) % TIME_FONTS.length;

  const currentSlideFonts = [
    { font: TIME_FONTS[prevFontIdx], isCurrent: false },
    { font: TIME_FONTS[currentFontIdx], isCurrent: true },
    { font: TIME_FONTS[nextFontIdx], isCurrent: false },
  ];

  const handlePrevFont = () => {
    updateSettings({ timeFont: TIME_FONTS[prevFontIdx].id });
  };

  const handleNextFont = () => {
    updateSettings({ timeFont: TIME_FONTS[nextFontIdx].id });
  };

  // Close popover on click outside or Escape, and arrow keys for theme/font immediate change
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover('none');
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopover('none');
      } else if (activePopover === 'theme') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevTheme();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextTheme();
        }
      } else if (activePopover === 'font') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevFont();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextFont();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePopover, currentThemeIdx, currentFontIdx]);

  const clockStyles: { id: ClockStyle; labelTh: string; labelEn: string; icon: React.ReactNode }[] = [
    {
      id: 'digital-modern',
      labelTh: 'ดิจิทัล',
      labelEn: 'Digital',
      icon: <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'flip',
      labelTh: 'ฟลิปการ์ด',
      labelEn: 'Flip',
      icon: <FlipVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'analog-minimal',
      labelTh: 'เข็มนาฬิกา',
      labelEn: 'Analog',
      icon: <Watch className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
    {
      id: 'minimalist',
      labelTh: 'มินิมอล',
      labelEn: 'Minimal',
      icon: <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
    },
  ];

  const timeScalePercent = Math.min(100, Math.max(10, Math.round((settings.fontSizeScale ?? 1.0) * 100)));
  const dateScalePercent = Math.min(100, Math.max(10, Math.round((settings.dateFontSizeScale ?? 1.0) * 100)));

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
      className={`fixed bottom-3 sm:bottom-6 left-1/2 z-40 transition-all duration-300 max-w-[96vw] ${
        isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{
        transform: 'translateX(-50%) scale(clamp(0.65, calc(95vw / 420px), 1))',
        transformOrigin: 'bottom center',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. THEME PICKER POPOVER (Slideshow Format: 3 items with < >)              */}
      {/* ========================================================================= */}
      {activePopover === 'theme' && (
        <div
          id="popover-theme-picker"
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[min(94vw,350px)] max-h-[calc(100dvh-5rem)] overflow-y-auto p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 select-none overscroll-contain ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-800 text-white shadow-black/90'
          }`}
        >
          {/* Header with Title and Page Indicator */}
          {/* Header with Title and Index Indicator */}
          <div className={`flex items-center justify-between pb-2 mb-2.5 border-b ${borderDivider}`}>
            <div className={`flex items-center gap-1.5 text-xs ${textHeading}`}>
              {settings.clockStyle === 'analog-minimal' ? (
                <>
                  <Watch className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isTh ? 'เลือกธีมหน้าปัดนาฬิกาเข็ม' : 'Analog Dial Theme'}</span>
                </>
              ) : (
                <>
                  <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.progressColor }} />
                  <span>{isTh ? 'เลือกธีมสี' : 'Color Theme'}</span>
                </>
              )}
            </div>
            <span className={`text-[11px] font-mono font-medium ${currentTheme.isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {currentThemeIdx + 1} / {allThemesList.length}
            </span>
          </div>

          {/* Slideshow Row: [< Button] [3 Theme Cards] [> Button] */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Button < */}
            <button
              id="btn-theme-slide-prev"
              type="button"
              onClick={handlePrevTheme}
              title={isTh ? 'เปลี่ยนเป็นธีมก่อนหน้า (<)' : 'Previous theme (<)'}
              aria-label={isTh ? 'ธีมก่อนหน้า' : 'Previous theme'}
              className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
                currentTheme.isLight
                  ? 'border-zinc-200 bg-zinc-100/90 hover:bg-zinc-200 text-zinc-700 shadow-xs'
                  : 'border-zinc-700/80 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 3 Theme Cards: [Prev] [Current (Active)] [Next] */}
            <div className="flex-1 grid grid-cols-3 gap-1.5 sm:gap-2">
              {currentSlideThemes.map(({ entry: [themeId, def], isCurrent }, slotIdx) => {
                const isAnalog = settings.clockStyle === 'analog-minimal';
                const watchCase = isAnalog
                  ? getWatchCaseForTheme(themeId, def.isLight, def.progressColor, def.previewColors.bg)
                  : null;

                const displayName = isAnalog && watchCase
                  ? (isTh ? watchCase.nameTh : watchCase.nameEn)
                  : (isTh
                    ? def.nameTh.replace(/^พาสเทล\s*/, '')
                    : def.nameEn.replace(/^Pastel\s*/, ''));

                const handleClick = () => {
                  if (slotIdx === 0) handlePrevTheme();
                  else if (slotIdx === 2) handleNextTheme();
                  else updateSettings({ theme: themeId });
                };

                return (
                  <button
                    key={`${themeId}-${slotIdx}`}
                    id={`theme-select-${themeId}`}
                    type="button"
                    onClick={handleClick}
                    title={isAnalog && watchCase ? (isTh ? watchCase.nameTh : watchCase.nameEn) : (isTh ? def.nameTh : def.nameEn)}
                    className={`group flex flex-col items-center p-1.5 rounded-xl border transition-all text-center relative overflow-hidden cursor-pointer ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/60 shadow-md shadow-indigo-500/15 scale-[1.03]'
                        : `border-zinc-200/70 dark:border-zinc-800/80 opacity-75 hover:opacity-100 ${hoverRow} hover:scale-[1.01]`
                    }`}
                  >
                    {/* Color / Clock Preview Block */}
                    <div
                      className="w-full h-11 rounded-lg border border-black/10 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-xs transition-transform group-hover:scale-105"
                      style={{ backgroundColor: def.previewColors.bg }}
                    >
                      {isAnalog && watchCase ? (
                        /* Mini Analog Watch Case & Dial Preview (ตัวเรือน + เม็ดมะยม + หน้าปัด) */
                        <div className="relative flex items-center justify-center">
                          {/* Mini Watch Crown at 3 o'clock */}
                          <div 
                            className="absolute -right-1 w-0.5 h-2 rounded-r-xs border border-l-0 shadow-xs z-0"
                            style={{
                              background: watchCase.crownGradient,
                              borderColor: watchCase.crownBorder,
                            }}
                          />

                          {/* Mini Outer Watch Case Bezel (ตัวเรือนชั้นนอก) */}
                          <div 
                            className="relative w-8 h-8 rounded-full flex items-center justify-center p-[2.5px] shadow-xs z-10"
                            style={{
                              background: watchCase.bezelGradient,
                              border: `1px solid ${watchCase.bezelBorder}`,
                              boxShadow: watchCase.bezelShadow,
                            }}
                          >
                            {/* Mini Dial Face (หน้าปัดด้านใน) */}
                            <div 
                              className="relative w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                              style={{
                                background: watchCase.dialBackground,
                                border: `0.5px solid ${watchCase.dialBorder}`,
                                boxShadow: watchCase.dialInnerShadow,
                              }}
                            >
                              {/* Mini 12, 3, 6, 9 ticks */}
                              <span className="absolute top-0.5 w-[1px] h-1 rounded-full opacity-70" style={{ backgroundColor: watchCase.hourTickColor }} />
                              <span className="absolute bottom-0.5 w-[1px] h-1 rounded-full opacity-70" style={{ backgroundColor: watchCase.hourTickColor }} />
                              <span className="absolute left-0.5 w-1 h-[1px] rounded-full opacity-70" style={{ backgroundColor: watchCase.hourTickColor }} />
                              <span className="absolute right-0.5 w-1 h-[1px] rounded-full opacity-70" style={{ backgroundColor: watchCase.hourTickColor }} />

                              {/* Mini Hour Hand */}
                              <div 
                                className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom w-[1.5px] h-2 rounded-full"
                                style={{ 
                                  backgroundColor: watchCase.hourMinuteHandColor,
                                  transform: 'rotate(-50deg)',
                                }}
                              />

                              {/* Mini Minute Hand */}
                              <div 
                                className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom w-[1px] h-3 rounded-full"
                                style={{ 
                                  backgroundColor: watchCase.hourMinuteHandColor,
                                  transform: 'rotate(55deg)',
                                }}
                              />

                              {/* Mini Second Hand */}
                              <div 
                                className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom w-[0.75px] h-3 rounded-full"
                                style={{ 
                                  backgroundColor: watchCase.secondHandColor,
                                  transform: 'rotate(180deg)',
                                }}
                              />

                              {/* Mini Center Pivot */}
                              <div 
                                className="absolute w-1 h-1 rounded-full z-10 shadow-xs"
                                style={{ backgroundColor: watchCase.pivotColor }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Mock mini digital clock display */
                        <>
                          <span
                            className="text-[10px] sm:text-[11px] font-bold font-mono tracking-tight leading-none drop-shadow-xs"
                            style={{ color: def.previewColors.text }}
                          >
                            12<span style={{ color: def.previewColors.colon }}>:</span>00
                          </span>

                          {/* Accent progress bar mockup */}
                          <div
                            className="w-5 h-0.5 rounded-full mt-1 opacity-80"
                            style={{ backgroundColor: def.progressColor }}
                          />
                        </>
                      )}

                      {/* Active check badge */}
                      {isCurrent && (
                        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs z-20">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Theme / Case Name */}
                    <span
                      className={`w-full text-[9px] sm:text-[10px] mt-1 truncate font-medium ${
                        isCurrent
                          ? 'text-indigo-500 dark:text-indigo-400 font-bold'
                          : currentTheme.isLight
                          ? 'text-zinc-600'
                          : 'text-zinc-400'
                      }`}
                    >
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button > */}
            <button
              id="btn-theme-slide-next"
              type="button"
              onClick={handleNextTheme}
              title={isTh ? 'เปลี่ยนเป็นธีมถัดไป (>)' : 'Next theme (>)'}
              aria-label={isTh ? 'ธีมถัดไป' : 'Next theme'}
              className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
                currentTheme.isLight
                  ? 'border-zinc-200 bg-zinc-100/90 hover:bg-zinc-200 text-zinc-700 shadow-xs'
                  : 'border-zinc-700/80 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 shadow-xs'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1 mt-2.5 pt-2 border-t border-inherit overflow-x-hidden px-2">
            {allThemesList.map(([tId], idx) => (
              <button
                key={tId}
                type="button"
                onClick={() => updateSettings({ theme: tId })}
                aria-label={`Select theme ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentThemeIdx === idx
                    ? 'w-3.5 bg-indigo-500'
                    : 'w-1 bg-zinc-300/70 dark:bg-zinc-700/70 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FONT PICKER POPOVER (3 items with Immediate Change on < >)             */}
      {/* ========================================================================= */}
      {activePopover === 'font' && (
        <div
          id="popover-font-picker"
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[min(94vw,350px)] max-h-[calc(100dvh-5rem)] overflow-y-auto p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 select-none overscroll-contain ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-800 text-white shadow-black/90'
          }`}
        >
          {/* Header with Title and Index Indicator */}
          <div className={`flex items-center justify-between pb-2 mb-2.5 border-b ${borderDivider}`}>
            <div className={`flex items-center gap-1.5 text-xs ${textHeading}`}>
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isTh ? 'เลือกฟอนต์ตัวเลขหลัก' : 'Main Time Font'}</span>
            </div>
            <span className={`text-[11px] font-mono font-medium ${currentTheme.isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {currentFontIdx + 1} / {TIME_FONTS.length}
            </span>
          </div>

          {/* Slideshow Row: [< Button] [3 Font Cards] [> Button] */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Button < */}
            <button
              id="btn-font-slide-prev"
              type="button"
              onClick={handlePrevFont}
              title={isTh ? 'เปลี่ยนเป็นฟอนต์ก่อนหน้า (<)' : 'Previous font (<)'}
              aria-label={isTh ? 'ฟอนต์ก่อนหน้า' : 'Previous font'}
              className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
                currentTheme.isLight
                  ? 'border-zinc-200 bg-zinc-100/90 hover:bg-zinc-200 text-zinc-700 shadow-xs'
                  : 'border-zinc-700/80 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 3 Font Cards: [Prev] [Current (Active)] [Next] */}
            <div className="flex-1 grid grid-cols-3 gap-1.5 sm:gap-2">
              {currentSlideFonts.map(({ font, isCurrent }, slotIdx) => {
                const displayName = isTh
                  ? font.nameTh.split(' ')[0]
                  : font.nameEn.split(' ')[0];

                const handleClick = () => {
                  if (slotIdx === 0) handlePrevFont();
                  else if (slotIdx === 2) handleNextFont();
                  else updateSettings({ timeFont: font.id });
                };

                return (
                  <button
                    key={`${font.id}-${slotIdx}`}
                    id={`font-select-${font.id}`}
                    type="button"
                    onClick={handleClick}
                    title={isTh ? font.nameTh : font.nameEn}
                    className={`group flex flex-col items-center p-1.5 rounded-xl border transition-all text-center relative overflow-hidden cursor-pointer ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/60 shadow-md shadow-indigo-500/15 scale-[1.03]'
                        : `border-zinc-200/70 dark:border-zinc-800/80 opacity-75 hover:opacity-100 ${hoverRow} hover:scale-[1.01]`
                    }`}
                  >
                    {/* Font Preview Block */}
                    <div
                      className={`w-full h-11 rounded-lg border flex flex-col items-center justify-center relative overflow-hidden shadow-xs transition-transform group-hover:scale-105 ${
                        currentTheme.isLight
                          ? 'bg-zinc-100/90 border-zinc-200/70'
                          : 'bg-zinc-800/80 border-zinc-700/60'
                      }`}
                    >
                      {/* Digits Preview */}
                      <span
                        className="text-sm sm:text-base font-bold tracking-tight leading-none drop-shadow-xs"
                        style={{
                          fontFamily: font.fontFamily,
                          letterSpacing: font.letterSpacing,
                          color: currentTheme.previewColors.text,
                        }}
                      >
                        12<span style={{ color: currentTheme.previewColors.colon }}>:</span>45
                      </span>

                      {/* Active Check Badge */}
                      {isCurrent && (
                        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Font Name */}
                    <span
                      className={`w-full text-[10px] sm:text-[11px] mt-1 truncate font-medium ${
                        isCurrent
                          ? 'text-indigo-500 dark:text-indigo-400 font-bold'
                          : currentTheme.isLight
                          ? 'text-zinc-600'
                          : 'text-zinc-400'
                      }`}
                    >
                      {displayName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Button > */}
            <button
              id="btn-font-slide-next"
              type="button"
              onClick={handleNextFont}
              title={isTh ? 'เปลี่ยนเป็นฟอนต์ถัดไป (>)' : 'Next font (>)'}
              aria-label={isTh ? 'ฟอนต์ถัดไป' : 'Next font'}
              className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center rounded-full border transition-all active:scale-90 cursor-pointer ${
                currentTheme.isLight
                  ? 'border-zinc-200 bg-zinc-100/90 hover:bg-zinc-200 text-zinc-700 shadow-xs'
                  : 'border-zinc-700/80 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 shadow-xs'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1 mt-2.5 pt-2 border-t border-inherit">
            {TIME_FONTS.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateSettings({ timeFont: f.id })}
                aria-label={`Select font ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentFontIdx === idx
                    ? 'w-3.5 bg-indigo-500'
                    : 'w-1.5 bg-zinc-300/80 dark:bg-zinc-700/80 hover:bg-zinc-400 dark:hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. QUICK SETTINGS POPOVER (Floats directly above the bar)                 */}
      {/* ========================================================================= */}
      {activePopover === 'settings' && (
        <div
          id="popover-settings-menu"
          className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[min(92vw,320px)] max-h-[calc(100dvh-5rem)] overflow-y-auto p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 z-50 overscroll-contain ${
            currentTheme.isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/30'
              : 'bg-zinc-900/95 border-zinc-800 text-white shadow-black/90'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between pb-2 mb-2 border-b ${borderDivider}`}>
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
          <div className="space-y-1 text-xs">
            {/* Show Seconds */}
            <label className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${hoverRow} cursor-pointer transition-colors ${textLabel}`}>
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
            <label className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${hoverRow} cursor-pointer transition-colors ${textLabel}`}>
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
            <div className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${textLabel}`}>
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
            <div className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${textLabel}`}>
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
            <div className={`pt-2 mt-1 border-t ${borderDivider} space-y-2.5`}>
              {/* 1. Main Time Size Slider */}
              <div>
                <div className="flex justify-between items-center text-[11px] sm:text-[12px] mb-1">
                  <span className={`text-[11px] sm:text-[12px] ${textHeading}`}>{isTh ? 'ขนาดเวลาหลัก' : 'Main Time Size'}</span>
                  <span className={`font-mono text-xs ${textValue}`}>{timeScalePercent}%</span>
                </div>
                <input
                  type="range"
                  id="slider-time-size"
                  min="20"
                  max="100"
                  step="1"
                  value={timeScalePercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateSettings({ fontSizeScale: Math.max(0.2, val / 100) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* 2. Full Date Size Slider */}
              <div>
                <div className="flex justify-between items-center text-[11px] sm:text-[12px] mb-1">
                  <span className={`text-[11px] sm:text-[12px] ${textHeading}`}>{isTh ? 'ขนาดวันที่แบบเต็ม' : 'Full Date Size'}</span>
                  <span className={`font-mono text-xs ${textValue}`}>{dateScalePercent}%</span>
                </div>
                <input
                  type="range"
                  id="slider-date-size"
                  min="20"
                  max="100"
                  step="1"
                  value={dateScalePercent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateSettings({ dateFontSizeScale: Math.max(0.2, val / 100) });
                  }}
                  className="w-full accent-indigo-600 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* 3. Screen Brightness Slider */}
              <div>
                <div className="flex justify-between items-center text-[11px] sm:text-[12px] mb-1">
                  <span className={`text-[11px] sm:text-[12px] ${textHeading}`}>{isTh ? 'ความสว่างหน้าจอ' : 'Screen Brightness'}</span>
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
        className={`flex items-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 py-1 sm:py-2 rounded-xl sm:rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
          currentTheme.isLight
            ? 'bg-white/85 border-zinc-300/80 text-zinc-800 shadow-zinc-400/20'
            : 'bg-zinc-900/85 border-zinc-700/80 text-zinc-100 shadow-black/60'
        }`}
      >
        {/* Clock Style Selector Pills (Icon-only) */}
        <div className="flex items-center bg-black/10 dark:bg-white/5 rounded-lg sm:rounded-xl p-0.5 border border-white/5">
          {clockStyles.map((s) => {
            const isActive = settings.clockStyle === s.id;
            return (
              <button
                key={s.id}
                id={`style-btn-${s.id}`}
                type="button"
                onClick={() => updateSettings({ clockStyle: s.id })}
                className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-all flex items-center justify-center ${
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
        <div className="w-[1px] h-3.5 sm:h-4 bg-zinc-500/30 mx-0.5" />

        {/* 12H / 24H Toggle */}
        <button
          id="btn-toggle-12-24"
          type="button"
          onClick={() => updateSettings({ is24Hour: !settings.is24Hour })}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
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
          <SunMoon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Language Toggle (TH / EN) */}
        <button
          id="btn-toggle-lang"
          type="button"
          onClick={() => updateSettings({ language: settings.language === 'th' ? 'en' : 'th' })}
          className="p-1 sm:p-1.5 rounded-md sm:rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center text-zinc-400 hover:text-zinc-200"
          title={isTh ? 'ภาษา: ไทย (คลิกสลับเป็น EN)' : 'Language: English (Click for TH)'}
          aria-label="Switch Language"
        >
          <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Theme Picker Popover Toggle Button */}
        <button
          id="btn-theme-popover-toggle"
          type="button"
          onClick={() => setActivePopover(activePopover === 'theme' ? 'none' : 'theme')}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border transition-all flex items-center justify-center relative ${
            activePopover === 'theme'
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
              : 'border-transparent hover:border-zinc-500/30 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isTh ? 'เลือกธีมสี' : 'Color Themes'}
          aria-label="Select Theme"
        >
          <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: currentTheme.progressColor }} />
          <span
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-black/40"
            style={{ backgroundColor: currentTheme.progressColor }}
          />
        </button>

        {/* Font Picker Popover Toggle Button */}
        <button
          id="btn-font-popover-toggle"
          type="button"
          onClick={() => setActivePopover(activePopover === 'font' ? 'none' : 'font')}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border transition-all flex items-center justify-center relative ${
            activePopover === 'font'
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
              : 'border-transparent hover:border-zinc-500/30 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isTh ? 'เลือกฟอนต์ตัวเลขหลัก' : 'Main Time Font'}
          aria-label="Select Font"
        >
          <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          id="btn-toggle-sound"
          type="button"
          onClick={() => updateSettings({ enableTickSound: !settings.enableTickSound })}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border border-transparent hover:border-zinc-500/30 hover:bg-white/10 transition-all flex items-center justify-center ${
            settings.enableTickSound ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title={settings.enableTickSound ? (isTh ? 'เปิดเสียงติ๊ก' : 'Tick ON') : (isTh ? 'ปิดเสียงติ๊ก' : 'Tick OFF')}
          aria-label="Toggle Tick Sound"
        >
          {settings.enableTickSound ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Quick Settings Popover Toggle Button */}
        <button
          id="btn-quick-settings-toggle"
          type="button"
          onClick={() => setActivePopover(activePopover === 'settings' ? 'none' : 'settings')}
          className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg border transition-all flex items-center justify-center ${
            activePopover === 'settings'
              ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
              : 'border-transparent hover:border-zinc-500/30 hover:bg-white/10 text-zinc-400 hover:text-zinc-200'
          }`}
          title={isTh ? 'การตั้งค่าเพิ่มเติม' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Fullscreen Button */}
        <button
          id="btn-toggle-fullscreen"
          type="button"
          onClick={toggleFullscreen}
          className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-600/40 shadow-sm transition-all flex items-center justify-center"
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
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />}
        </button>
      </div>
    </div>
  );
};
