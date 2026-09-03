import React, { useState } from 'react';
import {
  X,
  Palette,
  Eye,
  Volume2,
  Calendar,
  Layers,
  SunMedium,
  Sparkles,
  RotateCcw,
  Check,
  Moon,
  Sun,
} from 'lucide-react';
import { ClockSettings, ThemePreset, CalendarSystem } from '../types';
import { THEMES, ThemeDefinition } from '../utils/themeConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClockSettings;
  updateSettings: (partial: Partial<ClockSettings>) => void;
  resetSettings: () => void;
  currentTheme: ThemeDefinition;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  resetSettings,
  currentTheme,
}) => {
  const [themeFilter, setThemeFilter] = useState<'all' | 'pastel-canvas' | 'pastel-light' | 'pastel-dark' | 'classic'>('all');

  if (!isOpen) return null;

  const isTh = settings.language === 'th';
  const themeEntries = Object.entries(THEMES) as [ThemePreset, ThemeDefinition][];

  const filteredThemes = themeEntries.filter(([_, t]) => {
    if (themeFilter === 'all') return true;
    return t.category === themeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Modal Dialog Card */}
      <div
        id="settings-modal-dialog"
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 shadow-2xl transition-all ${
          currentTheme.isLight
            ? 'bg-white border-zinc-200 text-zinc-900'
            : 'bg-zinc-900 border-zinc-700 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-700/40 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isTh ? 'การตั้งค่าหน้าจอและนาฬิกา' : 'Display & Clock Settings'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isTh
                  ? 'ปรับแต่งธีม ตัวเลข และการแสดงผลเต็มหน้าจอ'
                  : 'Customize themes, formatting & display options'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings-modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>{isTh ? 'เลือกธีมสีพาสเทลถนอมสายตา' : 'Color & Pastel Themes'}</span>
            </label>
            <span className="text-[11px] text-zinc-400">
              {isTh ? 'โทนนุ่มนวล สบายตา สีตัดกันลงตัว' : 'Soft, non-glaring & balanced contrast'}
            </span>
          </div>

          {/* Theme Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3 p-1 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-xs">
            <button
              id="filter-theme-all"
              type="button"
              onClick={() => setThemeFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                themeFilter === 'all'
                  ? 'bg-zinc-700 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isTh ? 'ทั้งหมด' : 'All'} ({themeEntries.length})
            </button>
            <button
              id="filter-theme-pastel-canvas"
              type="button"
              onClick={() => setThemeFilter('pastel-canvas')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                themeFilter === 'pastel-canvas'
                  ? 'bg-purple-900/60 text-purple-200 font-semibold border border-purple-500/50 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3 h-3 text-purple-300" />
              <span>{isTh ? 'พื้นหลังพาสเทลหลากสี' : 'Pastel Canvas'}</span>
            </button>
            <button
              id="filter-theme-pastel-light"
              type="button"
              onClick={() => setThemeFilter('pastel-light')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                themeFilter === 'pastel-light'
                  ? 'bg-amber-950/70 text-amber-300 font-semibold border border-amber-700/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>{isTh ? 'พาสเทลสว่างนุ่ม' : 'Pastel Daylight'}</span>
            </button>
            <button
              id="filter-theme-pastel-dark"
              type="button"
              onClick={() => setThemeFilter('pastel-dark')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                themeFilter === 'pastel-dark'
                  ? 'bg-emerald-950/70 text-emerald-300 font-semibold border border-emerald-700/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>{isTh ? 'พาสเทลถนอมสายตา (มืด)' : 'Pastel Night'}</span>
            </button>
            <button
              id="filter-theme-classic"
              type="button"
              onClick={() => setThemeFilter('classic')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                themeFilter === 'classic'
                  ? 'bg-indigo-950/70 text-indigo-300 font-semibold border border-indigo-700/40 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isTh ? 'คลาสสิก' : 'Classic'}</span>
            </button>
          </div>

          {/* Theme Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredThemes.map(([key, themeObj]) => {
              const isSelected = settings.theme === key;
              return (
                <button
                  key={key}
                  id={`theme-select-${key}`}
                  onClick={() => updateSettings({ theme: key })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 font-bold bg-cyan-950/30 text-white'
                      : 'border-zinc-700/60 hover:border-zinc-500 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    {/* Live Miniature Clock Preview Swatch */}
                    <div
                      className="w-11 h-7 rounded-md flex items-center justify-center font-mono font-bold text-[10px] tracking-tight shrink-0 shadow-inner border"
                      style={{
                        backgroundColor: themeObj.previewColors.bg,
                        borderColor: themeObj.isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)',
                      }}
                    >
                      <span style={{ color: themeObj.previewColors.text }}>12</span>
                      <span style={{ color: themeObj.previewColors.colon }} className="mx-px">:</span>
                      <span style={{ color: themeObj.previewColors.text }}>00</span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="truncate text-xs font-semibold leading-tight">
                        {isTh ? themeObj.nameTh : themeObj.nameEn}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {themeObj.category === 'pastel-canvas'
                          ? (isTh ? 'พื้นหลังสีพาสเทล' : 'Pastel Canvas')
                          : themeObj.isLight 
                            ? (isTh ? 'สว่างสบายตา' : 'Soft Light') 
                            : (isTh ? 'มืดถนอมตา' : 'Soft Dark')}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-zinc-950 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Background Pattern Selector */}
          <div className="mt-4 p-3 rounded-2xl bg-zinc-800/40 border border-zinc-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                {isTh ? 'ลวดลายบนพื้นหลัง (Background Pattern)' : 'Background Pattern'}
              </span>
              <span className="text-[10px] text-zinc-400">
                {isTh ? 'เพิ่มลายมินิมอลเบาๆ นวลตา' : 'Minimal subtle texture'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              {[
                { id: 'dots', nameTh: 'ลายจุดมินิมอล', nameEn: 'Dot Grid' },
                { id: 'grid', nameTh: 'ลายตารางโปร่ง', nameEn: 'Subtle Grid' },
                { id: 'waves', nameTh: 'คลื่นแสงละมุน', nameEn: 'Soft Waves' },
                { id: 'none', nameTh: 'เรียบสนิท (ไม่มีลาย)', nameEn: 'Solid / None' },
              ].map((pattern) => {
                const isSelected = (settings.backgroundPattern || 'dots') === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    id={`pattern-select-${pattern.id}`}
                    type="button"
                    onClick={() => updateSettings({ backgroundPattern: pattern.id as any })}
                    className={`p-2 rounded-xl border text-center font-medium transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-950/40 text-purple-200 font-semibold ring-1 ring-purple-400/40'
                        : 'border-zinc-700/60 hover:border-zinc-500 bg-zinc-800/30 text-zinc-300 hover:bg-zinc-800/70'
                    }`}
                  >
                    {isTh ? pattern.nameTh : pattern.nameEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Component Visibility Controls */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{isTh ? 'เลือกเปิด/ปิดการแสดงผลแต่ละส่วน' : 'Show / Hide Components'}</span>
            </label>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
              {isTh ? '*เวลาหลักจะแสดงอยู่เสมอ' : '*Main clock is always visible'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* 1. Day of Week / Week Pill */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium text-amber-300/90">
                {isTh ? 'ป้ายบอกวันและสัปดาห์' : 'Day & Week Pill'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-day-pill"
                checked={settings.showDayPill}
                onChange={(e) => updateSettings({ showDayPill: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 2. Main Full Date Text */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium">
                {isTh ? 'วันที่แบบเต็ม (Full Date Text)' : 'Full Date Text'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-full-date-text"
                checked={settings.showFullDateText}
                onChange={(e) => updateSettings({ showFullDateText: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 3. Day of Year Badge */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium text-cyan-300/90">
                {isTh ? 'วันที่ .. ของปี' : 'Day .. of year'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-day-of-year"
                checked={settings.showDayOfYearBadge}
                onChange={(e) => updateSettings({ showDayOfYearBadge: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 4. Days Remaining Badge */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium text-cyan-300/90">
                {isTh ? 'เหลืออีก .. วัน' : '.. days remaining'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-days-remaining"
                checked={settings.showDaysRemainingBadge}
                onChange={(e) => updateSettings({ showDaysRemainingBadge: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 5. Seconds Display */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium">
                {isTh ? 'ตัวเลขวินาที (Seconds)' : 'Seconds'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-seconds"
                checked={settings.showSeconds}
                onChange={(e) => updateSettings({ showSeconds: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 6. Milliseconds Display */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium">
                {isTh ? 'ตัวเลขมิลลิวินาที (Milliseconds)' : 'Milliseconds'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-ms"
                checked={settings.showMilliseconds}
                onChange={(e) =>
                  updateSettings({ showMilliseconds: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 7. Reference & Timezone (Top Right) */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium">
                {isTh ? 'เขตเวลาด้านบน (Timezone / GMT)' : 'Top Timezone Info'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-timezone"
                checked={settings.showTimezone}
                onChange={(e) => updateSettings({ showTimezone: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* 9. Bottom Footer Badge */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70 transition-colors">
              <span className="font-medium">
                {isTh ? 'ป้ายข้อความด้านล่าง (Footer Badge)' : 'Bottom Footer Badge'}
              </span>
              <input
                type="checkbox"
                id="toggle-show-footer-badge"
                checked={settings.showFooterBadge}
                onChange={(e) => updateSettings({ showFooterBadge: e.target.checked })}
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Formatting & Controls */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>{isTh ? 'รูปแบบตัวเลขและการควบคุม' : 'Formatting & Controls'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Thai Numerals */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70">
              <span className="font-medium">
                {isTh ? 'ใช้เลขไทย (๑, ๒, ๓)' : 'Thai Numerals'}
              </span>
              <input
                type="checkbox"
                id="checkbox-thai-numerals"
                checked={settings.useThaiNumerals}
                onChange={(e) =>
                  updateSettings({ useThaiNumerals: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            {/* Auto-hide controls */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer hover:bg-zinc-800/70">
              <span className="font-medium">
                {isTh ? 'ซ่อนปุ่มอัตโนมัติเมื่อไม่ขยับเมาส์' : 'Auto-hide Control Bar'}
              </span>
              <input
                type="checkbox"
                id="checkbox-autohide-controls"
                checked={settings.autoHideControls}
                onChange={(e) =>
                  updateSettings({ autoHideControls: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Calendar System */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold mb-2.5 text-zinc-300">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{isTh ? 'ระบบปีปฏิทิน' : 'Calendar Era Format'}</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'be', labelTh: 'พ.ศ. (พุทธศักราช)', labelEn: 'B.E. Only' },
              { id: 'ce', labelTh: 'ค.ศ. (คริสต์ศักราช)', labelEn: 'C.E. / A.D.' },
              { id: 'both', labelTh: 'ทั้ง พ.ศ. และ ค.ศ.', labelEn: 'Both B.E. & C.E.' },
            ].map((cal) => (
              <button
                key={cal.id}
                id={`calendar-format-${cal.id}`}
                onClick={() =>
                  updateSettings({ calendarSystem: cal.id as CalendarSystem })
                }
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  settings.calendarSystem === cal.id
                    ? 'border-cyan-500 bg-cyan-950/25 font-semibold text-cyan-300'
                    : 'border-zinc-700/60 bg-zinc-800/30 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isTh ? cal.labelTh : cal.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Progress & Sounds */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>{isTh ? 'แถบความคืบหน้า & เสียง' : 'Progress & Audio'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer">
              <span>{isTh ? 'แถบเปอร์เซ็นต์ของวัน' : 'Day Progress Bar'}</span>
              <input
                type="checkbox"
                id="checkbox-day-progress"
                checked={settings.showDayProgress}
                onChange={(e) =>
                  updateSettings({ showDayProgress: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer">
              <span>{isTh ? 'แถบเปอร์เซ็นต์ของปี' : 'Year Progress Bar'}</span>
              <input
                type="checkbox"
                id="checkbox-year-progress"
                checked={settings.showYearProgress}
                onChange={(e) =>
                  updateSettings({ showYearProgress: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer">
              <span>{isTh ? 'เสียงติ๊กทุกวินาที (Tick)' : 'Second Tick Sound'}</span>
              <input
                type="checkbox"
                id="checkbox-tick-sound"
                checked={settings.enableTickSound}
                onChange={(e) =>
                  updateSettings({ enableTickSound: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/60 cursor-pointer">
              <span>{isTh ? 'เสียงระฆังทุกต้นชั่วโมง' : 'Hourly Chime'}</span>
              <input
                type="checkbox"
                id="checkbox-hourly-chime"
                checked={settings.enableHourlyChime}
                onChange={(e) =>
                  updateSettings({ enableHourlyChime: e.target.checked })
                }
                className="w-4 h-4 rounded accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Brightness & Scale Sliders */}
        <div className="mb-6 space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-zinc-300">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                {isTh ? 'ระดับความสว่างหน้าจอ (Dimmer)' : 'Display Brightness'}
              </span>
              <span className="font-mono text-zinc-400">
                {settings.dimmerBrightness}%
              </span>
            </div>
            <input
              type="range"
              id="slider-brightness"
              min="15"
              max="100"
              value={settings.dimmerBrightness}
              onChange={(e) =>
                updateSettings({ dimmerBrightness: parseInt(e.target.value, 10) })
              }
              className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">
                {isTh ? 'ขนาดตัวเลขนาฬิกา (Font Scale)' : 'Clock Size Scale'}
              </span>
              <span className="font-mono text-zinc-400">
                {(settings.fontSizeScale * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              id="slider-font-scale"
              min="0.75"
              max="1.35"
              step="0.05"
              value={settings.fontSizeScale}
              onChange={(e) =>
                updateSettings({ fontSizeScale: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-zinc-300">
                {isTh ? 'ขนาดข้อความวันที่แบบเต็ม (Date Text Scale)' : 'Full Date Text Scale'}
              </span>
              <span className="font-mono text-zinc-400">
                {((settings.dateFontSizeScale ?? 1.0) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              id="slider-date-font-scale"
              min="0.50"
              max="3.00"
              step="0.05"
              value={settings.dateFontSizeScale ?? 1.0}
              onChange={(e) =>
                updateSettings({ dateFontSizeScale: parseFloat(e.target.value) })
              }
              className="w-full accent-cyan-500 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-700/40">
          <button
            id="btn-reset-settings"
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isTh ? 'คืนค่าเริ่มต้น' : 'Reset Defaults'}</span>
          </button>

          <button
            id="btn-close-settings-done"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-md transition-all"
          >
            {isTh ? 'เสร็จสิ้น' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
