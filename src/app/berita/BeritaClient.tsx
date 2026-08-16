"use client";

import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, TrendingUp, Image as ImageIcon, Filter, Newspaper } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface BeritaItem {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  image?: string | null;
  category?: string | null;
  createdAt: string;
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric"
    });
  } catch {
    return dateStr;
  }
};

export function BeritaClient() {
  const [allNews, setAllNews] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua Berita");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Fetch berita published dari API
  const fetchBerita = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts?status=published", { cache: "no-store" });
      const data = await res.json();
      if (data.status === "success") {
        setAllNews(data.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat berita:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBerita();
  }, [fetchBerita]);

  // Ambil kategori unik dari data DB
  const uniqueCategories = Array.from(new Set(allNews.map(n => n.category || "Umum")));
  const categories = ["Semua Berita", ...uniqueCategories];

  // Filter berita
  const filteredNews = allNews.filter((n) => {
    const matchCategory = activeCategory === "Semua Berita" || n.category === activeCategory;
    const matchSearch = searchQuery === "" ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const headline = filteredNews[0];
  const remainingNews = filteredNews.slice(1);

  useEffect(() => {
    const handleScroll = () => {
      if (showMobileCategories) setShowMobileCategories(false);
      if (showMobileSearch) setShowMobileSearch(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showMobileCategories, showMobileSearch]);

  return (
    <MainLayout>
      {/* KATEGORI & PENCARIAN (Sticky) */}
      <div className="sticky top-16 z-40 bg-primary shadow-sm transition-all relative text-on-primary">
        <div className="container mx-auto px-0 md:px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-0">

            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-between py-3 px-4">
              <span className="text-white font-bold uppercase tracking-wider text-sm">{activeCategory}</span>
              <div className="flex items-center gap-3 text-white">
                <button
                  onClick={() => { setShowMobileSearch(!showMobileSearch); setShowMobileCategories(false); }}
                  className="p-1"
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  onClick={() => { setShowMobileCategories(!showMobileCategories); setShowMobileSearch(false); }}
                  className="p-1"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Desktop Category Tabs */}
            <div className="hidden md:flex overflow-x-auto hide-scrollbar w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-4 whitespace-nowrap text-center text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "text-white font-bold border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block relative group w-64 lg:w-72 shrink-0 py-2 pr-4 md:pr-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-white/10 hover:bg-white/20 focus:bg-white focus:text-foreground border border-white/20 rounded-lg focus:outline-none focus:ring-0 placeholder:text-white/70 focus:placeholder:text-muted-foreground text-sm text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Overlay */}
        {showMobileCategories && (
          <div className="fixed inset-0 z-40" onClick={() => setShowMobileCategories(false)} aria-hidden="true" />
        )}

        {/* Mobile Category Dropdown */}
        <AnimatePresence>
          {showMobileCategories && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden absolute top-full left-0 w-64 h-[calc(100vh-124px)] bg-white shadow-xl border-r border-border z-50 text-foreground overflow-y-auto"
            >
              <div className="flex flex-col py-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowMobileCategories(false); }}
                    className={`px-4 py-4 text-left text-sm border-b border-border last:border-0 transition-colors [-webkit-tap-highlight-color:transparent] ${
                      activeCategory === cat ? "bg-primary/10 text-primary font-bold border-l-4 border-l-primary" : "text-foreground/80 hover:bg-muted border-l-4 border-l-transparent"
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Search Expandable */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-primary px-4 pb-3 absolute top-full left-0 w-full z-30 shadow-md border-t border-white/20 text-on-primary"
            >
              <div className="relative w-full mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-white text-foreground rounded-lg focus:outline-none text-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium">Memuat berita...</p>
                  </div>
                )}

                {/* Empty State */}
                {!loading && filteredNews.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                      <Newspaper className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Berita</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      {searchQuery
                        ? `Tidak ada berita yang cocok dengan pencarian "${searchQuery}".`
                        : activeCategory !== "Semua Berita"
                          ? `Belum ada berita di kategori "${activeCategory}".`
                          : "Belum ada berita yang dipublikasikan. Admin dapat menambahkan berita melalui dashboard."}
                    </p>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="mt-4 text-primary text-sm font-medium hover:underline">
                        Hapus pencarian
                      </button>
                    )}
                  </div>
                )}

                {/* Berita Ada */}
                {!loading && filteredNews.length > 0 && (
                  <>
                    {/* TOP SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8 pb-8 border-b border-border/60">
                      {/* Berita Utama */}
                      {headline && (
                        <Link href={`/berita/${headline.slug}`} className="group block md:col-span-7">
                          <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden mb-4 bg-muted border border-border/50">
                            {headline.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={headline.image} alt={headline.title} className="w-full h-full object-cover " />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5">
                                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="mb-2">
                            <span className="bg-primary text-white px-2 py-1 text-xs font-bold uppercase tracking-wider">{headline.category || "Umum"}</span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground hover:text-primary transition-colors leading-tight mb-3">
                            {headline.title}
                          </h2>
                          <p className="text-sm md:text-base text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                            {headline.excerpt || ""}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <span>{formatDate(headline.createdAt)}</span>
                            {headline.authorName && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>Oleh: {headline.authorName}</span>
                              </>
                            )}
                          </div>
                        </Link>
                      )}

                      {/* Sub Utama */}
                      <div className="md:col-span-5 flex flex-col gap-6 md:gap-0 justify-between">
                        {remainingNews.slice(0, 2).map((news) => (
                          <Link href={`/berita/${news.slug}`} key={news.id} className="group block md:pb-6 md:border-b md:last:border-0 md:last:pb-0 border-border/40">
                            <div className="flex flex-row md:flex-col gap-4">
                              <div className="w-32 h-24 md:w-full md:h-auto md:aspect-[16/9] rounded-lg bg-muted shrink-0 overflow-hidden relative md:mb-3">
                                {news.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={news.image} alt={news.title} className="w-full h-full object-cover " />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                    <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/30" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="bg-primary text-white px-2 py-0.5 text-[10px] font-bold uppercase mb-2 inline-block">{news.category || "Umum"}</span>
                                <h3 className="text-base md:text-lg font-bold text-foreground hover:text-primary transition-colors leading-snug line-clamp-3 md:line-clamp-2 mb-2">
                                  {news.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                                  <span>{formatDate(news.createdAt)}</span>
                                  {news.authorName && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-border" />
                                      <span>Oleh: {news.authorName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* LIST BERITA BAWAH */}
                    <div className="flex flex-col">
                      {remainingNews.slice(2).map((news) => (
                        <Link href={`/berita/${news.slug}`} key={news.id} className="group block py-5 border-b border-border/40 last:border-0">
                          <div className="flex flex-row justify-between gap-4 md:gap-8">
                            <div className="flex flex-col justify-center flex-1">
                              <span className="bg-primary text-white px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase w-fit mb-2 md:mb-3">{news.category || "Umum"}</span>
                              <h3 className="text-base md:text-xl font-bold text-foreground hover:text-primary transition-all duration-300 leading-snug mb-2 line-clamp-3 md:line-clamp-2">
                                {news.title}
                              </h3>
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed hidden md:block mb-3">
                                {news.excerpt || ""}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground font-medium">
                                <span>{formatDate(news.createdAt)}</span>
                                {news.authorName && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>Oleh: {news.authorName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="w-28 h-28 md:w-48 md:h-32 rounded-lg bg-muted shrink-0 overflow-hidden relative border border-border/50">
                              {news.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={news.image} alt={news.title} className="w-full h-full object-cover " />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-10 hidden lg:block">
              {/* Widget: Berita Terbaru (ganti "Populer" dengan data nyata) */}
              {!loading && allNews.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground border-b pb-4">
                    <TrendingUp className="w-5 h-5 text-primary" /> Berita Terbaru
                  </h3>
                  <div className="space-y-6">
                    {allNews.slice(0, 4).map((item, index) => (
                      <Link href={`/berita/${item.slug}`} key={item.id} className="flex gap-4 group">
                        <div className="text-3xl font-bold text-slate-200 group-hover:text-primary/20 transition-colors shrink-0 w-6 text-center leading-none">
                          {index + 1}
                        </div>
                        <div className="flex-1 border-b border-border/40 pb-5 last:border-0 last:pb-0">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">
                            {item.category || "Umum"}
                          </span>
                          <h4 className="text-sm font-bold leading-snug hover:text-primary transition-colors line-clamp-2 text-foreground">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
