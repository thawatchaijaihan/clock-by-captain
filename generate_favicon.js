import fs from 'fs';
import path from 'path';

// 1. Create crisp, modern vector SVG favicon (64x64)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
  <defs>
    <!-- Metallic Bezel Gradient -->
    <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a2e39" />
      <stop offset="50%" stop-color="#14161d" />
      <stop offset="100%" stop-color="#0a0b0f" />
    </linearGradient>
    <linearGradient id="bezelBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f566b" />
      <stop offset="100%" stop-color="#1e222d" />
    </linearGradient>
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#07090e" />
      <stop offset="100%" stop-color="#0d111a" />
    </linearGradient>
    <linearGradient id="digitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Pedestal / Stand Base -->
  <path d="M 19 50 L 22 58 L 42 58 L 45 50 Z" fill="#181a22" stroke="#313645" stroke-width="2" stroke-linejoin="round" />
  <rect x="22" y="56" width="20" height="2" rx="1" fill="#0c0d12" />

  <!-- Outer Clock Body -->
  <rect x="4" y="8" width="56" height="42" rx="10" ry="10" fill="url(#caseGrad)" stroke="url(#bezelBorder)" stroke-width="2.5" />
  
  <!-- Inner Glass Screen -->
  <rect x="9.5" y="13.5" width="45" height="31" rx="5" ry="5" fill="url(#screenGrad)" stroke="#1a1e28" stroke-width="1.5" />

  <!-- Digital Time Display: 12:00 in bold digital segments -->
  <g fill="url(#digitGrad)" filter="url(#glow)">
    <!-- Digit 1 -->
    <rect x="14" y="20" width="3.2" height="18" rx="0.8" />

    <!-- Digit 2 -->
    <!-- top -->
    <rect x="20" y="20" width="8.5" height="2.8" rx="0.6" />
    <!-- top right -->
    <rect x="25.7" y="20" width="2.8" height="8" rx="0.6" />
    <!-- mid -->
    <rect x="20" y="27.6" width="8.5" height="2.8" rx="0.6" />
    <!-- bot left -->
    <rect x="20" y="27.6" width="2.8" height="8" rx="0.6" />
    <!-- bot -->
    <rect x="20" y="35.2" width="8.5" height="2.8" rx="0.6" />

    <!-- Colon Dots : -->
    <circle cx="32" cy="24.5" r="1.6" />
    <circle cx="32" cy="33.5" r="1.6" />

    <!-- Digit 3 (0) -->
    <rect x="35.5" y="20" width="8.5" height="18" rx="2" fill="none" stroke="url(#digitGrad)" stroke-width="2.8" />

    <!-- Digit 4 (0) -->
    <rect x="46" y="20" width="8.5" height="18" rx="2" fill="none" stroke="url(#digitGrad)" stroke-width="2.8" />
  </g>
