import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const posterDir = join(root, "public", "posters", "website-style");
const qrDir = join(root, "public", "posters", "qr");
const siteUrl = "https://ozsut.sabirlar.com/";

mkdirSync(qrDir, { recursive: true });

const qrSvgPath = join(qrDir, "ozsut-menu-qr.svg");
const qrPngPath = join(qrDir, "ozsut-menu-qr.png");
const labelPngPath = join(qrDir, "qr-label.png");

function gfTables() {
  const exp = Array(512).fill(0);
  const log = Array(256).fill(0);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  return { exp, log };
}

const { exp, log } = gfTables();

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return exp[log[a] + log[b]];
}

function polyMul(a, b) {
  const out = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) out[i + j] ^= gfMul(a[i], b[j]);
  }
  return out;
}

function rsGenerator(degree) {
  let gen = [1];
  for (let i = 0; i < degree; i++) gen = polyMul(gen, [1, exp[i]]);
  return gen;
}

function rsRemainder(data, degree) {
  const gen = rsGenerator(degree);
  const rem = Array(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ rem.shift();
    rem.push(0);
    for (let i = 0; i < degree; i++) rem[i] ^= gfMul(gen[i + 1], factor);
  }
  return rem;
}

function pushBits(bits, value, length) {
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

function makeCodewords(text) {
  const bytes = [...Buffer.from(text, "utf8")];
  const bits = [];
  pushBits(bits, 0b0100, 4);
  pushBits(bits, bytes.length, 8);
  for (const byte of bytes) pushBits(bits, byte, 8);
  for (let i = 0; i < 4 && bits.length < 55 * 8; i++) bits.push(0);
  while (bits.length % 8) bits.push(0);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    data.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  }
  for (let pad = 0; data.length < 55; pad++) data.push(pad % 2 === 0 ? 0xec : 0x11);

  return [...data, ...rsRemainder(data, 15)];
}

function makeQrMatrix(text) {
  const version = 3;
  const size = 17 + version * 4;
  const modules = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));

  const set = (x, y, value, isReserved = true) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = Boolean(value);
    if (isReserved) reserved[y][x] = true;
  };

  const finder = (x, y) => {
    for (let dy = -1; dy <= 7; dy++) {
      for (let dx = -1; dx <= 7; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        const inFinder = dx >= 0 && dy >= 0 && dx <= 6 && dy <= 6;
        const dark =
          inFinder &&
          (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
        set(xx, yy, dark);
      }
    }
  };

  finder(0, 0);
  finder(size - 7, 0);
  finder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }

  const alignment = (cx, cy) => {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const dark = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
        set(cx + dx, cy + dy, dark);
      }
    }
  };
  alignment(22, 22);

  set(8, 4 * version + 9, true);

  // Reserve format information zones.
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  const codewords = makeCodewords(text);
  const dataBits = [];
  for (const byte of codewords) pushBits(dataBits, byte, 8);

  let bitIndex = 0;
  let upward = true;
  const mask = (x, y) => (x + y) % 2 === 0;

  for (let x = size - 1; x >= 1; x -= 2) {
    if (x === 6) x--;
    for (let i = 0; i < size; i++) {
      const y = upward ? size - 1 - i : i;
      for (let dx = 0; dx < 2; dx++) {
        const xx = x - dx;
        if (reserved[y][xx]) continue;
        const bit = dataBits[bitIndex++] === 1;
        modules[y][xx] = bit !== mask(xx, y);
      }
    }
    upward = !upward;
  }

  const format = makeFormatBits(0b01, 0); // L correction, mask 0
  const formatPositionsA = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const formatPositionsB = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
    [size - 5, 8], [size - 6, 8], [size - 7, 8], [size - 8, 8],
    [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4],
    [8, size - 3], [8, size - 2], [8, size - 1],
  ];

  for (let i = 0; i < 15; i++) {
    const bit = ((format >> i) & 1) === 1;
    set(formatPositionsA[i][0], formatPositionsA[i][1], bit);
    set(formatPositionsB[i][0], formatPositionsB[i][1], bit);
  }

  return modules;
}

