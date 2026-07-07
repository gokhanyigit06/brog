import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });

// 1) İletişim formu gönder
const stamp = String(Math.floor(Math.random() * 100000));
await p.goto("http://localhost:3000/tr/iletisim", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.fill('input[placeholder="Adınız"]', `Form Test ${stamp}`);
await p.fill('input[placeholder="E-posta adresiniz"]', "test@ornek.com");
await p.fill('textarea[placeholder="Mesajınız"]', "İletişim formu doğrulama mesajı.");
await p.click("text=Mesaj Gönder");
await p.waitForTimeout(3000);
const ok = await p.getByText("Mesajınız iletildi").count().catch(() => 0);
console.log("İletişim formu:", ok > 0 ? "OK" : "BAŞARISIZ");

// 2) Admin'de görünüyor mu
const actx = await b.newContext({ viewport: { width: 1280, height: 900 }, httpCredentials: { username: "vogolab", password: "vogolab2026" } });
const ap = await actx.newPage();
await ap.goto("http://localhost:3000/admin/leads", { waitUntil: "domcontentloaded", timeout: 60000 });
await ap.waitForTimeout(2500);
const inAdmin = await ap.getByText(`Form Test ${stamp}`).count().catch(() => 0);
console.log("Admin'de lead:", inAdmin > 0 ? `OK (${stamp})` : "YOK");
await ap.screenshot({ path: "scripts/p2_admin_leads.jpg", type: "jpeg", quality: 84 });

// 3) Hakkımızda + blog + detay "diğer çalışmalar"
await p.goto("http://localhost:3000/tr/hakkimizda", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(3000);
await p.screenshot({ path: "scripts/p2_hakkimizda.jpg", type: "jpeg", quality: 82 });
await p.goto("http://localhost:3000/tr/blog", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.screenshot({ path: "scripts/p2_blog.jpg", type: "jpeg", quality: 82 });
await p.goto("http://localhost:3000/tr/projeler/neo-maison", { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(2500);
await p.evaluate(() => { const h=[...document.querySelectorAll("h2,h3")].find(e=>/Diğer Çalışmalar|More works/i.test(e.textContent||"")); if(h) h.scrollIntoView({block:"start"}); });
await p.waitForTimeout(3000);
await p.screenshot({ path: "scripts/p2_others.jpg", type: "jpeg", quality: 82 });

await b.close();
console.log("done");
