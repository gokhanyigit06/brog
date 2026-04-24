import { type Locale, getTranslations } from "@/i18n";

export default async function ProjelerPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);
  return (
    <main>
      <h1>{t.projects.title}</h1>
    </main>
  );
}
