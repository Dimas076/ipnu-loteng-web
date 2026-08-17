import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-on-primary pt-16 md:pt-20 pb-8">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6 text-white">
                IPNU Lombok Tengah
              </h3>
              <p className="text-white/80 text-base leading-relaxed max-w-sm">
                Pelajar Berkarakter, Berilmu, Bergerak. Wadah pembinaan generasi muda Nahdlatul Ulama yang inklusif, berwawasan kebangsaan, dan toleran.
              </p>
            </div>
          </div>
          
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col space-y-1 md:space-y-4">
              <span className="text-white/50 font-semibold tracking-wider text-sm uppercase mb-2">Navigasi</span>
              <Link href="/" className="text-white/90 hover:text-white transition-colors w-fit py-2 md:py-0 block">Beranda</Link>
              <Link href="/sejarah" className="text-white/90 hover:text-white transition-colors w-fit py-2 md:py-0 block">Sejarah</Link>
              <Link href="/berita" className="text-white/90 hover:text-white transition-colors w-fit py-2 md:py-0 block">Berita</Link>
              <Link href="/agenda" className="text-white/90 hover:text-white transition-colors w-fit py-2 md:py-0 block">Agenda</Link>
            </div>
            
            <div className="flex flex-col space-y-1 md:space-y-4">
              <span className="text-white/50 font-semibold tracking-wider text-sm uppercase mb-2">Sosial Media</span>
              <a href="https://www.instagram.com/ipnu_lomboktengah?igsh=MWRiM2x4dWE5MDdyZg==" className="text-white/90 hover:text-white transition-colors flex items-center group w-fit py-2 md:py-0" target="_blank" rel="noopener noreferrer">
                Instagram <ArrowUpRight className="ml-1 h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>
              <a href="https://www.facebook.com/share/1d7RecgkWc/" className="text-white/90 hover:text-white transition-colors flex items-center group w-fit py-2 md:py-0" target="_blank" rel="noopener noreferrer">
                Facebook <ArrowUpRight className="ml-1 h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>
              <a href="https://youtube.com/@ipnulomboktengah?si=WHS2CL8MZO2-0-CZ" className="text-white/90 hover:text-white transition-colors flex items-center group w-fit py-2 md:py-0" target="_blank" rel="noopener noreferrer">
                YouTube <ArrowUpRight className="ml-1 h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>

            <div className="flex flex-col space-y-4 col-span-2 sm:col-span-1 mt-4 sm:mt-0">
              <span className="text-white/50 font-semibold tracking-wider text-sm uppercase mb-2">Kontak</span>
              <div className="text-white/90 text-sm space-y-3">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>Gedung PCNU Lombok Tengah Lt. 2, Jl. Diponegoro No. 48, Praya</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+62 812 3456 7890</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>info@ipnuloteng.or.id</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50 mt-12 border-t border-white/10 pt-8">
          <p>&copy; {new Date().getFullYear()} Pimpinan Cabang IPNU Lombok Tengah.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
