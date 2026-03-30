"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map as MapIcon, Tags, MessageSquare, BookOpen, Image as ImageIcon, Settings, LogOut, ExternalLink } from "lucide-react";
import { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Trips", href: "/admin/trips", icon: MapIcon },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-charcoal font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <Link href="/admin" className="font-serif text-xl font-semibold tracking-wide uppercase">
            K2K <span className="font-serif text-lg font-light italic text-accent ml-0.5">Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive(item)
                  ? "bg-accent/10 text-accent"
                  : "text-charcoal/70 hover:text-accent hover:bg-accent/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-charcoal/50 hover:text-charcoal hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={18} />
            View Site
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 shrink-0">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-medium text-charcoal/50 uppercase tracking-widest font-nav">
            Admin Panel
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs uppercase">
              AD
            </div>
          </div>
        </header>
        
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
