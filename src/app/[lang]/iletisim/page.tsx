import { type Locale, getTranslations } from "@/i18n";

export default async function IletisimPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);
  return (
    <main>
      <h1>{t.contact.title}</h1>
    </main>
  );
}
