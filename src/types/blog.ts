// ─── Blog Content Block Types ─────────────────────────────────────────────────

import type { MediaItem, LocaleText } from "./content";

/**
 * Block types for blog post body content.
 * Every image/video slot supports both image and video.
 */

// Rich text or raw HTML block
export interface BlockRichText {
  type: "rich_text";
  id: string;
  content: LocaleText; // HTML string
}

// Full-width single media
export interface BlockMedia {
  type: "media";
  id: string;
  media: MediaItem;
  caption?: LocaleText;
}

// 2 images side by side (1:1 square)
export interface BlockTwoMedia {
  type: "two_media";
  id: string;
  items: [MediaItem, MediaItem];
  caption?: LocaleText;
}

// 3 images side by side (9:16 portrait)
export interface BlockThreeMedia {
  type: "three_media";
  id: string;
  items: [MediaItem, MediaItem, MediaItem];
  caption?: LocaleText;
}

// Text on the LEFT, media on the RIGHT
export interface BlockTextLeft {
  type: "text_left";
  id: string;
  text: LocaleText; // HTML
  media: MediaItem;
}

// Text on the RIGHT, media on the LEFT
export interface BlockTextRight {
  type: "text_right";
  id: string;
  text: LocaleText; // HTML
  media: MediaItem;
}

// Spacer
export interface BlockSpacer {
  type: "spacer";
  id: string;
  size: "sm" | "md" | "lg";
}

// Quote
export interface BlockQuote {
  type: "quote";
  id: string;
  text: LocaleText;
  author?: string;
}

export type BlogBlock =
  | BlockRichText
  | BlockMedia
  | BlockTwoMedia
  | BlockThreeMedia
  | BlockTextLeft
  | BlockTextRight
  | BlockSpacer
  | BlockQuote;

// ─── Blog Post ────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;                // URL-friendly, unique
  title: LocaleText;
  excerpt: LocaleText;         // Short description
  coverMedia: MediaItem;       // Cover image or video
  body: BlogBlock[];           // Content blocks
  tags?: string[];
  author?: string;
  published: boolean;
  publishedAt: string;         // ISO date string
  createdAt: string;
  updatedAt: string;
}
