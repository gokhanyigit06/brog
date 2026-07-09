"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Görünüme yaklaşana kadar video indirmeyen autoplay video.
 * (38MB'lık kapak videolarının sayfa yükünü şişirmesini engeller.)
 */
export default function LazyVideo({ src, style, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (active) ref.current?.play().catch(() => {});
  }, [active]);

  return (
    <video
      ref={ref}
      src={active ? src : undefined}
      muted
      loop
      playsInline
      autoPlay={active}
      preload="none"
      style={style}
      className={className}
    />
  );
}
