import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Download, Printer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const prisma = new PrismaClient();

export default async function CetakSertifikat({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const peserta = await prisma.peserta.findUnique({
    where: { id: parseInt(id) },
    include: { agenda: true }
  });

  if (!peserta || peserta.status_sertifikat !== 'approved') {
    notFound();
  }

  // A simple but beautiful HTML/CSS certificate template
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8">
      
      {/* Controls - Hidden when printing */}
      <div className="w-[1123px] max-w-full flex justify-between items-center mb-6 print:hidden px-4">
        <Link href="/sertifikat">
          <Button variant="outline" className="font-bold">Kembali</Button>
        </Link>
        <div className="flex gap-3">
          <Button 
            className="bg-primary text-white font-bold px-6"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>
      
      <div className="w-full text-center text-sm text-slate-500 mb-4 print:hidden">
        Gunakan orientasi <strong>Landscape</strong> saat mencetak ke PDF.
      </div>

      {/* Certificate Container (A4 Landscape dimensions approx: 1123px x 794px) */}
      <div 
        className="relative bg-white shadow-2xl overflow-hidden print:shadow-none print:m-0"
        style={{ width: '1123px', height: '794px', maxWidth: '100vw' }}
      >
        {/* Certificate Border Design */}
        <div className="absolute inset-4 border-[12px] border-primary/10 rounded-sm z-0"></div>
        <div className="absolute inset-6 border-[2px] border-primary/30 rounded-sm z-0"></div>
        
        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-br-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-tl-full z-0"></div>
        
        {/* Certificate Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-16 text-center">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
              <img src="/ipnu-logo.png" alt="IPNU Logo" className="w-full h-full object-contain p-2" onError={(e) => { e.currentTarget.style.display='none' }} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-primary tracking-widest uppercase">Pimpinan Cabang</h1>
              <h2 className="text-2xl font-bold text-slate-700 tracking-wider">Ikatan Pelajar Nahdlatul Ulama</h2>
              <p className="text-slate-500 font-medium">Kabupaten Lombok Tengah</p>
            </div>
          </div>
          
          <h1 className="text-6xl font-black text-slate-800 tracking-widest uppercase mb-4" style={{ fontFamily: 'serif' }}>
            Sertifikat
          </h1>
          <p className="text-xl text-primary font-bold tracking-widest uppercase mb-12">
            Penghargaan / Kepesertaan
          </p>
          
          <p className="text-lg text-slate-600 mb-4">Diberikan Kepada:</p>
          
          <h2 className="text-5xl font-bold text-slate-900 border-b-2 border-primary/30 pb-2 mb-2 inline-block px-12" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
            {peserta.nama_lengkap}
          </h2>
          <p className="text-lg text-slate-500 font-medium mb-12 uppercase tracking-widest">Utusan: {peserta.asal_pimpinan || "-"}</p>
          
          <p className="text-xl text-slate-700 max-w-3xl leading-relaxed">
            Atas partisipasinya sebagai <strong>PESERTA</strong> dalam kegiatan:<br/>
            <strong className="text-2xl text-primary mt-2 block">{peserta.agenda.title}</strong>
          </p>
          
          <p className="text-slate-600 mt-4 font-medium">
            Yang diselenggarakan pada tanggal {new Date(peserta.agenda.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} di {peserta.agenda.location || 'Lombok Tengah'}.
          </p>
          
          {/* Signatures */}
          <div className="absolute bottom-16 w-full flex justify-between px-32 mt-12">
            <div className="flex flex-col items-center">
              <p className="text-slate-600 font-medium mb-16">Ketua PC IPNU</p>
              <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
              <p className="font-bold text-slate-800">M. Rekam Kurniawan</p>
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-slate-600 font-medium mb-16">Ketua Panitia</p>
              <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
              <p className="font-bold text-slate-800">.................................</p>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Client-side print script component */}
      <PrintButton />
    </div>
  );
}

// Extract the print button into a client component to allow onClick
import { PrintButton } from './PrintButton';
