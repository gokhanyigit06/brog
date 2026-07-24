// Instagram öne çıkanlar (highlight) kapakları — 1080x1920, ikon tam merkezde
// Profilde daire olarak kırpılır; ikon merkez %60 güvenli alanda tutulur.
import { chromium } from "playwright";
import fs from "fs";

const OUT = "instagram/one-cikanlar";
fs.mkdirSync(OUT, { recursive: true });

// İnce çizgi ikonlar (stroke, 96x96 viewBox)
const S = `fill="none" stroke="#F6F6F3" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"`;
const ICONS = {
  islerimiz: `<svg viewBox="0 0 96 96"><rect x="14" y="30" width="68" height="46" rx="6" ${S}/><path d="M36 30 v-6 a6 6 0 0 1 6-6 h12 a6 6 0 0 1 6 6 v6" ${S}/><path d="M14 50 h68" ${S}/></svg>`,
  hizmetler: `<svg viewBox="0 0 96 96"><rect x="16" y="16" width="28" height="28" rx="6" ${S}/><rect x="52" y="16" width="28" height="28" rx="6" ${S}/><rect x="16" y="52" width="28" height="28" rx="6" ${S}/><rect x="52" y="52" width="28" height="28" rx="14" ${S}/></svg>`,
  surec: `<svg viewBox="0 0 96 96"><circle cx="24" cy="24" r="9" ${S}/><circle cx="72" cy="48" r="9" ${S}/><circle cx="30" cy="76" r="9" ${S}/><path d="M32 28 C 50 34, 58 38, 64 42" ${S}/><path d="M64 54 C 52 62, 46 66, 39 71" ${S}/></svg>`,
  yorumlar: `<svg viewBox="0 0 96 96"><path d="M48 16 l9.6 19.4 21.4 3.1 -15.5 15.1 3.7 21.3 -19.2-10.1 -19.2 10.1 3.7-21.3 -15.5-15.1 21.4-3.1 Z" ${S}/></svg>`,
  biz: `<svg viewBox="0 0 96 96"><circle cx="36" cy="34" r="12" ${S}/><path d="M14 78 c0-14 10-22 22-22 s22 8 22 22" ${S}/><circle cx="66" cy="38" r="9" ${S}/><path d="M62 54 c11 0 20 7 20 20" ${S}/></svg>`,
  sss: `<svg viewBox="0 0 96 96"><path d="M16 24 a8 8 0 0 1 8-8 h48 a8 8 0 0 1 8 8 v32 a8 8 0 0 1 -8 8 h-34 l-14 12 v-12 h-0 a8 8 0 0 1 -8-8 Z" ${S}/><path d="M42 34 a7 7 0 1 1 9 8 c-2 1-3 2.4-3 5" ${S}/><circle cx="48" cy="55" r="0.5" ${S}/></svg>`,
};

const COVERS = [
  ["islerimiz", "İşlerimiz"],
  ["hizmetler", "Hizmetler"],
  ["surec", "Süreç"],
  ["yorumlar", "Yorumlar"],
  ["biz", "Biz"],
  ["sss", "SSS"],
];

function cover(iconSvg) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:#080808;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
  .glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:900px;background:radial-gradient(circle at center, rgba(37,99,235,0.20) 0%, rgba(0,0,0,0) 62%)}
  .icon{position:relative;z-index:1;width:340px;height:340px}
  .icon svg{width:100%;height:100%}
  </style></head><body><div class="glow"></div><div class="icon">${iconSvg}</div></body></html>`;
}

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [key, label] of COVERS) {
  await p.setContent(cover(ICONS[key]), { waitUntil: "networkidle" });
  await p.screenshot({ path: `${OUT}/${key}.jpg`, type: "jpeg", quality: 95 });
  console.log(`✓ ${key}.jpg (${label})`);
}
await b.close();
console.log("✅ Kapaklar hazır:", OUT);
