import { chromium } from "playwright";
const slug = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`http://localhost:3000/tr/projeler/${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(d => { const s = getComputedStyle(d); return s.borderRadius.startsWith("36") && s.borderWidth.startsWith("10"); });
  if (el) el.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(2500);
try {
  await page.waitForFunction(() => {
    const imgs = [...document.querySelectorAll("img")].filter(i => /projects%2F/.test(i.src) && i.closest("div") && getComputedStyle(i.closest("div").parentElement||i).borderRadius);
    const frameImgs = [...document.querySelectorAll("img")].filter(i => i.width < 300 && i.src.includes("firebasestorage"));
    return frameImgs.length > 0 && frameImgs.every(i => i.complete && i.naturalWidth > 0);
  }, { timeout: 15000 });
} catch {}
await page.waitForTimeout(1500);
await page.screenshot({ path: `scripts/phones_${slug}.jpg`, type: "jpeg", quality: 85 });
await browser.close();
console.log("done", slug);
process.exit(0);
