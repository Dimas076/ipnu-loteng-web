import { MainLayout } from "@/components/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Image as ImageIcon, TrendingUp, Tag, Newspaper } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/ui/ShareButton";

export const revalidate = 60; // ISR 60 seconds

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Ambil detail berita
  const berita = await prisma.berita.findUnique({
    where: { slug }
  });

  if (!berita || berita.status !== "published") {
    notFound();
  }

  // Ambil berita terbaru untuk "Berita Populer/Terbaru"
  const beritaTerbaru = await prisma.berita.findMany({
    where: { 
      status: "published",
      id: { not: berita.id } // Kecualikan berita yang sedang dibaca
    },
    orderBy: { createdAt: 'desc' },
    take: 4
  });

  // Format Tanggal
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KONTEN UTAMA (Kiri) */}
          <div className="lg:col-span-8">
            <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-primary" asChild>
              <Link href="/berita">
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Indeks Berita
              </Link>
            </Button>

            {/* Artikel Header */}
        <header className="mb-10">
          <Badge className="mb-4">{berita.category || "Umum"}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight mb-6">
            {berita.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Oleh <span className="font-medium text-foreground">Tim Redaksi</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(berita.createdAt)}</span>
            </div>
            <div className="ml-auto">
              <ShareButton title={berita.title} />
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {berita.image ? (
          <div className="aspect-[21/9] bg-muted rounded-lg mb-10 overflow-hidden relative border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={berita.image} alt={berita.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[21/9] bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg mb-10 flex items-center justify-center border border-border">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}

        {/* Content */}
        <article 
          className="prose prose-lg prose-slate max-w-none font-medium text-slate-800 leading-relaxed prose-a:text-primary hover:prose-a:text-primary/80 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: berita.content }}
        />
        
        {/* Footer Artikel (Tags) */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-muted-foreground" /> Kategori Terkait</h3>
          <div className="flex flex-wrap gap-2">
            <Link href={`/berita?kategori=${encodeURIComponent(berita.category || "Umum")}`}>
              <Badge variant="outline" className="rounded-lg px-4 py-1 hover:bg-slate-100 cursor-pointer">
                {berita.category || "Umum"}
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      {/* SIDEBAR (Kanan) */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 space-y-10">
          
          {/* Widget 1: Berita Populer/Terbaru */}
          <div className="bg-slate-50 rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" /> Berita Terbaru
            </h3>
            
            {beritaTerbaru.length > 0 ? (
              <div className="space-y-6">
                {beritaTerbaru.map((item) => (
                  <Link href={`/berita/${item.slug}`} key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-20 rounded-lg bg-muted shrink-0 overflow-hidden relative border border-border">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover " />
                      ) : (
                        <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground/30 transition-transform" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">{item.category || "Umum"}</span>
                      <h4 className="text-sm font-bold leading-snug hover:text-primary hover:underline underline-offset-2 transition-all line-clamp-2 mb-1 text-foreground">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-muted-foreground">{formatDate(item.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Belum ada berita lainnya.
              </div>
            )}
          </div>

          {/* Widget 2: Banner / Info CTA */}
          <div className="bg-primary text-white rounded-lg p-8 text-center relative overflow-hidden border border-border">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl -translate-y-10 translate-x-10"></div>
             
             <h3 className="text-xl font-bold mb-2">Grup WhatsApp IPNU Loteng</h3>
             <p className="text-primary-foreground/80 text-sm mb-6">Bergabunglah dengan channel WhatsApp kami untuk mendapatkan informasi terkini secara langsung.</p>
             <Button className="w-full rounded-lg font-bold relative z-10 transition-transform h-12 bg-[#25D366] text-white hover:bg-[#20bd5a]" asChild>
               <a href="https://whatsapp.com/channel/0029Vauxr2e6WaKevYRY1m3b" target="_blank" rel="noopener noreferrer">Gabung Channel WA</a>
             </Button>
          </div>

        </div>
      </div>
      
      </div>
      </div>
    </MainLayout>
  );
}
