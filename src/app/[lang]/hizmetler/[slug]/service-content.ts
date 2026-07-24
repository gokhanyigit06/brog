// Hizmet alt sayfalarının içerik haritası.
// Kod tarafında tutulur (SEO metni sık değişmez); referanslar ve blog yazıları canlı çekilir.

export interface ServiceDetail {
  slug: string;
  nav_tr: string; nav_en: string;               // kısa ad (breadcrumb/link)
  metaTitle_tr: string; metaTitle_en: string;
  metaDesc_tr: string; metaDesc_en: string;
  eyebrow_tr: string; eyebrow_en: string;
  h1_tr: string; h1_en: string;
  intro_tr: string; intro_en: string;
  idealTitle_tr: string; idealTitle_en: string;
  ideals: { icon: string; t_tr: string; t_en: string; d_tr: string; d_en: string }[];
  advTitle_tr: string; advTitle_en: string;
  advantages: { t_tr: string; t_en: string; d_tr: string; d_en: string }[];
  useTitle_tr: string; useTitle_en: string;
  useCases: { t_tr: string; t_en: string; d_tr: string; d_en: string }[];
  stepsTitle_tr: string; stepsTitle_en: string;
  steps: { t_tr: string; t_en: string; d_tr: string; d_en: string }[];
  faq: { q_tr: string; q_en: string; a_tr: string; a_en: string }[];
  matchTags: string[];   // proje eşleştirme
  blogTokens: string[];  // blog etiket/başlık eşleştirme (küçük harf)
}

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "web-tasarim",
    nav_tr: "Web Tasarım & Geliştirme", nav_en: "Web Design & Development",
    metaTitle_tr: "Web Tasarım & Geliştirme — Ankara | Vogolab",
    metaTitle_en: "Web Design & Development | Vogolab",
    metaDesc_tr: "Ankara'da markanıza özel tasarlanıp kodlanan, hızlı ve dönüşüm odaklı web siteleri. İdeal bir web sitesi nasıl olmalı, size nasıl kazandırır ve süreç nasıl işler — gerçek referanslarımızla.",
    metaDesc_en: "Custom-designed, fast, conversion-focused websites. What an ideal website looks like, how it pays off, and how our process works — with real references.",
    eyebrow_tr: "Web Tasarım & Geliştirme", eyebrow_en: "Web Design & Development",
    h1_tr: "İşletmenizin en çok çalışan elemanı: web siteniz.",
    h1_en: "Your hardest-working employee: your website.",
    intro_tr: "Bir web sitesi vitrin değil, satış aracıdır. Müşteriniz sizi gece 23.00'te arıyor, telefonu siteniz açıyor. Biz hazır şablon doldurmayız — markanıza özel tasarlar, sıfırdan kodlar ve satışa dönüşecek şekilde kurarız.",
    intro_en: "A website isn't a showcase — it's a sales tool. Your customer looks you up at 11 pm, and your site answers the call. We don't fill templates; we design for your brand, code from scratch, and build to convert.",
    idealTitle_tr: "İdeal bir web sitesi nasıl olmalı?", idealTitle_en: "What should an ideal website look like?",
    ideals: [
      { icon: "⚡", t_tr: "3 saniyede açılmalı", t_en: "Loads under 3 seconds", d_tr: "Yavaş açılan sitenin ziyaretçisi beklemez, rakibe gider. Google da yavaş siteyi aşağı iter. Kurduğumuz siteler optimize görseller ve modern altyapıyla saniyeler içinde açılır.", d_en: "Visitors don't wait for slow sites — and neither does Google. Our builds open in seconds with optimized assets and a modern stack." },
      { icon: "📱", t_tr: "Mobil öncelikli olmalı", t_en: "Mobile-first", d_tr: "Trafiğin %70'inden fazlası telefondan gelir. Tasarımı önce mobilde kurgular, her ekranda kusursuz görünmesini sağlarız.", d_en: "Over 70% of traffic is mobile. We design for the phone first and make every screen flawless." },
      { icon: "🎯", t_tr: "Dönüşüme yönlendirmeli", t_en: "Built to convert", d_tr: "Ziyaretçi 5 saniyede ne yaptığınızı anlamalı, tek bakışta 'teklif al / ara / satın al' adımını görmeli. Her sayfayı net bir hedefe göre kurgularız.", d_en: "A visitor should grasp what you do in 5 seconds and see the next step at a glance. Every page is built around one clear goal." },
      { icon: "🔍", t_tr: "SEO altyapısıyla doğmalı", t_en: "Born with SEO", d_tr: "Hız, semantik yapı, meta veriler ve yapılandırılmış veri baştan kurulursa bedavadır; sonradan eklemek pahalıdır. Sitelerimiz Google'a hazır teslim edilir.", d_en: "Speed, semantics, metadata and structured data are free at the start and costly later. Our sites ship Google-ready." },
      { icon: "🛡️", t_tr: "Güven vermeli", t_en: "Builds trust", d_tr: "Gerçek referanslar, net iletişim bilgileri, SSL ve profesyonel tasarım. Müşteri parasını güvenmediği siteye bırakmaz.", d_en: "Real references, clear contact info, SSL and professional design. Nobody pays a site they don't trust." },
      { icon: "🧩", t_tr: "Kolay yönetilebilmeli", t_en: "Easy to manage", d_tr: "Fiyat, ürün ve içerik güncellemesi için ajansa muhtaç kalmamalısınız. Her projeyi size özel yönetim paneliyle teslim ederiz.", d_en: "You shouldn't need an agency to change a price. Every project ships with its own admin panel." },
    ],
    advTitle_tr: "İyi bir site işletmenize ne kazandırır?", advTitle_en: "What does a good website earn you?",
    advantages: [
      { t_tr: "7/24 satış temsilcisi", t_en: "A 24/7 sales rep", d_tr: "Siz uyurken müşteri toplar: gece gelen ziyaretçi menünüzü inceler, formunuzu doldurur, sabah telefonunuz çalar.", d_en: "It sells while you sleep: night visitors browse, fill your form, and your phone rings in the morning." },
      { t_tr: "Google'da bulunabilirlik", t_en: "Found on Google", d_tr: "\"Ankara + sektörünüz\" aramalarında çıkmak, tabela asmaktan daha fazla müşteri getirir. İyi kurulmuş site bu aramaların anahtarıdır.", d_en: "Ranking for \"your city + your trade\" brings more customers than any billboard." },
      { t_tr: "Reklam bütçenizin verimi", t_en: "Ad budget efficiency", d_tr: "Aynı reklamı kötü siteye götürürseniz para yakarsınız; hızlı ve ikna edici siteye götürürseniz dönüşüm alırsınız. Kalite puanı yükselir, tık maliyeti düşer.", d_en: "The same ad burns money on a bad site and converts on a good one. Quality score up, cost per click down." },
      { t_tr: "Marka güveni ve fiyat gücü", t_en: "Brand trust & pricing power", d_tr: "Profesyonel görünen işletme, pazarlıkta da masaya güçlü oturur. Kurumsal görünüm fiyatınızı savunur.", d_en: "A professional presence defends your price at the negotiating table." },
    ],
    useTitle_tr: "Kimler için, hangi ihtiyaca?", useTitle_en: "For whom, for what?",
    useCases: [
      { t_tr: "Kurumsal web sitesi", t_en: "Corporate website", d_tr: "Hizmet ve referanslarınızı anlatan, teklif toplayan modern vitrin — KOBİ'den holdinge.", d_en: "A modern presence that presents your services and collects leads." },
      { t_tr: "E-ticaret", t_en: "E-commerce", d_tr: "Shopify veya özel altyapıyla online mağaza; ödeme, kargo ve ürün yönetimi dahil uçtan uca.", d_en: "Online stores on Shopify or custom stacks — payments, shipping and product management included." },
      { t_tr: "Rezervasyon & randevu", t_en: "Booking & appointments", d_tr: "Otel, klinik, restoran: takvim ve rezervasyon akışı siteye gömülü, telefona bağımlılık biter.", d_en: "Hotels, clinics, restaurants: calendar and booking flows built in." },
      { t_tr: "QR menü & özel yazılım", t_en: "QR menus & custom software", d_tr: "Excel ile yönetilen QR menüler, paneller, iç araçlar — ihtiyacınız neyse onu kodlarız.", d_en: "Excel-managed QR menus, panels, internal tools — whatever you need, we code it." },
    ],
    stepsTitle_tr: "Nasıl çalışıyoruz?", stepsTitle_en: "How we work",
    steps: [
      { t_tr: "Keşif & strateji", t_en: "Discovery & strategy", d_tr: "İşinizi, rakiplerinizi ve müşterinizi dinliyoruz. Ankara'daysanız yüz yüze; değilseniz görüntülü. Sitenin hedefini birlikte netleştiriyoruz.", d_en: "We learn your business, competitors and customers, and set the site's goal together." },
      { t_tr: "Tasarım", t_en: "Design", d_tr: "Markanıza özel arayüz tasarımı. Beğenmediğinizi bu aşamada konuşuyoruz — kodlamadan sonra değil.", d_en: "A custom interface for your brand. We iterate here — not after the code is written." },
      { t_tr: "Geliştirme", t_en: "Development", d_tr: "Modern teknolojilerle (Next.js, Shopify vb.) hız ve SEO öncelikli kodlama; içerik girişi ve yönetim paneli kurulumu.", d_en: "Speed- and SEO-first development on modern stacks, plus content entry and the admin panel." },
      { t_tr: "Yayın & büyüme", t_en: "Launch & growth", d_tr: "Alan adı, hosting, Search Console, panel eğitimi. İsterseniz reklam ve SEO ile aynı ekipten büyümeye devam.", d_en: "Domain, hosting, Search Console, panel training — then growth with ads and SEO from the same team." },
    ],
    faq: [
      { q_tr: "Bir web sitesi ne kadar sürede hazır olur?", q_en: "How long does a website take?", a_tr: "Kurumsal bir site için gerçekçi süre 4-8 hafta; e-ticaret ve rezervasyon sistemli projelerde 8-12 hafta. 'Üç güne teslim' vaadi genelde şablon demektir.", a_en: "4–8 weeks for a corporate site; 8–12 for e-commerce or booking projects." },
      { q_tr: "Fiyatı ne belirliyor?", q_en: "What determines the price?", a_tr: "Özel tasarım mı şablon mu, e-ticaret/rezervasyon gibi işlevler, içerik üretimi ve SEO altyapısının kapsamı. Teklifleri fiyattan değil kapsam listesinden karşılaştırın.", a_en: "Custom vs template, features like e-commerce, content production and SEO scope." },
      { q_tr: "Siteyi kendim güncelleyebilecek miyim?", q_en: "Can I update the site myself?", a_tr: "Evet. Her projeyi size özel yönetim paneliyle ve eğitimiyle teslim ederiz; fiyat, içerik ve görsel güncellemeleri için bize bağımlı kalmazsınız.", a_en: "Yes — every project ships with its own admin panel and training." },
      { q_tr: "Mevcut sitemiz var, baştan mı yapmak gerekir?", q_en: "We already have a site — rebuild from scratch?", a_tr: "Her zaman değil. Önce ücretsiz inceliyoruz: bazen hız ve SEO iyileştirmesi yeterli olur, bazen yeniden kurmak daha ekonomiktir. Dürüst bir yol haritası sunarız.", a_en: "Not always. We review it free first and give you an honest roadmap." },
    ],
    matchTags: ["Web Tasarım", "Web Design", "Next.js", "Shopify", "E-Commerce", "Rezervasyon"],
    blogTokens: ["web", "site"],
  },
  {
    slug: "reklam-yonetimi",
    nav_tr: "Reklam Yönetimi", nav_en: "Ads Management",
    metaTitle_tr: "Meta & Google Reklam Yönetimi — Ankara | Vogolab",
    metaTitle_en: "Meta & Google Ads Management | Vogolab",
    metaDesc_tr: "Ankara'da sonuç odaklı Meta ve Google Ads yönetimi: doğru kitle, doğru kreatif, sürekli optimizasyon. Bütçeniz tıklamaya değil satışa dönüşsün.",
    metaDesc_en: "Results-driven Meta & Google Ads management: right audience, right creative, continuous optimization.",
    eyebrow_tr: "Reklam Yönetimi", eyebrow_en: "Ads Management",
    h1_tr: "Reklam bütçeniz gidere değil, yatırıma dönüşsün.",
    h1_en: "Turn ad spend into an investment, not an expense.",
    intro_tr: "Meta ve Google'da reklam vermek kolay; kâr ettiren reklam vermek zanaattır. Kitleyi doğru kurar, kreatifi markaya göre üretir, her hafta veriyle optimize ederiz. Raporda beğeni değil, talep ve satış konuşulur.",
    intro_en: "Running ads is easy; running profitable ads is a craft. We build the right audiences, produce on-brand creatives, and optimize weekly on data.",
    idealTitle_tr: "İyi bir reklam hesabı nasıl olmalı?", idealTitle_en: "What does a healthy ad account look like?",
    ideals: [
      { icon: "🎯", t_tr: "Doğru hedefleme", t_en: "Right targeting", d_tr: "Ankara'da hizmet veren işletmenin reklamı İzmir'e gitmemeli. Lokasyon, yaş, ilgi ve davranış katmanlarıyla bütçe doğru kitleye akar.", d_en: "Location, age, interest and behavior layers point the budget at the right people." },
      { icon: "🖼️", t_tr: "Markaya özel kreatif", t_en: "On-brand creatives", d_tr: "Stok görselle marka olunmaz. Reklam görselini ve metnini markanızın dilinde üretiriz; durdurup baktıran işler.", d_en: "No stock visuals. We produce scroll-stopping creatives in your brand's voice." },
      { icon: "📊", t_tr: "Dönüşüm takibi", t_en: "Conversion tracking", d_tr: "Pixel ve dönüşüm API'si kurulmadan harcanan her lira kördür. Hangi reklamın kaç talep getirdiğini kuruşuyla görürsünüz.", d_en: "Without pixel + conversion API, every lira is blind. You see which ad brought which lead." },
      { icon: "🧪", t_tr: "Sürekli A/B testi", t_en: "Always testing", d_tr: "Tek kreatifle yaşayan hesap yorulur. Başlık, görsel ve kitle varyasyonları sürekli yarışır; kazanan bütçeyi alır.", d_en: "Headlines, visuals and audiences race constantly; the winner takes the budget." },
      { icon: "🔁", t_tr: "Yeniden pazarlama", t_en: "Retargeting", d_tr: "Ziyaretçilerin %97'si ilk seferde almaz. Sepeti bırakana, sayfanızı gezene ayrı kurgularla geri döneriz.", d_en: "97% don't buy first visit. We come back with tailored flows." },
      { icon: "🧾", t_tr: "Şeffaf raporlama", t_en: "Transparent reporting", d_tr: "Reklam hesabı sizin hesabınızdır; harcamayı ve sonucu her an görürsünüz. Aylık raporda rakam konuşur.", d_en: "It's your ad account. You see spend and results anytime." },
    ],
    advTitle_tr: "Profesyonel yönetim ne kazandırır?", advTitle_en: "What does professional management earn you?",
    advantages: [
      { t_tr: "Boşa yanan bütçenin sonu", t_en: "No more wasted budget", d_tr: "Yanlış kitle, yanlış saat, yanlış kreatif — amatör yönetilen hesapların bütçesinin ciddi bölümü çöpe gider. Optimizasyon bunu satışa çevirir.", d_en: "Wrong audience, wrong hour, wrong creative — optimization turns that waste into sales." },
      { t_tr: "Ölçülebilir sonuç", t_en: "Measurable results", d_tr: "\"Reklam işe yarıyor mu?\" sorusu tahminle değil rakamla cevaplanır: talep başı maliyet, ROAS, satış.", d_en: "Cost per lead, ROAS, sales — answered with numbers, not hunches." },
      { t_tr: "Hızlı sonuç", t_en: "Fast results", d_tr: "SEO birikimli kazançtır, reklam ise musluk: doğru kurulduğunda ilk hafta talep düşmeye başlar.", d_en: "SEO compounds; ads are a tap. Set up right, leads start in week one." },
      { t_tr: "Site + reklam aynı ekipte", t_en: "Site + ads, one team", d_tr: "Reklamı yöneten ekip sitenizi de tanıyorsa dönüşüm ikiye katlanır: iniş sayfası, hız ve mesaj tek elden kurgulanır.", d_en: "When the ads team also knows your site, landing page, speed and message align." },
    ],
    useTitle_tr: "Hangi kanallar, hangi işler?", useTitle_en: "Which channels, which jobs?",
    useCases: [
      { t_tr: "Meta Ads (Instagram & Facebook)", t_en: "Meta Ads", d_tr: "Yerel işletme, e-ticaret ve marka bilinirliği için görsel ağırlıklı kampanyalar.", d_en: "Visual campaigns for local businesses, e-commerce and awareness." },
      { t_tr: "Google Ads (Arama & Alışveriş)", t_en: "Google Ads", d_tr: "\"Ankara + sektör\" arayan hazır müşteriyi yakalayan arama ve alışveriş kampanyaları.", d_en: "Search & Shopping campaigns that catch ready-to-buy customers." },
      { t_tr: "Yeniden pazarlama kurguları", t_en: "Retargeting flows", d_tr: "Siteyi gezen, sepeti bırakan, formu yarım bırakan kitlelere özel dönüş senaryoları.", d_en: "Custom comeback scenarios for visitors and cart abandoners." },
      { t_tr: "Kreatif üretim", t_en: "Creative production", d_tr: "Reklam görselleri, videolar ve metinler — kampanyayla birlikte tek pakette.", d_en: "Ad visuals, videos and copy — bundled with the campaign." },
    ],
    stepsTitle_tr: "Nasıl çalışıyoruz?", stepsTitle_en: "How we work",
    steps: [
      { t_tr: "Hesap & pixel kurulumu", t_en: "Account & pixel setup", d_tr: "Reklam hesapları, Pixel/dönüşüm API'si ve analitik doğru kurulur; ölçemediğimiz hiçbir şeye para harcatmayız.", d_en: "Accounts, pixel/conversion API and analytics set up right — we never spend what we can't measure." },
      { t_tr: "Strateji & kitle kurgusu", t_en: "Strategy & audiences", d_tr: "Hedef: talep mi, satış mı, bilinirlik mi? Bütçe, kanal ve kitle planı buna göre yazılır.", d_en: "Leads, sales or awareness — budget, channel and audience plans follow the goal." },
      { t_tr: "Kreatif & lansman", t_en: "Creatives & launch", d_tr: "Markanıza özel görsel ve metin varyasyonları hazırlanır, kampanya test kurgusuyla yayına alınır.", d_en: "On-brand creative variants go live in a structured test." },
      { t_tr: "Optimizasyon & raporlama", t_en: "Optimize & report", d_tr: "Haftalık optimizasyon, aylık net rapor: harcama, talep başı maliyet, ROAS ve sonraki ayın planı.", d_en: "Weekly optimization; monthly report with spend, CPL, ROAS and next month's plan." },
    ],
    faq: [
      { q_tr: "Minimum reklam bütçesi ne olmalı?", q_en: "What's the minimum ad budget?", a_tr: "Sektöre ve hedefe göre değişir; yerel hizmet işletmeleri için anlamlı test bütçeleri günlük birkaç yüz liradan başlar. İlk görüşmede işinize göre gerçekçi bir aralık söyleriz.", a_en: "Depends on sector and goal; we'll give a realistic range for your case." },
      { q_tr: "Sonucu ne zaman görürüm?", q_en: "When do I see results?", a_tr: "Teknik kurulum ve öğrenme fazı sonrası ilk talepler genelde ilk 1-2 haftada gelir; hesap 4-6 haftada oturur.", a_en: "First leads typically within 1–2 weeks; accounts stabilize in 4–6." },
      { q_tr: "Reklam hesabı kimin üzerine olur?", q_en: "Who owns the ad account?", a_tr: "Sizin. Hesaplar sizin adınıza kurulur, biz yetkili olarak yönetiriz; ayrılırsanız geçmiş veriniz sizde kalır.", a_en: "You. We manage as a partner; your data stays yours." },
      { q_tr: "Sitem eskiyse reklam verebilir miyim?", q_en: "My site is old — can I still run ads?", a_tr: "Verebilirsiniz ama önermeyiz; kötü iniş sayfası bütçeyi eritir. Gerekirse önce dönüşüm odaklı bir iniş sayfası kurar, sonra yayına çıkarız.", a_en: "You can, but a weak landing page burns budget — we'd fix that first." },
    ],
    matchTags: ["Meta Ads", "Google Ads", "Digital Ads", "Reklam"],
    blogTokens: ["reklam", "ads", "meta", "google"],
  },
  {
    slug: "seo",
    nav_tr: "SEO", nav_en: "SEO",
    metaTitle_tr: "SEO & Yerel SEO Hizmeti — Ankara | Vogolab",
    metaTitle_en: "SEO & Local SEO Services | Vogolab",
    metaDesc_tr: "Teknik altyapıdan içeriğe uçtan uca SEO. Ankara ve çevresi için yerel SEO uzmanlığı: harita, semt ve sektör aramalarında kalıcı görünürlük.",
    metaDesc_en: "End-to-end SEO from technical foundations to content, with local SEO expertise for lasting visibility.",
    eyebrow_tr: "SEO & Yerel SEO", eyebrow_en: "SEO & Local SEO",
    h1_tr: "Reklam durunca kaybolmayın: kalıcı organik görünürlük.",
    h1_en: "Don't vanish when the ads stop: lasting organic visibility.",
    intro_tr: "Reklam muslugu kapanınca trafik biter; SEO ise bileşik faizle çalışır. Teknik altyapı, içerik ve yerel sinyalleri birlikte kurar, \"Ankara + sektörünüz\" aramalarında sizi kalıcı olarak öne taşırız.",
    intro_en: "Ads stop when the tap closes; SEO compounds. We build technical foundations, content and local signals together for lasting rankings.",
    idealTitle_tr: "İyi bir SEO çalışması neleri kapsamalı?", idealTitle_en: "What should good SEO cover?",
    ideals: [
      { icon: "🧱", t_tr: "Teknik temel", t_en: "Technical base", d_tr: "Hız, mobil uyum, temiz URL, sitemap, yapılandırılmış veri. Google siteyi okuyamıyorsa içerik boşa yazılır.", d_en: "Speed, mobile, clean URLs, sitemaps, structured data — content is wasted if Google can't read the site." },
      { icon: "🗺️", t_tr: "Yerel sinyaller", t_en: "Local signals", d_tr: "Google İşletme Profili, tutarlı ad-adres-telefon, yorum yönetimi. Harita kutusuna girmenin yolu buradan geçer.", d_en: "Business Profile, consistent NAP, review management — the way into the map pack." },
      { icon: "🔑", t_tr: "Doğru anahtar kelimeler", t_en: "Right keywords", d_tr: "Hacimli ama alakasız kelime değil; satın alma niyeti taşıyan \"semt + hizmet\" aramaları hedeflenir.", d_en: "Not vanity volume — buying-intent \"district + service\" searches." },
      { icon: "✍️", t_tr: "Yaşayan içerik", t_en: "Living content", d_tr: "Ayda bir yazılan blog değil; müşterinin sorduğu soruları cevaplayan, düzenli beslenen içerik planı.", d_en: "A steady plan answering real customer questions." },
      { icon: "🔗", t_tr: "Otorite inşası", t_en: "Authority building", d_tr: "Sektörel dizinler, yerel kaynaklar ve doğal bağlantılarla alan adı güveni zamanla örülür.", d_en: "Domain trust built over time via directories and natural links." },
      { icon: "📈", t_tr: "Ölçüm & raporlama", t_en: "Measurement", d_tr: "Search Console ve analitikle sıralama, trafik ve dönüşüm takibi; ayda bir anlaşılır rapor.", d_en: "Rankings, traffic and conversions tracked; a clear monthly report." },
    ],
    advTitle_tr: "SEO işletmenize ne kazandırır?", advTitle_en: "What does SEO earn you?",
    advantages: [
      { t_tr: "Tık başına maliyeti sıfır trafik", t_en: "Zero cost-per-click traffic", d_tr: "Organik tıklamanın faturası yoktur. İlk sayfaya oturan bir sayfa, yıllarca bedava müşteri taşır.", d_en: "Organic clicks have no invoice. A page that ranks carries free customers for years." },
      { t_tr: "Birikimli kazanç", t_en: "Compounding returns", d_tr: "Reklamın aksine SEO'da durduğunuzda birikim kaybolmaz; her ay bir öncekinin üstüne koyar.", d_en: "Unlike ads, gains don't evaporate — each month builds on the last." },
      { t_tr: "Güven algısı", t_en: "Perceived trust", d_tr: "Kullanıcı organik sonuca reklamdan daha çok güvenir. İlk sayfada olmak başlı başına referanstır.", d_en: "Users trust organic results more than ads. Page one is a reference in itself." },
      { t_tr: "Yerelde rakipsizlik", t_en: "Local dominance", d_tr: "Ankara'da çoğu sektörde SEO'yu doğru yapan bir elin parmağını geçmez — erken davranan kazanır.", d_en: "In most local markets, few do SEO right — early movers win." },
    ],
    useTitle_tr: "Neleri kapsıyoruz?", useTitle_en: "What we cover",
    useCases: [
      { t_tr: "Teknik SEO denetimi", t_en: "Technical SEO audit", d_tr: "Mevcut sitenin hız, indeksleme ve yapı sorunlarının tam listesi ve çözümü.", d_en: "A full list of speed, indexing and structural issues — and the fixes." },
      { t_tr: "Yerel SEO & Harita", t_en: "Local SEO & Maps", d_tr: "Google İşletme Profili optimizasyonu, yorum stratejisi, semt bazlı içerik.", d_en: "Business Profile optimization, review strategy, district-level content." },
      { t_tr: "İçerik stratejisi", t_en: "Content strategy", d_tr: "Anahtar kelime araştırması ve satışa hizmet eden blog/sayfa planı — yazımı dahil.", d_en: "Keyword research and a content plan that serves sales — writing included." },
      { t_tr: "E-ticaret SEO", t_en: "E-commerce SEO", d_tr: "Kategori ve ürün sayfası optimizasyonu, alışveriş sonuçlarında görünürlük.", d_en: "Category & product page optimization, Shopping visibility." },
    ],
    stepsTitle_tr: "Nasıl çalışıyoruz?", stepsTitle_en: "How we work",
    steps: [
      { t_tr: "Denetim & rakip analizi", t_en: "Audit & competitors", d_tr: "Sitenizin mevcut durumu, rakiplerin konumu ve fırsat haritası çıkarılır.", d_en: "Where you stand, where competitors sit, and the opportunity map." },
      { t_tr: "Teknik düzeltmeler", t_en: "Technical fixes", d_tr: "Hız, indeksleme, yapılandırılmış veri ve site içi yapı sorunları giderilir.", d_en: "Speed, indexing, structured data and on-site structure fixed." },
      { t_tr: "İçerik & yerel sinyaller", t_en: "Content & local signals", d_tr: "İçerik planı devreye girer; İşletme Profili ve yorum akışı düzenli beslenir.", d_en: "The content plan kicks in; Business Profile and reviews stay fed." },
      { t_tr: "Ölçüm & iterasyon", t_en: "Measure & iterate", d_tr: "Aylık rapor: hangi kelimede neredesiniz, trafik ve talep nereye gidiyor, sırada ne var.", d_en: "Monthly: where you rank, where traffic goes, what's next." },
    ],
    faq: [
      { q_tr: "SEO'dan ne zaman sonuç alırım?", q_en: "When will I see SEO results?", a_tr: "Teknik düzeltmeler 1-3 ayda, içerik stratejisi 3-6 ayda etkisini gösterir. 'Bir haftada birinci sayfa' vaadi veren varsa kaçın.", a_en: "Technical fixes show in 1–3 months, content in 3–6. Run from 'page one in a week' promises." },
      { q_tr: "Garanti veriyor musunuz?", q_en: "Do you guarantee rankings?", a_tr: "Sıralamayı Google belirler; garanti veren yanıltır. Biz süreç ve şeffaf ölçüm garantisi veririz: ne yapıldığını ve neyin değiştiğini her ay görürsünüz.", a_en: "Google decides rankings; anyone guaranteeing them is misleading you. We guarantee process and transparent measurement." },
      { q_tr: "Sadece Ankara için mi çalışıyorsunuz?", q_en: "Only Ankara?", a_tr: "Merkez üssümüz Ankara ve çevre iller; yerel aramalarda uzmanız. Türkiye geneli ve e-ticaret SEO projeleri de yürütüyoruz.", a_en: "Ankara is home turf, but we run nationwide and e-commerce SEO too." },
      { q_tr: "Reklamla SEO birlikte mi yürümeli?", q_en: "Ads and SEO together?", a_tr: "İdeali bu: reklam hemen talep getirirken SEO kalıcı zemini örer. Aynı ekipte olduğu için ikisi tek stratejide birleşir.", a_en: "Ideally yes — ads bring leads now while SEO builds the ground." },
    ],
    matchTags: ["SEO", "Yerel SEO"],
    blogTokens: ["seo"],
  },
  {
    slug: "marka-kreatif",
    nav_tr: "Marka & Kreatif", nav_en: "Brand & Creative",
    metaTitle_tr: "Marka Kimliği & Kreatif Tasarım — Ankara | Vogolab",
    metaTitle_en: "Brand Identity & Creative Design | Vogolab",
    metaDesc_tr: "Logo ve kurumsal kimlikten sosyal medya içeriğine, QR menüden kişisel marka sitelerine — her temas noktasında tutarlı ve akılda kalıcı bir görsel dil.",
    metaDesc_en: "From logo and identity to social content and QR menus — a consistent, memorable visual language at every touchpoint.",
    eyebrow_tr: "Marka & Kreatif", eyebrow_en: "Brand & Creative",
    h1_tr: "Marka, logodan fazlasıdır: her temasta aynı his.",
    h1_en: "A brand is more than a logo: the same feeling at every touch.",
    intro_tr: "Müşteri markanızla Instagram'da, menüde, kartvizitte ve sitede karşılaşır — hepsinde aynı dili konuşmalısınız. Kimliği kurar, tüm temas noktalarına tutarlı biçimde yayarız.",
    intro_en: "Customers meet your brand on Instagram, on the menu, on the card, on the site — it must speak one language everywhere. We build the identity and roll it out consistently.",
    idealTitle_tr: "Güçlü bir marka kimliği neye benzer?", idealTitle_en: "What does a strong identity look like?",
    ideals: [
      { icon: "◈", t_tr: "Akılda kalır", t_en: "Memorable", d_tr: "Bir bakışta tanınan logo, renk ve tipografi. Kalabalık vitrinde sizi hatırlatan şey budur.", d_en: "Logo, color and type recognized at a glance." },
      { icon: "🧭", t_tr: "Tutarlıdır", t_en: "Consistent", d_tr: "Sitede başka, menüde başka görünen marka güven kaybeder. Kimlik kılavuzu her kanalda aynı dili garanti eder.", d_en: "A brand that looks different everywhere loses trust. The guideline keeps one language." },
      { icon: "🎭", t_tr: "Karakteri vardır", t_en: "Has character", d_tr: "Premium mu, samimi mi, iddialı mı? Ton belirlenir; görsel ve metin dili ona göre kurulur.", d_en: "Premium, warm or bold — the tone is set, visuals and copy follow." },
      { icon: "📐", t_tr: "Her boyutta çalışır", t_en: "Works at every size", d_tr: "Favicon'dan tabelaya, story'den faturaya — iyi kimlik her ölçekte okunur.", d_en: "From favicon to signage, a good identity reads at every scale." },
      { icon: "🗂️", t_tr: "Kılavuzla teslim edilir", t_en: "Ships with a guide", d_tr: "Renk kodları, yazı tipleri, kullanım kuralları ve tüm dosyalar elinizde olur; matbaacıya 'şu maviden' demezsiniz.", d_en: "Color codes, fonts, usage rules and all files in your hands." },
      { icon: "🔄", t_tr: "Dijitalde yaşar", t_en: "Lives digitally", d_tr: "Kimlik sadece baskıda değil; sitede, sosyal medyada ve reklamda aynı güçle çalışacak şekilde tasarlanır.", d_en: "Designed to work as hard on screens as in print." },
    ],
    advTitle_tr: "Tutarlı kimlik ne kazandırır?", advTitle_en: "What does a consistent identity earn you?",
    advantages: [
      { t_tr: "Hatırlanma", t_en: "Recall", d_tr: "Müşteri ihtiyacı doğduğunda aklına ilk gelen marka olursunuz — satışın yarısı budur.", d_en: "Be the first name that comes to mind — that's half the sale." },
      { t_tr: "Fiyat gücü", t_en: "Pricing power", d_tr: "Özenli görünen marka, ucuz pazarlığın muhatabı olmaz; premium algı fiyatınızı savunur.", d_en: "A polished brand isn't haggled with; premium perception defends your price." },
      { t_tr: "Reklam verimi", t_en: "Ad efficiency", d_tr: "Tanınan markanın reklamı daha çok tıklanır; aynı bütçeyle daha fazla sonuç alırsınız.", d_en: "Recognized brands get clicked more — more results per lira." },
      { t_tr: "İç düzen", t_en: "Internal order", d_tr: "Kılavuz varken her yeni tasarım hızlı ve tutarlı çıkar; 'hangi logo neredeydi' karmaşası biter.", d_en: "With a guide, every new design ships fast and on-brand." },
    ],
    useTitle_tr: "Neler üretiyoruz?", useTitle_en: "What we produce",
    useCases: [
      { t_tr: "Logo & kurumsal kimlik", t_en: "Logo & identity", d_tr: "Logo, renk, tipografi, kartvizit, antetli — kılavuzuyla birlikte eksiksiz paket.", d_en: "Logo, color, type and stationery — with the guideline." },
      { t_tr: "Sosyal medya içeriği", t_en: "Social content", d_tr: "Şablon setleri ve düzenli içerik üretimi; profiliniz vitrin gibi görünür.", d_en: "Template kits and steady content production." },
      { t_tr: "QR menü & baskı işleri", t_en: "QR menus & print", d_tr: "Restoran ve kafeler için markalı QR menüler, masa üstü ve baskı materyalleri.", d_en: "Branded QR menus and print material for venues." },
      { t_tr: "Kişisel marka", t_en: "Personal brands", d_tr: "Sanatçı, danışman ve profesyoneller için portfolyo siteleri ve kişisel kimlik.", d_en: "Portfolio sites and identities for professionals." },
    ],
    stepsTitle_tr: "Nasıl çalışıyoruz?", stepsTitle_en: "How we work",
    steps: [
      { t_tr: "Marka keşfi", t_en: "Brand discovery", d_tr: "Hikâyeniz, rakipler, hedef kitle ve ton. Kime, ne hissettirmek istiyoruz?", d_en: "Your story, competitors, audience and tone." },
      { t_tr: "Konsept & tasarım", t_en: "Concept & design", d_tr: "Yön seçenekleri sunulur; seçilen konsept logo, renk ve tipografiye dönüşür.", d_en: "Directions are presented; the chosen concept becomes logo, color, type." },
      { t_tr: "Uygulama", t_en: "Rollout", d_tr: "Kimlik; site, sosyal medya, menü ve baskı materyallerine tutarlı biçimde uygulanır.", d_en: "The identity rolls out to site, social, menus and print." },
      { t_tr: "Kılavuz & teslim", t_en: "Guide & handoff", d_tr: "Tüm kaynak dosyalar ve kullanım kılavuzu size teslim edilir — marka sizindir.", d_en: "All source files and the guide are yours." },
    ],
    faq: [
      { q_tr: "Sadece logo yaptırabilir miyim?", q_en: "Can I get just a logo?", a_tr: "Evet; ama logoyu tek başına değil, en azından renk-tipografi ve temel kullanım kurallarıyla teslim etmeyi öneririz — yoksa tutarlılık ilk haftada bozulur.", a_en: "Yes — though we recommend at least color, type and basic rules with it." },
      { q_tr: "Mevcut logomuzu koruyarak yenilenebilir miyiz?", q_en: "Can we refresh while keeping our logo?", a_tr: "Evet, buna marka tazeleme diyoruz: logo korunur ya da inceltilir; renk, tipografi ve uygulama dili modernize edilir.", a_en: "Yes — a brand refresh keeps the logo and modernizes everything around it." },
      { q_tr: "Sosyal medya yönetimi de yapıyor musunuz?", q_en: "Do you manage social media?", a_tr: "İçerik üretimi ve tasarım tarafını üstleniyoruz; reklamla birleşince tek elden bütünleşik yürür.", a_en: "We handle content production and design; combined with ads it runs as one." },
      { q_tr: "Dosyaların telifi kimde kalır?", q_en: "Who owns the files?", a_tr: "Sizde. Tüm kaynak dosyalar ve kullanım hakları teslimle birlikte size geçer.", a_en: "You. All source files and rights transfer on delivery." },
    ],
    matchTags: ["Branding", "Marka", "Kişisel Marka", "QR Menu", "Design", "Multilingual"],
    blogTokens: ["marka", "brand", "logo", "sosyal"],
  },
];

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return SERVICE_DETAILS.find((s) => s.slug === slug);
}

/** Hizmet listesindeki başlıktan alt sayfa slug'ı türetir (admin başlığı değiştirse de çalışır). */
export function serviceSlugForTitle(title: string): string | null {
  const t = (title || "").toLowerCase();
  if (/web/.test(t)) return "web-tasarim";
  if (/reklam|ads/.test(t)) return "reklam-yonetimi";
  if (/seo/.test(t)) return "seo";
  if (/marka|kreatif|brand/.test(t)) return "marka-kreatif";
  return null;
}
