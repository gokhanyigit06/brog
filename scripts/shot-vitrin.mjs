import { chromium } from "playwright";
const browser = await chromium.launch();

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/tr/teklif", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
// Vitrin bölümüne in ("Seçili işlerimiz")
await page.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find(e => /Seçili işlerimiz|Referans/i.test(e.textContent || ""));
  if (h) h.scrollIntoView({ block: "start" });
});
await page.waitForTimeout(2000);
await page.screenshot({ path: "scripts/vitrin_page.jpg", type: "jpeg", quality: 86 });

const actx = await browser.newContext({ viewport: { width: 1280, height: 900 }, httpCredentials: { username: "vogolab", password: "vogolab2026" } });
const apage = await actx.newPage();
await apage.goto("http://localhost:3000/admin/teklif-vitrin", { waitUntil: "domcontentloaded", timeout: 60000 });
await apage.waitForTimeout(2500);
await apage.screenshot({ path: "scripts/vitrin_admin.jpg", type: "jpeg", quality: 86 });

await browser.close();
console.log("done");
process.exit(0);
