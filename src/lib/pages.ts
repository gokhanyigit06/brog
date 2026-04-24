import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PageData, PageSlug, Section } from "@/types/content";

const COLLECTION = "pages";

// ─── Get a full page ──────────────────────────────────────────────────────────
export async function getPage(slug: PageSlug): Promise<PageData | null> {
  const snap = await getDoc(doc(db, COLLECTION, slug));
  if (!snap.exists()) return null;
  return snap.data() as PageData;
}

// ─── Save / overwrite a full page ─────────────────────────────────────────────
export async function savePage(slug: PageSlug, sections: Section[]): Promise<void> {
  await setDoc(doc(db, COLLECTION, slug), {
    slug,
    sections,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Update a single section ──────────────────────────────────────────────────
export async function updateSection(
  slug: PageSlug,
  sectionId: string,
  data: Partial<Section>
): Promise<void> {
  const pageRef = doc(db, COLLECTION, slug);
  const snap = await getDoc(pageRef);
  if (!snap.exists()) return;

  const page = snap.data() as PageData;
  const sections = page.sections.map((s) =>
    s.id === sectionId
      ? { ...s, ...data, updatedAt: new Date().toISOString() }
      : s
  );

  await updateDoc(pageRef, { sections, updatedAt: new Date().toISOString() });
}

// ─── Reorder sections ─────────────────────────────────────────────────────────
export async function reorderSections(
  slug: PageSlug,
  orderedIds: string[]
): Promise<void> {
  const pageRef = doc(db, COLLECTION, slug);
  const snap = await getDoc(pageRef);
  if (!snap.exists()) return;

  const page = snap.data() as PageData;
  const sectionMap = new Map(page.sections.map((s) => [s.id, s]));
  const sections = orderedIds
    .map((id, index) => {
      const s = sectionMap.get(id);
      if (!s) return null;
      return { ...s, order: index };
    })
    .filter(Boolean) as Section[];

  await updateDoc(pageRef, { sections, updatedAt: new Date().toISOString() });
}

// ─── Toggle section visibility ────────────────────────────────────────────────
export async function toggleSection(
  slug: PageSlug,
  sectionId: string,
  visible: boolean
): Promise<void> {
  await updateSection(slug, sectionId, { visible } as Partial<Section>);
}

// ─── Delete a section ─────────────────────────────────────────────────────────
export async function deleteSection(
  slug: PageSlug,
  sectionId: string
): Promise<void> {
  const pageRef = doc(db, COLLECTION, slug);
  const snap = await getDoc(pageRef);
  if (!snap.exists()) return;

  const page = snap.data() as PageData;
  const sections = page.sections
    .filter((s) => s.id !== sectionId)
    .map((s, i) => ({ ...s, order: i }));

  await updateDoc(pageRef, { sections, updatedAt: new Date().toISOString() });
}

// ─── Add a section ────────────────────────────────────────────────────────────
export async function addSection(
  slug: PageSlug,
  section: Section
): Promise<void> {
  const pageRef = doc(db, COLLECTION, slug);
  const snap = await getDoc(pageRef);

  if (!snap.exists()) {
    await setDoc(pageRef, {
      slug,
      sections: [{ ...section, order: 0 }],
      updatedAt: new Date().toISOString(),
    });
    return;
  }

  const page = snap.data() as PageData;
  const sections = [
    ...page.sections,
    { ...section, order: page.sections.length },
  ];
  await updateDoc(pageRef, { sections, updatedAt: new Date().toISOString() });
}
