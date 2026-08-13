import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Profil | IPNU Lombok Tengah",
  description: "Sejarah, Visi Misi, dan Struktur Organisasi PC IPNU Lombok Tengah.",
};

export default async function ProfilPage() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });
  const pilars = await prisma.pilar.findMany({ orderBy: { order: 'asc' } });
  const pengurusList = await prisma.pengurus.findMany({ orderBy: { order: 'asc' } });

  const ketua = pengurusList.filter(p => p.tier === 1);
  const wakilKetua = pengurusList.filter(p => p.tier === 2);
  const sekBen = pengurusList.filter(p => p.tier === 3);
  return (
    <MainLayout>
      {/* HERO SECTION */}
      <div className="bg-background relative overflow-hidden py-16 md:py-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Profil <span className="text-primary italic">Organisasi.</span>
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
              <Badge variant="outline" className="border-primary/30 bg-primary/5 mb-4 text-primary">Lahirnya Organisasi</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Jejak Langkah <span className="text-primary font-semibold">Pelajar NU</span>
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

        {/* Arah Gerak / Visi Misi */}
        <section className="py-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Arah Gerak <span className="font-semibold">Organisasi</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tiga pilar utama yang menjadi landasan pergerakan Pimpinan Cabang IPNU Kabupaten Lombok Tengah Masa Khidmat 2026-2028.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border rounded-lg overflow-hidden">
            {pilars.length > 0 ? (
              pilars.map((pilar, index) => (
                <div key={pilar.id} className={`bg-white rounded-lg p-8 ${index !== pilars.length - 1 ? 'border-b md:border-b-0 md:border-r' : 'border-none'} border-border hover:bg-muted/30 transition-all duration-300 text-center group`}>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6 transition-transform duration-300 text-on-primary">
                    <span className="text-2xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{pilar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pilar.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-muted-foreground">Belum ada pilar arah gerak.</div>
            )}
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="py-8 pb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Struktur <span className="font-semibold">Organisasi</span></h2>
            <p className="text-muted-foreground text-lg">Pimpinan Cabang IPNU Lombok Tengah Masa Khidmat 2026-2028</p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Tier 1: Ketua */}
            {ketua.length > 0 && (
              <div className="flex justify-center flex-wrap gap-8">
                {ketua.map(k => (
                  <div key={k.id} className="w-full max-w-xs">
                    <Card className="text-center border-border/60 hover:border-primary/30 transition-all duration-300 group rounded-lg">
                      <CardContent className="pt-8 pb-6 px-6">
                        {k.foto ? (
                          <div className="w-32 h-32 rounded-lg mx-auto mb-5 overflow-hidden border border-primary/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-primary/5 rounded-lg mx-auto mb-5 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300">
                            <span className="text-3xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                              {k.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <h3 className="font-bold text-xl text-foreground mb-1">{k.nama}</h3>
                        <Badge className="bg-primary/10 hover:bg-primary/20 border-none font-semibold text-primary">{k.jabatan}</Badge>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Tier 2: Wakil Ketua */}
            {wakilKetua.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {wakilKetua.map(w => (
                  <Card key={w.id} className="text-center border-border/50 hover:border-primary/30 transition-all duration-300 group">
                    <CardContent className="pt-8 pb-6 px-6">
                      {w.foto ? (
                        <div className="w-24 h-24 rounded-lg mx-auto mb-5 overflow-hidden border border-primary/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={w.foto} alt={w.nama} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-primary/5 rounded-lg mx-auto mb-5 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300 text-on-primary">
                          <span className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                            {w.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-lg text-foreground mb-1">{w.nama}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{w.jabatan}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tier 3: Sekretaris & Bendahara dkk */}
            {sekBen.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sekBen.map(s => (
                  <Card key={s.id} className="text-center border-border/40 hover:border-primary/30 transition-all duration-300 group">
                    <CardContent className="pt-6 pb-5 px-4">
                      {s.foto ? (
                        <div className="w-24 h-24 rounded-lg mx-auto mb-5 overflow-hidden border border-primary/20">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.foto} alt={s.nama} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-primary/5 rounded-lg mx-auto mb-5 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all duration-300 text-on-primary">
                          <span className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                            {s.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-base text-foreground mb-1 line-clamp-1">{s.nama}</h3>
                      <p className="text-xs font-medium text-muted-foreground">{s.jabatan}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

          </div>
        </section>
      </div>
    </MainLayout>
  );
}
