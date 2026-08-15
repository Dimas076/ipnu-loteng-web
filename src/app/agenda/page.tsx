"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Calendar as CalendarIcon, MapPin, Users, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function AgendaPage() {
  const router = useRouter();
  const [agendas, setAgendas] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const calendarDays = [];
  
  for (let i = 0; i < firstDay; i++) {
    const d = daysInPrevMonth - firstDay + i + 1;
    calendarDays.push({
      day: d, month: month - 1, year: month === 0 ? year - 1 : year, isPrev: true, isNext: false,
      date: new Date(month === 0 ? year - 1 : year, month - 1, d)
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i, month, year, isPrev: false, isNext: false,
      date: new Date(year, month, i)
    });
  }
  
  const remainingSlots = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({
      day: i, month: month + 1, year: month === 11 ? year + 1 : year, isPrev: false, isNext: true,
      date: new Date(month === 11 ? year + 1 : year, month + 1, i)
    });
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const daysWithEvents = calendarDays.map(calDay => {
    const eventsOnDay = agendas.filter(agenda => agenda.date && isSameDay(calDay.date, new Date(agenda.date)));
    const hasEvent = eventsOnDay.length > 0;
    const isToday = isSameDay(calDay.date, new Date());
    const isSelected = selectedDate ? isSameDay(calDay.date, selectedDate) : isToday;
    return { ...calDay, hasEvent, isActive: isSelected, isToday };
  });

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaRes, galleryRes] = await Promise.all([
          axios.get("/api/agenda"),
          axios.get("/api/galeri?limit=3")
        ]);
        setAgendas(agendaRes.data.data);
        setGalleries(galleryRes.data.data);
      } catch (error) {
        console.error("Gagal memuat data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    "Semua", 
    ...Array.from(new Set(agendas.map(a => a.category).filter(c => c && c.toLowerCase() !== 'semua')))
  ];

  const filteredAgendas = agendas.filter(agenda => {
    if (activeCategory === "Semua") return true;
    return (agenda.category || "Semua") === activeCategory;
  });

  const featuredEvent = filteredAgendas.length > 0 ? filteredAgendas[0] : null;
  const regularEvents = filteredAgendas.length > 1 ? filteredAgendas.slice(1) : [];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Rapat': return { bg: '#e3f2fd', text: '#1565c0' };
      case 'Pelatihan': return { bg: '#ffcc80', text: '#e65100' };
      case 'Kaderisasi': return { bg: '#e8f5e9', text: '#2e7d32' };
      case 'Sosial': return { bg: '#fce4ec', text: '#c2185b' };
      default: return { bg: '#f5f5f5', text: '#616161' };
    }
  };

  return (
    <MainLayout>
      {/* HERO SECTION */}
      <div className="bg-background relative overflow-hidden py-16 md:py-24">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Agenda <span className="text-primary italic">Kegiatan.</span>
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-medium line-clamp-2">
            Mari bertumbuh dan bergerak riang gembira bersama. Temukan berbagai ruang kolaborasi, mulai dari pelatihan hingga diskusi pelajar.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT LAYOUT */}
      <div className="bg-surface-container-lowest">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            
            {/* LEFT COLUMN (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              
              {/* Upcoming Events Section */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface">Kegiatan Mendatang</h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-20">
                    <span className="animate-spin border-4 border-primary/20 border-t-primary rounded-full h-12 w-12"></span>
                  </div>
                ) : agendas.length === 0 ? (
                  <div className="text-center py-20 bg-surface-container rounded-xl border border-outline-variant">
                    <CalendarIcon className="h-16 w-16 text-on-surface-variant/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-on-surface">Belum ada agenda</h3>
                    <p className="text-on-surface-variant mt-2">Belum ada agenda kegiatan yang dijadwalkan dalam waktu dekat.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    
                    {/* Featured Event Card */}
                    {featuredEvent && (
                      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-5/12 relative min-h-64 bg-surface-variant">
                          <img 
                            src={featuredEvent.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"} 
                            alt={featuredEvent.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          {/* Date Badge over image */}
                          <div className="absolute top-4 left-4 text-white rounded-lg px-2 py-1 flex flex-col items-center justify-center shadow-md min-w-12 border border-white/10 bg-primary">
                            <span className="text-xs font-bold uppercase tracking-widest leading-none mb-1">
                              {new Date(featuredEvent.date).toLocaleDateString('id-ID', { month: 'short' }).replace('.', '')}
                            </span>
                            <span className="text-xl font-black leading-none">
                              {new Date(featuredEvent.date).getDate()}
                            </span>
                          </div>
                        </div>
                        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{ backgroundColor: getCategoryColor(featuredEvent.category || 'Semua').bg, color: getCategoryColor(featuredEvent.category || 'Semua').text }}>
                              {featuredEvent.category || 'Semua'}
                            </span>
                            <div className="flex items-center text-xs font-semibold text-on-surface-variant">
                              <Clock className="w-4 h-4 mr-1 text-outline" />
                              08:00 - 16:00 WITA
                            </div>
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-on-surface mb-3 line-clamp-2 leading-tight">
                            {featuredEvent.title}
                          </h3>
                          <p className="text-on-surface-variant text-sm mb-5 line-clamp-2 leading-relaxed">
                            {featuredEvent.description || "Masa Kesetiaan Anggota. Gerbang awal kaderisasi untuk membentuk anggota yang militan dan berwawasan kebangsaan."}
                          </p>
                          <div className="flex items-start text-sm font-medium text-on-surface-variant mb-6 mt-auto">
                            <MapPin className="w-4 h-4 mr-2 text-outline shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{featuredEvent.location || "Gedung NU Center, Lombok Tengah"}</span>
                          </div>
                          <div className="flex flex-row gap-3">
                            <Link href={`/agenda/${featuredEvent.id}/daftar`} className="flex-1">
                              <Button className="w-full text-white font-semibold rounded-md h-10 border-0 bg-primary hover:bg-primary/90">
                                Daftar Sekarang
                              </Button>
                            </Link>
                            <Link href={`/agenda/${featuredEvent.id}`} className="flex-1">
                              <Button variant="outline" className="w-full border-outline-variant text-on-surface font-semibold rounded-md h-10">
                                Detail
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regular Event Cards Grid */}
                    {regularEvents.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {regularEvents.map((agenda, index) => (
                          <div key={agenda.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 flex flex-col">
                            
                            <div className="flex items-start justify-between mb-5">
                              {/* Gray Date Badge */}
                              <div className="bg-surface-variant text-on-surface rounded-lg px-2 py-1.5 flex flex-col items-center justify-center min-w-12">
                                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant leading-none mb-1">
                                  {new Date(agenda.date).toLocaleDateString('id-ID', { month: 'short' }).replace('.', '')}
                                </span>
                                <span className="text-xl font-bold leading-none text-primary">
                                  {new Date(agenda.date).getDate()}
                                </span>
                              </div>
                              
                              {/* Category Pill */}
                              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide" style={{
                                backgroundColor: getCategoryColor(agenda.category || 'Semua').bg,
                                color: getCategoryColor(agenda.category || 'Semua').text
                              }}>
                                {agenda.category || 'Semua'}
                              </span>
                            </div>

                            <h3 className="text-base md:text-lg font-bold text-on-surface mb-5 line-clamp-2 leading-snug">
                              {agenda.title}
                            </h3>
                            
                            <div className="mt-auto space-y-2 mb-6">
                              <div className="flex items-center text-on-surface-variant text-xs md:text-sm">
                                <Clock className="w-4 h-4 mr-2 text-outline shrink-0" />
                                13:00 - Selesai
                              </div>
                              <div className="flex items-start text-on-surface-variant text-xs md:text-sm">
                                <MapPin className="w-4 h-4 mr-2 text-outline shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{agenda.location || "Aula PCNU"}</span>
                              </div>
                            </div>
                            
                            <Link href={`/agenda/${agenda.id}`} className="block w-full">
                              <Button variant="outline" className="w-full h-10 rounded-md text-sm font-semibold border-outline-variant text-on-surface hover:bg-surface-container">
                                Detail Agenda
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </section>

              {/* Documentation Section */}
              {galleries.length > 0 && (
                <section className="pt-8 mb-12">
                  <div className="flex items-center justify-between mb-6 gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-on-surface-variant shrink-0" />
                      <h2 className="text-lg sm:text-xl font-bold text-on-surface leading-tight">Dokumentasi Kegiatan</h2>
                    </div>
                    <Link href="/galeri" className="font-bold text-xs hover:underline uppercase tracking-wide text-primary shrink-0">
                      Lihat Semua
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {galleries.slice(0, 3).map(doc => (
                      <div key={doc.id} className="flex flex-col gap-2">
                        <div className="relative aspect-video overflow-hidden bg-surface-variant rounded-lg">
                          <img 
                            src={doc.image} 
                            alt={doc.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" 
                          />
                        </div>
                        <p className="text-sm font-bold text-on-surface-variant text-left line-clamp-1">{doc.title}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* RIGHT COLUMN (4 Cols) - SIDEBAR */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Calendar Widget */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-on-surface">Kalender</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={prevMonth} className="text-on-surface hover:text-primary"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-lg font-medium text-on-surface">{monthNames[month]} {year}</span>
                    <button onClick={nextMonth} className="text-on-surface hover:text-primary"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                
                <div 
                  className="grid gap-1 text-center mb-4" 
                  style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                >
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                    <div key={day} className="text-sm font-bold text-on-surface-variant py-2">{day}</div>
                  ))}
                </div>
                
                <div 
                  className="grid gap-y-2 gap-x-1 text-center"
                  style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                >
                  {daysWithEvents.map((cal, i) => (
                    <div key={i} className="aspect-square w-full flex items-center justify-center">
                      {(cal.isPrev || cal.isNext) ? (
                        <span className="text-xl text-on-surface-variant/40 font-medium">
                          {cal.day}
                        </span>
                      ) : (
                        <button 
                          onClick={() => setSelectedDate(cal.date)}
                          className={`w-full h-full max-w-[3rem] max-h-[3rem] rounded-md flex flex-col items-center justify-center text-xl transition-colors cursor-pointer ${cal.isActive ? 'bg-primary text-white shadow-sm font-bold' : 'hover:bg-surface-container text-on-surface font-normal'} ${cal.isToday && !cal.isActive ? 'border border-primary text-primary' : ''}`}
                        >
                          <span className={`${cal.hasEvent ? '-mb-1' : ''}`}>{cal.day}</span>
                          {cal.hasEvent && (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${cal.isActive ? 'bg-white' : 'bg-primary'}`}></div>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Event Details below calendar */}
                {selectedDate ? (
                  <div className="mt-6 pt-4 border-t border-outline-variant/50">
                    <p className="text-xs text-on-surface-variant font-medium mb-3 capitalize">
                      {selectedDate.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    <div className="space-y-3">
                      {agendas.filter(agenda => agenda.date && isSameDay(new Date(agenda.date), selectedDate)).length > 0 ? (
                        agendas.filter(agenda => agenda.date && isSameDay(new Date(agenda.date), selectedDate)).map(agenda => (
                          <Link href={`/agenda/${agenda.id}`} key={agenda.id} className="block pl-3 border-l-2 border-primary hover:bg-surface-container py-1.5 transition-colors rounded-r-md">
                            <p className="text-sm font-bold text-on-surface leading-tight mb-1">{agenda.title}</p>
                            <p className="text-xs text-on-surface-variant flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {agenda.time || "08:00 WITA"}
                            </p>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-on-surface-variant">Tidak ada kegiatan terjadwal.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-outline-variant/50 flex items-center gap-3 text-sm text-on-surface font-bold">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    Ada kegiatan
                  </div>
                )}
              </div>

              {/* Category Filter Widget */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                <h3 className="text-base font-bold text-on-surface mb-4">Kategori Kegiatan</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: any) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${activeCategory === cat ? 'border-primary text-primary bg-primary/5' : 'border-outline-variant text-muted-foreground hover:bg-surface-container'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>


              
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
