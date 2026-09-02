export type ClockStyle = 'digital-modern' | 'digital-classic' | 'analog-minimal' | 'flip' | 'minimalist';

export type LanguageMode = 'th' | 'en';

export type CalendarSystem = 'be' | 'ce' | 'both'; // be = พ.ศ., ce = ค.ศ.

export type ThemePreset =
  | 'bold-typography'
  | 'oled'
  | 'cyber-cyan'
  | 'sunset-amber'
  | 'emerald-zen'
  | 'neon-rose'
  | 'aurora'
  | 'nordic-slate'
  | 'warm-paper'
  | 'clean-light';

export interface ClockSettings {
  clockStyle: ClockStyle;
  theme: ThemePreset;
  language: LanguageMode;
  is24Hour: boolean;
  showSeconds: boolean;
  showMilliseconds: boolean;
  calendarSystem: CalendarSystem;
  useThaiNumerals: boolean;
  enableTickSound: boolean;
  enableHourlyChime: boolean;
  showDayProgress: boolean;
  showYearProgress: boolean;
  showDayPill: boolean;            // ป้ายบอกวันและสัปดาห์
  showFullDateText: boolean;       // วันที่แบบเต็ม
  showDayOfYearBadge: boolean;     // วันที่ .. ของปี
  showDaysRemainingBadge: boolean; // เหลืออีก .. วัน
  showSystemStatus: boolean;       // สถานะระบบด้านบน
  showTimezone: boolean;           // เขตเวลาด้านบน
  showFooterBadge: boolean;        // ป้ายด้านล่าง
  dimmerBrightness: number; // 10 to 100
  fontSizeScale: number; // 0.8 to 1.4
  dateFontSizeScale: number; // 0.5 to 3.0
  autoHideControls: boolean;
}

export interface TimeState {
  now: Date;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  dayOfWeek: number;
  dayOfMonth: number;
  month: number;
  yearCE: number;
  yearBE: number;
}
