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
  // ─── Ambil data dengan fallback jika DB tidak tersedia ─────────────────────
  let profile = null;
  let beritaTerbaru: any[] = [];
  let galeriTerbaru: any[] = [];
  let totalPAC = 0, totalPR = 0, totalPK = 0, totalAnggota = 0;

  try {
    const [profileData, beritaData, galeriData, statsData] = await Promise.all([
      prisma.profile.findUnique({ where: { id: 1 } }),
      prisma.berita.findMany({
        where: { status: "published" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.galeri.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.pAC.aggregate({
        _count: { id: true },
        _sum: { pr: true, pk: true, members: true },
        where: { status: "Aktif" }
      }),
    ]);

    profile = profileData;
    beritaTerbaru = beritaData;
    galeriTerbaru = galeriData;

    const pacAgg = statsData as any;
    totalPAC = pacAgg?._count?.id || 0;
    totalPR = pacAgg?._sum?.pr || 0;
    totalPK = pacAgg?._sum?.pk || 0;
    totalAnggota = pacAgg?._sum?.members || 0;
  } catch (err) {
    console.error("⚠️ Database tidak tersedia, halaman tampil dengan data kosong:", err);
  }

  // ─── Susun stats dari data nyata ──────────────────────────────────────────
  const stats = [
    { value: totalPAC > 0 ? `${totalPAC}` : "—", label: "Pimpinan Anak Cabang" },
    { value: totalPR > 0 ? `${totalPR}` : "—", label: "Pimpinan Ranting" },
    { value: totalPK > 0 ? `${totalPK}` : "—", label: "Pimpinan Komisariat" },
    { value: totalAnggota > 0 ? `${totalAnggota}+` : "—", label: "Anggota Aktif" },
  ];

  return (
    <MainLayout>
      {/* Hero — teks + kolase foto kegiatan */}
      <HeroSection profile={profile} />

      {/* Stats — data real dari DB */}
      <StatsStrip stats={stats} />

      {/* Tentang Kami — foto dari profile.sejarah_image */}
      <TentangKami sejarahImage={profile?.tentang_kami_image} />

      {/* Program Kerja — konten statis (belum ada di DB) */}
      <ProgramSection />

      {/* Kabar Terbaru — 3 berita published terbaru dari DB */}
      <KabarTerbaru berita={beritaTerbaru} />

      {/* Galeri Kegiatan — 4 foto terbaru dari DB (tersembunyi jika kosong) */}
      <GaleriSection photos={galeriTerbaru} />
    </MainLayout>
  );
}
