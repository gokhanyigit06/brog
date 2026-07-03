import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000/tr/projeler/neo-maison", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3500);
// Telefon çerçevesini (mobile_preview) bul — 10px koyu bezel'li div
await page.evaluate(() => {
  const el = [...document.querySelectorAll("div")].find(d => {
    const s = getComputedStyle(d);
    return s.borderRadius.startsWith("36") && s.borderWidth.startsWith("10");
  });
  if (el) el.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(3500);
await page.screenshot({ path: "scripts/nm_phones.jpg", type: "jpeg", quality: 86 });
await browser.close();
console.log("done");
process.exit(0);
