import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export interface UploadProgress {
  progress: number;  // 0-100
  url?: string;
  error?: string;
}

/**
 * Upload a file to Firebase Storage.
 * No file size limit — supports high-res images and videos.
 *
 * @param file     - The File object to upload
 * @param path     - Storage path e.g. "pages/anasayfa/hero"
 * @param onProgress - Optional callback with progress 0-100
 * @returns        - Download URL
 */
export async function uploadMedia(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `${path}/${timestamp}_${safeName}`);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(pct));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Detect if the file is a video based on mime type.
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

/**
 * Detect if the file is an image based on mime type.
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
