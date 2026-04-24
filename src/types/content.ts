// ─── Media (Image or Video) ───────────────────────────────────────────────────
export interface MediaItem {
  type: "image" | "video";
  url: string;
  alt?: string;           // for images
  poster?: string;        // for videos (thumbnail url)
  width?: number;
  height?: number;
}

// ─── Localised Text ───────────────────────────────────────────────────────────
export interface LocaleText {
  tr: string;
  en: string;
}

// ─── Section Types ────────────────────────────────────────────────────────────
export type SectionType =
  | "hero"
  | "text"
  | "media"
  | "cards"
  | "gallery"
  | "cta"
  | "stats"
  | "team"
  | "faq"
  | "contact_form"
  | "custom";

// ─── Base Section ─────────────────────────────────────────────────────────────
export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  updatedAt: string; // ISO
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export interface HeroSection extends BaseSection {
  type: "hero";
  title: LocaleText;
  subtitle: LocaleText;
  cta?: { label: LocaleText; href: string };
  media?: MediaItem;
}

// ─── Text Section ─────────────────────────────────────────────────────────────
export interface TextSection extends BaseSection {
  type: "text";
  title?: LocaleText;
  body: LocaleText;
}

// ─── Media Section ────────────────────────────────────────────────────────────
export interface MediaSection extends BaseSection {
  type: "media";
  title?: LocaleText;
  media: MediaItem;
  caption?: LocaleText;
}

// ─── Cards Section ────────────────────────────────────────────────────────────
export interface CardItem {
  id: string;
  title: LocaleText;
  description?: LocaleText;
  media?: MediaItem;
  href?: string;
}

export interface CardsSection extends BaseSection {
  type: "cards";
  title?: LocaleText;
  subtitle?: LocaleText;
  items: CardItem[];
  columns?: 2 | 3 | 4;
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
export interface GallerySection extends BaseSection {
  type: "gallery";
  title?: LocaleText;
  items: MediaItem[];
  columns?: 2 | 3 | 4;
}

// ─── CTA Section ─────────────────────────────────────────────────────────────
export interface CtaSection extends BaseSection {
  type: "cta";
  title: LocaleText;
  subtitle?: LocaleText;
  buttonLabel: LocaleText;
  buttonHref: string;
  media?: MediaItem;
}

// ─── Stats Section ────────────────────────────────────────────────────────────
export interface StatItem {
  id: string;
  value: LocaleText;
  label: LocaleText;
}

export interface StatsSection extends BaseSection {
  type: "stats";
  title?: LocaleText;
  items: StatItem[];
}

// ─── Team Section ─────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: LocaleText;
  bio?: LocaleText;
  photo?: MediaItem;
}

export interface TeamSection extends BaseSection {
  type: "team";
  title?: LocaleText;
  members: TeamMember[];
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
export interface FaqItem {
  id: string;
  question: LocaleText;
  answer: LocaleText;
}

export interface FaqSection extends BaseSection {
  type: "faq";
  title?: LocaleText;
  items: FaqItem[];
}

// ─── Contact Form Section ────────────────────────────────────────────────────
export interface ContactFormSection extends BaseSection {
  type: "contact_form";
  title?: LocaleText;
  subtitle?: LocaleText;
  email: string; // receives form submissions
}

// ─── Union ───────────────────────────────────────────────────────────────────
export type Section =
  | HeroSection
  | TextSection
  | MediaSection
  | CardsSection
  | GallerySection
  | CtaSection
  | StatsSection
  | TeamSection
  | FaqSection
  | ContactFormSection;

// ─── Page ─────────────────────────────────────────────────────────────────────
export type PageSlug =
  | "anasayfa"
  | "projeler"
  | "hizmetler"
  | "hakkimizda"
  | "iletisim";

export interface PageData {
  slug: PageSlug;
  sections: Section[];
  updatedAt: string;
}
