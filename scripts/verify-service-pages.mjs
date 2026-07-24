import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";

for (const slug of ["web-tasarim", "reklam-yonetimi", "seo", "marka-kreatif"]) {
  await p.goto(`http://localhost:3000/tr/hizmetler/${slug}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(2500);
  const h1 = (await p.locator("h1").first().textContent())?.trim();
  const refs = await p.locator("text=Bu alanda ürettiğimiz").count();
  const blog = await p.locator("text=Bu konuda yazdıklarımız").count();
  console.log(`✓ ${slug}: "${h1?.slice(0, 50)}" | referans: ${refs > 0 ? "var" : "yok"} | blog: ${blog > 0 ? "var" : "yok"}`);
}

// web-tasarim tam sayfa görsel
await p.goto("http://localhost:3000/tr/hizmetler/web-tasarim", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2000);
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 110)); } window.scrollTo(0,0); });
await p.waitForTimeout(3000);
await p.screenshot({ path: `${shots}/svc-web-tasarim-full.png`, fullPage: true });

// hizmetler listesindeki linkler
await p.goto("http://localhost:3000/tr/hizmetler", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
console.log("Listede 'Detaylı incele' linki:", await p.locator("text=Detaylı incele").count());

// mobil kontrol
const m = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 })).newPage();
await m.goto("http://localhost:3000/tr/hizmetler/web-tasarim", { waitUntil: "domcontentloaded", timeout: 60000 });
await m.waitForTimeout(2500);
const ovf = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("Mobil yatay taşma:", ovf, "px");
await b.close();
