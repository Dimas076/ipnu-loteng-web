"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Search, Award, Download, Calendar, MapPin, ChevronRight, AlertCircle, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SertifikatPage() {
  const [hp, setHp] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState("");

  // Form Evaluasi State
  const [selectedPeserta, setSelectedPeserta] = useState<any | null>(null);
  const [formResponses, setFormResponses] = useState<Record<string, string>>({});
  const [submittingForm, setSubmittingForm] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hp.trim()) {
      setError("Masukkan nomor HP terlebih dahulu");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await axios.get(`/api/peserta/search?hp=${encodeURIComponent(hp)}`);
      setResults(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mencari sertifikat. Coba lagi.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = (peserta: any) => {
    setSelectedPeserta(peserta);
    setFormResponses({});
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeserta) return;
    
    setSubmittingForm(true);
    try {
      await axios.post(`/api/peserta/${selectedPeserta.id}/submit-form`, {
        responses: formResponses
      });
      
      // Update local state
      setResults(prev => 
        prev ? prev.map(p => p.id === selectedPeserta.id ? { ...p, has_filled_form: true } : p) : null
      );
      setSelectedPeserta(null);
      alert("Terima kasih, evaluasi berhasil dikirim. Anda sekarang dapat mengunduh sertifikat.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim evaluasi. Coba lagi.");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-background relative overflow-hidden py-16 md:py-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 text-primary">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6">
            Portal <span className="text-primary italic">E-Sertifikat.</span>
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl font-medium mb-10">
            Unduh sertifikat elektronik dari berbagai kegiatan IPNU Lombok Tengah yang telah Anda ikuti.
          </p>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg bg-card p-2 rounded-lg shadow-sm border border-border flex flex-col sm:flex-row gap-2"
          >
            <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Masukkan Nomor HP Anda (Misal: 0812...)"
                  className="w-full h-12 pl-12 pr-4 bg-transparent border-none rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground font-medium"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 rounded-md font-bold bg-primary text-white hover:bg-primary/90 flex items-center justify-center min-w-[140px]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "Cari"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-background flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 mb-8">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {results !== null && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                  <FileCheck2 className="w-6 h-6 text-primary" />
                  Hasil Pencarian
                </h2>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                  {results.length} Ditemukan
                </span>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-16 bg-muted rounded-lg border border-border border-dashed">
                  <Award className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Sertifikat Tidak Ditemukan</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Kami tidak menemukan sertifikat yang terhubung dengan nomor HP <strong>{hp}</strong>. Pastikan nomor sudah benar atau hubungi panitia kegiatan terkait.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((peserta) => (
                    <div key={peserta.id} className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-bold tracking-wide">
                          {peserta.agenda?.category || 'Kegiatan'}
                        </span>
                        <div className="bg-green-50 text-green-700 p-2 rounded-full">
                          <Award className="w-5 h-5" />
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-foreground leading-snug mb-4 line-clamp-2">
                        {peserta.agenda?.title || 'Agenda IPNU'}
                      </h3>
                      
                      <div className="space-y-2 mb-6 mt-auto">
                        <div className="flex items-center text-sm text-on-surface-variant font-medium">
                          <Calendar className="w-4 h-4 mr-2 opacity-70" />
                          {peserta.agenda?.date ? new Date(peserta.agenda.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                        </div>
                        <div className="flex items-center text-sm text-on-surface-variant font-medium">
                          <MapPin className="w-4 h-4 mr-2 opacity-70" />
                          <span className="line-clamp-1">{peserta.agenda?.location || '-'}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
                        {peserta.agenda?.sertifikat_form_fields?.length > 0 && !peserta.has_filled_form ? (
                          <Button 
                            onClick={() => handleOpenForm(peserta)} 
                            className="w-full font-bold bg-[#1565c0] text-white hover:bg-[#1565c0]/90 flex items-center justify-center rounded-md"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Isi Form Evaluasi
                          </Button>
                        ) : peserta.sertifikat_file ? (
                          <a href={peserta.sertifikat_file} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full font-bold bg-primary text-white hover:bg-primary/90 flex items-center justify-center rounded-md group-hover:shadow-md transition-all">
                              <Download className="w-4 h-4 mr-2" />
                              Unduh File Asli
                            </Button>
                          </a>
                        ) : (
                          <Link href={`/sertifikat/${peserta.id}/cetak`} target="_blank" className="w-full">
                            <Button className="w-full font-bold bg-primary text-white hover:bg-primary/90 flex items-center justify-center rounded-md group-hover:shadow-md transition-all">
                              <Download className="w-4 h-4 mr-2" />
                              Unduh E-Sertifikat
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      {/* Modal Form Evaluasi */}
      {selectedPeserta && selectedPeserta.agenda?.sertifikat_form_fields && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-border w-full max-w-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-primary/5 rounded-t-lg">
              <div>
                <h2 className="text-xl font-bold text-foreground">Form Evaluasi Kegiatan</h2>
                <p className="text-sm text-muted-foreground mt-1">Wajib diisi sebelum mengunduh sertifikat.</p>
              </div>
              <button onClick={() => setSelectedPeserta(null)} className="text-muted-foreground hover:text-foreground font-bold bg-white p-1.5 rounded-md border border-border">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="evaluasiForm" onSubmit={handleFormSubmit} className="space-y-6">
                {selectedPeserta.agenda.sertifikat_form_fields.map((field: any, index: number) => (
                  <div key={field.id || index}>
                    <label className="block text-sm font-bold text-foreground mb-2">
                      {index + 1}. {field.question} <span className="text-red-500">*</span>
                    </label>
                    
                    {field.type === 'text' && (
                      <input 
                        type="text" 
                        required 
                        className="w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                        value={formResponses[field.id] || ''}
                        onChange={(e) => setFormResponses({...formResponses, [field.id]: e.target.value})}
                      />
                    )}

                    {field.type === 'textarea' && (
                      <textarea 
                        required 
                        rows={3}
                        className="w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                        value={formResponses[field.id] || ''}
                        onChange={(e) => setFormResponses({...formResponses, [field.id]: e.target.value})}
                      />
                    )}

                    {field.type === 'select' && (
                      <select 
                        required 
                        className="w-full p-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all bg-white"
                        value={formResponses[field.id] || ''}
                        onChange={(e) => setFormResponses({...formResponses, [field.id]: e.target.value})}
                      >
                        <option value="" disabled>Pilih Jawaban...</option>
                        {field.options?.map((opt: string, i: number) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </form>
            </div>
            
            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-lg">
              <Button variant="outline" type="button" className="rounded-lg" onClick={() => setSelectedPeserta(null)} disabled={submittingForm}>Batal</Button>
              <Button form="evaluasiForm" type="submit" className="rounded-lg font-bold bg-primary text-white hover:bg-primary/90" disabled={submittingForm}>
                {submittingForm ? 'Menyimpan...' : 'Kirim & Lanjut Unduh'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
