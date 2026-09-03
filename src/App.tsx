import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ClockSettings,
  LanguageMode,
} from './types';
import { THEMES } from './utils/themeConfig';
import { DigitalClock } from './components/DigitalClock';
import { DateDisplay } from './components/DateDisplay';
import { AnalogClock } from './components/AnalogClock';
import { FlipClock } from './components/FlipClock';
import { MinimalistClock } from './components/MinimalistClock';
import { ControlBar } from './components/ControlBar';
import { playTickSound, playHourlyChime } from './utils/audioUtils';
import { getTimezoneInfo } from './utils/timeUtils';
import { Globe2, Sparkles } from 'lucide-react';

const DEFAULT_SETTINGS: ClockSettings = {
  clockStyle: 'digital-modern',
  theme: 'pastel-canvas-lavender',
  timeFont: 'inter',
  language: 'th',
  is24Hour: true,
  showSeconds: true,
  showMilliseconds: false,
  calendarSystem: 'be',
  useThaiNumerals: false,
  enableTickSound: false,
  enableHourlyChime: false,
  showDayProgress: false,
  showYearProgress: false,
  showDayPill: false,
  showFullDateText: true,
  showDayOfYearBadge: false,
  showDaysRemainingBadge: false,
  showTimezone: false,
  showFooterBadge: false,
  dimmerBrightness: 100,
  fontSizeScale: 1.0,
  dateFontSizeScale: 1.0,
  autoHideControls: true,
  backgroundPattern: 'none',
};

