export default function AdminDashboard() {
  const pages = [
    { slug: "anasayfa", label: "Anasayfa", href: "/admin/anasayfa", icon: "🏠" },
    { slug: "projeler", label: "Projeler", href: "/admin/projeler", icon: "💼" },
    { slug: "hizmetler", label: "Hizmetler", href: "/admin/hizmetler", icon: "⚙️" },
    { slug: "hakkimizda", label: "Hakkımızda", href: "/admin/hakkimizda", icon: "👥" },
    { slug: "iletisim", label: "İletişim", href: "/admin/iletisim", icon: "📬" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Sayfaları ve içerikleri buradan yönet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <a
            key={page.slug}
            href={page.href}
            className="group block p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-800 transition-all"
          >
            <div className="text-2xl mb-3">{page.icon}</div>
            <h2 className="text-white font-semibold text-lg group-hover:text-white">
              {page.label}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Sayfayı düzenle →
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
