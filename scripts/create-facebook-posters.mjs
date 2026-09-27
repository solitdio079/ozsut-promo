import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "public", "posters");
const promoDir = join(root, "public", "promo");
const fontPath = "/System/Library/Fonts/HelveticaNeue.ttc";

mkdirSync(outDir, { recursive: true });

const W = 1080;
const H = 1080;

const colors = {
  burgundy: "#5a1636",
  teal: "#1f4e55",
  cream: "#fff9ef",
  warm: "#f7f1e7",
  brown: "#7a4532",
  ink: "#30201f",
  gold: "#d8a642",
  whatsapp: "#25d366",
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function assetHref(relativePath) {
  return join(promoDir, basename(relativePath));
}

function lines(text, maxChars) {
  const words = text.split(/\s+/);
  const result = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length > maxChars && current) {
      result.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) result.push(current);
  return result;
}

function textBlock({ x, y, text, size, weight = 800, fill = colors.ink, maxChars = 24, lineHeight = 1.08, family = "Arial", anchor = "start", transform = "" }) {
  return lines(text, maxChars)
    .map((line, index) => {
      const dy = index * size * lineHeight;
      return `<text x="${x}" y="${y + dy}" ${transform ? `transform="${transform}"` : ""} text-anchor="${anchor}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`;
    })
    .join("\n");
}

function chip({ x, y, width, text, fill = colors.cream, stroke = colors.burgundy, textFill = colors.burgundy }) {
  return `
    <rect x="${x}" y="${y}" width="${width}" height="46" rx="23" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${x + width / 2}" y="${y + 30}" text-anchor="middle" font-family="Arial" font-size="22" font-weight="900" fill="${textFill}">${escapeXml(text)}</text>
  `;
}

function whatsappFooter() {
  return `
    <g transform="translate(690 992)">
      <rect x="0" y="-44" width="326" height="62" rx="31" fill="${colors.whatsapp}"/>
      <path transform="translate(21 -31) scale(1.28)" fill="#ffffff" d="M16.04 3.2A12.72 12.72 0 0 0 5.16 22.5L3.5 28.8l6.45-1.62A12.7 12.7 0 1 0 16.04 3.2Zm0 23.08a10.5 10.5 0 0 1-5.35-1.46l-.38-.22-3.82.96 1-3.72-.25-.39a10.49 10.49 0 1 1 8.8 4.83Zm5.75-7.85c-.31-.16-1.85-.91-2.13-1.02-.29-.1-.5-.16-.7.16-.21.31-.81 1.01-.99 1.22-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.7-1.68-.96-2.3-.25-.6-.51-.52-.7-.53h-.6c-.21 0-.54.08-.83.39-.29.31-1.09 1.07-1.09 2.61 0 1.54 1.12 3.03 1.28 3.24.16.21 2.21 3.37 5.35 4.72.75.32 1.33.51 1.78.65.75.24 1.43.21 1.97.13.6-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z"/>
      <text x="72" y="-7" font-family="Arial" font-size="24" font-weight="900" fill="#ffffff">+90 531 618 86 79</text>
    </g>
  `;
}

