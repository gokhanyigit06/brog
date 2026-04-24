import { type Locale } from "@/i18n";
import { getTranslations } from "@/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <main>
      <h1>{t.home.hero.title}</h1>
      <p>{t.home.hero.subtitle}</p>
    </main>
  );
}
