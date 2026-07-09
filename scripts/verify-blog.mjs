import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });

await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(4000);
await p.evaluate(() => window.scrollTo(0, 420));
await p.waitForTimeout(2500);
await p.screenshot({ path: "scripts/blog_list.jpg", type: "jpeg", quality: 84 });

await p.goto("http://localhost:3000/tr/blog/seo-nedir-isletmeler-icin-baslangic-rehberi", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(4000);
const title = await p.title();
console.log("detay title:", title);
await p.evaluate(() => window.scrollTo(0, 900));
await p.waitForTimeout(2500);
await p.screenshot({ path: "scripts/blog_detail.jpg", type: "jpeg", quality: 84 });

await b.close();
console.log("done");