function baseSvg({ image, campaign, title, subtitle, price, note, details, menuRows = [], slug }) {
  const imageUri = assetHref(image);
  const hasRows = menuRows.length > 0;
  const rows = menuRows
    .map((row, index) => {
      const y = 647 + index * 34;
      return `
        <text x="${index < 5 ? 86 : 538}" y="${index < 5 ? y : 647 + (index - 5) * 34}" font-family="Arial" font-size="24" font-weight="800" fill="${colors.ink}">${escapeXml(row.name)}</text>
        <text x="${index < 5 ? 444 : 980}" y="${index < 5 ? y : 647 + (index - 5) * 34}" text-anchor="end" font-family="Arial" font-size="24" font-weight="900" fill="${colors.burgundy}">${escapeXml(row.price)}</text>
      `;
    })
    .join("\n");

  const detailItems = details
    .slice(0, hasRows ? 3 : 6)
    .map((item, index) => {
      const x = hasRows ? 86 : 92 + (index % 2) * 448;
      const y = hasRows ? 865 + index * 34 : 682 + Math.floor(index / 2) * 62;
      return `
        <g transform="translate(${x} ${y})">
          <circle cx="0" cy="-8" r="6" fill="${colors.gold}"/>
          <text x="18" y="0" font-family="Arial" font-size="${hasRows ? 24 : 28}" font-weight="700" fill="${colors.ink}">${escapeXml(item)}</text>
        </g>
      `;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="heroClip-${slug}">
      <rect x="44" y="128" width="992" height="430" rx="38"/>
    </clipPath>
    <linearGradient id="fade-${slug}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.03"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.56"/>
    </linearGradient>
    <pattern id="pinstripe-${slug}" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="${colors.warm}"/>
      <path d="M0 0H24" stroke="${colors.burgundy}" stroke-opacity="0.08" stroke-width="2"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#pinstripe-${slug})"/>
  <rect x="28" y="28" width="1024" height="1024" rx="42" fill="${colors.cream}" stroke="${colors.burgundy}" stroke-opacity="0.24" stroke-width="3"/>

  <text x="68" y="94" font-family="Arial" font-size="70" font-weight="900" fill="${colors.teal}">ÖZSÜT</text>
  ${chip({ x: 774, y: 50, width: 230, text: campaign, fill: colors.burgundy, stroke: colors.burgundy, textFill: colors.cream })}

  <image href="${imageUri}" x="44" y="128" width="992" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#heroClip-${slug})"/>
  <rect x="44" y="128" width="992" height="430" rx="38" fill="url(#fade-${slug})"/>

  ${textBlock({ x: 78, y: 460, text: title, size: 58, weight: 950, fill: "#ffffff", maxChars: 24, family: "Arial" })}
  <text x="82" y="528" font-family="Arial" font-size="29" font-weight="900" fill="${colors.cream}">${escapeXml(subtitle)}</text>

  <rect x="66" y="590" width="948" height="${hasRows ? 360 : 310}" rx="32" fill="#ffffff" stroke="${colors.burgundy}" stroke-opacity="0.12" stroke-width="2"/>
  <rect x="720" y="604" width="264" height="96" rx="28" fill="${colors.burgundy}"/>
  <text x="852" y="645" text-anchor="middle" font-family="Arial" font-size="${price.length > 12 ? 32 : 43}" font-weight="900" fill="${colors.cream}">${escapeXml(price)}</text>
  <text x="852" y="676" text-anchor="middle" font-family="Arial" font-size="21" font-weight="800" fill="${colors.cream}">${escapeXml(note)}</text>

  ${
    hasRows
      ? `<text x="86" y="618" font-family="Arial" font-size="30" font-weight="900" fill="${colors.teal}">Menü seçenekleri</text>${rows}${detailItems}`
      : `<text x="92" y="638" font-family="Arial" font-size="32" font-weight="900" fill="${colors.teal}">Kampanya detayı</text>${detailItems}`
  }

  <text x="76" y="998" font-family="Arial" font-size="20" font-weight="800" fill="${colors.brown}">Instagram reklam bağlantısı ile web menümüzü ziyaret edin.</text>
  ${whatsappFooter()}
</svg>`;
}

const posters = [
  {
    slug: "serpme-kahvalti",
    image: "/promo/serpme-kahvalti.jpeg",
    campaign: "Hafta içi fırsatı",
    title: "Hafta içine özel serpme kahvaltı",
    subtitle: "Pazartesi - Cuma | 2 kişilik servis",
    price: "1000 TL",
    note: "2 kişilik",
    details: [
      "Peynir tabağı",
      "Söğüş & zeytin tabağı",
      "Bal, kaymak, tereyağı",
      "Gözleme, pişi, sigara böreği",
      "Sucuklu yumurta",
      "Patates kızartması",
    ],
  },
  {
    slug: "pizza-hamburger-icecek",
    image: "/promo/pizza-hamburger-icecek.jpeg",
    campaign: "Kampanya 2",
    title: "Pizza veya hamburger alana içecek hediye",
    subtitle: "200 ml şişe Coca-Cola ya da Fanta hediye",
    price: "İçecek hediye!",
    note: "Pizza & burger",
    details: ["Tüm pizza çeşitlerinde geçerlidir", "Tüm hamburger çeşitlerinde geçerlidir", "200 ml şişe içecek hediyesi"],
    menuRows: [
      { name: "Margherita pizza", price: "665 TL" },
      { name: "BBQ tavuklu pizza", price: "700 TL" },
      { name: "Sebzeli pizza", price: "665 TL" },
      { name: "Ay pizza", price: "760 TL" },
      { name: "Dört peynirli pizza", price: "750 TL" },
      { name: "Hamburger", price: "700 TL" },
      { name: "Cızır burger", price: "635 TL" },
      { name: "Tavuk burger", price: "575 TL" },
    ],
  },
  {
    slug: "tatli-bir-mola",
    image: "/promo/tatli-bir-mola.jpeg",
    campaign: "Kampanya 3",
    title: "Tatlı bir mola",
    subtitle: "Dilim pasta alana çay veya kahve hediye",
    price: "300 TL",
    note: "Çay/kahve hediye",
    details: [
      "Karamelli dilim pasta",
      "Meyveli dilim pasta",
      "Çikolatalı dilim pasta",
      "Frambuaz dilim pasta",
      "1 bardak çay",
      "veya 1 fincan kahve",
    ],
  },
];

for (const poster of posters) {
  const svg = baseSvg(poster);
  const svgPath = join(outDir, `${poster.slug}-instagram-poster.svg`);
  const pngPath = join(outDir, `${poster.slug}-instagram-poster.png`);

  writeFileSync(svgPath, svg);
  execFileSync("magick", ["-font", fontPath, svgPath, "-resize", `${W}x${H}!`, pngPath], {
    stdio: "inherit",
  });

  console.log(`${basename(pngPath)} created`);
}
