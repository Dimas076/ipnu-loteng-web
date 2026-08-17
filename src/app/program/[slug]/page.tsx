"use client";

import { useParams, notFound } from "next/navigation";
import { MainLayout } from "@/components/layouts/MainLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight,
  Target, 
  Shield, 
  TrendingUp, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star, 
  PenTool, 
  PhoneCall, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  Briefcase, 
  MonitorPlay, 
  Newspaper, 
  Music,
  Sparkles
} from "lucide-react";
import Link from "next/link";

// ─── ICON MAP ─────────────────────────────────────────────────────────────
const iconMap: Record<string, any> = {
  Target, Shield, TrendingUp, Users, 
  BookOpen, MessageSquare, Star, PenTool, 
  PhoneCall, GraduationCap, HeartHandshake, FileText, 
  Briefcase, MonitorPlay, Newspaper, Music
};

// ─── DUMMY DATA (Aesthetic & Professional) ──────────────────────────────────
const programData: Record<string, any> = {
  kaderisasi: {
    title: "Kaderisasi",
    highlight: "Pelajar.",
    eyebrow: "PILAR PERGERAKAN",
    description: "Program unggulan yang berfokus pada pembentukan karakter, mental, dan kapasitas kepemimpinan pelajar. Kami mencetak kader yang tangguh, toleran, dan siap menghadapi tantangan zaman.",
    features: [
      { title: "Masa Kesetiaan Anggota", desc: "Gerbang awal pengenalan nilai dasar pergerakan, ke-NU-an, dan aswaja.", icon: "Target" },
      { title: "Latihan Kader Muda", desc: "Penggemblengan mental kepemimpinan dan manajemen organisasi tingkat menengah.", icon: "Shield" },
      { title: "Upgrading Pengurus", desc: "Pelatihan khusus untuk meningkatkan skill manajerial pengurus cabang.", icon: "TrendingUp" },
      { title: "Kaderisasi Non-Formal", desc: "Pendidikan berkelanjutan melalui mentoring dan pendampingan minat bakat.", icon: "Users" }
    ]
  },
  kajian: {
    title: "Kajian",
    highlight: "Keislaman.",
    eyebrow: "MERAWAT TRADISI",
    description: "Memperdalam pemahaman Islam Ahlussunnah wal Jama'ah melalui forum diskusi rutin, ngaji bareng, dan bedah kitab. Memastikan setiap kader memiliki landasan spiritual yang kokoh.",
    features: [
      { title: "Kajian Rutin Selapanan", desc: "Forum silaturahmi dan ngaji kitab kuning bersama ulama lokal secara bergilir.", icon: "BookOpen" },
      { title: "Diskusi Intelektual", desc: "Membedah isu-isu kontemporer dari sudut pandang aswaja dan kebangsaan.", icon: "MessageSquare" },
      { title: "Peringatan Hari Besar", desc: "Menyelenggarakan kegiatan keagamaan untuk merawat syiar Islam di kalangan pelajar.", icon: "Star" },
      { title: "Ngaji Jurnalistik", desc: "Menggabungkan literasi digital dengan pemahaman agama yang moderat dan kritis.", icon: "PenTool" }
    ]
  },
  advokasi: {
    title: "Advokasi",
    highlight: "Pelajar.",
    eyebrow: "MENDAMPINGI & MELINDUNGI",
    description: "Hadir sebagai pendamping dan pelindung hak-hak pelajar di lingkungan sekolah maupun masyarakat. Mengadvokasi kebijakan yang berpihak pada kemajuan dunia pendidikan.",
    features: [
      { title: "Posko Pengaduan", desc: "Menerima dan menindaklanjuti laporan terkait masalah pendidikan dan pelajar.", icon: "PhoneCall" },
      { title: "Pendampingan Beasiswa", desc: "Membantu pelajar kurang mampu untuk mengakses bantuan pendidikan pemerintah.", icon: "GraduationCap" },
      { title: "Sosialisasi Anti-Bullying", desc: "Kampanye masif ke sekolah-sekolah untuk menciptakan ruang aman bagi siswa.", icon: "HeartHandshake" },
      { title: "Kajian Kebijakan", desc: "Merespons dan mengkritisi kebijakan pemerintah daerah di sektor pendidikan.", icon: "FileText" }
    ]
  },
  pengembangan: {
    title: "Skill &",
    highlight: "Pengembangan.",
    eyebrow: "MENGHADAPI ZAMAN",
    description: "Wadah pelatihan skill digital, wirausaha, dan kesenian pelajar. Kami mempersiapkan kader IPNU agar tidak hanya kuat secara agama, tetapi juga unggul secara profesional.",
    features: [
      { title: "Student Preneur", desc: "Pelatihan kewirausahaan dan inkubasi bisnis kecil bagi pelajar Nahdlatul Ulama.", icon: "Briefcase" },
      { title: "Kelas Desain & Media", desc: "Workshop intensif desain grafis, videografi, dan manajemen media sosial.", icon: "MonitorPlay" },
      { title: "Lembaga Pers Pelajar", desc: "Wadah berekspresi melalui tulisan, pelatihan jurnalistik, dan karya sastra.", icon: "Newspaper" },
      { title: "Pentas Kesenian", desc: "Mengembangkan minat bakat di bidang hadroh, akustik, dan seni islami lainnya.", icon: "Music" }
    ]
  }
};

