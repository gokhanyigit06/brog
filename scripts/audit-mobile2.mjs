import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const pages = ["tr", "tr/teklif", "tr/projeler", "tr/hizmetler", "tr/hakkimizda", "tr/projeler/neo-maison", "tr/blog/seo-nedir-isletmeler-icin-baslangic-rehberi", "tr/iletisim", "tr/blog"];
for (const path of pages) {
  await p.goto(`http://localhost:3000/${path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(2800);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`/${path}: taşma = ${overflow}px`);
}
// Doğrulama screenshot'ları: footer (mobil), iletişim form, detay başlık
await p.goto("http://localhost:3000/tr", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
await p.waitForTimeout(1800);
await p.screenshot({ path: "scripts/m2_footer.jpg", type: "jpeg", quality: 80 });
await p.goto("http://localhost:3000/tr/iletisim", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(() => window.scrollTo(0, 700));
await p.waitForTimeout(1500);
await p.screenshot({ path: "scripts/m2_iletisim.jpg", type: "jpeg", quality: 80 });
await p.goto("http://localhost:3000/tr/projeler/neo-maison", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2800);
await p.screenshot({ path: "scripts/m2_detay.jpg", type: "jpeg", quality: 80 });
const t = await p.title();
console.log("detay title:", t);
await b.close();
console.log("done");
