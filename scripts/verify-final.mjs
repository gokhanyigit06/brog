import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1050 } });

await p.goto("http://localhost:3000/tr/hizmetler", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3500);
await p.evaluate(() => window.scrollTo(0, 750));
await p.waitForTimeout(2500);
await p.screenshot({ path: "scripts/final_hizmetler.jpg", type: "jpeg", quality: 82 });

await p.goto("http://localhost:3000/tr/blog/ankara-web-sitesi-yaptirma-rehberi", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3500);
console.log("blog title:", await p.title());
await p.screenshot({ path: "scripts/final_ankara_post.jpg", type: "jpeg", quality: 82 });

await b.close();
console.log("done");