export default function ProgramPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  if (!slug) return null;

  const data = programData[slug];
  
  if (!data) {
    notFound();
  }

  return (
    <MainLayout>
      {/* ─── HERO SECTION (Asymmetrical, Ambient) ─── */}
      <div className="bg-background relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-border/40">
        {/* Glow */}
        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05] mb-6">
                {data.title} <br className="hidden md:block" />
                <span className="text-primary italic">{data.highlight}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[50ch] font-medium">
                {data.description}
              </p>
            </motion.div>
            
            {/* Right: Abstract Graphic / Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:flex relative h-full w-full min-h-[400px] items-center justify-center"
            >
              <div className="relative w-full aspect-square max-w-[400px] bg-card rounded-xl border border-border/50 shadow-xl overflow-hidden group flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-primary/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Star className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Bergerak Riang</h3>
                  <p className="text-muted-foreground font-medium">Melangkah bersama membangun peradaban pelajar.</p>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-md border border-border shadow-lg z-20 flex items-center justify-center">
                <p className="text-sm font-bold text-primary uppercase tracking-widest">{data.eyebrow}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* ─── FEATURES SECTION (Bento Grid) ─── */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">
              Fokus Utama <span className="text-primary italic">Program.</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Empat elemen kunci yang menjadi prioritas dalam pelaksanaan program {data.title} {data.highlight}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feat: any, idx: number) => {
              const Icon = iconMap[feat.icon] || Star;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card p-8 rounded-md border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 group flex gap-6 items-start"
                >
                  <div className="w-14 h-14 shrink-0 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary transition-colors duration-300 ease-[cubic-bezier(0.2,0,0,1)]">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">{feat.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* ─── BOTTOM CTA BANNER ─── */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-primary rounded-2xl p-10 md:p-16 text-center relative overflow-hidden border border-primary-container shadow-2xl">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                Kenali Lebih Dekat <br />IPNU Lombok Tengah.
              </h2>
              <p className="text-white/80 text-lg md:text-xl font-medium mb-10">
                Jelajahi potret aksi nyata kami dan pelajari lebih lanjut tentang perjalanan organisasi pelajar NU.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" className="font-bold bg-white text-primary hover:bg-white/90 rounded-md h-12 px-8 shadow-lg" asChild>
                  <Link href="/galeri">Lihat Galeri Kegiatan</Link>
                </Button>
                <Button size="lg" className="font-bold text-white bg-transparent border border-white/40 hover:bg-white/10 hover:border-white rounded-md h-12 px-8" asChild>
                  <Link href="/sejarah">Sejarah Organisasi</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
