import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";
import StickyCta from "@/components/site/sticky-cta";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import type { BlogBlock, BlogPost } from "@/types/blog";
import type { LocaleText, MediaItem } from "@/types/content";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vogolab.com";

function pick(t: LocaleText | undefined, lang: string): string {
  if (!t) return "";
  return (lang === "tr" ? t.tr : t.en) || t.tr || "";
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Blog | Vogolab" };
    const title = `${pick(post.title, lang)} | Vogolab Blog`;
    const description = pick(post.excerpt, lang).replace(/\s+/g, " ").slice(0, 158);
    const url = `${SITE_URL}/${lang}/blog/${slug}`;
    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title, description, url, siteName: "Vogolab", type: "article", locale: "tr_TR",
        publishedTime: post.publishedAt || post.createdAt,
        images: post.coverMedia?.url && post.coverMedia.type === "image"
          ? [{ url: post.coverMedia.url }]
          : [{ url: "/og-teklif.jpg", width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch {
    return { title: "Blog | Vogolab" };
  }
}

function fmtDate(iso: string, lang: string): string {
  try {
    return new Date(iso).toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  } catch { return ""; }
}

/* ── Medya (görsel/video) ── */
function Media({ media, radius = 16 }: { media?: MediaItem; radius?: number }) {
  if (!media?.url) return null;
  if (media.type === "video") {
    return <video src={media.url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: radius }} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={media.url} alt={media.alt || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: radius }} />;
}

/* ── Zengin metin: HTML ise olduğu gibi, düz metinse paragraflara böl ── */
function RichText({ text }: { text: string }) {
  const style: React.CSSProperties = { fontSize: 17, lineHeight: 1.85, color: "#374151" };
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return <div style={style} className="blog-rich" dangerouslySetInnerHTML={{ __html: text }} />;
  }
  return (
    <div style={style}>
      {text.split(/\n{2,}/).map((p, i) => (
        <p key={i} style={{ margin: "0 0 20px" }}>{p}</p>
      ))}
    </div>
  );
}

