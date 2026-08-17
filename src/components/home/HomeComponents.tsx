"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { GallerySlideshow } from "@/components/ui/GallerySlideshow";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Hero Section ───────────────────────────────────────────────────────────
export function HeroSection({ profile }: { profile?: any }) {
  // Ambil foto dari profile jika ada
  const heroImages = [
    profile?.hero_image_1 || null,
    profile?.hero_image_2 || null,
    profile?.hero_image_3 || null,
  ];

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28 overflow-hidden bg-background">
      {/* ── Decorative Background ── */}
      <div className="absolute top-0 right-0 -translate-y-20 translate-x-1/4 w-[700px] h-[700px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── KIRI: Teks & CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col text-center lg:text-left mx-auto lg:mx-0 max-w-xl lg:max-w-none order-2 lg:order-1"
          >


            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.08] mb-6">
              Bergerak Riang{' '}
              <span className="text-primary italic">Gembira.</span>
            </h1>

            {/* Deskripsi */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[52ch] mb-8 mx-auto lg:mx-0">
              Wadah pergerakan, pengkaderan, dan intelektual pelajar Nahdlatul Ulama yang toleran dan berwawasan kebangsaan.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" className="rounded-md text-base group" asChild>
                <Link href="/agenda">
                  Lihat Agenda <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-md text-base group" asChild>
                <Link href="/berita">
                  Baca Berita <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* ── KANAN: Kolase Foto + Dekorasi ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative w-full order-1 lg:order-2 hidden lg:block"
          >
            {/* Grid rapi: 1 foto tinggi kiri + 2 foto susun kanan */}
            <div className="grid grid-cols-5 grid-rows-2 gap-3 md:gap-4 mx-auto max-w-md lg:max-w-none">

              {/* Foto 1: Besar, tinggi (span 2 baris) */}
              <div className="col-span-3 row-span-2 rounded-2xl overflow-hidden shadow-lg aspect-[3/4]">
                {heroImages[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImages[0]} alt="Kegiatan IPNU Lombok Tengah" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/15 via-primary/8 to-primary/3 flex items-center justify-center">
                    <span className="text-5xl font-black text-primary/20 tracking-tighter">IPNU</span>
                  </div>
                )}
              </div>

              {/* Foto 2: Kanan atas */}
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg">
                {heroImages[1] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImages[1]} alt="Aktivitas IPNU" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/12 to-primary/4 flex items-center justify-center">
                    <span className="text-3xl font-black text-primary/15 tracking-tighter">NU</span>
                  </div>
                )}
              </div>

              {/* Foto 3: Kanan bawah */}
              <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg">
                {heroImages[2] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImages[2]} alt="IPNU Loteng" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/90 flex items-center justify-center">
                    <span className="text-2xl font-black text-white/80 tracking-tighter">IP</span>
                  </div>
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── Stats Strip ─────────────────────────────────────────────────────────────
interface Stat { value: string; label: string; }

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Subtle decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
      
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 max-w-6xl relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</span>
              <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Tentang Kami ─────────────────────────────────────────────────────────────
