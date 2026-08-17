import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Sejarah | IPNU Lombok Tengah",
  description: "Sejarah, Visi Misi, dan Struktur Organisasi PC IPNU Lombok Tengah.",
};

export const revalidate = 60;

export default async function ProfilPage() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  return (
    <MainLayout>
      {/* HERO SECTION */}
      <div className="bg-background relative overflow-hidden py-16 md:py-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Sejarah <span className="text-primary italic">Organisasi.</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-medium">
            Berdiri teguh untuk mengabdi pada agama, bangsa, dan negara melalui pembinaan generasi pelajar yang berakhlakul karimah.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 space-y-24 max-w-7xl">
        {/* Sejarah */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 group">
            {profile?.sejarah_image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profile.sejarah_image} 
                  alt="Sejarah Organisasi" 
                  className="w-full h-full object-cover transition-transform duration-700"
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-slate-800 flex items-center justify-center transition-transform duration-700">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto border-4 border-white/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white/70 font-serif text-3xl font-bold">1954</span>
                  </div>
                  <p className="text-white/60 font-medium tracking-widest uppercase text-sm">Dokumentasi Sejarah</p>
                </div>
              </div>
            )}
            {/* Overlay gradasi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Sejarah Berdirinya <span className="text-primary font-semibold">IPNU</span>
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground text-[17px] leading-relaxed whitespace-pre-line">
              {profile?.sejarah_text ? (
                <p>{profile.sejarah_text}</p>
              ) : (
                <>
                  <p>
                    <strong className="text-foreground">Ikatan Pelajar Nahdlatul Ulama (IPNU)</strong> didirikan secara resmi pada tanggal <strong className="text-foreground">24 Februari 1954</strong> (20 Jumadil Akhir 1373 H) di Semarang, Jawa Tengah. Lahirnya IPNU diprakarsai pada saat pelaksanaan Konferensi Besar Lembaga Pendidikan Ma’arif NU.
                  </p>
                  <p>
                    Sebelum IPNU berdiri, telah banyak bermunculan perkumpulan pelajar berhaluan Ahlussunnah wal Jamaah yang bersifat kedaerahan, seperti <em>Tsamrotul Mustafidin</em> (Surabaya), <em>Persano</em>, dan <em>PAMNO</em> (Malang). Keinginan kuat untuk menyatukan seluruh potensi pelajar secara nasional inilah yang mendorong tokoh-tokoh pelopor seperti <strong className="text-foreground">M. Shufyan Cholil, H. Musthafa,</strong> dan <strong className="text-foreground">Prof. Dr. KH. M. Tolchah Mansoer</strong> (Ketua Umum Pertama) untuk mendirikan wadah bernama IPNU.
                  </p>
                  <p>
                    Di Kabupaten Lombok Tengah, IPNU terus mengepakkan sayapnya sebagai Badan Otonom (Banom) NU yang mengayomi dan membina ribuan pelajar, santri, serta mahasiswa putra, demi mewujudkan generasi yang berilmu, berakhlakul karimah, dan tangguh di era modern.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