function Block({ block, lang }: { block: BlogBlock; lang: string }) {
  switch (block.type) {
    case "rich_text":
      return <RichText text={pick(block.content, lang)} />;
    case "media":
      return (
        <figure style={{ margin: 0 }}>
          <div style={{ width: "100%", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: 16 }}><Media media={block.media} /></div>
          {block.caption && pick(block.caption, lang) && <figcaption style={{ fontSize: 13, color: "#9ca3af", marginTop: 10, textAlign: "center" }}>{pick(block.caption, lang)}</figcaption>}
        </figure>
      );
    case "two_media":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {block.items.map((m, i) => <div key={i} style={{ aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 16 }}><Media media={m} /></div>)}
        </div>
      );
    case "three_media":
      return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {block.items.map((m, i) => <div key={i} style={{ aspectRatio: "9 / 16", overflow: "hidden", borderRadius: 16 }}><Media media={m} /></div>)}
        </div>
      );
    case "text_left":
    case "text_right": {
      const textFirst = block.type === "text_left";
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          {textFirst && <RichText text={pick(block.text, lang)} />}
          <div style={{ aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 16 }}><Media media={block.media} /></div>
          {!textFirst && <RichText text={pick(block.text, lang)} />}
        </div>
      );
    }
    case "quote":
      return (
        <blockquote style={{ margin: 0, borderLeft: "3px solid var(--accent)", paddingLeft: 28 }}>
          <p style={{ fontSize: "clamp(20px, 2.4vw, 28px)", fontWeight: 600, lineHeight: 1.45, color: "#0a0a0a", margin: 0, letterSpacing: "-0.01em" }}>
            “{pick(block.text, lang)}”
          </p>
          {block.author && <cite style={{ display: "block", marginTop: 14, fontSize: 14, color: "#6b7280", fontStyle: "normal" }}>— {block.author}</cite>}
        </blockquote>
      );
    case "spacer":
      return <div style={{ height: block.size === "lg" ? 80 : block.size === "md" ? 48 : 24 }} />;
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;
  let post: BlogPost | null = null;
  try { post = await getPostBySlug(slug); } catch { post = null; }

  if (!post || !post.published) {
    return (
      <>
        <Navbar lang={lang} lightBg />
        <main style={{ background: "#fff", minHeight: "70vh", paddingTop: 180, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0a0a0a" }}>Yazı bulunamadı</h1>
          <Link href={`/${lang}/blog`} style={{ color: "var(--accent)", fontSize: 15, marginTop: 16, display: "inline-block", textDecoration: "none", fontWeight: 600 }}>← Tüm yazılar</Link>
        </main>
        <Footer lang={lang} />
      </>
    );
  }

  const title = pick(post.title, lang);
  const excerpt = pick(post.excerpt, lang);
  let others: BlogPost[] = [];
  try { others = (await getAllPosts(true)).filter((p) => p.id !== post!.id).slice(0, 2); } catch { others = []; }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: post.coverMedia?.type === "image" ? post.coverMedia?.url : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.author || "Vogolab" },
    publisher: { "@type": "Organization", name: "Vogolab", logo: { "@type": "ImageObject", url: `${SITE_URL}/vogolab-vg-mark.svg` } },
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar lang={lang} lightBg />
      <main style={{ background: "#fff", minHeight: "100vh" }}>

        {/* ── Başlık ── */}
        <div className="section-container" style={{ paddingTop: 150, paddingBottom: 48 }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
              {(post.tags || []).slice(0, 3).map((t, i) => (
                <span key={t} style={{
                  display: "inline-block", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 600, lineHeight: 1,
                  ...(i === 0 ? { background: "var(--accent)", color: "var(--accent-ink)" } : { border: "1px solid #d1d5db", color: "#374151" }),
                }}>{t}</span>
              ))}
              <span style={{ fontSize: 14, color: "#9ca3af" }}>{fmtDate(post.publishedAt || post.createdAt, lang)}</span>
            </div>
            <h1 style={{ fontSize: "clamp(34px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05, color: "#0a0a0a", margin: 0 }}>
              {title}
            </h1>
            {excerpt && <p style={{ fontSize: 18, lineHeight: 1.65, color: "#4b5563", marginTop: 22, maxWidth: 700 }}>{excerpt}</p>}
          </div>
        </div>

        {/* ── Kapak ── */}
        {post.coverMedia?.url && (
          <div className="section-container" style={{ paddingBottom: 64 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "21 / 9", borderRadius: 20, overflow: "hidden", background: "#eef0f2" }}>
              {post.coverMedia.type === "video" ? (
                <video src={post.coverMedia.url} autoPlay muted loop playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Image src={post.coverMedia.url} alt={title} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
              )}
            </div>
          </div>
        )}

        {/* ── Gövde blokları ── */}
        <article className="section-container" style={{ paddingBottom: 96 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>
            {(post.body || []).map((b) => <Block key={b.id} block={b} lang={lang} />)}
          </div>
        </article>

        {/* ── Diğer yazılar ── */}
        {others.length > 0 && (
          <div className="section-container" style={{ paddingBottom: 110 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0a0a0a", marginBottom: 40 }}>
              Diğer yazılar
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 36 }}>
              {others.map((p) => (
                <Link key={p.id} href={`/${lang}/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10", borderRadius: 16, overflow: "hidden", background: "#eef0f2", marginBottom: 16 }}>
                    {p.coverMedia?.url && p.coverMedia.type === "image" && (
                      <Image src={p.coverMedia.url} alt={pick(p.title, lang)} fill sizes="33vw" style={{ objectFit: "cover" }} />
                    )}
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-0.01em", margin: 0 }}>{pick(p.title, lang)}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        <style>{`
          .blog-rich p { margin: 0 0 20px; }
          .blog-rich h2 { font-size: 28px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; margin: 36px 0 16px; }
          .blog-rich h3 { font-size: 22px; font-weight: 700; color: #0a0a0a; margin: 28px 0 12px; }
          .blog-rich a { color: var(--accent); }
          .blog-rich ul, .blog-rich ol { padding-left: 24px; margin: 0 0 20px; }
          .blog-rich li { margin-bottom: 8px; }
          @media (max-width: 767px) {
            article .section-container > div > div[style*="grid"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </>
  );
}
