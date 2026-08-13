"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Calendar,
  Image as ImageIcon,
  X,
  ChevronRight,
  Building
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logoUrl } = useSite();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Berita", href: "/dashboard/berita", icon: FileText },
    { name: "PAC", href: "/dashboard/pac", icon: Users },
    { name: "Agenda", href: "/dashboard/agenda", icon: Calendar },
    { name: "Galeri", href: "/dashboard/galeri", icon: ImageIcon },
    { name: "Profil Organisasi", href: "/dashboard/profil", icon: Building },
    { name: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border h-screen flex flex-col transition-all duration-300 md:translate-x-0 md:static md:h-screen md:sticky md:top-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-background shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo IPNU" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                IP
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-tight">IPNU Loteng</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Sistem Informasi</span>
            </div>
          </Link>
          {isOpen && (
            <button onClick={() => setIsOpen && setIsOpen(false)} className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 space-y-1 no-scrollbar">
          <div className="px-6 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Menu Utama</p>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}`));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen && setIsOpen(false)}
                className={`flex items-center justify-between px-6 py-3 text-sm transition-colors group border-l-4 ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary font-bold"
                    : "text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border"
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-5 border-t border-border bg-background mt-auto shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary flex items-center justify-center text-white font-bold shrink-0">
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user?.name || "Admin IPNU"}</p>
              <p className="text-xs font-medium text-muted-foreground truncate">{user?.email || "admin@ipnuloteng.or.id"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
