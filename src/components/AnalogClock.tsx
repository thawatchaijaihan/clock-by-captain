import React from 'react';
import { ThemeDefinition } from '../utils/themeConfig';
import { toThaiNumerals } from '../utils/timeUtils';

interface AnalogClockProps {
  date: Date;
  theme: ThemeDefinition;
  useThaiNumerals: boolean;
  fontSizeScale?: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  date,
  theme,
  useThaiNumerals,
  fontSizeScale = 1.0,
}) => {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
  const minutes = date.getMinutes() + seconds / 60;
  const hours = (date.getHours() % 12) + minutes / 60;

  const secondAngle = seconds * 6; // 360 / 60
  const minuteAngle = minutes * 6; // 360 / 60
  const hourAngle = hours * 30; // 360 / 12

  const hourNumbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div
      id="analog-clock-container"
      className="flex items-center justify-center my-3 sm:my-5 transition-transform duration-150"
      style={{
        transform: fontSizeScale !== 1 ? `scale(${fontSizeScale})` : undefined,
        transformOrigin: 'center',
      }}
    >
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem] rounded-full p-2 flex items-center justify-center shadow-2xl transition-all duration-300"
        style={{
          background: theme.isLight
            ? 'radial-gradient(circle, #fbf9f4 55%, #ece7dc 100%)'
            : 'radial-gradient(circle, rgba(28,29,36,0.75) 0%, rgba(13,14,17,0.95) 100%)',
          border: `2px solid ${theme.isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        {/* Minute/Hour tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <div
              key={i}
              className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom"
              style={{
                height: '50%',
                transform: `rotate(${i * 6}deg)`,
              }}
            >
              <div
                className={`w-0.5 rounded-full ${
                  isHour
                    ? `h-3 sm:h-4 ${theme.isLight ? 'bg-zinc-800' : 'bg-zinc-200'}`
                    : `h-1.5 sm:h-2 ${theme.isLight ? 'bg-zinc-300' : 'bg-zinc-700'}`
                }`}
              />
            </div>
          );
        })}

        {/* Hour Numerals */}
        {hourNumbers.map((num, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const radius = 40; // percent
          const x = 50 + radius * Math.sin(angle);
          const y = 50 - radius * Math.cos(angle);

          const displayNum = useThaiNumerals ? toThaiNumerals(num) : num;

          return (
            <div
              key={num}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base md:text-lg font-bold ${
                theme.textPrimaryClass
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              {displayNum}
            </div>
          );
        })}

        {/* Center Pivot Base */}
        <div
          className="absolute w-4 h-4 rounded-full z-30 shadow-md border border-black/20"
          style={{ backgroundColor: theme.progressColor }}
        />

        {/* Hour Hand */}
        <div
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-10 transition-transform duration-75"
          style={{
            height: '28%',
            width: '4.5px',
            transform: `rotate(${hourAngle}deg)`,
          }}
        >
          <div
            className={`w-full h-full rounded-full shadow-md ${
              theme.isLight ? 'bg-zinc-900' : 'bg-zinc-100'
            }`}
          />
        </div>

        {/* Minute Hand */}
        <div
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-20 transition-transform duration-75"
          style={{
            height: '40%',
            width: '3px',
            transform: `rotate(${minuteAngle}deg)`,
          }}
        >
          <div
            className={`w-full h-full rounded-full shadow-md ${
              theme.isLight ? 'bg-zinc-700' : 'bg-zinc-300'
            }`}
          />
        </div>

        {/* Second Hand */}
        <div
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-30"
          style={{
            height: '46%',
            width: '1.5px',
            transform: `rotate(${secondAngle}deg)`,
          }}
        >
          <div
            className="w-full h-full rounded-full shadow-sm"
            style={{ backgroundColor: theme.progressColor }}
          />
          {/* Counterbalance tail */}
          <div
            className="w-1 h-6 -bottom-6 left-1/2 -translate-x-1/2 absolute rounded-full"
            style={{ backgroundColor: theme.progressColor }}
          />
        </div>
      </div>
    </div>
  );
};
