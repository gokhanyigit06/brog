import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
});

const db = getFirestore(app);

const project = {
  title: "Macc-cino",
  brandName: "Macc-cino",
  slug: "macc-cino",
  description_tr: "Ankara merkezli profesyonel kahve sistemleri markası Macc-cino için uçtan uca web tasarımı ve özel yönetim paneli geliştirmesi. 25+ yıllık deneyim, 500+ işletme referansıyla sektörün lider firması için ürün yönetimi, çok dilli içerik ve iletişim altyapısı kuruldu.",
  description_en: "Full web design and custom admin panel development for Macc-cino, a leading Ankara-based professional coffee systems company with 25+ years of experience and 500+ business clients. Includes multilingual product management, hero slider, and contact infrastructure.",
  industry_tr: "Yiyecek & İçecek",
  industry_en: "Food & Beverage",
  timeline: "",
  imageUrl: "",
  listingImageUrl: "",
  videoUrl: "",
  listingVideoUrl: "",
  year: "2024",
  category: "Web Design & Development",
  tags: ["Web Design", "Admin Panel", "Coffee", "Multilingual", "Ankara"],
  link: "https://macc-cino.com",
  order: 0,
  featured: true,
  blocks: [
    {
      type: "mobile_preview",
      count: 1,
      phones: [{ url: "https://macc-cino.com" }],
    },
    {
      type: "text_block",
      label: "Proje Hakkında",
      title_tr: "Kahve Sektörü İçin Uçtan Uca Dijital Çözüm",
      title_en: "End-to-End Digital Solution for the Coffee Industry",
      body_tr: "Macc-cino, Ankara merkezli profesyonel kahve makineleri ve barista konsepti sunan bir B2B markasıdır. Restoran, otel, ofis ve fitness merkezleri gibi çok sayıda sektöre hizmet vermektedir.\n\nProje kapsamında kurumsal kimliğe uygun, sade ve güçlü bir web sitesi tasarlandı. Ürün yönetimi, hero slider, blog/trend içerikleri ve iletişim formunu tek çatı altında toplayan özel bir admin paneli geliştirildi. Panel; Türkçe, İngilizce ve Almanca çoklu dil desteği, sektör bazlı filtreleme ve 7/24 mesaj takibi sunmaktadır.",
      body_en: "Macc-cino is an Ankara-based B2B brand offering professional coffee machines and barista concepts. They serve restaurants, hotels, offices, fitness centers, and more.\n\nThe project included a clean, powerful website aligned with the corporate identity, plus a custom admin panel centralizing product management, hero slider, blog/trends, and contact forms. The panel supports Turkish, English, and German multilingual content, sector-based filtering, and round-the-clock message tracking.",
    },
    {
      type: "mobile_preview",
      count: 1,
      phones: [{ url: "https://macc-cino.com/admin" }],
    },
  ],
};

const ref = await addDoc(collection(db, "projects"), project);
console.log("✓ Proje eklendi:", ref.id);
process.exit(0);
