"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, Upload, Loader2, FileIcon, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminAgendaParticipantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [evaluasiModalPeserta, setEvaluasiModalPeserta] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/agenda/${id}/participants`);
      setParticipants(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data peserta", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchParticipants();
  }, [id]);

  const handleApprove = async (participantId: number) => {
    try {
      await axios.post(`/api/participants/${participantId}/approve`);
      // Update local state instead of refetching everything
      setParticipants(participants.map(p => 
        p.id === participantId ? { ...p, status_sertifikat: 'approved' } : p
      ));
    } catch (error) {
      console.error("Gagal menerbitkan sertifikat", error);
      alert("Gagal menerbitkan sertifikat.");
    }
  };

  const triggerUpload = (participantId: number) => {
    setUploadingId(participantId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file first
      const uploadRes = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = uploadRes.data.url;

      // Save to participant
      await axios.post(`/api/participants/${uploadingId}/sertifikat`, { url: fileUrl });

      // Update local state
      setParticipants(participants.map(p => 
        p.id === uploadingId ? { ...p, status_sertifikat: 'approved', sertifikat_file: fileUrl } : p
      ));

      alert("Sertifikat manual berhasil diupload dan diterbitkan!");
    } catch (error) {
      console.error("Gagal mengupload sertifikat", error);
      alert("Gagal mengupload sertifikat.");
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Only Admin or Super Admin
  if (user && !user.roles.includes('Super Admin') && !user.roles.includes('Admin PAC')) {
    return (
      <div className="p-8 text-center">Anda tidak memiliki akses.</div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <Link href="/dashboard/agenda" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Manajemen Agenda
        </Link>
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*,application/pdf" 
          onChange={handleFileUpload} 
        />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Daftar Peserta Agenda</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola peserta dan terbitkan sertifikat.</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="p-4 font-bold text-on-surface">Nama Peserta</th>
                  <th className="p-4 font-bold text-on-surface">Asal Pimpinan</th>
                  <th className="p-4 font-bold text-on-surface">Nomor HP/WA</th>
                  <th className="p-4 font-bold text-on-surface text-center">Status Sertifikat</th>
                  <th className="p-4 font-bold text-on-surface text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Memuat data peserta...</td>
                  </tr>
                ) : participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">Belum ada peserta yang mendaftar.</td>
                  </tr>
                ) : (
                  participants.map((participant) => (
                    <tr key={participant.id} className="bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-b border-outline-variant transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-on-surface">{participant.nama_lengkap}</div>
                        <div className="text-xs text-on-surface-variant">Akun: {participant.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-surface-container-low text-on-surface-variant px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-outline-variant">
                          {participant.asal_pimpinan}
                        </span>
                      </td>
                      <td className="p-4">
                        <a href={`https://wa.me/${participant.nomor_hp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                          {participant.nomor_hp}
                        </a>
                      </td>
                      <td className="p-4 text-center">
                        {participant.status_sertifikat === 'approved' ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center text-primary bg-[#DDF3E8] border border-transparent px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                              <CheckCircle className="h-3 w-3 mr-1" /> Diterbitkan
                            </span>
                            {participant.sertifikat_file && (
                              <span className="inline-flex items-center text-xs text-blue-600 font-medium mt-1">
                                <FileIcon className="h-3 w-3 mr-1" /> File Kustom
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center text-on-surface bg-[#F1C21B]/10 border border-[#F1C21B]/30 px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                            <Clock className="h-3 w-3 mr-1" /> Menunggu
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="rounded-lg font-bold bg-white text-muted-foreground border-outline-variant" 
                            onClick={() => triggerUpload(participant.id)}
                            disabled={uploadingId === participant.id}
                            title="Upload file sertifikat khusus (PDF/Gambar)"
                          >
                            {uploadingId === participant.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Button>
                          
                          {participant.has_filled_form && participant.sertifikat_form_responses && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="rounded-lg font-bold bg-[#1565c0]/10 text-[#1565c0] border-[#1565c0]/20 hover:bg-[#1565c0] hover:text-white" 
                              onClick={() => setEvaluasiModalPeserta(participant)}
                              title="Lihat Jawaban Evaluasi"
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {participant.status_sertifikat === 'pending' && (
                            <Button size="sm" className="rounded-lg font-bold" onClick={() => handleApprove(participant.id)}>
                              Terbitkan Otomatis
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal View Evaluasi */}
      {evaluasiModalPeserta && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-border w-full max-w-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-primary/5 rounded-t-lg">
              <div>
                <h2 className="text-xl font-bold text-foreground">Hasil Evaluasi Peserta</h2>
                <p className="text-sm text-muted-foreground mt-1">{evaluasiModalPeserta.nama_lengkap} - {evaluasiModalPeserta.nomor_hp}</p>
              </div>
              <button onClick={() => setEvaluasiModalPeserta(null)} className="text-muted-foreground hover:text-foreground font-bold bg-white p-1.5 rounded-md border border-border">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              {evaluasiModalPeserta.agenda?.sertifikat_form_fields?.length > 0 ? (
                evaluasiModalPeserta.agenda.sertifikat_form_fields.map((field: any, index: number) => (
                  <div key={field.id || index} className="bg-muted/30 p-4 rounded-lg border border-border">
                    <h4 className="text-sm font-bold text-foreground mb-2">{index + 1}. {field.question}</h4>
                    <p className="text-sm text-on-surface-variant font-medium whitespace-pre-wrap">
                      {evaluasiModalPeserta.sertifikat_form_responses?.[field.id] || <span className="italic text-muted-foreground">Tidak ada jawaban</span>}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic text-center py-4">Agenda ini tidak memiliki form evaluasi.</p>
              )}
            </div>
            
            <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3 rounded-b-lg">
              <Button variant="outline" className="rounded-lg" onClick={() => setEvaluasiModalPeserta(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
