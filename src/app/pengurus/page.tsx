import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Susunan Pengurus | IPNU Lombok Tengah",
  description: "Susunan Pengurus Cabang (PC) Ikatan Pelajar Nahdlatul Ulama (IPNU) Kabupaten Lombok Tengah.",
};

export const revalidate = 60;

export default async function PengurusPage() {
  const pengurusList = await prisma.pengurus.findMany({ orderBy: { order: 'asc' } });
  
  const pilars = [
    {
      id: 1,
      title: "Bergerak Riang Gembira",
      description: "Menjalankan roda organisasi dengan penuh semangat, keikhlasan, dan kegembiraan, guna menciptakan iklim pergerakan yang positif bagi seluruh kader."
    },
    {
      id: 2,
      title: "Rekonsiliasi, Harmoni, Solid dan Loyal",
      description: "Menyatukan seluruh elemen pelajar NU dalam harmoni kebersamaan, membangun kesolidan, serta memupuk loyalitas tanpa batas kepada organisasi."
    },
    {
      id: 3,
      title: "Revitalisasi Organisasi Optimalisasi Kaderisasi",
      description: "Menghidupkan kembali struktur kepengurusan hingga tingkat ranting dan mengoptimalkan sistem pengkaderan yang berkelanjutan dan terukur."
    }
  ];
  const ketua = pengurusList.filter(p => p.tier === 1);
  const wakilKetua = pengurusList.filter(p => p.tier === 2);
  const sekBen = pengurusList.filter(p => p.tier === 3);

  const divisiKeys = Array.from(new Set(sekBen.map(s => s.divisi || "Pengurus Harian")));
  const groupedSekBen = sekBen.reduce((acc, curr) => {
    const divisi = curr.divisi || "Pengurus Harian";
    if (!acc[divisi]) acc[divisi] = [];
    acc[divisi].push(curr);
    return acc;
  }, {} as Record<string, typeof sekBen>);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 lg:px-8 py-16 md:py-24 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Susunan <span className="text-primary">Pengurus</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Jajaran Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama (IPNU) Kabupaten Lombok Tengah Masa Khidmat 2026-2028.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Tier 1: Ketua */}
          {ketua.length > 0 && (
            <div className="flex justify-center flex-wrap gap-8">
              {ketua.map(k => (
                <div key={k.id} className="w-full max-w-xs">
                  <Card className="text-center border-border/60 hover:border-primary/30 transition-all duration-300 group rounded-lg shadow-sm hover:shadow-md">
                    <CardContent className="pt-8 pb-6 px-6">
                      {k.foto ? (
                        <div className="w-40 h-40 rounded-full mx-auto mb-5 overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={k.foto} alt={k.nama} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-40 h-40 bg-primary/5 rounded-full mx-auto mb-5 border-4 border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                          <span className="text-4xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                            {k.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-xl text-foreground mb-2">{k.nama}</h3>
                      <Badge className="bg-primary/10 hover:bg-primary/20 border-none font-semibold text-primary px-4 py-1">{k.jabatan}</Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* Tier 2: Wakil Ketua */}
          {wakilKetua.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wakilKetua.map(w => (
                <Card key={w.id} className="text-center border-border/50 hover:border-primary/30 transition-all duration-300 group shadow-sm hover:shadow-md">
                  <CardContent className="pt-8 pb-6 px-6">
                    {w.foto ? (
                      <div className="w-32 h-32 rounded-full mx-auto mb-5 overflow-hidden border-4 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={w.foto} alt={w.nama} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-primary/5 rounded-full mx-auto mb-5 border-4 border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                        <span className="text-3xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                          {w.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-foreground mb-1">{w.nama}</h3>
                    <p className="text-sm font-semibold text-primary">{w.jabatan}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Tier 3: Sekretaris & Bendahara dkk (Grouped by Divisi) */}
          {sekBen.length > 0 && (
            <div className="space-y-12">
              {divisiKeys.map(divisi => (
                <div key={divisi} className="space-y-6">
                  {divisi !== "Pengurus Harian" && (
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold tracking-tight inline-block relative">
                        {divisi}
                        <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary/20 rounded-full"></div>
                      </h3>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {groupedSekBen[divisi].map(s => (
                      <Card key={s.id} className="text-center border-border/40 hover:border-primary/30 transition-all duration-300 group shadow-sm">
                        <CardContent className="pt-6 pb-5 px-4">
                          {s.foto ? (
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-300">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={s.foto} alt={s.nama} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-primary/5 rounded-full mx-auto mb-4 border-2 border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                              <span className="text-2xl font-bold text-primary/80 group-hover:text-primary transition-colors tracking-widest">
                                {s.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <h3 className="font-bold text-base text-foreground mb-1 line-clamp-2 min-h-[40px] flex items-center justify-center">{s.nama}</h3>
                          <p className="text-xs font-medium text-muted-foreground">{s.jabatan}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {pengurusList.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada data pengurus yang ditambahkan.
            </div>
          )}

        </div>

        {/* Visi Misi */}
        <section className="mt-24 pt-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Visi & <span className="font-semibold text-primary">Misi</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tujuan dan langkah-langkah strategis Ikatan Pelajar Nahdlatul Ulama dalam mewujudkan generasi penerus yang berkualitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Visi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Terbentuknya pelajar bangsa yang bertaqwa kepada Allah SWT, berilmu, berakhlak mulia dan berwawasan kebangsaan serta bertanggungjawab atas tegak dan terlaksananya syari&apos;at Islam menurut faham Ahlussunnah wal Jama&apos;ah.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 text-foreground">Misi</h3>
              <ul className="text-muted-foreground leading-relaxed space-y-3 list-disc pl-5">
                <li>Menghimpun dan membina pelajar Nahdlatul Ulama dalam satu wadah organisasi.</li>
                <li>Mempersiapkan kader-kader intelektual sebagai penerus perjuangan bangsa.</li>
                <li>Mengusahakan tercapainya tujuan organisasi dengan menyusun landasan program perjuangan sesuai dengan perkembangan masyarakat.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Arah Gerak */}
        <section className="mt-24 pt-16 border-t border-border">
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

      </div>
    </MainLayout>
  );
}
