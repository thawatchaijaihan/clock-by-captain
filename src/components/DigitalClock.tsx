import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';

interface DigitalClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  showMilliseconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  fontSizeScale: number;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  date,
  is24Hour,
  showSeconds,
  showMilliseconds,
  useThaiNumerals,
  theme,
  fontSizeScale,
}) => {
  const { hours, minutes, seconds, milliseconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

  return (
    <div id="digital-clock-display" className="flex flex-col items-center justify-center select-none w-full my-1 sm:my-3">
      {/* Main Clock Numerals Group */}
      <div 
        className="flex items-baseline justify-center font-bold-display font-black leading-none tracking-[-0.05em] tabular-nums drop-shadow-2xl transition-all duration-300"
        style={{
          fontSize: `calc(${fontSizeScale} * clamp(4.5rem, ${showSeconds ? 'min(21.5vw, 42vh)' : 'min(29vw, 48vh)'}, 25rem))`,
          lineHeight: 0.92,
        }}
      >
        {/* Hours Box */}
        <span className={`inline-block ${theme.textPrimaryClass} ${theme.glowClass}`}>
          {hours}
        </span>

        {/* Solid Colon Separator */}
        <span className={`inline-block px-1 sm:px-2 md:px-3 ${theme.colonClass} opacity-80 select-none`}>
          :
        </span>

        {/* Minutes Box */}
        <span className={`inline-block ${theme.textPrimaryClass} ${theme.glowClass}`}>
          {minutes}
        </span>

        {/* Seconds (if enabled) */}
        {showSeconds && (
          <>
            <span className={`inline-block px-1 sm:px-2 md:px-3 ${theme.colonClass} opacity-80 select-none`}>
              :
            </span>
            <span className={`inline-block ${theme.textPrimaryClass} ${theme.glowClass}`}>
              {seconds}
            </span>
          </>
        )}

        {/* Milliseconds (if enabled) */}
        {showMilliseconds && (
          <span 
            className={`inline-block ml-2 text-[0.32em] font-bold tracking-tight opacity-80 ${theme.textAccentClass}`}
          >
            .{milliseconds}
          </span>
        )}

        {/* AM/PM Tag (in 12h mode) */}
        {!is24Hour && period && (
          <span className={`inline-block ml-3 text-[0.2em] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md align-middle ${theme.tagBgClass}`}>
            {period}
          </span>
        )}
      </div>
    </div>
  );
};
