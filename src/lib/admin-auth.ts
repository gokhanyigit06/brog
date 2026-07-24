// Admin oturum yardımcıları — hem Edge (proxy) hem Node (API route) ortamında
// çalışsın diye yalnızca Web Crypto kullanır.

const ADMIN_USER = () => process.env.ADMIN_USER || "vogolab";
const ADMIN_PASS = () => process.env.ADMIN_PASS || "vogolab2026";

export const ADMIN_COOKIE = "vg_admin";
const SESSION_DAYS = 30;

function secret(): string {
  // Şifre değişirse tüm eski oturumlar otomatik geçersizleşir
  return `${ADMIN_USER()}:${ADMIN_PASS()}:vogolab-admin-v1`;
}

async function hmac(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USER() && pass === ADMIN_PASS();
}

/** İmzalı oturum token'ı: "<sonKullanmaMs>.<imza>" */
export async function createAdminToken(): Promise<string> {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${await hmac(String(exp))}`;
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return (await hmac(expStr)) === sig;
}

export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // saniye (cookie maxAge)
