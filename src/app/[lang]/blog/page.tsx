import { type Locale, getTranslations } from "@/i18n";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);
  return (
    <main>
      <h1>{t.blog.title}</h1>
    </main>
  );
}
