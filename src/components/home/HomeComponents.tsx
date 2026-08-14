"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Hero Section ───────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border bg-background">
      {/* Massive Ambient Background Glows */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-8 items-center">
          
          {/* Kiri: Tipografi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col text-center lg:text-left mx-auto lg:mx-0 max-w-2xl lg:max-w-none"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.05] mb-6">
              Bergerak Riang <span className="text-primary italic block md:inline">Gembira.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[60ch] mb-8 mx-auto lg:mx-0">
              Wadah pergerakan, pengkaderan, dan intelektual pelajar Nahdlatul Ulama yang toleran dan berwawasan kebangsaan.
            </p>
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

          {/* Kanan: Floating UI Elements Tanpa Kotak Pembatas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:flex relative h-full w-full items-center justify-center min-h-[450px]"
          >
             {/* Center Logo Hub */}
             <div className="relative w-40 h-40 xl:w-48 xl:h-48 bg-white shadow-2xl rounded-full flex items-center justify-center border border-white/50 transform hover:scale-105 transition-all duration-700 ease-out z-10 group">
                <div className="absolute -inset-8 border border-primary/20 rounded-full opacity-50 group-hover:animate-[spin_12s_linear_infinite]" />
                <div className="absolute -inset-16 border border-primary/10 rounded-full opacity-30 group-hover:animate-[spin_18s_linear_infinite_reverse]" />
                <span className="text-7xl xl:text-8xl font-black text-primary tracking-tighter">IP</span>
             </div>
             
             {/* Floating Badges */}
             <div className="absolute bottom-12 left-0 xl:-left-12 bg-white/70 backdrop-blur-xl px-6 py-3.5 rounded-2xl border border-white/40 shadow-xl transform hover:-translate-y-1 transition-transform duration-300 z-20">
                <p className="text-sm font-bold text-foreground">Ahlussunnah wal Jama'ah</p>
                <p className="text-xs text-muted-foreground font-medium">Nilai Dasar Pergerakan</p>
             </div>
             
             <div className="absolute top-12 right-0 xl:-right-4 bg-primary text-white px-5 py-2.5 rounded-xl shadow-xl transform hover:-translate-y-1 transition-transform duration-300 rotate-3 z-20">
                <p className="text-xs font-bold uppercase tracking-widest">Kolaborasi Pelajar</p>
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
        <div className="flex flex-col md:flex-row items-start gap-12 lg:gap-16">
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
            className="w-full md:w-1/2 mt-8 md:mt-0"
          >
            <p className="text-sm font-bold text-primary mb-3">Sejak 1954</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Mencetak Generasi<br /><span className="italic">Pelajar Kritis &amp; Agamis</span>
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
  createdAt: Date | string;
}

export function KabarTerbaru({ berita }: { berita: BeritaItem[] }) {
  if (berita.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background">
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
              <Link href={`/berita/${item.slug}`} className="group block h-full bg-white border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-muted">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-muted-foreground font-semibold text-sm">IPNU</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold mb-3 group-hover:text-primary transition-colors leading-snug text-foreground line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
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

  // Ambil maks 4 foto
  const display = photos.slice(0, 4);

  return (
    <section className="py-12 md:py-16 bg-background">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {display.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer aspect-video"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex flex-col justify-end p-3 md:p-5">
                <h4 className="text-white font-semibold text-xs md:text-sm leading-tight line-clamp-2">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
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
