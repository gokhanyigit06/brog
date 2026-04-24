"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Briefcase,
  Wrench,
  Users,
  Mail,
  Settings,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/anasayfa",   label: "Anasayfa",   icon: Home },
  { href: "/admin/projeler",   label: "Projeler",   icon: Briefcase },
  { href: "/admin/hizmetler",  label: "Hizmetler",  icon: Wrench },
  { href: "/admin/hakkimizda", label: "Hakkımızda", icon: Users },
  { href: "/admin/iletisim",   label: "İletişim",   icon: Mail },
  { href: "/admin/ayarlar",    label: "Ayarlar",    icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="logo"
            className="h-6 w-auto object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-widest uppercase">vogolab</span>
            <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase mt-0.5">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-white text-zinc-900"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon size={15} />
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-zinc-900" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ExternalLink size={12} />
          Siteyi Görüntüle
        </Link>
      </div>
    </aside>
  );
}
