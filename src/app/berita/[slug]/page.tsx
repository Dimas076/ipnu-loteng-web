import { MainLayout } from "@/components/layouts/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Share2, ArrowLeft, Image as ImageIcon, TrendingUp, Tag } from "lucide-react";
import Link from "next/link";

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
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
          <Badge className="mb-4">Kegiatan</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] leading-tight mb-6">
            Pelantikan Pengurus Cabang IPNU Lombok Tengah Masa Khidmat 2026-2028
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Oleh <span className="font-medium text-foreground">Tim Redaksi</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>12 Agustus 2026</span>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Share2 className="h-3 w-3" /> Bagikan
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="aspect-[21/9] bg-muted rounded-lg mb-10 overflow-hidden flex items-center justify-center border border-border">
          <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
        </div>

        {/* Content */}
        <article className="prose prose-lg prose-slate max-w-none">
          <p className="lead text-xl text-muted-foreground mb-8">
            Bupati Lombok Tengah secara resmi menghadiri acara pelantikan pengurus PC IPNU yang baru. Acara berlangsung khidmat dan dihadiri ribuan pelajar dari seluruh penjuru kabupaten.
          </p>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p className="mb-4">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-[#0F172A]">Harapan Kepengurusan Baru</h3>
          <p className="mb-4">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic bg-primary/5 rounded-lg text-on-primary">
            "Organisasi ini adalah tempat menempa diri. Jadikanlah IPNU sebagai kawah candradimuka untuk mencetak pemimpin masa depan."
          </blockquote>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
          </p>
        </article>
        
        {/* Footer Artikel (Tags) */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-muted-foreground" /> Tag Terkait</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-lg px-4 py-1 hover:bg-slate-100 cursor-pointer">IPNU</Badge>
            <Badge variant="outline" className="rounded-lg px-4 py-1 hover:bg-slate-100 cursor-pointer">Lombok Tengah</Badge>
            <Badge variant="outline" className="rounded-lg px-4 py-1 hover:bg-slate-100 cursor-pointer">Pelantikan</Badge>
            <Badge variant="outline" className="rounded-lg px-4 py-1 hover:bg-slate-100 cursor-pointer">Organisasi</Badge>
          </div>
        </div>
      </div>

      {/* SIDEBAR (Kanan) */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 space-y-10">
          
          {/* Widget 1: Berita Populer */}
          <div className="bg-slate-50 rounded-lg p-6 border border-border">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" /> Berita Terpopuler
            </h3>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((item) => (
                <Link href={`/berita/popular-${item}`} key={item} className="flex gap-4 group">
                  <div className="w-24 h-20 rounded-lg bg-muted shrink-0 overflow-hidden relative border border-border">
                    <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground/30 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">Kaderisasi</span>
                    <h4 className="text-sm font-bold leading-snug hover:text-primary hover:underline underline-offset-2 transition-all line-clamp-2 mb-1 text-foreground">
                      Makesta Raya Zona Utara Diikuti Ratusan Peserta
                    </h4>
                    <span className="text-[11px] text-muted-foreground">5 Agustus 2026</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Widget 2: Banner / Info CTA */}
          <div className="bg-primary text-white rounded-lg p-8 text-center relative overflow-hidden border border-border">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl -translate-y-10 translate-x-10"></div>
             
             <h3 className="text-xl font-bold mb-2">Ingin mendapatkan update terbaru?</h3>
             <p className="text-primary-foreground/80 text-sm mb-6">Bergabunglah dengan channel WhatsApp kami.</p>
             <Button variant="secondary" className="w-full rounded-lg font-bold relative z-10 transition-transform h-12" asChild>
               <Link href="/auth/register">Daftar Sekarang</Link>
             </Button>
          </div>

        </div>
      </div>
      
      </div>
      </div>
    </MainLayout>
  );
}
