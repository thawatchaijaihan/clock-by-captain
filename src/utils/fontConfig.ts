import { TimeFontFamily } from '../types';

export interface FontDefinition {
  id: TimeFontFamily;
  nameTh: string;
  nameEn: string;
  fontFamily: string;
  letterSpacing: string;
  digitWidth?: string;
  digitGap?: string;
  category: 'sans' | 'mono' | 'tech' | 'serif';
  previewDigits: string;
}

export const TIME_FONTS: FontDefinition[] = [
  {
    id: 'dseg7',
    nameTh: 'เซกเมนต์ ดิจิทัล (7-Segment LED)',
    nameEn: '7-Segment Classic LED',
    fontFamily: "'DSEG7 Modern', 'DSEG7 Classic', monospace",
    letterSpacing: '0.04em',
    digitWidth: 'w-[0.65em]',
    digitGap: 'gap-[0.14em]',
    category: 'tech',
    previewDigits: '02:30',
  },
  {
    id: 'inter',
    nameTh: 'อินเตอร์ (Modern Bold)',
    nameEn: 'Inter Modern',
    fontFamily: "'Inter', 'Plus Jakarta Sans', sans-serif",
    letterSpacing: '-0.06em',
    category: 'sans',
    previewDigits: '12:30',
  },
  {
    id: 'orbitron',
    nameTh: 'ออร์บิทรอน (Sci-Fi Tech)',
    nameEn: 'Orbitron Sci-Fi',
    fontFamily: "'Orbitron', sans-serif",
    letterSpacing: '0.02em',
    category: 'tech',
    previewDigits: '12:30',
  },
  {
    id: 'jetbrains-mono',
    nameTh: 'เจ็ตเบรนส์ (Code Mono)',
    nameEn: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '-0.02em',
    category: 'mono',
    previewDigits: '12:30',
  },
  {
    id: 'chakra-petch',
    nameTh: 'จักรเพชร (Cyber Thai)',
    nameEn: 'Chakra Petch Tech',
    fontFamily: "'Chakra Petch', sans-serif",
    letterSpacing: '0.01em',
    category: 'tech',
    previewDigits: '12:30',
  },
  {
    id: 'prompt',
    nameTh: 'พร้อมท์ (Thai Modern)',
    nameEn: 'Prompt Modern',
    fontFamily: "'Prompt', sans-serif",
    letterSpacing: '-0.03em',
    category: 'sans',
    previewDigits: '12:30',
  },
  {
    id: 'outfit',
    nameTh: 'เอาท์ฟิต (Geometric)',
    nameEn: 'Outfit Geometric',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.04em',
    category: 'sans',
    previewDigits: '12:30',
  },
  {
    id: 'share-tech',
    nameTh: 'แชร์เทค (Retro Digital)',
    nameEn: 'Share Tech Digital',
    fontFamily: "'Share Tech Mono', monospace",
    letterSpacing: '0.03em',
    category: 'mono',
    previewDigits: '12:30',
  },
  {
    id: 'playfair',
    nameTh: 'เพลย์แฟร์ (Luxury Serif)',
    nameEn: 'Playfair Classic',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '0.01em',
    category: 'serif',
    previewDigits: '12:30',
  },
];

export const getTimeFontDefinition = (fontId?: TimeFontFamily): FontDefinition => {
  return TIME_FONTS.find((f) => f.id === fontId) || TIME_FONTS[0];
};

export const getTimeFontFamily = (fontId?: TimeFontFamily): string => {
  return getTimeFontDefinition(fontId).fontFamily;
};
