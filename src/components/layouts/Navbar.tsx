"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/agenda", label: "Agenda" },
  { href: "/sertifikat", label: "Sertifikat" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { logoUrl } = useSite();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-container-lowest/70 backdrop-blur-lg border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo IPNU" className="h-9 w-9 object-contain shrink-0" />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              IP
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground leading-tight">IPNU LOTENG</span>
            <span className="text-[10px] font-semibold text-muted-foreground leading-tight tracking-wide">Bergerak Riang Gembira</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                isActive(link.href)
                  ? "text-primary font-semibold bg-primary/8"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="relative group">
            <button className={cn(
              "px-4 py-2 rounded-lg transition-colors flex items-center gap-1",
              pathname.startsWith("/pengurus") || pathname.startsWith("/pac")
                ? "text-primary font-semibold bg-primary/8"
                : "text-foreground/70 hover:text-foreground hover:bg-muted"
            )}>
              Direktori
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 flex flex-col z-50">
              <Link 
                href="/pengurus" 
                className={cn(
                  "px-4 py-2.5 text-sm transition-colors",
                  pathname.startsWith("/pengurus") ? "bg-primary/5 text-primary font-semibold" : "text-on-surface hover:bg-surface-container-low"
                )}
              >
                Pengurus PC
              </Link>
              <Link 
                href="/pac" 
                className={cn(
                  "px-4 py-2.5 text-sm transition-colors",
                  pathname.startsWith("/pac") ? "bg-primary/5 text-primary font-semibold" : "text-on-surface hover:bg-surface-container-low"
                )}
              >
                Direktori PAC
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg"
            onClick={() => setIsOpen(true)}
            aria-label="Buka Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white h-screen flex flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border bg-white shrink-0">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo IPNU" className="h-8 w-8 object-contain" />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                IP
              </div>
            )}
            <span className="font-bold text-foreground text-base">IPNU Loteng</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg -mr-1"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Drawer Nav */}
        <div className="flex flex-col p-4 space-y-1 overflow-y-auto flex-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Menu Utama</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center min-h-[48px] px-3 rounded-lg text-sm font-medium transition-colors border-l-4",
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-semibold border-primary"
                  : "text-foreground hover:bg-muted border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px w-full bg-border my-3" />

          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-3">Direktori</p>
          <Link
            href="/pengurus"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center min-h-[48px] px-3 rounded-lg text-sm font-medium transition-colors border-l-4",
              pathname.startsWith("/pengurus")
                ? "bg-primary/10 text-primary font-semibold border-primary"
                : "text-foreground hover:bg-muted border-transparent"
            )}
          >
            Pengurus PC
          </Link>
          <Link
            href="/pac"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center min-h-[48px] px-3 rounded-lg text-sm font-medium transition-colors border-l-4",
              pathname.startsWith("/pac")
                ? "bg-primary/10 text-primary font-semibold border-primary"
                : "text-foreground hover:bg-muted border-transparent"
            )}
          >
            Direktori PAC
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border shrink-0">
          <p className="text-xs text-center text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} IPNU Lombok Tengah
          </p>
        </div>
      </aside>
    </header>
  );
}
