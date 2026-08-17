"use client";

import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { GallerySlideshow } from "@/components/ui/GallerySlideshow";

interface GaleriPhoto {
  id: number;
  title: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function GaleriPage() {
  const [photos, setPhotos] = useState<GaleriPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/galeri", { cache: "no-store" });
      const data = await res.json();
      if (data.status === "success") {
        setPhotos(data.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat galeri:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Bangun daftar kategori dinamis dari data DB
  const uniqueCategories = Array.from(new Set(photos.map((p) => p.category)));
  const categories = ["Semua", ...uniqueCategories];

  const filtered =
    activeCategory === "Semua"
      ? photos
      : photos.filter((item) => item.category === activeCategory);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="bg-background py-6 md:py-8 border-b border-border">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              Galeri <span className="text-primary">Kegiatan</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Dokumentasi visual perjalanan dan aktivitas organisasi PC IPNU Lombok Tengah.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Empty State — belum ada foto sama sekali */}
        {!loading && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Galeri Belum Tersedia</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              Dokumentasi kegiatan akan segera ditampilkan di sini. Silakan kunjungi kembali nanti.
            </p>
          </div>
        )}

        {/* Ada foto */}
        {!loading && photos.length > 0 && (
          <>
            {/* Filter Pills */}
            <div className="flex overflow-x-auto gap-2 mb-10 pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold border transition-colors duration-200",
                    activeCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filtered.map((item) => {
                  const images = item.image.split(',');
                  return (
                    <div
                      key={item.id}
                      className="aspect-video"
                    >
                      <GallerySlideshow
                        images={images}
                        title={item.title}
                        category={item.category}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-muted-foreground font-medium text-base">Belum ada foto untuk kategori ini.</p>
                <button
                  onClick={() => setActiveCategory("Semua")}
                  className="mt-4 text-sm text-primary font-semibold hover:underline"
                >
                  Tampilkan semua foto
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </MainLayout>
  );
}
