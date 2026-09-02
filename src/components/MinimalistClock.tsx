import React from 'react';
import { formatTimeComponents } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';

interface MinimalistClockProps {
  date: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
}

export const MinimalistClock: React.FC<MinimalistClockProps> = ({
  date,
  is24Hour,
  showSeconds,
  useThaiNumerals,
  theme,
}) => {
  const { hours, minutes, seconds, period } = formatTimeComponents(
    date,
    is24Hour,
    useThaiNumerals
  );

  return (
    <div id="minimalist-clock-display" className="flex flex-col items-center justify-center my-4 select-none text-center">
      <div 
        className="flex items-center justify-center space-x-2 font-light tracking-widest font-mono-num"
        style={{
          fontSize: 'clamp(4.5rem, min(19vw, 36vh), 18rem)',
          lineHeight: 1,
        }}
      >
        <span className={theme.textPrimaryClass}>{hours}</span>
        <span className={`font-thin ${theme.textSecondaryClass} opacity-50`}>:</span>
        <span className={theme.textPrimaryClass}>{minutes}</span>
        {showSeconds && (
          <>
            <span className={`font-thin ${theme.textSecondaryClass} opacity-50`}>:</span>
            <span className={`font-normal ${theme.textAccentClass}`}>{seconds}</span>
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
