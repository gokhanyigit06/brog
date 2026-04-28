import { Metadata } from "next";
import { type Locale } from "@/i18n";
import Navbar from "@/components/site/navbar";
import Footer from "@/components/site/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Vogolab",
  description: "Terms of Service and Conditions for Vogolab.",
};

export default async function TermsOfServicePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isTr = lang === "tr";

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <Navbar lang={lang as Locale} />

      <div className="section-container" style={{ paddingTop: "140px", paddingBottom: "100px", color: "#fff" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, marginBottom: "48px", letterSpacing: "-0.02em" }}>
          {isTr ? "Kullanım Koşulları" : "Terms of Service"}
        </h1>

        <div style={{ fontSize: "16px", lineHeight: "1.9", color: "rgba(255,255,255,0.65)", display: "flex", flexDirection: "column", gap: "36px", maxWidth: "760px" }}>
          {isTr ? (
            <>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>Son Güncelleme:</strong> {new Date().toLocaleDateString("tr-TR")}
              </p>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>1. Taraflar</h2>
                <p>İşbu Kullanım Koşulları ("Sözleşme"), vogolab.com ("Site") adresinde hizmet veren Vogolab ("Şirket") ile Site'yi kullanan kişi ("Kullanıcı") arasında akdedilmiştir.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>2. Hizmetlerin Kullanımı</h2>
                <p>Site'yi kullanarak veya Site üzerinden sunulan hizmetlere erişerek bu Sözleşme'deki şartları kabul etmiş sayılırsınız. Site üzerinden sunulan içeriklerin izinsiz kopyalanması, çoğaltılması veya dağıtılması yasaktır.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>3. Fikri Mülkiyet</h2>
                <p>Site'de yer alan tüm içerikler (tasarım, metin, grafik, logo vb.) Vogolab'ın mülkiyetinde olup ilgili telif hakkı yasalarıyla korunmaktadır. Vogolab'ın önceden yazılı onayı alınmadan herhangi bir içeriğin ticari amaçla kullanılması yasaktır.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>4. Sorumluluk Reddi</h2>
                <p>Vogolab, Site'de yer alan bilgilerin doğruluğu ve güncelliği için makul çabayı gösterir ancak herhangi bir garanti vermez. Site kullanımından doğabilecek doğrudan veya dolaylı zararlardan Vogolab sorumlu tutulamaz.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>5. Değişiklikler</h2>
                <p>Vogolab, önceden haber vermeksizin bu Sözleşme şartlarında değişiklik yapma hakkını saklı tutar. Güncel Sözleşme Site'de yayınlandığı andan itibaren geçerlilik kazanır.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>6. İletişim</h2>
                <p>Bu sözleşme ile ilgili sorularınız için bizimle{" "}
                  <a href="mailto:hello@vogolab.com" style={{ color: "#fff", textDecoration: "underline" }}>hello@vogolab.com</a>{" "}
                  adresi üzerinden iletişime geçebilirsiniz.
                </p>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
                <strong style={{ color: "rgba(255,255,255,0.6)" }}>Last Updated:</strong> {new Date().toLocaleDateString("en-US")}
              </p>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>1. Parties</h2>
                <p>This Terms of Service ("Agreement") is concluded between Vogolab ("Company") operating at vogolab.com ("Site") and the person using the Site ("User").</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>2. Use of Services</h2>
                <p>By using the Site or accessing the services provided through the Site, you agree to the terms in this Agreement. Unauthorized copying, reproduction, or distribution of the content provided on the Site is prohibited.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>3. Intellectual Property</h2>
                <p>All content on the Site (design, text, graphics, logos, etc.) is the property of Vogolab and is protected by applicable copyright laws. Commercial use of any content without prior written consent from Vogolab is prohibited.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>4. Disclaimer</h2>
                <p>Vogolab makes reasonable efforts to ensure the accuracy and timeliness of the information on the Site but does not provide any warranties. Vogolab cannot be held liable for any direct or indirect damages arising from the use of the Site.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>5. Changes</h2>
                <p>Vogolab reserves the right to make changes to the terms of this Agreement without prior notice. The updated Agreement becomes effective as soon as it is published on the Site.</p>
              </div>

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>6. Contact</h2>
                <p>For questions regarding this agreement, contact us at{" "}
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
