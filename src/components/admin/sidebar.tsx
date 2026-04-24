"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Briefcase,
  Settings,
  Users,
  Mail,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/anasayfa", label: "Anasayfa", icon: Home },
  { href: "/admin/projeler", label: "Projeler", icon: Briefcase },
  { href: "/admin/hizmetler", label: "Hizmetler", icon: Settings },
  { href: "/admin/hakkimizda", label: "Hakkımızda", icon: Users },
  { href: "/admin/iletisim", label: "İletişim", icon: Mail },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">
            brog
          </span>
          <span className="text-xs text-zinc-400 font-medium bg-zinc-800 px-2 py-0.5 rounded-full">
            admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-white text-zinc-900"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Siteye Git ↗
        </Link>
      </div>
    </aside>
  );
}