function makeFormatBits(ecl, mask) {
  let data = (ecl << 3) | mask;
  let bits = data << 10;
  const poly = 0x537;
  for (let i = 14; i >= 10; i--) {
    if ((bits >> i) & 1) bits ^= poly << (i - 10);
  }
  return ((data << 10) | bits) ^ 0x5412;
}

function writeQrSvg(text, outPath) {
  const matrix = makeQrMatrix(text);
  const quiet = 4;
  const moduleSize = 12;
  const size = matrix.length + quiet * 2;
  const rects = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix.length; x++) {
      if (matrix[y][x]) {
        rects.push(`<rect x="${(x + quiet) * moduleSize}" y="${(y + quiet) * moduleSize}" width="${moduleSize}" height="${moduleSize}"/>`);
      }
    }
  }

  writeFileSync(outPath, `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size * moduleSize}" height="${size * moduleSize}" viewBox="0 0 ${size * moduleSize} ${size * moduleSize}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g fill="#111111">${rects.join("")}</g>
</svg>
`);
}

writeQrSvg(siteUrl, qrSvgPath);
execFileSync("magick", [qrSvgPath, "-resize", "300x300", qrPngPath], { stdio: "inherit" });

execFileSync(
  "magick",
  [
    "-background",
    "none",
    "-size",
    "430x92",
    "-font",
    "/System/Library/Fonts/HelveticaNeue.ttc",
    "-fill",
    "#5a1636",
    "-gravity",
    "center",
    "-pointsize",
    "26",
    "caption:QR kodu okut\\nweb menüye ulaş",
    labelPngPath,
  ],
  { stdio: "inherit" },
);

const posterFiles = readdirSync(posterDir)
  .filter((file) => file.endsWith("-website-poster.png"))
  .filter((file) => !file.includes("-qr-"));

for (const file of posterFiles) {
  const input = join(posterDir, file);
  const output = join(posterDir, file.replace("-website-poster.png", "-qr-website-poster.png"));
  const width = Number(execFileSync("magick", ["identify", "-format", "%w", input]).toString());
  const height = Number(execFileSync("magick", ["identify", "-format", "%h", input]).toString());
  const qrSize = Math.round(Math.min(width, height) * 0.18);
  const margin = Math.round(Math.min(width, height) * 0.035);
  const labelWidth = Math.round(qrSize * 1.45);
  const labelHeight = Math.round(qrSize * 0.34);
  const cardWidth = Math.max(qrSize + margin, labelWidth) + margin * 2;
  const cardHeight = qrSize + labelHeight + margin * 2;

  const card = join(qrDir, `${basename(file, ".png")}-qr-card.png`);
  const qrSized = join(qrDir, `${basename(file, ".png")}-qr-sized.png`);
  const labelSized = join(qrDir, `${basename(file, ".png")}-label-sized.png`);

  execFileSync("magick", [qrPngPath, "-resize", `${qrSize}x${qrSize}`, qrSized], { stdio: "inherit" });
  execFileSync("magick", [labelPngPath, "-resize", `${labelWidth}x${labelHeight}`, labelSized], { stdio: "inherit" });
  execFileSync("magick", ["-size", `${cardWidth}x${cardHeight}`, "xc:#fff9ef", "-bordercolor", "#5a1636", "-border", "4", "-alpha", "set", card], { stdio: "inherit" });
  execFileSync("magick", [card, qrSized, "-gravity", "north", "-geometry", `+0+${margin}`, "-composite", labelSized, "-gravity", "south", "-geometry", `+0+${Math.round(margin * 0.45)}`, "-composite", card], { stdio: "inherit" });
  execFileSync("magick", [input, card, "-gravity", "southeast", "-geometry", `+${margin}+${margin}`, "-composite", output], { stdio: "inherit" });
}

writeFileSync(join(posterDir, "instagram-ad-caption.txt"), `“Sadece bir kahvaltı değil, bir ziyafet🍳 masa da boş yer kalmayana dek donattık”😋🤤
📍Özsüt/Kastamonu
📞Rezervasyon için: 03662142828
✨Hafta içi ve hafta sonu hizmetinizdeyiz.

QR kodu okut, web menüye ulaş:
${siteUrl}
`);

console.log(`QR posters created for ${siteUrl}`);
