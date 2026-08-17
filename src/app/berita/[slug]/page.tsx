import { MainLayout } from "@/components/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Image as ImageIcon, TrendingUp, Tag, Newspaper, BadgeCheck } from "lucide-react";
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
    take: 5
  });

  // Format Tanggal
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* KONTEN UTAMA (Kiri) */}
          <div className="lg:col-span-8">
            
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-muted-foreground mb-4 md:mb-6 font-semibold">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/berita" className="hover:text-primary transition-colors">Berita</Link>
              <span className="mx-2">/</span>
              <span className="text-primary">{berita.category || "Umum"}</span>
            </nav>

            {/* Artikel Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-[#0F172A] leading-[1.25] mb-5">
            {berita.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 mb-2">
            <div className="flex flex-col">
              <div className="flex items-center text-primary font-bold text-[15px] mb-1">
                <span className="text-muted-foreground font-normal mr-1.5">Oleh</span> 
                {berita.authorName || "Tim Redaksi IPNU"}
                <BadgeCheck className="w-[18px] h-[18px] ml-1.5 text-white fill-blue-500" />
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(berita.createdAt)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ShareButton title={berita.title} />
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {berita.image ? (
          <div className="aspect-[16/9] bg-muted rounded-lg mb-8 overflow-hidden relative border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={berita.image} alt={berita.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg mb-8 flex items-center justify-center border border-border">
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
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                        <span>{formatDate(item.createdAt)}</span>
                        {item.authorName && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="line-clamp-1">{item.authorName}</span>
                          </>
                        )}
                      </div>
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



        </div>
      </div>
      
      </div>
      </div>
    </MainLayout>
  );
}
