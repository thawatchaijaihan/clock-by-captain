import React from 'react';
import { ThemeDefinition } from '../utils/themeConfig';
import { toThaiNumerals } from '../utils/timeUtils';
import { getWatchCaseForTheme } from '../utils/watchCaseConfig';

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
  const watchCase = getWatchCaseForTheme(
    theme.id,
    Boolean(theme.isLight),
    theme.progressColor || '#4f46e5',
    theme.previewColors.bg || '#10141d'
  );

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
      className="flex items-center justify-center my-3 sm:my-5 transition-transform duration-150 relative select-none"
      style={{
        transform: `scale(${fontSizeScale * 1.35})`,
        transformOrigin: 'center',
      }}
    >
      {/* 1. Watch Crown at 3 o'clock (เม็ดมะยมตัวเรือนนาฬิกา) */}
      <div 
        className="absolute right-[-10px] sm:right-[-14px] top-1/2 -translate-y-1/2 w-3 sm:w-4 h-9 sm:h-12 rounded-r-md z-0 shadow-lg border border-l-0"
        style={{
          background: watchCase.crownGradient,
          borderColor: watchCase.crownBorder,
          boxShadow: '3px 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        {/* Crown knurling / ridges */}
        <div className="w-full h-full flex flex-col justify-between py-1 opacity-40">
          <div className="w-full h-[1.5px] bg-black/50" />
          <div className="w-full h-[1.5px] bg-black/50" />
          <div className="w-full h-[1.5px] bg-black/50" />
          <div className="w-full h-[1.5px] bg-black/50" />
        </div>
      </div>

      {/* 2. Outer Bezel / Case Body (ตัวเรือนนาฬิกาชั้นนอก) */}
      <div 
        className="relative w-[min(76vw,65vh)] h-[min(76vw,65vh)] sm:w-[min(82vw,70vh)] sm:h-[min(82vw,70vh)] max-w-[50rem] max-h-[50rem] rounded-full p-4 sm:p-5 md:p-6 flex items-center justify-center transition-all duration-300 z-10"
        style={{
          background: watchCase.bezelGradient,
          border: `1.5px solid ${watchCase.bezelBorder}`,
          boxShadow: watchCase.bezelShadow,
        }}
      >
        {/* 3. Inner Dial Ring / Chapter Ring with Dial Face (หน้าปัดด้านใน) */}
        <div 
          className="relative w-full h-full rounded-full p-2 flex items-center justify-center transition-all duration-300 overflow-hidden"
          style={{
            background: watchCase.dialBackground,
            border: `2px solid ${watchCase.dialBorder}`,
            boxShadow: watchCase.dialInnerShadow,
          }}
        >
          {/* Minute & Hour Tick Marks */}
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
                  className={`rounded-full transition-colors ${
                    isHour
                      ? 'w-[2px] sm:w-[2.5px] h-3.5 sm:h-5 shadow-xs'
                      : 'w-[1px] sm:w-[1.5px] h-1.5 sm:h-2 opacity-60'
                  }`}
                  style={{
                    backgroundColor: isHour ? watchCase.hourTickColor : watchCase.minuteTickColor,
                  }}
                />
              </div>
            );
          })}

          {/* Hour Numerals */}
          {hourNumbers.map((num, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const radius = 38; // percent
            const x = 50 + radius * Math.sin(angle);
            const y = 50 - radius * Math.cos(angle);

            const displayNum = useThaiNumerals ? toThaiNumerals(num) : num;

            return (
              <div
                key={num}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base md:text-xl font-bold font-mono tracking-tight select-none drop-shadow-xs"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  color: watchCase.numeralColor,
                }}
              >
                {displayNum}
              </div>
            );
          })}

          {/* Center Brand / Subtitle Accent */}
          <div className="absolute top-[28%] text-center pointer-events-none opacity-40 select-none">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: watchCase.numeralColor }}>
              CHRONO
            </span>
          </div>

          {/* Hour Hand (เข็มชั่วโมง) */}
          <div
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-10 transition-transform duration-75"
            style={{
              height: '27%',
              width: '5.5px',
              transform: `rotate(${hourAngle}deg)`,
            }}
          >
            <div
              className="w-full h-full rounded-full shadow-md border border-black/20 relative"
              style={{
                backgroundColor: watchCase.hourMinuteHandColor,
              }}
            >
              {/* Luminous Inset Line */}
              <div 
                className="absolute inset-x-1 top-2 bottom-3 rounded-full opacity-80"
                style={{ backgroundColor: watchCase.handAccentColor }}
              />
            </div>
          </div>

          {/* Minute Hand (เข็มนาที) */}
          <div
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 origin-bottom z-20 transition-transform duration-75"
            style={{
              height: '39%',
              width: '4px',
              transform: `rotate(${minuteAngle}deg)`,
            }}
          >
            <div
              className="w-full h-full rounded-full shadow-md border border-black/20 relative"
              style={{
                backgroundColor: watchCase.hourMinuteHandColor,
              }}
            >
              {/* Luminous Inset Line */}
              <div 
                className="absolute inset-x-0.5 top-2 bottom-3 rounded-full opacity-80"
                style={{ backgroundColor: watchCase.handAccentColor }}
              />
            </div>
          </div>

          {/* Second Hand (เข็มวินาที) */}
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
              style={{ backgroundColor: watchCase.secondHandColor }}
            />
            {/* Counterbalance tail */}
            <div
              className="w-1.5 h-7 -bottom-7 left-1/2 -translate-x-1/2 absolute rounded-full shadow-xs"
              style={{ backgroundColor: watchCase.secondHandColor }}
            />
          </div>

          {/* Center Pivot Cap (แกนหมุนตรงกลาง) */}
          <div
            className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full z-40 shadow-md border border-black/30"
            style={{ backgroundColor: watchCase.pivotColor }}
          />
        </div>
      </div>
    </div>
  );
};
