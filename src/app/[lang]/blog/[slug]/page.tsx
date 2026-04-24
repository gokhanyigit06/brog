export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <h1>Blog: {slug}</h1>
    </main>
  );
}
