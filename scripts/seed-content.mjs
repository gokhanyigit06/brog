/**
 * Vogolab – Firebase İçerik Seed Scripti
 * Çalıştır: node scripts/seed-content.mjs
 *
 * Tüm section'ların TR ve EN içeriklerini Firebase'e tek seferde yazar.
 * Mevcut içerik varsa üzerine yazar (merge değil, set).
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBss2G9jy5cWNa14qKtvI7PmlC3JUb4u7k",
  authDomain: "brog-1acb3.firebaseapp.com",
  projectId: "brog-1acb3",
  storageBucket: "brog-1acb3.firebasestorage.app",
  messagingSenderId: "370433122581",
  appId: "1:370433122581:web:9092002ef883d620f3c91c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed(docId, data) {
  await setDoc(doc(db, "siteContent", docId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
  console.log(`✅  siteContent/${docId} yazıldı`);
}

async function run() {
  console.log("🚀  Vogolab içerik seedi başlıyor...\n");

  // ──────────────────────────────────────────────────────
  // HERO
  // ──────────────────────────────────────────────────────
  await seed("hero", {
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
  });

  // ──────────────────────────────────────────────────────
  // SHOWCASE
  // ──────────────────────────────────────────────────────
  await seed("showcase", {
    label: "01",
    title_tr: "Her projede tutarlı kalite, yenilikçi tasarım",
    title_en: "Consistent quality in every project, innovative design",
    description_tr:
      "Tasarımın amaca buluştuğu dijital deneyimler yaratıyoruz — yenilik ile netliği harmanlıyoruz. Her etkileşim kusursuz, sezgisel ve anlamlı hissettirmek için tasarlanır.",
    description_en:
      "We create digital experiences where design meets purpose — blending innovation with clarity. Every interaction is crafted to feel seamless, intuitive, and meaningful.",
    stat1_value: "120+",
    stat1_label_tr: "Tamamlanan Proje",
    stat1_label_en: "Projects Done",
    stat2_value: "98%",
    stat2_label_tr: "Müşteri Memnuniyeti",
    stat2_label_en: "Client Satisfaction",
    stat3_value: "5+",
    stat3_label_tr: "Yıllık Deneyim",
    stat3_label_en: "Years Experience",
    mediaItems: [],
  });

  // ──────────────────────────────────────────────────────
  // MARQUEE
  // ──────────────────────────────────────────────────────
  await seed("marquee", {
    items: ["MARKA", "TASARIM", "GELİŞTİRME", "FOTOĞRAF", "PAZARLAMA", "STRATEJİ", "MOSİYON", "UX/UI"],
    items_en: ["BRANDING", "DESIGN", "DEVELOPMENT", "PHOTOGRAPHY", "MARKETING", "STRATEGY", "MOTION", "UX/UI"],
    speed: 30,
  });

  // ──────────────────────────────────────────────────────
  // PROJECTS SECTION
  // ──────────────────────────────────────────────────────
  await seed("projects", {
    label: "02",
    title_tr: "Projeler",
    title_en: "Projects",
    description_tr:
      "Kendileri için konuşan dijital ürünler yaratıyoruz — sade, hızlı ve kullanıcı odaklı.",
    description_en:
      "We craft digital products that speak for themselves — simple, fast, and user-focused.",
    viewAllLink: "/projeler",
    projects: [],
  });

  // ──────────────────────────────────────────────────────
  // WHY SECTION
  // ──────────────────────────────────────────────────────
  await seed("why", {
    label: "03",
    title_tr: "Neden Biz?",
    title_en: "Why Vogolab?",
    mediaUrl: "",
    mediaType: "image",
    features: [
      {
        id: "1",
        icon: "✦",
        title_tr: "Strateji &\nAraştırma",
        title_en: "Strategy &\nResearch",
        description_tr:
          "Özelleştirilmiş stratejiler geliştirip derinlemesine araştırmalar yaparak kritik içgörüleri ortaya çıkarıyoruz.",
        description_en:
          "We shape tailored strategies and perform in-depth research to reveal critical insights.",
        order: 0,
      },
      {
        id: "2",
        icon: "◎",
        title_tr: "Tasarım &\nPrototip",
        title_en: "Design &\nPrototype",
        description_tr:
          "Fikirleri ilgi çekici tasarımlara ve işlevsel prototiplere dönüştürerek vizyonunuzu hayata geçiriyoruz.",
        description_en:
          "We transform ideas into engaging designs and functional prototypes that bring your vision to life.",
        order: 1,
      },
      {
        id: "3",
        icon: "▦",
        title_tr: "Geliştir, Test Et &\nOptimize Et",
        title_en: "Build, Test &\nOptimize",
        description_tr:
          "Güvenilir çözümler üretir, kapsamlı testler yapar ve en iyi performans için ince ayar yapıyoruz.",
        description_en:
          "We craft reliable solutions, perform thorough testing, and fine-tune for top performance.",
        order: 2,
      },
      {
        id: "4",
        icon: "↗",
        title_tr: "Lansman &\nDestek",
        title_en: "Launch &\nSupport",
        description_tr:
          "Hassasiyetle lansman yapıyor ve ürününüzün büyümesine yardımcı olmak için sürekli destek sağlıyoruz.",
        description_en:
          "We launch with precision and provide ongoing support to help your product grow.",
        order: 3,
      },
    ],
  });

  // ──────────────────────────────────────────────────────
  // SERVICES SECTION
  // ──────────────────────────────────────────────────────
  await seed("services", {
    label: "04",
    title_tr: "Hizmetler",
    title_en: "Services",
    items: [
      {
        id: "1",
        title_tr: "Sanat Yönetimi",
        title_en: "Art Direction",
        description_tr:
          "Markanızın görsel hikayesini tanımlayan yaratıcı ve tutarlı sanat yönetimi. Dikkat çeken ve ilham veren estetikler üretiyoruz.",
        description_en:
          "Creative and cohesive art direction that defines your brand's visual story. We craft impactful aesthetics that capture attention.",
        pills_tr: ["Görsel Konsept", "Stil Geliştirme", "Kampanya Sanatı", "Yaratıcı Yönetim", "Fotoğrafçılık"],
        pills_en: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction", "Photography"],
        pills: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction", "Photography"],
        order: 0,
      },
      {
        id: "2",
        title_tr: "Marka Kimliği",
        title_en: "Brand Identity",
        description_tr:
          "Temel değerlerinizi yansıtan, hedef kitlenizle bağlantı kuran ayırt edici marka kimliği. Tutarlı ve akılda kalıcı bir kimlik şekillendiriyoruz.",
        description_en:
          "Distinctive branding that reflects your core values and connects with your audience. We shape a consistent and memorable identity.",
        pills_tr: ["Animasyon Stratejisi", "Storyboard", "2D / 3D Hareket", "Görsel Efektler", "Geçişler"],
        pills_en: ["Animation Strategy", "Storyboarding", "2D / 3D Motion", "Visual Effects", "Transitions"],
        pills: ["Animation Strategy", "Storyboarding", "2D / 3D Motion", "Visual Effects", "Transitions"],
        order: 1,
      },
      {
        id: "3",
        title_tr: "Hareket Tasarımı",
        title_en: "Motion Design",
        description_tr:
          "Görsellerinize hayat ve duygu katan dinamik hareket tasarımı. Sürükleyici, hikaye odaklı deneyimler yaratmak için hareketi ve ritmi yönlendiriyoruz.",
        description_en:
          "Dynamic motion design that adds life and emotion to your visuals. We guide movement and rhythm to create immersive story-driven experiences.",
        pills_tr: ["Görsel Konsept", "Stil Geliştirme", "Kampanya Sanatı", "Yaratıcı Yönetim"],
        pills_en: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction"],
        pills: ["Visual Concept", "Style Development", "Campaign Art", "Creative Direction"],
        order: 2,
      },
      {
        id: "4",
        title_tr: "Web Geliştirme",
        title_en: "Web Development",
        description_tr:
          "Etkilemek için tasarlanmış modern, duyarlı ve yüksek performanslı web siteleri. Kusursuz etkileşim, hız ve dönüşüm için optimize edilmiştir.",
        description_en:
          "Modern, responsive, and high-performance websites built to impress. Optimized for seamless interaction, speed, and conversion.",
        pills_tr: ["Duyarlı Tasarım", "Etkileşimli Arayüzler", "İçerik Yönetimi", "SEO Optimizasyonu", "Performans"],
        pills_en: ["Responsive Design", "Interactive Layouts", "CMS Integration", "SEO Optimization", "Performance"],
        pills: ["Responsive Design", "Interactive Layouts", "CMS Integration", "SEO Optimization", "Performance"],
        order: 3,
      },
    ],
  });

  // ──────────────────────────────────────────────────────
  // FAQ SECTION
  // ──────────────────────────────────────────────────────
  await seed("faq", {
    label: "05",
    title_tr: "Sıkça\nSorulan\nSorular",
    title_en: "Frequently\nAsked\nQuestions",
    items: [
      {
        id: "1",
        question_tr: "Tipik teslim süreniz nedir?",
        question_en: "What is your typical turnaround time?",
        answer_tr:
          "Projenin kapsamına bağlı olarak değişmekle birlikte, küçük projeler 1–2 hafta, büyük projeler ise 4–8 hafta sürmektedir.",
        answer_en:
          "It varies by scope — small projects typically take 1–2 weeks, while larger ones range from 4–8 weeks.",
        order: 0,
      },
      {
        id: "2",
        question_tr: "Özel tasarım çözümleri sunuyor musunuz?",
        question_en: "Do you offer custom design solutions?",
        answer_tr:
          "Evet, her proje benzersizdir. Markanıza ve hedeflerinize özel çözümler geliştiriyoruz.",
        answer_en:
          "Yes, every project is unique. We develop solutions fully tailored to your brand and goals.",
        order: 1,
      },
      {
        id: "3",
        question_tr: "Hangi sektörlerde uzmanlaşıyorsunuz?",
        question_en: "What industries do you specialize in?",
        answer_tr:
          "Teknoloji, moda, sağlık, fintech ve yaratıcı endüstriler dahil birçok sektörde deneyimliyiz.",
        answer_en:
          "We have experience across many sectors including tech, fashion, healthcare, fintech, and creative industries.",
        order: 2,
      },
      {
        id: "4",
        question_tr: "Hem tasarım hem de geliştirmeyi üstlenebilir misiniz?",
        question_en: "Can you handle both design and development?",
        answer_tr:
          "Kesinlikle. Uçtan uca hizmet sunuyoruz: strateji, tasarım, geliştirme ve lansman.",
        answer_en:
          "Absolutely. We offer end-to-end services: strategy, design, development, and launch.",
        order: 3,
      },
      {
        id: "5",
        question_tr: "Lansman sonrası destek sağlıyor musunuz?",
        question_en: "Do you provide post-launch support?",
        answer_tr: "Evet, tüm projelerimizde bakım ve destek planları sunuyoruz.",
        answer_en: "Yes, we offer maintenance and support plans for all our projects.",
        order: 4,
      },
    ],
  });

  // ──────────────────────────────────────────────────────
  // NAVBAR
  // ──────────────────────────────────────────────────────
  await seed("navbar", {
    logoUrl: "",
    brandText: "vogolab",
    email: "hello@vogolab.com",
    phone: "+90 555 000 0000",
    location: "İstanbul, Türkiye",
    menuBgImage: "",
    menuBrandLine1: "vogo",
    menuBrandLine2: "lab.",
    social_x: "https://x.com/vogolab",
    social_dribbble: "https://dribbble.com/vogolab",
    social_instagram: "https://instagram.com/vogolab",
    social_linkedin: "https://linkedin.com/company/vogolab",
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
  });

  // ──────────────────────────────────────────────────────
  // SETTINGS
  // ──────────────────────────────────────────────────────
  await seed("settings", {
    email: "hello@vogolab.com",
    phone: "+90 555 000 0000",
    location: "İstanbul, Türkiye",
    social_x: "https://x.com/vogolab",
    social_dribbble: "https://dribbble.com/vogolab",
    social_instagram: "https://instagram.com/vogolab",
    social_linkedin: "https://linkedin.com/company/vogolab",
  });

  // ──────────────────────────────────────────────────────
  // ABOUT
  // ──────────────────────────────────────────────────────
  await seed("about", {
    title_tr: "Hakkımızda",
    title_en: "About Us",
    bio_tr:
      "Vogolab, markaların dijital dünyadaki varlığını güçlendiren yaratıcı bir ajans. Tasarım, geliştirme ve strateji alanlarında uçtan uca hizmet sunuyoruz.",
    bio_en:
      "Vogolab is a creative agency that strengthens brands in the digital world. We offer end-to-end services in design, development, and strategy.",
    image: "",
  });

  console.log("\n🎉  Tüm içerikler Firebase'e başarıyla yazıldı!");
  console.log("   /tr → Türkçe içerik");
  console.log("   /en → İngilizce içerik");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌  Hata:", err);
  process.exit(1);
});
