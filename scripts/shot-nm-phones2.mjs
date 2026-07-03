import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000/tr/projeler/neo-maison", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(d => { const s = getComputedStyle(d); return s.borderRadius.startsWith("36") && s.borderWidth.startsWith("10"); });
  if (el) el.scrollIntoView({ block: "center" });
});
// Telefon görsellerinin yüklenmesini bekle
await page.waitForTimeout(3000);
try {
  await page.waitForFunction(() => {
    const imgs = [...document.querySelectorAll("img")].filter(i => i.src.includes("neomaison-v2-m"));
    return imgs.length > 0 && imgs.every(i => i.complete && i.naturalWidth > 0);
  }, { timeout: 15000 });
  console.log("telefon görselleri yüklendi");
} catch { console.log("görseller 15sn'de yüklenmedi (headless DNS olabilir)"); }
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/nm_phones2.jpg", type: "jpeg", quality: 86 });
await browser.close();
process.exit(0);
