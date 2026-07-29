// Admin panelinin İÇERİK yazma yolu. İstemciden Firestore'a doğrudan yazmak
// yerine sunucu rotasına (/api/admin/content) gider; orada Admin SDK yazar.
// Neden böyle olduğu: src/app/api/admin/content/route.ts başındaki not.
//
// İmzalar bilerek Firestore yardımcılarına benzetildi ki çağrı yerleri
// birebir değiştirilebilsin.

async function cagir(govde: Record<string, unknown>): Promise<{ id?: string }> {
  const r = await fetch("/api/admin/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(govde),
  });
  if (!r.ok) {
    const m = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(
      r.status === 401
        ? "Oturum düşmüş görünüyor — yeniden giriş yapıp tekrar deneyin."
        : m.error ?? `Kaydedilemedi (HTTP ${r.status})`
    );
  }
  return (await r.json()) as { id?: string };
}

export const adminSet = (col: string, id: string, data: Record<string, unknown>) =>
  cagir({ op: "set", col, id, data }).then(() => undefined);

export const adminUpdate = (col: string, id: string, data: Record<string, unknown>) =>
  cagir({ op: "update", col, id, data }).then(() => undefined);

export const adminAdd = (col: string, data: Record<string, unknown>) =>
  cagir({ op: "add", col, data }).then((r) => r.id as string);

export const adminDelete = (col: string, id: string) =>
  cagir({ op: "delete", col, id }).then(() => undefined);
