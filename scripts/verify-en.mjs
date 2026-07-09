import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const shots = "C:/Users/PC/AppData/Local/Temp/claude/c--Users-PC--gemini-antigravity-scratch-brog-brog/d21a068c-e37f-4cff-907e-b7f7419813ff/scratchpad";
for (const [path, name] of [["/en/hizmetler","en-hizmetler"],["/en/hakkimizda","en-hakkimizda"],["/en/blog","en-blog"]]) {
  await p.goto("http://localhost:3000" + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(2500);
  console.log(path, "→", await p.title());
  const h1 = await p.locator("h1").first().textContent();
  console.log("   h1:", h1?.trim().slice(0, 70));
  await p.screenshot({ path: `${shots}/${name}.png` });
}
// TR regresyon
for (const path of ["/tr/hizmetler", "/tr/hakkimizda", "/tr/blog", "/tr", "/tr/teklif"]) {
  await p.goto("http://localhost:3000" + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await p.waitForTimeout(1500);
  const h1 = await p.locator("h1").first().textContent().catch(() => "(h1 yok)");
  console.log(path, "h1:", (h1 || "").trim().replace(/\s+/g, " ").slice(0, 60));
}
await b.close();