</svg>`;

// Write public/favicon.svg
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
console.log('Saved public/favicon.svg');

// 2. Generate standard 32x32 Windows ICO format
// ICO File format:
// Header (6 bytes): 0x0000 (reserved), 0x0001 (icon type), 0x0001 (1 image)
// Directory Entry (16 bytes):
//   bWidth (1 byte): 32
//   bHeight (1 byte): 32
//   bColorCount (1 byte): 0 (>= 8bpp)
//   bReserved (1 byte): 0
//   wPlanes (2 bytes): 1
//   wBitCount (2 bytes): 32
//   dwBytesInRes (4 bytes): 40 (header) + 32*32*4 (image) + 32*4 (and mask)
//   dwImageOffset (4 bytes): 22 (6 + 16)

const WIDTH = 32;
const HEIGHT = 32;

// Draw 32x32 pixel buffer (BGRA format, bottom-to-top for BMP)
// Create a 2D grid of [R, G, B, A]
const grid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => [0, 0, 0, 0]));

const setPixel = (x, y, r, g, b, a = 255) => {
  if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
    grid[y][x] = [r, g, b, a];
  }
};

const fillRect = (x, y, w, h, r, g, b, a = 255) => {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x + dx, y + dy, r, g, b, a);
    }
  }
};

// Fill stand base (y: 26..29, x: 10..22)
fillRect(11, 26, 10, 3, 30, 34, 45, 255);
fillRect(10, 29, 12, 2, 18, 20, 26, 255);

// Outer body (x: 2..29, y: 4..25) rounded rect
for (let y = 4; y <= 25; y++) {
  for (let x = 2; x <= 29; x++) {
    // Round corners
    const isCorner = 
      (x <= 4 && y <= 6) || (x >= 27 && y <= 6) ||
      (x <= 4 && y >= 23) || (x >= 27 && y >= 23);
    const isOuterBevel =
      (x === 2 || x === 29 || y === 4 || y === 25);

    if (isCorner) {
      if ((x === 2 && y === 4) || (x === 29 && y === 4) || (x === 2 && y === 25) || (x === 29 && y === 25)) {
        continue; // transparent corner tip
      }
    }

    if (isOuterBevel) {
      setPixel(x, y, 65, 72, 88, 255); // highlight border
    } else {
      setPixel(x, y, 22, 25, 33, 255); // dark case
    }
  }
}

// Inner Screen (x: 5..26, y: 7..22)
fillRect(5, 7, 22, 16, 7, 9, 14, 255);
// Screen border
for (let x = 5; x <= 26; x++) {
  setPixel(x, 7, 24, 28, 38, 255);
  setPixel(x, 22, 24, 28, 38, 255);
}
for (let y = 7; y <= 22; y++) {
  setPixel(5, y, 24, 28, 38, 255);
  setPixel(26, y, 24, 28, 38, 255);
}

// Draw LED Digits in Vivid Cyan (#38bdf8 -> R:56, G:189, B:248)
const C_R = 56, C_G = 189, C_B = 248;

// Digit 1 (x: 8, y: 10..19)
fillRect(8, 10, 2, 10, C_R, C_G, C_B, 255);

// Digit 2 (x: 12..15, y: 10..19)
fillRect(12, 10, 4, 2, C_R, C_G, C_B, 255); // top
fillRect(14, 12, 2, 3, C_R, C_G, C_B, 255); // right top
fillRect(12, 14, 4, 2, C_R, C_G, C_B, 255); // mid
fillRect(12, 16, 2, 3, C_R, C_G, C_B, 255); // left bot
fillRect(12, 18, 4, 2, C_R, C_G, C_B, 255); // bot

// Colon : (x: 17, y: 12 and 17)
setPixel(17, 13, C_R, C_G, C_B, 255);
setPixel(17, 17, C_R, C_G, C_B, 255);

// Digit 3 (0) (x: 19..22, y: 10..19)
fillRect(19, 10, 4, 2, C_R, C_G, C_B, 255); // top
fillRect(19, 18, 4, 2, C_R, C_G, C_B, 255); // bot
fillRect(19, 11, 2, 8, C_R, C_G, C_B, 255); // left
fillRect(22, 11, 2, 8, C_R, C_G, C_B, 255); // right

// Digit 4 (0) (x: 24..27, y: 10..19)
fillRect(24, 10, 3, 2, C_R, C_G, C_B, 255); // top
fillRect(24, 18, 3, 2, C_R, C_G, C_B, 255); // bot
fillRect(24, 11, 1, 8, C_R, C_G, C_B, 255); // left
fillRect(26, 11, 1, 8, C_R, C_G, C_B, 255); // right

// Build ICO Buffer
const headerSize = 6;
const dirEntrySize = 16;
const bmiHeaderSize = 40;
const xorSize = WIDTH * HEIGHT * 4;
const andRowBytes = Math.ceil(WIDTH / 32) * 4; // 4 bytes per row
const andSize = andRowBytes * HEIGHT;
const imageSize = bmiHeaderSize + xorSize + andSize;
const totalFileSize = headerSize + dirEntrySize + imageSize;

const icoBuffer = Buffer.alloc(totalFileSize);

// 1. ICO Header
icoBuffer.writeUInt16LE(0, 0); // reserved
icoBuffer.writeUInt16LE(1, 2); // icon type
icoBuffer.writeUInt16LE(1, 4); // count of images

// 2. Directory Entry
icoBuffer.writeUInt8(WIDTH, 6);        // width
icoBuffer.writeUInt8(HEIGHT, 7);       // height
icoBuffer.writeUInt8(0, 8);            // color palette count
icoBuffer.writeUInt8(0, 9);            // reserved
icoBuffer.writeUInt16LE(1, 10);        // color planes
icoBuffer.writeUInt16LE(32, 12);       // bits per pixel
icoBuffer.writeUInt32LE(imageSize, 14);// bytes in resource
icoBuffer.writeUInt32LE(22, 18);       // offset to image data

// 3. BITMAPINFOHEADER
let offset = 22;
icoBuffer.writeUInt32LE(bmiHeaderSize, offset); offset += 4;
icoBuffer.writeInt32LE(WIDTH, offset); offset += 4;
icoBuffer.writeInt32LE(HEIGHT * 2, offset); offset += 4; // Height * 2 for XOR + AND masks
icoBuffer.writeUInt16LE(1, offset); offset += 2;          // planes
icoBuffer.writeUInt16LE(32, offset); offset += 2;         // bit count
icoBuffer.writeUInt32LE(0, offset); offset += 4;          // BI_RGB (uncompressed)
icoBuffer.writeUInt32LE(xorSize + andSize, offset); offset += 4;
icoBuffer.writeInt32LE(0, offset); offset += 4;          // XPelsPerMeter
icoBuffer.writeInt32LE(0, offset); offset += 4;          // YPelsPerMeter
icoBuffer.writeUInt32LE(0, offset); offset += 4;          // ClrUsed
icoBuffer.writeUInt32LE(0, offset); offset += 4;          // ClrImportant

// 4. XOR Mask (Bottom-to-top RGBA -> BGRA)
for (let y = HEIGHT - 1; y >= 0; y--) {
  for (let x = 0; x < WIDTH; x++) {
    const [r, g, b, a] = grid[y][x];
    icoBuffer.writeUInt8(b, offset++);
    icoBuffer.writeUInt8(g, offset++);
    icoBuffer.writeUInt8(r, offset++);
    icoBuffer.writeUInt8(a, offset++);
  }
}

// 5. AND Mask (1 bit per pixel, 0 for opaque, 1 for transparent)
for (let y = HEIGHT - 1; y >= 0; y--) {
  let rowBits = 0;
  for (let x = 0; x < WIDTH; x++) {
    const a = grid[y][x][3];
    if (a === 0) {
      rowBits |= (1 << (7 - (x % 8)));
    }
    if (x % 8 === 7 || x === WIDTH - 1) {
      icoBuffer.writeUInt8(rowBits, offset++);
      rowBits = 0;
    }
  }
}

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('Saved public/favicon.ico successfully! Size:', icoBuffer.length, 'bytes');
