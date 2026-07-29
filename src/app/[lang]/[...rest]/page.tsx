import { notFound } from "next/navigation";

// Bir dil önekinin altındaki EŞLEŞMEYEN her yol buraya düşer (proxy tüm yolları
// /tr veya /en ile öneklediğinden pratikte tüm 404'ler bir dil altında gelir).
// notFound() → markalı [lang]/not-found + gerçek HTTP 404.
// Daha özel rotalar (hizmetler, projeler/[slug], blog/[slug] ...) bu catch-all'dan
// önceliklidir; yalnızca hiçbir rotayla eşleşmeyen yollar buraya gelir.
export default function CatchAllNotFound() {
  notFound();
}
