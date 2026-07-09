import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();

const shots = [
  ["tr", "home", [0, 900, 2400, 4200]],
  ["tr/teklif", "teklif", [0, 1600, 5200]],
  ["tr/projeler", "projeler", [0, 900]],
  ["tr/hizmetler", "hizmetler", [0, 1100]],
  ["tr/hakkimizda", "hakkimizda", [0, 1400]],
  ["tr/projeler/neo-maison", "detay", [0, 900, 2200]],
  ["tr/blog/seo-nedir-isletmeler-icin-baslangic-rehberi", "blogd", [0, 1200]],
  ["tr/iletisim", "iletisim", [900]],
];

for (const [path, name, scrolls] of shots) {
  await p.goto(`http://localhost:3000/${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(3200);
  for (let i = 0; i < scrolls.length; i++) {
    await p.evaluate((y) => window.scrollTo(0, y), scrolls[i]);
    await p.waitForTimeout(1400);
    await p.screenshot({ path: `scripts/m_${name}_${i}.jpg`, type: "jpeg", quality: 78 });
  }
  // Yatay taşma tespiti
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`${name}: yatay taşma = ${overflow}px`);
}
await b.close();
console.log("done");
