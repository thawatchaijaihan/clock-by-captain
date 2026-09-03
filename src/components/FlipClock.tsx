import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';

interface FlipClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  fontSizeScale?: number;
}

const FlipCard: React.FC<{
  value: string;
  theme: ThemeDefinition;
  label?: string;
}> = ({ value, theme, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center rounded-xl sm:rounded-2xl md:rounded-3xl px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-9 shadow-2xl border ${
          theme.isLight
            ? 'bg-zinc-100 border-zinc-300 text-zinc-900 shadow-zinc-200'
            : 'bg-zinc-900/90 border-zinc-800 text-zinc-100 shadow-black/80'
        }`}
      >
        {/* Center horizontal divider line simulating flip cards */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/40 z-10" />

        <span className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-mono-num tracking-tight ${theme.textPrimaryClass}`}>
          {value}
        </span>
      </div>
      {label && (
        <span className={`text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest mt-2 sm:mt-3 ${theme.textSecondaryClass}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export const FlipClock: React.FC<FlipClockProps> = ({
  date,
  is24Hour,
  showSeconds,
  useThaiNumerals,
  theme,
  fontSizeScale = 1.0,
}) => {
  const { hours, minutes, seconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

  return (
    <div
      id="flip-clock-display"
      className="flex items-center justify-center gap-2 sm:gap-4 my-4 select-none transition-transform duration-150"
      style={{
        transform: fontSizeScale !== 1 ? `scale(${fontSizeScale})` : undefined,
        transformOrigin: 'center',
      }}
    >
      <FlipCard value={hours} theme={theme} label="ชั่วโมง / Hours" />
      
      <span className={`text-2xl sm:text-4xl md:text-6xl font-bold ${theme.colonClass} select-none`}>
        :
      </span>

      <FlipCard value={minutes} theme={theme} label="นาที / Minutes" />

      {showSeconds && (
        <>
          <span className={`text-2xl sm:text-4xl md:text-6xl font-bold ${theme.colonClass} select-none`}>
            :
          </span>
          <FlipCard value={seconds} theme={theme} label="วินาที / Seconds" />
        </>
      )}

      {!is24Hour && period && (
        <div className="self-end mb-6 ml-2">
          <span className={`px-2.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg ${theme.tagBgClass}`}>
            {period}
          </span>
        </div>
      )}
    </div>
  );
};
