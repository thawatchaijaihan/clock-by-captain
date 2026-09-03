import React from 'react';
import { CalendarSystem, LanguageMode } from '../types';
import { formatDateString, getProgressStats, toThaiNumerals } from '../utils/timeUtils';
import { ThemeDefinition } from '../utils/themeConfig';
import { Calendar, Compass, Sun, Moon } from 'lucide-react';

interface DateDisplayProps {
  date: Date;
  language: LanguageMode;
  calendarSystem: CalendarSystem;
  useThaiNumerals: boolean;
  theme: ThemeDefinition;
  showDayPill: boolean;
  showFullDateText: boolean;
  showDayOfYearBadge: boolean;
  showDaysRemainingBadge: boolean;
  showDayProgress: boolean;
  showYearProgress: boolean;
  dateFontSizeScale?: number;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  language,
  calendarSystem,
  useThaiNumerals,
  theme,
  showDayPill,
  showFullDateText,
  showDayOfYearBadge,
  showDaysRemainingBadge,
  showDayProgress,
  showYearProgress,
  dateFontSizeScale = 1.0,
}) => {
  const { dayOfWeek, dayOfMonth, month, year, fullDateText } = formatDateString(
    date,
    language,
    calendarSystem,
    useThaiNumerals
  );

  const stats = getProgressStats(date);
  const isNight = date.getHours() >= 18 || date.getHours() < 6;

  const formatNum = (num: number | string) => {
    return useThaiNumerals ? toThaiNumerals(num) : num;
  };

  const hasAnyVisible =
    showDayPill ||
    showFullDateText ||
    showDayOfYearBadge ||
    showDaysRemainingBadge ||
    showDayProgress ||
    showYearProgress;

  if (!hasAnyVisible) return null;

  return (
    <div id="fullscreen-date-container" className="flex flex-col items-center justify-center text-center w-full px-2 sm:px-6 select-none">
      {/* Primary Fullscreen Date Banner - Expanded Width */}
      <div className="flex flex-col items-center max-w-7xl mx-auto w-full">
        {/* Day of Week Highlight Pill */}
        {showDayPill && (
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all shadow-sm backdrop-blur-md border ${
            theme.isLight ? 'border-zinc-200 bg-zinc-100/90 text-zinc-800' : 'border-white/10 bg-white/5'
          }`}>
            {isNight ? (
              <Moon className={`w-3.5 h-3.5 ${theme.isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className={theme.textAccentClass}>{dayOfWeek}</span>
            <span className="opacity-30">•</span>
            <span className={theme.isLight ? 'text-zinc-600' : theme.textSecondaryClass}>
              {language === 'th'
                ? `สัปดาห์ที่ ${formatNum(stats.weekNumber)}`
                : `Week ${formatNum(stats.weekNumber)}`}
            </span>
          </div>
        )}

        {/* Large Prominent Full Date Text with Top Divider matching Bold Typography - Perfectly Centered */}
        {showFullDateText && (
          <div className={`w-full max-w-7xl mx-auto border-t pt-4 sm:pt-6 md:pt-7 mt-3 sm:mt-5 flex flex-col items-center justify-center ${
            theme.isLight ? 'border-zinc-300/70' : 'border-white/10'
          }`}>
            <div className="w-full flex items-center justify-center text-center overflow-visible">
              <h2 
                id="main-date-heading"
                className={`text-center whitespace-nowrap inline-block ${theme.textPrimaryClass} font-normal tracking-normal uppercase font-thai transition-all duration-150 select-none`}
                style={{
                  fontSize: `calc(${dateFontSizeScale} * clamp(1.05rem, 3.1vw, 4.5rem))`,
                  lineHeight: 1.25,
                }}
              >
                {fullDateText}
              </h2>
            </div>
          </div>
        )}

        {/* Informative Sub-badges (Day of Year / Days Left) */}
        {(showDayOfYearBadge || showDaysRemainingBadge) && (
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-4 text-xs md:text-sm">
            {showDayOfYearBadge && (
              <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md ${
                theme.isLight 
                  ? 'bg-zinc-100/90 border-zinc-200/90 text-zinc-800' 
                  : 'bg-white/5 border-white/10 text-zinc-300'
              }`}>
                <Calendar className={`w-3.5 h-3.5 ${theme.isLight ? 'text-indigo-600' : 'text-indigo-400 opacity-80'}`} />
                <span className="tracking-wider uppercase text-[11px] font-medium">
                  {language === 'th'
                    ? `วันที่ ${formatNum(stats.dayOfYear)} ของปี`
                    : `Day ${formatNum(stats.dayOfYear)} of year`}
                </span>
              </div>
            )}

            {showDaysRemainingBadge && (
              <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 backdrop-blur-md ${
                theme.isLight 
                  ? 'bg-zinc-100/90 border-zinc-200/90 text-zinc-800' 
                  : 'bg-white/5 border-white/10 text-zinc-300'
              }`}>
                <Compass className={`w-3.5 h-3.5 ${theme.isLight ? 'text-indigo-600' : 'text-indigo-400 opacity-80'}`} />
                <span className="tracking-wider uppercase text-[11px] font-medium">
                  {language === 'th'
                    ? `เหลืออีก ${formatNum(stats.daysRemainingInYear)} วัน`
                    : `${formatNum(stats.daysRemainingInYear)} days remaining`}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bars (Day / Year Elapsed) */}
        {(showDayProgress || showYearProgress) && (
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
            {showDayProgress && (
              <div className={`p-3 rounded-2xl border backdrop-blur-md text-left ${
                theme.isLight ? 'border-zinc-200/80 bg-white/80 shadow-xs' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className={`${theme.isLight ? 'text-zinc-500' : 'text-zinc-400'} text-[10px] font-bold tracking-[0.2em] uppercase`}>
                    {language === 'th' ? 'ความคืบหน้าของวัน' : 'Day Progress'}
                  </span>
                  <span className={`font-mono-num font-semibold ${theme.textAccentClass}`}>
                    {formatNum(stats.dayProgressPercent.toFixed(1))}%
                  </span>
                </div>
                <div className={`w-full h-1.5 ${theme.isLight ? 'bg-zinc-200' : 'bg-zinc-800/80'} rounded-full overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.dayProgressPercent}%`,
                      backgroundColor: theme.progressColor,
                    }}
                  />
                </div>
              </div>
            )}

            {showYearProgress && (
              <div className={`p-3 rounded-2xl border backdrop-blur-md text-left ${
                theme.isLight ? 'border-zinc-200/80 bg-white/80 shadow-xs' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className={`${theme.isLight ? 'text-zinc-500' : 'text-zinc-400'} text-[10px] font-bold tracking-[0.2em] uppercase`}>
                    {language === 'th' ? 'ความคืบหน้าของปี' : 'Year Progress'}
                  </span>
                  <span className={`font-mono-num font-semibold ${theme.textAccentClass}`}>
                    {formatNum(stats.yearProgressPercent.toFixed(1))}%
                  </span>
                </div>
                <div className={`w-full h-1.5 ${theme.isLight ? 'bg-zinc-200' : 'bg-zinc-800/80'} rounded-full overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.yearProgressPercent}%`,
                      backgroundColor: theme.progressColor,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
