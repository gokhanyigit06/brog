import { type Locale, getTranslations } from "@/i18n";

export default async function HizmetlerPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);
  return (
    <main>
      <h1>{t.services.title}</h1>
    </main>
  );
}
