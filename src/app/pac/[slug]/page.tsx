"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ArrowLeft, MapPin, Users, Building, Info, FileText } from "lucide-react";

// Reuse mock data for now
const MOCK_PAC = [
  { slug: "praya", name: "PAC IPNU Praya", address: "Kec. Praya", members: 120, pk: 12, pr: 8, ketua: "Ahmad Fauzi", masaKhidmah: "2024-2026", kontak: "081234567890", deskripsi: "PAC IPNU Praya merupakan salah satu pimpinan anak cabang teraktif di Lombok Tengah dengan berbagai program kaderisasi dan sosial kemasyarakatan." },
  { slug: "praya-tengah", name: "PAC IPNU Praya Tengah", address: "Kec. Praya Tengah", members: 85, pk: 8, pr: 5, ketua: "Budi Santoso", masaKhidmah: "2023-2025", kontak: "081234567891", deskripsi: "PAC IPNU Praya Tengah berfokus pada pengembangan potensi pelajar di bidang akademik dan keagamaan." },
  // fallback for others
];

export default function PacDetailPage() {
  const { slug } = useParams();
  
  // Find PAC or use a fallback mock
  const pac = MOCK_PAC.find(p => p.slug === slug) || { 
    slug: slug as string, 
    name: `PAC IPNU ${String(slug).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`, 
    address: `Kec. ${String(slug).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`, 
    members: 100, 
    pk: 10, 
    pr: 5, 
    ketua: "Fulan bin Fulan", 
    masaKhidmah: "2024-2026", 
    kontak: "0812xxxxxx",
    deskripsi: "Informasi detail mengenai Pimpinan Anak Cabang ini sedang dalam tahap pembaruan data oleh admin cabang."
  };

  return (
    <MainLayout>
      <div className="bg-muted/30 min-h-screen pb-20">
        {/* Header Section */}
        <div className="bg-white border-b border-border/60">
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
            <Link href="/pac" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Direktori PAC
            </Link>
            
            <div className="flex flex-row gap-4 md:gap-8 items-center md:items-start">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-center font-bold md: shrink-0 text-on-primary">
                {pac.name.charAt(9)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-5xl font-extrabold text-foreground mb-2 md:mb-5 leading-tight tracking-tight">
                  {pac.name}
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-muted-foreground text-sm md:text-base font-medium">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                    {pac.address}
                  </div>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1.5 text-primary" />
                    Masa Khidmah {pac.masaKhidmah}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 mt-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column (Main Info) */}
            <div className="md:col-span-2 space-y-8">
              {/* Profil & Deskripsi */}
              <div className="bg-white p-6 md:p-8 border border-border rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <Info className="h-5 w-5 mr-3 text-primary" />
                  <h2 className="text-2xl font-bold">Profil PAC</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
                  {pac.deskripsi}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 border border-border/60">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Ketua PAC</p>
                    <p className="font-bold text-lg text-foreground">{pac.ketua}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Kontak / Telepon</p>
                    <p className="font-bold text-lg text-foreground">{pac.kontak}</p>
                  </div>
                </div>
              </div>

              {/* Ranting & Komisariat (Placeholder) */}
              <div className="bg-white p-6 md:p-8 border border-border rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                  <FileText className="h-5 w-5 mr-3 text-primary" />
                  <h2 className="text-2xl font-bold">Daftar Ranting & Komisariat</h2>
                </div>
                <div className="py-12 px-6 text-center border-2 border-dashed border-border/60 bg-slate-50/50">
                  <p className="text-muted-foreground text-sm">
                    Daftar lengkap Pimpinan Ranting dan Komisariat di wilayah ini sedang dalam proses pembaruan oleh admin cabang.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column (Stats Widget) */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 border border-border rounded-lg sticky top-24 shadow-sm">
                <h3 className="text-lg font-bold mb-6 border-b border-border pb-4 uppercase tracking-wider text-primary">Statistik</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 text-on-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm">Anggota</span>
                    </div>
                    <span className="text-3xl font-black text-primary">{pac.members}</span>
                  </div>
                  
                  <div className="w-full h-px bg-border/40 my-2"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 text-slate-600">
                        <Building className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm">Ranting</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{pac.pr}</span>
                  </div>
                  
                  <div className="w-full h-px bg-border/40 my-2"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 text-slate-600">
                        <Building className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-sm">Komisariat</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{pac.pk}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
