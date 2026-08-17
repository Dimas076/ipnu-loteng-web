"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ArrowRight, ChevronDown, UploadCloud } from "lucide-react";
import axios from "@/lib/axios";

export default function DaftarAgendaPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [agenda, setAgenda] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    wa: "",
    email: "",
    kegiatan: ""
  });

  useEffect(() => {
    // Fetch agenda to know what we are registering for
    const fetchAgenda = async () => {
      try {
        const res = await axios.get(`/api/agenda/${slug}`);
        setAgenda(res.data.data);
        if (res.data.data) {
          setFormData(prev => ({ ...prev, kegiatan: res.data.data.id.toString() }));
        }
      } catch (error) {
        console.error("Gagal memuat detail agenda", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAgenda();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/peserta', {
        agendaId: formData.kegiatan,
        nama_lengkap: formData.nama,
        asal_pimpinan: formData.alamat,
        nomor_hp: formData.wa,
      });

      alert("Pendaftaran berhasil!");
      router.push(`/agenda/${slug}`);
    } catch (error) {
      console.error("Gagal mendaftar:", error);
      alert("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="animate-spin border-4 border-primary/20 border-t-primary rounded-full h-12 w-12"></span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-surface-container-lowest py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-primary">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-outline-variant overflow-hidden">
          
          {/* Header */}
          <div className="px-6 py-8 border-b border-outline-variant bg-surface-container-lowest text-center">
            <h2 className="text-xl font-bold text-primary mb-2">Pendaftaran Kegiatan</h2>
            <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
              Silakan lengkapi formulir di bawah ini dengan data yang valid untuk mendaftar kegiatan IPNU LOTENG.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 md:px-10 space-y-6">
            
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-on-surface mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                required
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-3 rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white text-on-surface"
              />
            </div>

            {/* Alamat Lengkap */}
            <div>
              <label htmlFor="alamat" className="block text-sm font-medium text-on-surface mb-2">
                Alamat Lengkap / Asal Pimpinan
              </label>
              <textarea
                id="alamat"
                required
                rows={4}
                value={formData.alamat}
                onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                placeholder="Masukkan alamat lengkap atau asal pimpinan"
                className="w-full px-4 py-3 rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white text-on-surface resize-none"
              ></textarea>
            </div>

            {/* No WhatsApp & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="wa" className="block text-sm font-medium text-on-surface mb-2">
                  No. WhatsApp
                </label>
                <input
                  type="tel"
                  id="wa"
                  required
                  value={formData.wa}
                  onChange={(e) => setFormData({...formData, wa: e.target.value})}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white text-on-surface"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3 rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white text-on-surface"
                />
              </div>
            </div>

            {/* Pilih Kegiatan */}
            <div>
              <label htmlFor="kegiatan" className="block text-sm font-medium text-on-surface mb-2">
                Pilih Kegiatan
              </label>
              <div className="relative">
                <select
                  id="kegiatan"
                  required
                  value={formData.kegiatan}
                  onChange={(e) => setFormData({...formData, kegiatan: e.target.value})}
                  className="w-full px-4 py-3 rounded-md border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white text-on-surface appearance-none cursor-pointer"
                >
                  <option value="" disabled>Pilih salah satu kegiatan...</option>
                  {agenda && <option value={agenda.id}>{agenda.title}</option>}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-sm shadow-sm text-base font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'Memproses...' : (
                  <>
                    Daftar Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-4">
                Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku.
              </p>
            </div>

          </form>
        </div>
      </div>
    </MainLayout>
  );
}
