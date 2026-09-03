import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';
import { TimeFontFamily } from '../types';
import { getTimeFontDefinition } from '../utils/fontConfig';

interface MinimalistClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  fontSizeScale?: number;
  timeFont?: TimeFontFamily;
}

export const MinimalistClock: React.FC<MinimalistClockProps> = ({
  date,
  is24Hour,
  showSeconds,
  useThaiNumerals,
  theme,
  fontSizeScale = 1.0,
  timeFont,
}) => {
  const fontDef = getTimeFontDefinition(timeFont);
  const digitWidthClass = fontDef.digitWidth || 'w-[0.62em]';
  const digitGapClass = fontDef.digitGap || 'gap-[0.03em]';
  const { hours, minutes, seconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

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
    <div id="minimalist-clock-display" className="flex flex-col items-center justify-center my-4 select-none text-center">
      <div 
        className="flex items-center justify-center font-light tracking-normal select-none"
        style={{
          fontFamily: fontDef.fontFamily,
          fontSize: `calc(${fontSizeScale} * clamp(4.2rem, ${showSeconds ? 'min(23vw, 46vh)' : 'min(33vw, 56vh)'}, 34rem))`,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {renderFixedDigits(hours, theme.textPrimaryClass)}
        <span className={`w-[0.35em] inline-flex items-center justify-center text-center shrink-0 font-thin ${theme.textSecondaryClass} opacity-50`}>:</span>
        {renderFixedDigits(minutes, theme.textPrimaryClass)}
        {showSeconds && (
          <>
            <span className={`w-[0.35em] inline-flex items-center justify-center text-center shrink-0 font-thin ${theme.textSecondaryClass} opacity-50`}>:</span>
            {renderFixedDigits(seconds, `font-normal ${theme.textAccentClass}`)}
          </>
        )}
        {!is24Hour && period && (
          <span className={`text-base sm:text-xl font-normal self-end mb-3 ml-2 ${theme.textSecondaryClass}`}>
            {period}
          </span>
        )}
      </div>
    </div>
  );
};
