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
  title_main: string;       // "VOGO"
  title_sub: string;        // "lab."
  services_tr: string[];
  services_en: string[];
  slogan_tr: string;
  slogan_en: string;
  bgColor: string;
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
