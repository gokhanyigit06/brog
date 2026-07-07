import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = "Blog — Web, Reklam & SEO Rehberleri | Vogolab";
  const description = "Web tasarım, dijital reklam ve SEO üzerine güncel rehberler, ipuçları ve sektör analizleri. Vogolab ekibinden markanızı büyütecek içerikler.";
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${lang}/blog` },
    openGraph: { title, description, url: `${SITE_URL}/${lang}/blog`, siteName: "Vogolab", type: "website", locale: "tr_TR", images: [{ url: "/og-teklif.jpg", width: 1200, height: 630 }] },
  };
}

function fmtDate(iso: string, lang: string): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch { return ""; }
}

function PostCard({ post, lang }: { post: BlogPost; lang: string }) {
  const tr = lang === "tr";
  const title = (tr ? post.title?.tr : post.title?.en) || post.title?.tr || "";
  const excerpt = (tr ? post.excerpt?.tr : post.excerpt?.en) || post.excerpt?.tr || "";
  const cover = post.coverMedia?.url || "";

  return (
    <Link href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", borderRadius: 16, overflow: "hidden", background: "#eef0f2", border: "1px solid #e5e7eb" }}>
        {cover ? (
          post.coverMedia?.type === "video" ? (
            <video src={cover} muted loop playsInline autoPlay style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Image src={cover} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
          )
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/vogolab-vg-mark.svg" alt="" style={{ width: "26%", opacity: 0.1 }} />
          </div>
        )}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          {(post.tags || []).slice(0, 2).map((t, i) => (
            <span key={t} style={{
              display: "inline-block", borderRadius: 999, padding: "5px 12px", fontSize: 11.5, fontWeight: 600, lineHeight: 1,
              ...(i === 0
                ? { background: "var(--accent)", color: "var(--accent-ink)" }
                : { border: "1px solid #d1d5db", color: "#374151" }),
            }}>{t}</span>
          ))}
          <span style={{ fontSize: 13, color: "#9ca3af" }}>{fmtDate(post.publishedAt || post.createdAt, lang)}</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0 }}>{title}</h2>
        {excerpt && <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#4b5563", marginTop: 10, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{excerpt}</p>}
      </div>
    </Link>
  );
}

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  let posts: BlogPost[] = [];
  try { posts = await getAllPosts(true); } catch { posts = []; }

  return (
    <>
      <Navbar lang={lang} lightBg />
      <main style={{ background: "#fff", minHeight: "100vh" }}>
        <div style={{ paddingTop: 150, paddingBottom: 56, textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>
            Blog
          </p>
          <h1 style={{ fontSize: "clamp(52px, 8vw, 110px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.92, color: "#0a0a0a", margin: 0 }}>
            Fikirler &amp;<br />Rehberler
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", marginTop: 24, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Web tasarım, reklam ve SEO üzerine markanızı büyütecek güncel içerikler.
          </p>
        </div>

        <div className="section-container" style={{ paddingBottom: 120 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9ca3af", fontSize: 15 }}>
              İlk yazılar çok yakında burada.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", columnGap: 36, rowGap: 64 }}>
              {posts.map((p) => <PostCard key={p.id} post={p} lang={lang} />)}
            </div>
          )}
        </div>
      </main>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
