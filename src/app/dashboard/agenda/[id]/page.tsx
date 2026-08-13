"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminAgendaParticipantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                          <span className="inline-flex items-center text-primary bg-[#DDF3E8] border border-transparent px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                            <CheckCircle className="h-3 w-3 mr-1" /> Diterbitkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-on-surface bg-[#F1C21B]/10 border border-[#F1C21B]/30 px-2 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                            <Clock className="h-3 w-3 mr-1" /> Menunggu
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {participant.status_sertifikat === 'pending' && (
                          <Button size="sm" className="rounded-lg font-bold" onClick={() => handleApprove(participant.id)}>
                            Terbitkan Sertifikat
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
