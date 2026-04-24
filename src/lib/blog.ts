import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { BlogPost } from "@/types/blog";

const COLLECTION = "blog_posts";

// ─── Get all posts ────────────────────────────────────────────────────────────
export async function getAllPosts(publishedOnly = true): Promise<BlogPost[]> {
  const col = collection(db, COLLECTION);
  const q = publishedOnly
    ? query(col, where("published", "==", true), orderBy("publishedAt", "desc"))
    : query(col, orderBy("createdAt", "desc"));

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as BlogPost);
}

// ─── Get one post by slug ─────────────────────────────────────────────────────
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const col = collection(db, COLLECTION);
  const q = query(col, where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as BlogPost;
}

// ─── Get one post by ID ───────────────────────────────────────────────────────
export async function getPostById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return snap.data() as BlogPost;
}

// ─── Save / create post ───────────────────────────────────────────────────────
export async function savePost(post: BlogPost): Promise<void> {
  await setDoc(doc(db, COLLECTION, post.id), {
    ...post,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Update post fields ───────────────────────────────────────────────────────
export async function updatePost(
  id: string,
  data: Partial<BlogPost>
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Delete post ──────────────────────────────────────────────────────────────
export async function deletePost(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── Publish / unpublish ──────────────────────────────────────────────────────
export async function setPublished(id: string, published: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    published,
    publishedAt: published ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  });
}

// ─── Generate unique slug ─────────────────────────────────────────────────────
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
