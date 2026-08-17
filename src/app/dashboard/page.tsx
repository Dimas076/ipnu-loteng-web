"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { FileText, Calendar, Image as ImageIcon, TrendingUp, ArrowRight, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalBerita: number;
  totalAgenda: number;
  agendaSelesai: number;
  totalPengurus: number;
  totalGaleri: number;
}

interface RecentItem {
  id: number;
  title: string;
  type: "berita" | "agenda";
  createdAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, beritaRes, agendaRes] = await Promise.all([
        fetch("/api/dashboard/stats", { cache: "no-store" }),
        fetch("/api/posts?limit=3", { cache: "no-store" }),
        fetch("/api/agenda?limit=3", { cache: "no-store" }),
      ]);

      const stats = await statsRes.json();
      const berita = await beritaRes.json();
      const agenda = await agendaRes.json();

      if (stats.status === "success") setStatsData(stats.data);

      const items: RecentItem[] = [];
      if (berita.status === "success" && Array.isArray(berita.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        berita.data.forEach((b: any) => items.push({ id: b.id, title: b.title, type: "berita", createdAt: b.createdAt }));
      }
      if (agenda.status === "success" && Array.isArray(agenda.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        agenda.data.forEach((a: any) => items.push({ id: a.id, title: a.title, type: "agenda", createdAt: a.createdAt }));
      }
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentItems(items.slice(0, 4));
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    {
      title: "Berita Diterbitkan",
      value: loadingStats ? "—" : String(statsData?.totalBerita ?? 0),
      icon: FileText,
      link: "/dashboard/berita",
    },
    {
      title: "Total Agenda",
      value: loadingStats ? "—" : String(statsData?.totalAgenda ?? 0),
      icon: Calendar,
      link: "/dashboard/agenda",
    },
    {
      title: "Agenda Selesai",
      value: loadingStats ? "—" : String(statsData?.agendaSelesai ?? 0),
      icon: TrendingUp,
      link: "/dashboard/agenda",
    },
    {
      title: "Foto Galeri",
      value: loadingStats ? "—" : String(statsData?.totalGaleri ?? 0),
      icon: ImageIcon,
      link: "/dashboard/galeri",
    },
  ];

  const quickLinks = [
    { label: "Tulis Berita Baru", href: "/dashboard/berita/create", icon: FileText, desc: "Buat dan publikasikan artikel" },
    { label: "Tambah Agenda", href: "/dashboard/agenda", icon: Calendar, desc: "Buat jadwal kegiatan baru" },
    { label: "Upload Foto Galeri", href: "/dashboard/galeri", icon: ImageIcon, desc: "Tambah dokumentasi foto" },
    { label: "Edit Sejarah Organisasi", href: "/dashboard/profil", icon: TrendingUp, desc: "Perbarui sejarah & pengurus" },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Selamat Datang, {user?.name || "Administrator"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pusat kendali Sistem Informasi IPNU Lombok Tengah.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/agenda" className="inline-flex items-center justify-center px-4 py-2 bg-white border border-border text-foreground font-semibold text-sm rounded-md hover:bg-muted transition-colors">
            Lihat Agenda
          </Link>
          <Link href="/dashboard/berita/create" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold text-sm rounded-md hover:bg-primary/90 transition-colors">
            Buat Berita Baru
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link key={i} href={stat.link} className="bg-card rounded-lg p-5 border border-border hover:bg-muted/50 transition-colors duration-200 group relative block shadow-sm">
              <div className="flex items-start justify-between relative z-10 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                {loadingStats && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin mt-1" />}
              </div>
              <div className="relative z-10">
                <h3 className="text-muted-foreground font-medium text-xs mb-1">{stat.title}</h3>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Aktivitas Terkini */}
        <div className="lg:col-span-2 bg-card rounded-lg p-5 md:p-6 border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Aktivitas Terkini</h2>
              <p className="text-sm text-muted-foreground mt-1">Berita & agenda terbaru yang ditambahkan</p>
            </div>
            <Link href="/dashboard/berita" className="hidden sm:flex items-center text-sm font-bold text-primary hover:text-primary-hover transition-colors">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {loadingStats && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}
            {!loadingStats && recentItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas terbaru. Mulai buat berita atau agenda!</p>
            )}
            {recentItems.map((item, i) => {
              const Icon = item.type === "berita" ? FileText : Calendar;
              const href = item.type === "berita" ? "/dashboard/berita" : "/dashboard/agenda";
              return (
                <Link key={i} href={href} className="flex items-start gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-muted text-muted-foreground shrink-0 group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                      {item.type === "berita" ? "Berita" : "Agenda"}
                    </span>
                    <h4 className="font-semibold text-foreground text-sm line-clamp-1 mt-0.5">{item.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-3" />
                </Link>
              );
            })}
          </div>

          <Link href="/dashboard/berita" className="sm:hidden mt-4 flex justify-center items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Lihat Semua Aktivitas
          </Link>
        </div>

        {/* Akses Cepat */}
        <div className="bg-card rounded-lg p-5 md:p-6 border border-border shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Akses Cepat</h2>
            <p className="text-sm text-muted-foreground mt-1">Menu utama pengelolaan konten</p>
          </div>

          <div className="space-y-3 flex-1">
            {quickLinks.map((menu, i) => {
              const Icon = menu.icon;
              return (
                <Link key={i} href={menu.href} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{menu.label}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{menu.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
