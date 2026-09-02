import { CalendarSystem, LanguageMode } from '../types';

export const THAI_DAYS_FULL = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];

export const THAI_DAYS_SHORT = [
  'อา.',
  'จ.',
  'อ.',
  'พ.',
  'พฤ.',
  'ศ.',
  'ส.',
];

export const EN_DAYS_FULL = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const EN_DAYS_SHORT = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export const THAI_MONTHS_FULL = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

export const EN_MONTHS_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const EN_MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

export function toThaiNumerals(strOrNum: string | number): string {
  const str = String(strOrNum);
  return str.replace(/[0-9]/g, (digit) => THAI_DIGITS[parseInt(digit, 10)]);
}

export function padZero(num: number, length: number = 2): string {
  return String(num).padStart(length, '0');
}

export function formatTimeComponents(
  date: Date,
  is24Hour: boolean,
  useThaiNumerals: boolean
) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  let period = '';

  if (!is24Hour) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
  }

  const hStr = padZero(hours);
  const mStr = padZero(minutes);
  const sStr = padZero(seconds);
  const msStr = padZero(Math.floor(milliseconds / 10), 2); // 2-digit ms

  if (useThaiNumerals) {
    return {
      hours: toThaiNumerals(hStr),
      minutes: toThaiNumerals(mStr),
      seconds: toThaiNumerals(sStr),
      milliseconds: toThaiNumerals(msStr),
      period: period === 'AM' ? 'ก่อนเที่ยง' : period === 'PM' ? 'หลังเที่ยง' : '',
    };
  }

  return {
    hours: hStr,
    minutes: mStr,
    seconds: sStr,
    milliseconds: msStr,
    period,
  };
}

export function formatDateString(
  date: Date,
  language: LanguageMode,
  calendarSystem: CalendarSystem,
  useThaiNumerals: boolean
): {
  dayOfWeek: string;
  dayOfMonth: string;
  month: string;
  year: string;
  fullDateText: string;
} {
  const dayIdx = date.getDay();
  const dayNum = date.getDate();
  const monthIdx = date.getMonth();
  const yearCE = date.getFullYear();
  const yearBE = yearCE + 543;

  let dayOfWeek = '';
  let month = '';
  let dayOfMonth = String(dayNum);
  let year = '';

  if (language === 'th') {
    dayOfWeek = THAI_DAYS_FULL[dayIdx];
    month = THAI_MONTHS_FULL[monthIdx];
    
    if (calendarSystem === 'be') {
      year = `พ.ศ. ${yearBE}`;
    } else if (calendarSystem === 'ce') {
      year = `ค.ศ. ${yearCE}`;
    } else {
      year = `พ.ศ. ${yearBE} (ค.ศ. ${yearCE})`;
    }

    if (useThaiNumerals) {
      dayOfMonth = toThaiNumerals(dayOfMonth);
      year = toThaiNumerals(year);
    }

    const fullDateText = `${dayOfWeek}ที่ ${dayOfMonth} ${month} ${year}`;
    return { dayOfWeek, dayOfMonth, month, year, fullDateText };
  } else {
    dayOfWeek = EN_DAYS_FULL[dayIdx];
    month = EN_MONTHS_FULL[monthIdx];

    if (calendarSystem === 'be') {
      year = `B.E. ${yearBE}`;
    } else if (calendarSystem === 'ce') {
      year = `${yearCE}`;
    } else {
      year = `${yearCE} (B.E. ${yearBE})`;
    }

    const fullDateText = `${dayOfWeek}, ${month} ${dayNum}, ${year}`;
    return { dayOfWeek, dayOfMonth, month, year, fullDateText };
  }
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getProgressStats(date: Date) {
  // Day Progress
  const totalDaySeconds = 24 * 60 * 60;
  const currentDaySeconds =
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds() +
    date.getMilliseconds() / 1000;
  const dayProgressPercent = (currentDaySeconds / totalDaySeconds) * 100;

  // Year Progress
  const year = date.getFullYear();
  const totalDaysInYear = isLeapYear(year) ? 366 : 365;
  const dayOfYear = getDayOfYear(date);
  const yearProgressPercent = (dayOfYear / totalDaysInYear) * 100;
  const daysRemainingInYear = totalDaysInYear - dayOfYear;

  // Week number of year (ISO 8601-ish)
  const firstDayOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

  return {
    dayProgressPercent,
    yearProgressPercent,
    dayOfYear,
    daysRemainingInYear,
    totalDaysInYear,
    weekNumber,
  };
}

export function getTimezoneInfo() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    const offsetSign = offsetHours >= 0 ? '+' : '-';
    const absHours = Math.floor(Math.abs(offsetHours));
    const absMins = Math.abs(offsetMinutes % 60);
    const gmtString = `GMT${offsetSign}${absHours}${absMins > 0 ? `:${padZero(absMins)}` : ''}`;
    
    return {
      timeZone: tz,
      gmtString,
    };
  } catch {
    return {
      timeZone: 'Local',
      gmtString: 'GMT+7',
    };
  }
}
