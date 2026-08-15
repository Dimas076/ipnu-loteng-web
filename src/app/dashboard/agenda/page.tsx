"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users, Calendar, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

export default function AdminAgendaPage() {
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Rapat",
    date: "",
    endDate: "",
    location: "",
    map_link: "",
    latitude: null as number | null,
    longitude: null as number | null,
    whatsapp_group_link: "",
    status: "open",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchAgendas = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/agenda");
      setAgendas(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil agenda", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleOpenModal = (agenda: any = null) => {
    setSelectedFile(null); // Reset file selection
    if (agenda) {
      setEditId(agenda.id);
      setFormData({
        title: agenda.title,
        description: agenda.description,
        category: agenda.category && agenda.category !== 'Semua' ? agenda.category : "Rapat",
        date: agenda.date ? new Date(agenda.date).toISOString().split('T')[0] : "",
        endDate: agenda.endDate ? new Date(agenda.endDate).toISOString().split('T')[0] : "",
        location: agenda.location,
        map_link: agenda.map_link || "",
        latitude: agenda.latitude || null,
        longitude: agenda.longitude || null,
        whatsapp_group_link: agenda.whatsapp_group_link || "",
        status: agenda.status,
        image: agenda.image || "",
      });
    } else {
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        category: "Rapat",
        date: "",
        endDate: "",
        location: "",
        map_link: "",
        latitude: null,
        longitude: null,
        whatsapp_group_link: "",
        status: "open",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true);
    try {
      let imageUrl = formData.image;
      
      // Handle file upload if a file was selected
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", selectedFile);
        
        const uploadRes = await axios.post("/api/upload", fileFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.url;
        }
      }

      const dataToSubmit = { ...formData, image: imageUrl };

      if (editId) {
        await axios.put(`/api/agenda/${editId}`, dataToSubmit);
        alert("Agenda berhasil diubah");
      } else {
        await axios.post("/api/agenda", dataToSubmit);
        alert("Agenda berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchAgendas();
    } catch (error) {
      console.error("Error submitting agenda", error);
      alert("Gagal menyimpan agenda");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus agenda ini?")) {
      try {
        await axios.delete(`/api/agenda/${id}`);
        fetchAgendas();
      } catch (error) {
        alert("Gagal menghapus agenda");
      }
    }
  };

  // Only Admin or Super Admin can manage agendas
  if (user && !user.roles.includes('Super Admin') && !user.roles.includes('Admin PAC')) {
    return (
      <div className="p-8 text-center">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manajemen Agenda</h1>
            <p className="text-muted-foreground text-sm mt-1">Kelola pendaftaran kegiatan dan sertifikat peserta</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 rounded-lg">
            <Plus className="h-4 w-4" />
            Tambah Agenda
          </Button>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant text-on-surface font-bold">
                <tr>
                  <th className="p-4 font-bold text-foreground">Acara</th>
                  <th className="p-4 font-bold text-foreground">Kategori</th>
                  <th className="p-4 font-bold text-foreground">Waktu & Tempat</th>
                  <th className="p-4 font-bold text-foreground">Status</th>
                  <th className="p-4 font-bold text-foreground text-center">Peserta</th>
                  <th className="p-4 font-bold text-foreground text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Memuat data...</td>
                  </tr>
                ) : agendas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Belum ada agenda</td>
                  </tr>
                ) : (
                  agendas.map((agenda) => (
                  <tr key={agenda.id} className="bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-b border-outline-variant transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface-variant shrink-0 group-hover:text-primary transition-colors">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-on-surface leading-tight line-clamp-1">{agenda.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1 hidden sm:block line-clamp-1">{agenda.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#e3f2fd] text-[#1565c0]">
                        {agenda.category || "Semua"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center text-on-surface-variant">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-on-surface-variant" />
                          {new Date(agenda.date).toLocaleDateString('id-ID', {
                            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center text-on-surface-variant">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" />
                          {agenda.location}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        agenda.status === 'open' 
                          ? 'bg-surface-container-lowest text-on-surface-variant border-outline' 
                          : agenda.status === 'ongoing'
                            ? 'bg-[#DDF3E8] text-primary border-transparent'
                            : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                      }`}>
                        {agenda.status === 'open' ? 'Buka' : agenda.status === 'closed' ? 'Ditutup' : 'Selesai'}
                      </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link href={`/dashboard/agenda/${agenda.id}`} className="inline-block">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-surface-container-low text-[#1565c0] hover:text-white hover:bg-[#1565c0] border border-outline-variant" title="Lihat Pendaftar">
                            <Users className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                      <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-surface-container-low text-[#0d631b] hover:text-white hover:bg-[#0d631b] border border-outline-variant" title="Edit Agenda" onClick={() => handleOpenModal(agenda)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg bg-surface-container-low text-[#da1e28] hover:text-white hover:bg-[#da1e28] border border-outline-variant" 
                          title="Hapus Agenda"
                          onClick={() => handleDelete(agenda.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-border w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editId ? 'Edit Agenda' : 'Tambah Agenda Baru'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground font-bold">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="agendaForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Judul Acara</label>
                  <input type="text" required className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Kategori</label>
                  <select required className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Rapat">Rapat</option>
                    <option value="Pelatihan">Pelatihan</option>
                    <option value="Kaderisasi">Kaderisasi</option>
                    <option value="Sosial">Sosial</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Tanggal Mulai</label>
                    <input type="date" required className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Tanggal Selesai</label>
                    <input type="date" className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Lokasi</label>
                  <input type="text" required className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Link Peta Lokasi (Google Maps) (Opsional)</label>
                  <input type="url" placeholder="https://maps.app.goo.gl/..." className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.map_link} onChange={(e) => setFormData({...formData, map_link: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Pilih Titik Lokasi Peta (Opsional)</label>
                  <p className="text-xs text-muted-foreground mb-2">Klik pada peta untuk menaruh penanda merah (pin) di lokasi yang akurat.</p>
                  <MapPicker 
                    initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                    onPositionChange={(lat, lng) => setFormData({...formData, latitude: lat, longitude: lng})}
                  />
                  {formData.latitude && formData.longitude && (
                    <p className="text-xs text-primary mt-1 font-medium">Titik terpilih: {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Link Grup WhatsApp (Opsional)</label>
                  <input type="url" placeholder="https://chat.whatsapp.com/..." className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.whatsapp_group_link} onChange={(e) => setFormData({...formData, whatsapp_group_link: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Deskripsi & Syarat</label>
                  <textarea required rows={4} className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Poster Kegiatan (Opsional)</label>
                  {formData.image && !selectedFile && (
                    <div className="mb-2">
                      <img src={formData.image} alt="Poster" className="w-full max-w-xs h-auto rounded-lg border border-border" />
                    </div>
                  )}
                  {selectedFile && (
                    <div className="mb-2 text-sm text-primary font-medium">File terpilih: {selectedFile.name}</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }} 
                    className="w-full p-2 border border-border rounded-lg bg-muted focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" 
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Biarkan kosong jika tidak ingin mengubah poster.</p>
                </div>

                {editId && (
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Status Pendaftaran</label>
                    <select className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="open">Buka (Open)</option>
                      <option value="closed">Tutup (Closed)</option>
                      <option value="completed">Selesai (Completed)</option>
                    </select>
                  </div>
                )}
              </form>
            </div>
            
            <div className="p-6 border-t border-border bg-muted/50 flex justify-end gap-3">
              <Button variant="outline" type="button" className="rounded-lg border-border" onClick={() => setIsModalOpen(false)} disabled={uploadingImage}>Batal</Button>
              <Button form="agendaForm" type="submit" className="rounded-lg" disabled={uploadingImage}>
                {uploadingImage ? 'Menyimpan...' : editId ? 'Simpan Perubahan' : 'Buat Agenda'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
