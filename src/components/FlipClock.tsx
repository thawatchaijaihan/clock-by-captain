import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';
import { TimeFontFamily } from '../types';
import { getTimeFontDefinition } from '../utils/fontConfig';

interface FlipClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  fontSizeScale?: number;
  timeFont?: TimeFontFamily;
}

const FlipCard: React.FC<{
  value: string;
  theme: ThemeDefinition;
  label?: string;
  fontFamily?: string;
}> = ({ value, theme, label, fontFamily }) => {
  return (
    <div className="flex flex-col items-center shrink-0 select-none">
      <div
        className={`relative flex items-center justify-center rounded-2xl sm:rounded-3xl md:rounded-[2rem] w-[2.2em] sm:w-[2.35em] md:w-[2.5em] h-[1.35em] sm:h-[1.45em] md:h-[1.5em] shadow-2xl border shrink-0 ${
          theme.isLight
            ? 'bg-zinc-100 border-zinc-300 text-zinc-900 shadow-zinc-200'
            : 'bg-zinc-900/95 border-zinc-800 text-zinc-100 shadow-black/80'
        }`}
        style={{
          fontSize: 'clamp(4.2rem, min(12.5vw, 23vh), 13rem)',
          fontFamily,
        }}
      >
        {/* Center horizontal divider line simulating flip cards */}
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-black/40 z-10" />

        <div className="flex items-center justify-center w-full select-none leading-none">
          {value.split('').map((char, i) => (
            <span
              key={i}
              className={`w-[0.58em] inline-flex items-center justify-center text-center font-bold tracking-tight shrink-0 select-none ${theme.textPrimaryClass}`}
              style={{
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      {label && (
        <span className={`text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-widest mt-2.5 sm:mt-3.5 ${theme.textSecondaryClass}`}>
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
  timeFont,
}) => {
  const fontDef = getTimeFontDefinition(timeFont);
  const { hours, minutes, seconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

  return (
    <div
      id="flip-clock-display"
      className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 my-4 sm:my-6 select-none transition-transform duration-150 shrink-0"
      style={{
        transform: `scale(${fontSizeScale * 1.35})`,
        transformOrigin: 'center',
      }}
    >
      <FlipCard value={hours} theme={theme} label="ชั่วโมง / Hours" fontFamily={fontDef.fontFamily} />
      
      <span 
        className={`w-[0.35em] inline-flex items-center justify-center text-center shrink-0 font-bold ${theme.colonClass} select-none`} 
        style={{ 
          fontFamily: fontDef.fontFamily,
          fontSize: 'clamp(2.5rem, min(7vw, 13vh), 7rem)',
        }}
      >
        :
      </span>

      <FlipCard value={minutes} theme={theme} label="นาที / Minutes" fontFamily={fontDef.fontFamily} />

      {showSeconds && (
        <>
          <span 
            className={`w-[0.35em] inline-flex items-center justify-center text-center shrink-0 font-bold ${theme.colonClass} select-none`} 
            style={{ 
              fontFamily: fontDef.fontFamily,
              fontSize: 'clamp(2.5rem, min(7vw, 13vh), 7rem)',
            }}
          >
            :
          </span>
          <FlipCard value={seconds} theme={theme} label="วินาที / Seconds" fontFamily={fontDef.fontFamily} />
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
