"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !pass || loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Kullanıcı adı veya şifre hatalı.");
        setLoading(false);
      }
    } catch {
      setError("Bağlantı hatası — tekrar deneyin.");
      setLoading(false);
    }
  }

  return (
    // Sidebar'lı admin layout'unun üzerine tam ekran biner
    <div className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center p-6">
      {/* Arka plan: hafif mavi ışıma */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 700,
          background: "radial-gradient(circle at center, rgba(37,99,235,0.14) 0%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Marka */}
        <div className="flex flex-col items-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vogolab-vg-mark-white.svg" alt="Vogolab" className="h-12 w-auto mb-5" />
          <h1 className="text-white text-xl font-bold tracking-widest uppercase">Vogolab</h1>
          <p className="text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase mt-1.5">Yönetim Paneli</p>
        </div>

        {/* Kart */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-5 shadow-2xl shadow-black/40"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide">Kullanıcı Adı</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              autoFocus
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide">Şifre</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs -mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !user || !pass}
            className="mt-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg py-3 transition-colors"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-8">© {new Date().getFullYear()} Vogolab</p>
      </div>
    </div>
  );
}
