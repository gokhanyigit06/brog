import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────

/** Convert any string to a URL-safe slug. "Acity AVM 2025" → "acity-avm-2025" */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Guard: only use slug override if it's a clean path token — no dots, slashes, or http */
function isValidSlug(s?: string): boolean {
  return !!s && !s.includes(".") && !s.includes("/") && !s.startsWith("http");
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface HeroContent {
  title_main: string;
  title_sub: string;
  services_tr: string[];
  services_en: string[];
  slogan_tr: string;
  slogan_en: string;
  bgColor: string;
  bgImage: string;
  card1Image: string;   // small card
  card2Image: string;   // medium card
  card3Image: string;   // large card / hero bg
}

export interface NavbarContent {
  logoUrl: string;
  brandText: string;
  email: string;
  phone: string;
  location: string;
  menuBgImage: string;
  menuBrandLine1: string;     // big text line 1 in menu overlay (e.g. "vogolab")
  menuBrandLine2: string;     // big text line 2 in menu overlay (e.g. "lab.")
  social_x: string;
  social_dribbble: string;
  social_instagram: string;
  social_linkedin: string;
  nav_home_tr: string;
  nav_home_en: string;
  nav_projects_tr: string;
  nav_projects_en: string;
  nav_services_tr: string;
  nav_services_en: string;
  nav_about_tr: string;
  nav_about_en: string;
  nav_contact_tr: string;
  nav_contact_en: string;
}

export interface SiteSettings {
  email: string;
  phone: string;
  location: string;
  social_x: string;
  social_dribbble: string;
  social_instagram: string;
  social_linkedin: string;
}

// ─────────────────────────────────────────────
// PROJECT CONTENT BLOCKS
// ─────────────────────────────────────────────

export type ProjectBlock =
  | { type: "image_16_9"; url: string }
  | { type: "text_block"; label: string; title_tr: string; title_en: string; body_tr: string; body_en: string }
  | { type: "gallery"; layout: "left_big" | "right_big"; big: string; small1: string; small2: string }
  | { type: "single_image"; url: string; ratio: string }
  | { type: "mobile_preview"; count: 1 | 2 | 3; phones: Array<{ url?: string; imageUrl?: string }> };

export interface Project {
  id?: string;
  title: string;
  brandName: string;
  slug?: string;              // URL slug — falls back to id if not set
  description_tr: string;
  description_en: string;
  industry_tr?: string;       // e.g. "Sağlık"
  industry_en?: string;       // e.g. "Healthcare"
  timeline?: string;          // e.g. "8 Weeks"
  imageUrl: string;           // homepage cover image
  listingImageUrl?: string;   // projects-page cover image — falls back to imageUrl
  videoUrl?: string;          // homepage cover video (replaces imageUrl when present)
  listingVideoUrl?: string;   // projects-page cover video (replaces listingImageUrl when present)
  year: string;
  category: string;           // space of work
  tags: string[];
  link: string;               // live website URL
  order: number;
  featured: boolean;
  blocks?: ProjectBlock[];    // detail page content blocks
}

export interface Service {
  id?: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  order: number;
}

export interface AboutContent {
  title_tr: string;
  title_en: string;
  bio_tr: string;
  bio_en: string;
  image: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address_tr: string;
  address_en: string;
  maps_link: string;
  heroImage: string;   // top cover image
  image1: string;      // bottom-left image
  image2: string;      // bottom-right image
}

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────

const HERO_DEFAULT: HeroContent = {
  title_main: "VOGO",
  title_sub: "lab.",
  services_tr: ["MARKA", "TASARIM", "GELİŞTİRME", "FOTOĞRAF", "PAZARLAMA"],
  services_en: ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING"],
  slogan_tr: "Büyümeyi hızlandıran iş çözümleri üretiyoruz —\nverimli, ölçeklenebilir ve sonuç odaklı.",
  slogan_en: "We build business solutions that drive real growth —\nefficient, scalable, and profit-focused.",
  bgColor: "linear-gradient(160deg, #0a2540 0%, #07182a 100%)",
  bgImage: "",
  card1Image: "",
  card2Image: "",
  card3Image: "",
};

export async function getHeroContent(): Promise<HeroContent> {
  const snap = await getDoc(doc(db, "siteContent", "hero"));
  if (!snap.exists()) return HERO_DEFAULT;
  return { ...HERO_DEFAULT, ...snap.data() } as HeroContent;
}

export async function saveHeroContent(data: HeroContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "hero"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────

const NAVBAR_DEFAULT: NavbarContent = {
  logoUrl: "",
  brandText: "vogolab",
  email: "hello@brog.com",
  phone: "+90 555 000 0000",
  location: "Istanbul, Turkey",
  menuBgImage: "",
  menuBrandLine1: "vogolab",
  menuBrandLine2: "lab.",
  social_x: "https://x.com",
  social_dribbble: "https://dribbble.com",
  social_instagram: "https://instagram.com",
  social_linkedin: "https://linkedin.com",
  nav_home_tr: "Ana Sayfa",
  nav_home_en: "Home",
  nav_projects_tr: "Projeler",
  nav_projects_en: "Projects",
  nav_services_tr: "Hizmetler",
  nav_services_en: "Services",
  nav_about_tr: "Hakkımızda",
  nav_about_en: "About",
  nav_contact_tr: "İletişim",
  nav_contact_en: "Contact",
};

export async function getNavbarContent(): Promise<NavbarContent> {
  const snap = await getDoc(doc(db, "siteContent", "navbar"));
  if (!snap.exists()) return NAVBAR_DEFAULT;
  return { ...NAVBAR_DEFAULT, ...snap.data() } as NavbarContent;
}

export async function saveNavbarContent(data: NavbarContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "navbar"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────

const SETTINGS_DEFAULT: SiteSettings = {
  email: "hello@brog.com",
  phone: "+90 555 000 0000",
  location: "Istanbul, Turkey",
  social_x: "https://x.com",
  social_dribbble: "https://dribbble.com",
  social_instagram: "https://instagram.com",
  social_linkedin: "https://linkedin.com",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, "siteContent", "settings"));
  if (!snap.exists()) return SETTINGS_DEFAULT;
  return { ...SETTINGS_DEFAULT, ...snap.data() } as SiteSettings;
}

export async function saveSiteSettings(data: SiteSettings): Promise<void> {
  await setDoc(doc(db, "siteContent", "settings"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Project))
    .filter((p) => p.featured === true);
}

export async function addProject(data: Omit<Project, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, "projects", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();

  // 1) Explicit clean slug override
  const byExplicit = all.find((p) => isValidSlug(p.slug) && p.slug === slug);
  if (byExplicit) return byExplicit;

  // 2) Auto-match by slugified brandName
  const byBrand = all.find((p) => slugify(p.brandName || p.title || "") === slug);
  if (byBrand) return byBrand;

  // 3) Fall back to Firestore document id
  const byId = await getDoc(doc(db, "projects", slug));
  if (byId.exists()) return { id: byId.id, ...byId.data() } as Project;

  return null;
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export async function getServices(): Promise<Service[]> {
  const q = query(collection(db, "services"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
}

export async function addService(data: Omit<Service, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "services"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, "services", id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, "services", id));
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────

const ABOUT_DEFAULT: AboutContent = {
  title_tr: "Hakkımızda",
  title_en: "About Us",
  bio_tr: "",
  bio_en: "",
  image: "",
};

export async function getAboutContent(): Promise<AboutContent> {
  const snap = await getDoc(doc(db, "siteContent", "about"));
  if (!snap.exists()) return ABOUT_DEFAULT;
  return { ...ABOUT_DEFAULT, ...snap.data() } as AboutContent;
}

export async function saveAboutContent(data: AboutContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "about"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

const CONTACT_DEFAULT: ContactContent = {
  email: "hello@brog.com",
  phone: "+90 555 000 0000",
  address_tr: "İstanbul, Türkiye",
  address_en: "Istanbul, Turkey",
  maps_link: "",
  heroImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400&q=80",
  image1: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
  image2: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=900&q=80",
};

export async function getContactContent(): Promise<ContactContent> {
  const snap = await getDoc(doc(db, "siteContent", "contact"));
  if (!snap.exists()) return CONTACT_DEFAULT;
  return { ...CONTACT_DEFAULT, ...snap.data() } as ContactContent;
}

export async function saveContactContent(data: ContactContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "contact"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// FILE UPLOAD (Firebase Storage)
// ─────────────────────────────────────────────

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore if not found
  }
}

// ─────────────────────────────────────────────
// SHOWCASE SECTION
// ─────────────────────────────────────────────

export interface ShowcaseMediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  order: number;
  duration: number; // seconds each item is shown
}

export interface ShowcaseContent {
  label: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  stat1_value: string;
  stat1_label_tr: string;
  stat1_label_en: string;
  stat2_value: string;
  stat2_label_tr: string;
  stat2_label_en: string;
  stat3_value: string;
  stat3_label_tr: string;
  stat3_label_en: string;
  mediaItems: ShowcaseMediaItem[];
}

const SHOWCASE_DEFAULT: ShowcaseContent = {
  label: "01 — Our Commitment",
  title_tr: "Her projede tutarlı kalite, yenilikçi tasarım",
  title_en: "Consistent quality in every project, innovative Design",
  description_tr: "Tasarımın amaca buluştuğu dijital deneyimler yaratıyoruz — yenilik ile netliği harmanlıyoruz.",
  description_en: "We create digital experiences where design meets purpose — blending innovation with clarity.",
  stat1_value: "120+",
  stat1_label_tr: "Tamamlanan Proje",
  stat1_label_en: "Projects Done",
  stat2_value: "98%",
  stat2_label_tr: "Müşteri Memnuniyeti",
  stat2_label_en: "Client Retention",
  stat3_value: "5+",
  stat3_label_tr: "Yıllık Deneyim",
  stat3_label_en: "Years Experience",
  mediaItems: [],
};

export async function getShowcaseContent(): Promise<ShowcaseContent> {
  const snap = await getDoc(doc(db, "siteContent", "showcase"));
  if (!snap.exists()) return SHOWCASE_DEFAULT;
  return { ...SHOWCASE_DEFAULT, ...snap.data() } as ShowcaseContent;
}

export async function saveShowcaseContent(data: ShowcaseContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "showcase"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// MARQUEE SECTION
// ─────────────────────────────────────────────

export interface MarqueeContent {
  items: string[];   // text items to display
  speed: number;     // seconds for one full loop (lower = faster)
}

const MARQUEE_DEFAULT: MarqueeContent = {
  items: ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING", "STRATEGY", "MOTION", "UX/UI"],
  speed: 30,
};

export async function getMarqueeContent(): Promise<MarqueeContent> {
  const snap = await getDoc(doc(db, "siteContent", "marquee"));
  if (!snap.exists()) return MARQUEE_DEFAULT;
  return { ...MARQUEE_DEFAULT, ...snap.data() } as MarqueeContent;
}

export async function saveMarqueeContent(data: MarqueeContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "marquee"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// PROJECTS SECTION
// ─────────────────────────────────────────────

export interface ProjectItem {
  id: string;
  imageUrl: string;
  brandName: string;
  year: string;
  category: string;
  link: string;
  order: number;
}

export interface ProjectsContent {
  label: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  viewAllLink: string;
  projects: ProjectItem[];
}

const PROJECTS_DEFAULT: ProjectsContent = {
  label: "02",
  title_tr: "Projeler",
  title_en: "Latest Works",
  description_tr: "Kendileri için konuşan dijital ürünler yaratıyoruz — sade, hızlı ve kullanıcı odaklı.",
  description_en: "We craft digital products that speak for themselves — simple, fast, and user-focused.",
  viewAllLink: "/projects",
  projects: [],
};

export async function getProjectsContent(): Promise<ProjectsContent> {
  const snap = await getDoc(doc(db, "siteContent", "projects"));
  if (!snap.exists()) return PROJECTS_DEFAULT;
  return { ...PROJECTS_DEFAULT, ...snap.data() } as ProjectsContent;
}

export async function saveProjectsContent(data: ProjectsContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "projects"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// WHY SECTION
// ─────────────────────────────────────────────

export interface WhyFeature {
  id: string;
  icon: string;          // emoji or short symbol
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  order: number;
}

export interface WhyContent {
  label: string;
  title_tr: string;
  title_en: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  features: WhyFeature[];
}

const WHY_DEFAULT: WhyContent = {
  label: "03",
  title_tr: "Neden Biz?",
  title_en: "Why VOGOLAB?",
  mediaUrl: "",
  mediaType: "image",
  features: [
    { id: "1", icon: "✦", title_tr: "Strateji &\nAraştırma", title_en: "Strategy &\nResearch", description_tr: "Özelleştirilmiş stratejiler geliştirip derinlemesine araştırmalar yaparak kritik içgörüleri ortaya çıkarıyoruz.", description_en: "We begin by shaping tailored strategies and performing in-depth research to reveal critical insights.", order: 0 },
    { id: "2", icon: "◎", title_tr: "Tasarım &\nPrototip", title_en: "Design &\nPrototype", description_tr: "Fikirleri ilgi çekici tasarımlara ve işlevsel prototiplere dönüştürerek vizyonunuzu hayata geçiriyoruz.", description_en: "We transform ideas into engaging designs and functional prototypes that bring your vision to life.", order: 1 },
    { id: "3", icon: "▦", title_tr: "Geliştir, Test Et &\nOptimize Et", title_en: "Build, Test &\nOptimize", description_tr: "Güvenilir çözümler üretir, kapsamlı testler yapar ve en iyi performans için ince ayar yapıyoruz.", description_en: "We craft reliable solutions, perform thorough testing, and fine-tune for top performance.", order: 2 },
    { id: "4", icon: "↗", title_tr: "Lansman &\nDestek", title_en: "Launch &\nSupport", description_tr: "Hassasiyetle lansman yapıyor ve ürününüzün büyümesine yardımcı olmak için sürekli destek sağlıyoruz.", description_en: "We launch with precision and provide ongoing support to help your product grow.", order: 3 },
  ],
};

export async function getWhyContent(): Promise<WhyContent> {
  const snap = await getDoc(doc(db, "siteContent", "why"));
  if (!snap.exists()) return WHY_DEFAULT;
  return { ...WHY_DEFAULT, ...snap.data() } as WhyContent;
}

export async function saveWhyContent(data: WhyContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "why"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// SITE CONFIG — section visibility
// ─────────────────────────────────────────────

export interface SiteConfig {
  showShowcase: boolean;
  showMarquee: boolean;
  showProjects: boolean;
  showWhy: boolean;
  showServices: boolean;
  showFaq: boolean;
}

const SITE_CONFIG_DEFAULT: SiteConfig = {
  showShowcase: true,
  showMarquee: true,
  showProjects: true,
  showWhy: true,
  showServices: true,
  showFaq: true,
};

export async function getSiteConfig(): Promise<SiteConfig> {
  const snap = await getDoc(doc(db, "siteContent", "siteConfig"));
  if (!snap.exists()) return SITE_CONFIG_DEFAULT;
  return { ...SITE_CONFIG_DEFAULT, ...snap.data() } as SiteConfig;
}

export async function saveSiteConfig(data: SiteConfig): Promise<void> {
  await setDoc(doc(db, "siteContent", "siteConfig"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// SERVICES SECTION
// ─────────────────────────────────────────────

export interface ServiceItem {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  pills: string[];
  order: number;
}

export interface ServicesContent {
  label: string;
  title_tr: string;
  title_en: string;
  items: ServiceItem[];
}

const SERVICES_DEFAULT: ServicesContent = {
  label: "04",
  title_tr: "Hizmetler",
  title_en: "Services",
  items: [
    { id: "1", title_tr: "Art Direction", title_en: "Art Direction", description_tr: "Markanızın görsel hikayesini tanımlayan yaratıcı ve tutarlı sanat yönetimi. Dikkat çeken ve ilham veren estetikler üretiyoruz.", description_en: "Creative and cohesive art direction that defines your brand's visual story. We craft impactful aesthetics that capture attention.", pills: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction", "Photography"], order: 0 },
    { id: "2", title_tr: "Brand Identity", title_en: "Brand Identity", description_tr: "Temel değerlerinizi yansıtan, hedef kitlenizle bağlantı kuran ayırt edici marka kimliği. Tutarlı ve akılda kalıcı bir kimlik şekillendiriyoruz.", description_en: "Distinctive branding that reflects your core values and connects with your audience. We shape a consistent and memorable identity.", pills: ["Animation Strategy", "Storyboarding", "2D / 3D Motion", "Visual Effects", "Transitions"], order: 1 },
    { id: "3", title_tr: "Motion Direction", title_en: "Motion Direction", description_tr: "Görsellerinize hayat ve duygu katan dinamik hareket tasarımı. Sürükleyici, hikaye odaklı deneyimler yaratmak için hareketi ve ritmi yönlendiriyoruz.", description_en: "Dynamic motion design that adds life and emotion to your visuals. We guide movement and rhythm to create immersive experiences.", pills: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction"], order: 2 },
    { id: "4", title_tr: "Web Geliştirme", title_en: "Web Development", description_tr: "Etkilemek için tasarlanmış modern, duyarlı ve yüksek performanslı web siteleri. Kusursuz etkileşim, hız ve dönüşüm için optimize edilmiştir.", description_en: "Modern, responsive, and high-performance websites built to impress. Designed for seamless interaction, speed, and conversion.", pills: ["Responsive Design", "Interactive Layouts", "CMS Integration", "SEO Optimization", "Performance Tuning"], order: 3 },
  ],
};

export async function getServicesContent(): Promise<ServicesContent> {
  const snap = await getDoc(doc(db, "siteContent", "services"));
  if (!snap.exists()) return SERVICES_DEFAULT;
  return { ...SERVICES_DEFAULT, ...snap.data() } as ServicesContent;
}

export async function saveServicesContent(data: ServicesContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "services"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────

export interface FaqItem {
  id: string;
  question_tr: string;
  question_en: string;
  answer_tr: string;
  answer_en: string;
  order: number;
}

export interface FaqContent {
  label: string;
  title_tr: string;
  title_en: string;
  items: FaqItem[];
}

const FAQ_DEFAULT: FaqContent = {
  label: "05",
  title_tr: "Sıkça\nSorulan\nSorular",
  title_en: "Frequently\nAsked\nQuestions",
  items: [
    { id: "1", question_tr: "Tipik teslim süreniz nedir?", question_en: "What is your typical turnaround time?", answer_tr: "Projenin kapsamına bağlı olarak değişmekle birlikte, küçük projeler için 1–2 hafta, büyük projeler için 4–8 hafta sürmektedir.", answer_en: "Depending on the scope, small projects typically take 1–2 weeks, while larger ones range from 4–8 weeks.", order: 0 },
    { id: "2", question_tr: "Özel tasarım çözümleri sunuyor musunuz?", question_en: "Do you offer custom design solutions?", answer_tr: "Evet, her proje benzersizdir. Markanıza ve hedeflerinize özel çözümler geliştiriyoruz.", answer_en: "Yes, every project is unique. We develop solutions tailored to your brand and goals.", order: 1 },
    { id: "3", question_tr: "Hangi sektörlerde uzmanlaşıyorsunuz?", question_en: "What industries do you specialize in?", answer_tr: "Teknoloji, moda, sağlık, fintech ve yaratıcı endüstriler dahil birçok sektörde deneyimliyiz.", answer_en: "We have experience across many sectors including tech, fashion, health, fintech and creative industries.", order: 2 },
    { id: "4", question_tr: "Hem tasarım hem de geliştirmeyi üstlenebilir misiniz?", question_en: "Can you handle both design and development?", answer_tr: "Kesinlikle. Uçtan uca hizmet sunuyoruz: strateji, tasarım, geliştirme ve lansman.", answer_en: "Absolutely. We offer end-to-end services: strategy, design, development, and launch.", order: 3 },
    { id: "5", question_tr: "Lansman sonrası destek sağlıyor musunuz?", question_en: "Do you provide post-launch support?", answer_tr: "Evet, tüm projelerimizde bakım ve destek planları sunuyoruz.", answer_en: "Yes, we offer maintenance and support plans for all our projects.", order: 4 },
  ],
};

export async function getFaqContent(): Promise<FaqContent> {
  const snap = await getDoc(doc(db, "siteContent", "faq"));
  if (!snap.exists()) return FAQ_DEFAULT;
  return { ...FAQ_DEFAULT, ...snap.data() } as FaqContent;
}

export async function saveFaqContent(data: FaqContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "faq"), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}
