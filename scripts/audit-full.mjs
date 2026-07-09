import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();

const consoleErrs = {};
p.on("console", (m) => { if (m.type() === "error") (consoleErrs[p.url()] ||= []).push(m.text().slice(0, 120)); });
p.on("pageerror", (e) => (consoleErrs[p.url()] ||= []).push("PAGEERROR: " + String(e).slice(0, 120)));

// Şüpheli kalıplar (şablon kalıntısı, placeholder, bozuk değer)
const SUSPECT = [/BROG/i, /lorem/i, /Urban Glow/i, /Yoyoki/i, /\(510\)/, /hello@vogolab/i, /undefined/, /\bNaN\b/, /placeholder/i, /TODO/, /Lorem/];

const seeds = ["/tr", "/en"];
const seen = new Set();
const queue = [...seeds];
const report = [];

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  let status = 0;
  try {
    const resp = await p.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 45000 });
    status = resp?.status() || 0;
  } catch (e) { report.push({ path, issue: "YÜKLENMEDİ: " + String(e).slice(0, 80) }); continue; }
  await p.waitForTimeout(1800);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(600);

  const data = await p.evaluate(() => {
    const text = document.body.innerText;
    const links = [...document.querySelectorAll("a[href]")].map(a => a.getAttribute("href"));
    const deadLinks = links.filter(h => h === "#" || h === "" || h === "javascript:void(0)").length;
    const title = document.title;
    const h1 = document.querySelector("h1")?.innerText || "(h1 YOK)";
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const imgsBroken = [...document.querySelectorAll("img")].filter(i => i.complete && i.naturalWidth === 0 && i.src).map(i => i.src.slice(0, 80));
    const metaDesc = document.querySelector('meta[name="description"]')?.content || "(YOK)";
    return { text, links, deadLinks, title, h1, overflow, imgsBroken, metaDesc };
  });

  if (status !== 200) report.push({ path, issue: `HTTP ${status}` });
  for (const rx of SUSPECT) {
    const m = data.text.match(rx);
    if (m) {
      const i = data.text.search(rx);
      report.push({ path, issue: `ŞÜPHELİ METİN "${m[0]}": ...${data.text.slice(Math.max(0,i-40), i+60).replace(/\n/g," ")}...` });
    }
  }
  if (data.deadLinks > 0) report.push({ path, issue: `${data.deadLinks} ölü link (href="#")` });
  if (data.overflow > 0) report.push({ path, issue: `yatay taşma ${data.overflow}px (masaüstü)` });
  if (data.imgsBroken.length) report.push({ path, issue: `kırık görsel: ${data.imgsBroken.join(", ")}` });
  if (data.metaDesc === "(YOK)") report.push({ path, issue: "meta description yok" });
  console.log(`✓ ${path} [${status}] "${data.title.slice(0, 60)}"`);

  // iç linkleri kuyruğa ekle
  for (let h of data.links) {
    if (!h || !h.startsWith("/")) continue;
    h = h.split("#")[0].split("?")[0];
    if (h && !seen.has(h) && !h.startsWith("/admin") && !h.startsWith("/_next")) queue.push(h);
  }
}

console.log("\n════ BULGULAR ════");
if (!report.length) console.log("(temiz)");
for (const r of report) console.log(`• ${r.path} — ${r.issue}`);
console.log("\n════ KONSOL HATALARI ════");
for (const [url, errs] of Object.entries(consoleErrs)) console.log(`• ${url}\n   ${[...new Set(errs)].slice(0,3).join("\n   ")}`);
console.log(`\nToplam ${seen.size} sayfa tarandı.`);
await b.close();
