// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavTranslations {
  home: string;
  projects: string;
  services: string;
  about: string;
  contact: string;
  blog: string;
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export interface HomeTranslations {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

// ─── Common ───────────────────────────────────────────────────────────────────
export interface CommonTranslations {
  loading: string;
  error: string;
  viewAll: string;
  learnMore: string;
  readMore: string;
  backToList: string;
}

// ─── Page Translations ────────────────────────────────────────────────────────
export interface PageTranslations {
  title: string;
  subtitle: string;
}

export interface ContactTranslations extends PageTranslations {
  name: string;
  email: string;
  message: string;
  send: string;
}

// ─── Root Translations ────────────────────────────────────────────────────────
export interface Translations {
  nav: NavTranslations;
  home: HomeTranslations;
  projects: PageTranslations;
  services: PageTranslations;
  about: PageTranslations;
  contact: ContactTranslations;
  blog: PageTranslations;
  common: CommonTranslations;
}

// ─── Turkish ─────────────────────────────────────────────────────────────────
export const tr: Translations = {
  nav: {
    home: "Anasayfa",
    projects: "Projeler",
    services: "Hizmetler",
    about: "Hakkımızda",
    contact: "İletişim",
    blog: "Blog",
  },
  home: {
    hero: {
      title: "Yaratıcı Ajans",
      subtitle: "Markanızı geleceğe taşıyoruz.",
      cta: "Projelerimizi Gör",
    },
  },
  projects: { title: "Projeler", subtitle: "Yaptığımız işler" },
  services: { title: "Hizmetler", subtitle: "Neler yapıyoruz" },
  about: { title: "Hakkımızda", subtitle: "Biz kimiz" },
  blog: { title: "Blog", subtitle: "Yazılarımız" },
  contact: {
    title: "İletişim",
    subtitle: "Bize ulaşın",
    name: "Ad Soyad",
    email: "E-posta",
    message: "Mesaj",
    send: "Gönder",
  },
  common: {
    loading: "Yükleniyor...",
    error: "Bir hata oluştu",
    viewAll: "Tümünü Gör",
    learnMore: "Daha Fazla",
    readMore: "Devamını Oku",
    backToList: "Listeye Dön",
  },
};
