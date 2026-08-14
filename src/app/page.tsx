import { MainLayout } from "@/components/layouts/MainLayout";
import prisma from "@/lib/prisma";
import {
  HeroSection,
  StatsStrip,
  TentangKami,
  ProgramSection,
  KabarTerbaru,
  GaleriSection,
} from "@/components/home/HomeComponents";

// Revalidate setiap 60 detik — data update dari admin akan muncul dalam 1 menit
export const revalidate = 60;

export default async function Home() {
  // ─── Ambil semua data dari Prisma (SINGLE SOURCE OF TRUTH) ───────────────
  const [profile, beritaTerbaru, galeriTerbaru, statsData] = await Promise.all([
    // 1. Profil organisasi (untuk foto sejarah di section "Tentang Kami")
    prisma.profile.findUnique({ where: { id: 1 } }),

    // 2. 3 berita published terbaru
    prisma.berita.findMany({
      where: { status: "published" },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    // 3. 3 foto galeri terbaru
    prisma.galeri.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    // 4. Statistik nyata dari database
    Promise.all([
      prisma.berita.count({ where: { status: "published" } }),
      prisma.agenda.count({ where: { status: "completed" } }),
      prisma.pengurus.count(),
    ]),
  ]);

  const [totalBerita, agendaSelesai, totalPengurus] = statsData;

  // ─── Susun stats dari data nyata ──────────────────────────────────────────
  const stats = [
    { value: totalPengurus > 0 ? `${totalPengurus}+` : "—", label: "Pengurus Cabang" },
    { value: agendaSelesai > 0 ? `${agendaSelesai}+` : "—", label: "Agenda Selesai" },
    { value: totalBerita > 0 ? `${totalBerita}+` : "—", label: "Berita Publikasi" },
    { value: "2026", label: "Tahun Khidmah" },
  ];

  return (
    <MainLayout>
      {/* Hero — teks + foto statis */}
      <HeroSection />

      {/* Stats — data real dari DB */}
      <StatsStrip stats={stats} />

      {/* Tentang Kami — foto dari profile.sejarah_image */}
      <TentangKami sejarahImage={profile?.sejarah_image} />

      {/* Program Kerja — konten statis (belum ada di DB) */}
      <ProgramSection />

      {/* Kabar Terbaru — 3 berita published terbaru dari DB */}
      <KabarTerbaru berita={beritaTerbaru} />

      {/* Galeri Kegiatan — 4 foto terbaru dari DB (tersembunyi jika kosong) */}
      <GaleriSection photos={galeriTerbaru} />
    </MainLayout>
  );
}
