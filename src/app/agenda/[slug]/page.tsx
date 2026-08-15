"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Calendar, MapPin, ArrowLeft, CheckCircle2, ChevronRight, Info, CalendarClock, Clock, ExternalLink, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapViewer = dynamic(() => import("@/components/MapViewer"), { ssr: false });

export default function AgendaDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  
  const [agenda, setAgenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const res = await axios.get(`/api/agenda/${slug}`);
        setAgenda(res.data.data);
      } catch (error) {
        console.error("Gagal memuat detail agenda", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAgenda();
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="animate-spin border-4 border-primary/20 border-t-primary rounded-full h-12 w-12"></span>
        </div>
      </MainLayout>
    );
  }

  if (!agenda) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-bold text-foreground">Agenda tidak ditemukan</h2>
          <Link href="/agenda" className="mt-4 text-primary hover:underline">Kembali ke Daftar Agenda</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-20">
        
        <section className="relative w-full py-8 md:py-12 bg-surface-container-low border-b border-outline-variant">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
              
              {/* Poster (Kiri di Desktop, Atas di Mobile) */}
              <div className="w-full md:w-5/12 lg:w-4/12">
                <div className="w-full aspect-video flex items-center justify-center">
                  <img 
                    src={agenda.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop"} 
                    alt={agenda.title}
                    className="w-full h-full object-cover rounded-lg shadow-md border border-outline-variant/30"
                  />
                </div>
              </div>

              {/* Text Content (Kanan di Desktop, Bawah di Mobile) */}
              <div className="w-full md:w-7/12 lg:w-8/12 flex flex-col items-start pl-0 md:pl-4">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold mb-6 shadow-sm ${
                  agenda.status === 'open' ? 'bg-primary text-white' :
                  agenda.status === 'closed' ? 'bg-error text-white' :
                  'bg-surface-variant text-on-surface-variant'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {agenda.status === 'open' ? 'Pendaftaran Dibuka' : agenda.status === 'closed' ? 'Pendaftaran Ditutup' : 'Selesai'}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
                  {agenda.title}
                </h1>
                
                {agenda.description && (
                  <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
                    {agenda.description.substring(0, 160)}{agenda.description.length > 160 ? '...' : ''}
                  </p>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Two Column Layout Content */}
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              
              {/* Description */}
              <article className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant shadow-sm">
                <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-6 flex items-center gap-3 border-b border-outline-variant pb-3">
                  <Info className="w-6 h-6 text-primary" />
                  Tentang Kegiatan
                </h2>
                <div className="text-on-surface-variant space-y-4 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                  {agenda.description || <span className="italic text-muted-foreground">Tidak ada deskripsi untuk agenda ini.</span>}
                </div>
              </article>

            </div>

            {/* Right Column (Sidebar) */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 flex flex-col gap-8">
                {/* Event Details Card */}
                <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
                <h3 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-3">Detail Agenda</h3>
                
                <ul className="flex flex-col space-y-6 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-surface-container-low rounded-lg text-primary shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Tanggal</p>
                      <p className="font-semibold text-on-surface">{new Date(agenda.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-surface-container-low rounded-lg text-primary shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Waktu</p>
                      <p className="font-semibold text-on-surface">
                        {new Date(agenda.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} 
                        {agenda.endDate ? ` - ${new Date(agenda.endDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ' - Selesai'} WITA
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="p-2 bg-surface-container-low rounded-lg text-primary shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Lokasi</p>
                      <p className="font-semibold text-on-surface">{agenda.location}</p>
                    </div>
                  </li>
                </ul>

                <div className="pt-6 border-t border-outline-variant mt-2">
                  <Link href={`/agenda/${slug}/daftar`} className="flex items-center justify-center w-full bg-primary hover:bg-primary-container text-white font-bold h-12 rounded-lg shadow-sm text-base transition-colors">
                    Daftar Sekarang
                  </Link>
                  <p className="text-xs text-center text-on-surface-variant mt-3 font-medium">
                    Kuota terbatas. Pendaftaran ditutup pada {new Date(agenda.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

              </div>

              {/* Map Section */}
              {agenda.location && (
                <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
                  <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Peta Lokasi
                  </h3>
                  <div className="w-full relative mt-4">
                    {agenda.latitude && agenda.longitude ? (
                      <MapViewer position={[agenda.latitude, agenda.longitude]} locationName={agenda.location || 'Lokasi Kegiatan'} />
                    ) : (
                      <div className="w-full h-48 bg-surface-container rounded-lg overflow-hidden border border-outline-variant relative">
                        <iframe 
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(agenda.location || 'Lombok Tengah')}&t=m&z=15&ie=UTF8&iwloc=&output=embed`} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 w-full h-full"
                        ></iframe>
                      </div>
                    )}
                  </div>
                  <a href={agenda.map_link || `https://maps.google.com/?q=${encodeURIComponent(agenda.location)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-container mt-4 transition-colors">
                    Buka di Google Maps <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
              </div>

            </aside>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