export default function App() {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    document.title = 'Show Time By Captain';
  }, []);
  const [settings, setSettings] = useState<ClockSettings>(() => {
    try {
      const saved = localStorage.getItem('realtime_clock_settings_v2') || localStorage.getItem('realtime_clock_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme === 'bold-typography') {
          parsed.theme = 'pastel-canvas-lavender';
        }
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          // Guarantee clean minimal defaults unless user specifically customized them
          showFooterBadge: false,
          showDayOfYearBadge: false,
          showDaysRemainingBadge: false,
          showDayProgress: false,
          showYearProgress: false,
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const prevSecondRef = useRef<number>(currentTime.getSeconds());
  const prevHourRef = useRef<number>(currentTime.getHours());
  const hideTimerRef = useRef<number | null>(null);

  const currentTheme = THEMES[settings.theme] || THEMES['cyber-cyan'];
  const tzInfo = getTimezoneInfo();

  // Save settings on change (Local Storage)
  const updateSettings = useCallback((partial: Partial<ClockSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('realtime_clock_settings', JSON.stringify(next));
      } catch {
        // LocalStorage fallback
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('realtime_clock_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // Ignore
    }
  }, []);

  // Real-time animation loop with millisecond precision
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);

      const curSec = now.getSeconds();
      const curHour = now.getHours();

      // Second tick sound
      if (settings.enableTickSound && curSec !== prevSecondRef.current) {
        playTickSound();
      }

      // Hourly chime
      if (
        settings.enableHourlyChime &&
        curHour !== prevHourRef.current &&
        now.getMinutes() === 0 &&
        curSec === 0
      ) {
        playHourlyChime();
      }

      prevSecondRef.current = curSec;
      prevHourRef.current = curHour;

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [settings.enableTickSound, settings.enableHourlyChime]);

  // Fullscreen state detector
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fullscreen toggle function
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // In iframe or restricted environments
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, []);

  // Auto-hide controls timer on inactivity
  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (settings.autoHideControls) {
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  }, [settings.autoHideControls]);

  useEffect(() => {
    const handleActivity = () => {
      showControlsTemporarily();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    showControlsTemporarily();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showControlsTemporarily]);

  // Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in an input, don't trigger shortcuts
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (key === 't') {
        const keys = Object.keys(THEMES) as Array<keyof typeof THEMES>;
        const curIdx = keys.indexOf(settings.theme);
        updateSettings({ theme: keys[(curIdx + 1) % keys.length] });
      } else if (key === 'l') {
        updateSettings({ language: settings.language === 'th' ? 'en' : 'th' });
      } else if (key === 'm') {
        updateSettings({ enableTickSound: !settings.enableTickSound });
      } else if (key === ' ') {
        e.preventDefault();
        const styles: ClockSettings['clockStyle'][] = [
          'digital-modern',
          'flip',
          'analog-minimal',
          'minimalist',
        ];
        const curIdx = styles.indexOf(settings.clockStyle);
        updateSettings({ clockStyle: styles[(curIdx + 1) % styles.length] });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const keys = Object.keys(THEMES) as Array<keyof typeof THEMES>;
        const curIdx = keys.indexOf(settings.theme);
        updateSettings({ theme: keys[(curIdx - 1 + keys.length) % keys.length] });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const keys = Object.keys(THEMES) as Array<keyof typeof THEMES>;
        const curIdx = keys.indexOf(settings.theme);
        updateSettings({ theme: keys[(curIdx + 1) % keys.length] });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, toggleFullscreen, updateSettings]);

  return (
    <main
      id="realtime-clock-app"
      className={`relative w-screen h-screen overflow-hidden flex flex-col justify-between items-center transition-colors duration-500 select-none ${currentTheme.bgClass} ${!currentTheme.isLight ? 'dark' : ''}`}
      style={{
        filter: `brightness(${settings.dimmerBrightness}%)`,
      }}
    >
      {/* Background Pastel / Minimalist Pattern Overlay */}
      {settings.backgroundPattern && settings.backgroundPattern !== 'none' && (
        <div
          className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
            settings.backgroundPattern === 'dots'
              ? currentTheme.isLight
                ? 'bg-dot-grid-pastel opacity-70'
                : 'bg-dot-grid opacity-15'
              : settings.backgroundPattern === 'grid'
              ? currentTheme.isLight
                ? 'bg-grid-pastel opacity-80'
                : 'bg-grid-dark opacity-20'
              : settings.backgroundPattern === 'waves'
              ? 'bg-waves-pastel opacity-80'
              : ''
          }`}
        />
      )}

      {/* Top Header Bar */}
      {settings.showTimezone && (
        <header
          className={`w-full flex items-start justify-end px-6 sm:px-12 pt-6 sm:pt-8 z-30 transition-all duration-500 ${
            controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          {/* Reference & Timezone */}
          <div className="flex flex-col text-right">
            <span className={`text-[10px] font-bold tracking-[0.4em] uppercase mb-1.5 ${
              currentTheme.isLight ? 'text-indigo-600' : 'text-indigo-400'
            }`}>
              {settings.language === 'th' ? 'ข้อมูลอ้างอิง' : 'Reference'}
            </span>
            <div className={`flex items-center justify-end gap-1.5 text-xs font-medium tracking-widest uppercase opacity-90 font-mono ${
              currentTheme.isLight ? 'text-zinc-700 font-semibold' : 'text-zinc-300'
            }`}>
              <Globe2 className={`w-3.5 h-3.5 ${currentTheme.isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
              <span>{tzInfo.gmtString}</span>
              <span className="opacity-50">/</span>
              <span>{tzInfo.timeZone}</span>
            </div>
          </div>
        </header>
      )}

      {/* Center Stage: Fullscreen Clock & Fullscreen Date Layout */}
      <div className="flex-1 w-full max-w-[96vw] xl:max-w-[98vw] flex flex-col items-center justify-center px-2 sm:px-4 z-20 transition-all">
        {/* Render Selected Clock Style */}
        {settings.clockStyle === 'digital-modern' && (
          <DigitalClock
            date={currentTime}
            is24Hour={settings.is24Hour}
            showSeconds={settings.showSeconds}
            showMilliseconds={settings.showMilliseconds}
            useThaiNumerals={settings.useThaiNumerals}
            theme={currentTheme}
            fontSizeScale={settings.fontSizeScale}
            timeFont={settings.timeFont}
          />
        )}

        {settings.clockStyle === 'flip' && (
          <FlipClock
            date={currentTime}
            is24Hour={settings.is24Hour}
            showSeconds={settings.showSeconds}
            useThaiNumerals={settings.useThaiNumerals}
            theme={currentTheme}
            fontSizeScale={settings.fontSizeScale}
            timeFont={settings.timeFont}
          />
        )}

        {settings.clockStyle === 'analog-minimal' && (
          <AnalogClock
            date={currentTime}
            theme={currentTheme}
            useThaiNumerals={settings.useThaiNumerals}
            fontSizeScale={settings.fontSizeScale}
          />
        )}

        {settings.clockStyle === 'minimalist' && (
          <MinimalistClock
            date={currentTime}
            is24Hour={settings.is24Hour}
            showSeconds={settings.showSeconds}
            useThaiNumerals={settings.useThaiNumerals}
            theme={currentTheme}
            fontSizeScale={settings.fontSizeScale}
            timeFont={settings.timeFont}
          />
        )}

        {/* Fullscreen Date Display */}
        <DateDisplay
          date={currentTime}
          language={settings.language}
          calendarSystem={settings.calendarSystem}
          useThaiNumerals={settings.useThaiNumerals}
          theme={currentTheme}
          showDayPill={settings.showDayPill}
          showFullDateText={settings.showFullDateText}
          showDayOfYearBadge={settings.showDayOfYearBadge}
          showDaysRemainingBadge={settings.showDaysRemainingBadge}
          showDayProgress={settings.showDayProgress}
          showYearProgress={settings.showYearProgress}
          dateFontSizeScale={settings.dateFontSizeScale}
        />
      </div>

      {/* Bottom Spacer / Controls Area */}
      <footer className="w-full flex flex-col items-center justify-end pb-6 z-30">
        {/* Precision Chronicle Badge */}
        {settings.showFooterBadge && (
          <div className={`mb-3 transition-all duration-500 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`px-5 py-1.5 border rounded-full backdrop-blur-md ${
              currentTheme.isLight ? 'border-zinc-300/80 bg-white/80 shadow-xs' : 'border-white/10 bg-white/5'
            }`}>
              <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${
                currentTheme.isLight ? 'text-zinc-600' : 'text-white/40'
              }`}>
                {settings.language === 'th' ? 'นาฬิกาดิจิทัลความแม่นยำสูง' : 'Precision Digital Chronicle'}
              </span>
            </div>
          </div>
        )}

        {/* Floating Control Bar (All settings and controls contained here) */}
        <ControlBar
          settings={settings}
          updateSettings={updateSettings}
          resetSettings={resetSettings}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          currentTheme={currentTheme}
          isVisible={controlsVisible}
        />
      </footer>
    </main>
  );
}