export function TentangKami({ sejarahImage }: { sejarahImage?: string | null }) {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 relative"
          >
            <div className="aspect-[4/3] rounded-md overflow-hidden relative border border-border group">
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10 transition-colors duration-500" />
              {sejarahImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={sejarahImage}
                  alt="Sejarah IPNU Lombok Tengah"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground font-semibold">IPNU Loteng</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight tracking-tight mt-[-4px]">
              Mencetak Generasi<br /><span className="text-primary">Pelajar Kritis &amp; Agamis</span>
            </h2>
            <p className="text-base text-muted-foreground mb-4 leading-relaxed max-w-[65ch]">
              Ikatan Pelajar Nahdlatul Ulama (IPNU) Kabupaten Lombok Tengah hadir sebagai wadah perjuangan, kaderisasi, dan intelektual bagi para pelajar.
            </p>
            <p className="text-base text-muted-foreground mb-10 leading-relaxed max-w-[65ch]">
              Berlandaskan Islam Ahlussunnah wal Jama&apos;ah, kami berkomitmen merawat tradisi dan mempersiapkan pemimpin masa depan yang toleran, cinta tanah air, dan berakhlakul karimah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="border-l-4 border-primary pl-4 flex-1">
                <span className="font-bold text-foreground text-lg">Berjiwa Sosial</span>
                <p className="text-sm text-muted-foreground mt-1">Peduli dan aktif di lingkungan sekitar</p>
              </div>
              <div className="border-l-4 border-primary/40 pl-4 flex-1">
                <span className="font-bold text-foreground text-lg">Berwawasan Luas</span>
                <p className="text-sm text-muted-foreground mt-1">Terbuka terhadap ilmu dan perspektif baru</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Program Kerja ────────────────────────────────────────────────────────────
const programs = [
  { title: "Kaderisasi", desc: "Membangun karakter dan kapasitas kepemimpinan pelajar NU.", link: "/program/kaderisasi" },
  { title: "Kajian Keislaman", desc: "Memperdalam pemahaman aswaja dan tradisi keilmuan pesantren.", link: "/program/kajian" },
  { title: "Advokasi Pelajar", desc: "Mendampingi dan melindungi hak-hak pelajar di lingkungan sekolah.", link: "/program/advokasi" },
  { title: "Pengembangan", desc: "Pelatihan skill digital, wirausaha, dan kesenian pelajar.", link: "/program/pengembangan" }
];

export function ProgramSection() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-border/50 relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Program <span className="text-primary">Kami</span></h2>
          <p className="text-muted-foreground mt-3 max-w-xl">Empat pilar program yang menggerakkan kader IPNU Lombok Tengah.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {programs.map((prog, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="h-full"
            >
              <Link
                href={prog.link}
                className="flex flex-col h-full bg-background border border-border/60 shadow-sm hover:shadow-md hover:border-primary/50 rounded-md p-8 transition-all duration-300 group relative"
              >
                <h4 className="text-xl font-bold mb-3 text-foreground">{prog.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{prog.desc}</p>
                <div className="flex mt-auto justify-end w-full">
                  <ArrowRight className="h-6 w-6 text-primary opacity-80 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Kabar Terbaru ────────────────────────────────────────────────────────────
interface BeritaItem {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  category?: string | null;
  authorName?: string | null;
  createdAt: Date | string;
}

export function KabarTerbaru({ berita }: { berita: BeritaItem[] }) {
  if (berita.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">Kabar <span className="text-primary">Terbaru</span></h2>
            <p className="text-base text-muted-foreground">Aktivitas dan opini terkini dari rekan-rekan pelajar NU.</p>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-lg h-11" asChild>
            <Link href="/berita">Lihat Semua Berita <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {berita.slice(0, 3).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={index === 2 ? "hidden md:block" : ""}
            >
              <Link href={`/berita/${item.slug}`} className="group block h-full bg-white border border-border rounded-md overflow-hidden">
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-muted">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground font-semibold text-sm">IPNU</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold mb-3 hover:text-primary hover:underline transition-colors leading-snug text-foreground line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    {item.authorName && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>Oleh: {item.authorName}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full h-11 text-sm rounded-lg" asChild>
            <Link href="/berita">Lihat Semua Berita</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Galeri Kegiatan ──────────────────────────────────────────────────────────
interface GaleriItem {
  id: number;
  title: string;
  image: string;
}

export function GaleriSection({ photos }: { photos: GaleriItem[] }) {
  // Jika belum ada foto di DB, sembunyikan section ini
  if (photos.length === 0) return null;

  // Ambil maks 3 foto
  const display = photos.slice(0, 3);

  return (
    <section className="py-12 md:py-16 bg-white border-t border-border/50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">Galeri <span className="text-primary">Kegiatan</span></h2>
            <p className="text-base text-muted-foreground">Potret pergerakan dan aksi nyata pelajar Nahdlatul Ulama.</p>
          </div>
          <Button variant="outline" className="hidden md:flex h-11 rounded-lg" asChild>
            <Link href="/galeri">Lihat Semua Foto <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {display.map((photo) => {
            const images = photo.image.split(',');
            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="aspect-video"
              >
                <GallerySlideshow 
                  images={images} 
                  title={photo.title} 
                />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" className="w-full h-11 text-sm rounded-lg" asChild>
            <Link href="/galeri">Lihat Semua Foto</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
