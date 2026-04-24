"use client";

import { useRef, useState } from "react";
import { uploadMedia, isVideoFile } from "@/lib/upload";
import type { MediaItem } from "@/types/content";
import { Upload, X, Film, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  value?: MediaItem;
  onChange: (media: MediaItem) => void;
  onRemove?: () => void;
  path: string; // Firebase Storage path prefix
  className?: string;
}

export default function MediaUploader({
  value,
  onChange,
  onRemove,
  path,
  className = "",
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setProgress(0);
    try {
      const url = await uploadMedia(file, path, setProgress);
      const isVideo = isVideoFile(file);
      onChange({
        type: isVideo ? "video" : "image",
        url,
        alt: file.name,
      });
    } catch (err) {
      setError("Yükleme başarısız. Tekrar deneyin.");
      console.error(err);
    } finally {
      setProgress(null);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-700 group">
          {value.type === "video" ? (
            <video
              src={value.url}
              className="w-full max-h-64 object-cover"
              controls
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.url}
              alt={value.alt || ""}
              className="w-full max-h-64 object-cover"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {value.type === "video" ? (
                <><Film size={10} /> Video</>
              ) : (
                <><ImageIcon size={10} /> Görsel</>
              )}
            </span>
            {onRemove && (
              <button
                onClick={onRemove}
                className="bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging
            ? "border-white bg-zinc-800"
            : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900"
        }`}
      >
        <Upload className="mx-auto mb-2 text-zinc-500" size={24} />
        <p className="text-sm text-zinc-400">
          {value ? "Değiştirmek için tıkla veya sürükle" : "Görsel veya video yükle"}
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          PNG, JPG, WebP, MP4, WebM — Limit yok
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Progress */}
      {progress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Yükleniyor...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
