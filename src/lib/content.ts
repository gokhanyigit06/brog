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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

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

export interface Project {
  id?: string;
  title: string;
  description_tr: string;
  description_en: string;
  image: string;
  tags: string[];
  link: string;
  order: number;
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
