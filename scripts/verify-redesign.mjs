import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });

async function shot(url, name, scrollY, wait=3500) {
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(2500);
  if (scrollY) { await p.evaluate(y=>window.scrollTo(0,y), scrollY); }
  await p.waitForTimeout(wait);
  await p.screenshot({ path: `scripts/rd_${name}.jpg`, type:"jpeg", quality:82 });
}

await shot("http://localhost:3000/tr/projeler", "projeler", 520);
await shot("http://localhost:3000/tr/hizmetler", "hizmetler_hero", 0);
await shot("http://localhost:3000/tr/hizmetler", "hizmetler_svc", 720);
await shot("http://localhost:3000/tr/teklif", "teklif", 1250);
await b.close();
console.log("done");
