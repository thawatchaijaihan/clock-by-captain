import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';
import { TimeFontFamily } from '../types';
import { getTimeFontDefinition } from '../utils/fontConfig';

interface DigitalClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  showMilliseconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  fontSizeScale: number;
  timeFont?: TimeFontFamily;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  date,
  is24Hour,
  showSeconds,
  showMilliseconds,
  useThaiNumerals,
  theme,
  fontSizeScale,
  timeFont,
}) => {
  const fontDef = getTimeFontDefinition(timeFont);
  const digitWidthClass = fontDef.digitWidth || 'w-[0.62em]';
  const digitGapClass = fontDef.digitGap || 'gap-[0.03em]';
  const { hours, minutes, seconds, milliseconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

  // Fixed-width digit cell with font-specific spacing prevents collision and horizontal shifting
  const renderFixedDigits = (str: string, extraClass: string = '') => {
    return (
      <span className={`inline-flex items-center justify-center ${digitGapClass} ${extraClass}`}>
        {str.split('').map((char, i) => (
          <span
            key={i}
            className={`${digitWidthClass} inline-flex items-center justify-center text-center shrink-0 select-none`}
          >
            {char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div id="digital-clock-display" className="flex flex-col items-center justify-center select-none w-full my-1 sm:my-3">
      {/* Main Clock Numerals Group - Fixed slot width prevents any second-by-second jitter */}
      <div 
        className="flex items-center justify-center font-bold font-black leading-none select-none"
        style={{
          fontFamily: fontDef.fontFamily,
          fontSize: `calc(${fontSizeScale} * clamp(4.2rem, ${showSeconds ? 'min(23vw, 46vh)' : 'min(33vw, 56vh)'}, 34rem))`,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {/* Hours Box */}
        {renderFixedDigits(hours, `${theme.textPrimaryClass} ${theme.glowClass}`)}

        {/* Solid Colon Separator */}
        <span className={`w-[0.38em] mx-[0.06em] inline-flex items-center justify-center text-center shrink-0 ${theme.colonClass} ${theme.glowClass} opacity-85 select-none`}>
          :
        </span>

        {/* Minutes Box */}
        {renderFixedDigits(minutes, `${theme.textPrimaryClass} ${theme.glowClass}`)}

        {/* Seconds (if enabled) */}
        {showSeconds && (
          <>
            <span className={`w-[0.38em] mx-[0.06em] inline-flex items-center justify-center text-center shrink-0 ${theme.colonClass} ${theme.glowClass} opacity-85 select-none`}>
              :
            </span>
            {renderFixedDigits(seconds, `${theme.textPrimaryClass} ${theme.glowClass}`)}
          </>
        )}

        {/* Milliseconds (if enabled) */}
        {showMilliseconds && (
          <span 
            className={`inline-flex items-center ml-2 text-[0.32em] font-bold tracking-tight opacity-80 ${theme.textAccentClass}`}
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
