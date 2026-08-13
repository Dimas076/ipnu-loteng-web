"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSite } from "@/contexts/SiteContext";
import { Button } from "@/components/ui/button";
import { Menu, LogOut, Bell, Globe } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { logout } = useAuth();
  const { logoUrl } = useSite();

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-40 transition-all">
      <div className="flex items-center">
        <h2 className="text-xl font-bold tracking-tight text-on-surface hidden md:block">
          Dashboard Administrator
        </h2>
        <div className="md:hidden flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo IPNU" className="w-8 h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              IP
            </div>
          )}
          <span className="font-medium text-foreground tracking-tight">IPNU Loteng</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link href="/" target="_blank" className="hidden sm:block">
          <Button variant="outline" size="sm" className="rounded-lg bg-white border-outline text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <Globe className="h-4 w-4 mr-2 text-on-surface-variant" />
            Kunjungi Web
          </Button>
        </Link>
        
        <div className="h-6 w-px bg-border hidden sm:block"></div>

          <Button 
            variant="ghost" 
            onClick={logout} 
            className="hidden md:flex text-on-surface-variant hover:text-destructive hover:bg-surface-container-low rounded-lg font-medium transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2 text-on-surface-variant" />
            Keluar
        </Button>
        
        <Button variant="ghost" className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-muted/50 rounded-lg" onClick={onMenuClick} aria-label="Buka Menu">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
}
