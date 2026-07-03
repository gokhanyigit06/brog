import { chromium } from "playwright";
const slug = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(`http://localhost:3000/tr/projeler/${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
// mobil görseli olan telefonu bul
await page.evaluate(() => {
  const img = [...document.querySelectorAll("img")].find(i => /mobile/i.test(i.getAttribute("src")||""));
  if (img) { const frame = img.closest("div"); (frame?.parentElement || img).scrollIntoView({ block: "center" }); }
});
await page.waitForTimeout(2500);
try {
  await page.waitForFunction(() => {
    const imgs = [...document.querySelectorAll("img")].filter(i => /mobile/i.test(i.getAttribute("src")||""));
    return imgs.length > 0 && imgs.every(i => i.complete && i.naturalWidth > 0);
  }, { timeout: 15000 });
} catch {}
await page.waitForTimeout(1200);
await page.screenshot({ path: `scripts/phones_${slug}.jpg`, type: "jpeg", quality: 85 });
await browser.close();
console.log("done", slug);
process.exit(0);
