import { Metadata } from "next";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Vogolab",
  description: "Privacy Policy for Vogolab.",
};

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isTr = lang === "tr";

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar lang={lang as Locale} />

      <div className="section-container" style={{ paddingTop: "140px", paddingBottom: "100px", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, marginBottom: "48px", letterSpacing: "-0.02em" }}>
          {isTr ? "Gizlilik Politikası" : "Privacy Policy"}
        </h1>

        <div style={{ fontSize: "16px", lineHeight: "1.9", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", gap: "36px", maxWidth: "760px" }}>
          {isTr ? (
            <>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>Son Güncelleme:</strong> {new Date().toLocaleDateString("tr-TR")}
              </p>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>1. Kişisel Verilerin Toplanması</h2>
                <p>Vogolab (vogolab.com), iletişim formları, e-posta abonelikleri ve site içi analiz araçları vasıtasıyla ad, soyad, e-posta adresi ve kullanım verileri gibi bilgileri toplayabilir.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>2. Verilerin Kullanımı</h2>
                <p>Toplanan kişisel veriler; tarafınıza hizmet sunabilmek, iletişim taleplerinize yanıt vermek, kullanıcı deneyimini iyileştirmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılmaktadır.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>3. Çerezler (Cookies)</h2>
                <p>Site deneyimini geliştirmek için çerezler kullanmaktayız. Tarayıcı ayarlarınızdan çerez kullanımını yönetebilir veya tamamen kapatabilirsiniz. Çerezlerin kapatılması bazı site özelliklerinin çalışmamasına neden olabilir.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>4. Üçüncü Taraf Hizmetler</h2>
                <p>Site, Google Analytics gibi üçüncü taraf analiz araçları kullanabilir. Bu hizmetlerin kendi gizlilik politikaları geçerlidir ve topladıkları veriler üzerinde Vogolab kontrolü bulunmamaktadır.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>5. Veri Paylaşımı</h2>
                <p>Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü şahıslarla paylaşılmamaktadır. Vogolab, kişisel verilerinizi satmaz, kiralamaz veya takas etmez.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>6. Haklarınız</h2>
                <p>KVKK kapsamında kişisel verilerinize erişim, düzeltme, silme ve işlenmesini kısıtlama haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>7. İletişim</h2>
                <p>Gizlilik politikamız veya kişisel verilerinizle ilgili sorularınız için{" "}
                  <a href="mailto:hello@vogolab.com" style={{ color: "#fff", textDecoration: "underline" }}>hello@vogolab.com</a>{" "}
                  adresi üzerinden bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>Last Updated:</strong> {new Date().toLocaleDateString("en-US")}
              </p>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>1. Collection of Personal Data</h2>
                <p>Vogolab (vogolab.com) may collect information such as name, surname, e-mail address, and usage data through contact forms, e-mail subscriptions, and on-site analysis tools.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>2. Use of Data</h2>
                <p>The collected personal data is used to provide services to you, respond to your contact requests, improve the user experience, and fulfill our legal obligations.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>3. Cookies</h2>
                <p>We use cookies to improve the site experience. You can manage cookie usage or turn it off completely from your browser settings. Disabling cookies may cause some site features to stop working.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>4. Third-Party Services</h2>
                <p>The Site may use third-party analytics tools such as Google Analytics. Their own privacy policies apply, and Vogolab has no control over the data they collect.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>5. Data Sharing</h2>
                <p>Your personal data is not shared with third parties except as required by law. Vogolab does not sell, rent, or exchange your personal data.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>6. Your Rights</h2>
                <p>You have the right to access, correct, delete, and restrict the processing of your personal data. Please contact us to exercise these rights.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>7. Contact</h2>
                <p>For questions regarding our privacy policy or your personal data, contact us at{" "}
                  <a href="mailto:hello@vogolab.com" style={{ color: "#fff", textDecoration: "underline" }}>hello@vogolab.com</a>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
