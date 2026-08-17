"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Users, Calendar, Clock, MapPin, X } from "lucide-react";
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
    rundown: [] as {time: string, title: string}[],
    sertifikat_form_fields: [] as { id: string, question: string, type: 'text' | 'textarea' | 'select', options: string[] }[],
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
        date: agenda.date ? new Date(new Date(agenda.date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
        endDate: agenda.endDate ? new Date(new Date(agenda.endDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
        location: agenda.location,
        map_link: agenda.map_link || "",
        latitude: agenda.latitude || null,
        longitude: agenda.longitude || null,
        whatsapp_group_link: agenda.whatsapp_group_link || "",
        status: agenda.status,
        image: agenda.image || "",
        rundown: Array.isArray(agenda.rundown) ? agenda.rundown : [],
        sertifikat_form_fields: Array.isArray(agenda.sertifikat_form_fields) ? agenda.sertifikat_form_fields : [],
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
        rundown: [],
        sertifikat_form_fields: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleAddRundown = () => {
    setFormData({ ...formData, rundown: [...formData.rundown, { time: "", title: "" }] });
  };

  const handleRemoveRundown = (index: number) => {
    const newRundown = [...formData.rundown];
    newRundown.splice(index, 1);
    setFormData({ ...formData, rundown: newRundown });
  };

  const handleUpdateRundown = (index: number, field: 'time' | 'title', value: string) => {
    const newRundown = [...formData.rundown];
    newRundown[index][field] = value;
    setFormData({ ...formData, rundown: newRundown });
  };

  const handleAddFormField = () => {
    setFormData({ 
      ...formData, 
      sertifikat_form_fields: [
        ...formData.sertifikat_form_fields, 
        { id: Date.now().toString(), question: "", type: "text", options: ["Opsi 1"] }
      ] 
    });
  };

  const handleRemoveFormField = (index: number) => {
    const newFields = [...formData.sertifikat_form_fields];
    newFields.splice(index, 1);
    setFormData({ ...formData, sertifikat_form_fields: newFields });
  };

  const handleUpdateFormField = (index: number, field: 'question' | 'type', value: string) => {
    const newFields = [...formData.sertifikat_form_fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFormData({ ...formData, sertifikat_form_fields: newFields });
  };

  const handleUpdateFormOptions = (index: number, optionsString: string) => {
    const newFields = [...formData.sertifikat_form_fields];
    newFields[index].options = optionsString.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, sertifikat_form_fields: newFields });
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manajemen Agenda</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Kelola pendaftaran kegiatan dan sertifikat peserta</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="rounded-lg transition-all font-bold px-6 shrink-0">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Agenda
        </Button>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-low text-on-surface border-b border-outline-variant font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Acara</th>
                <th className="px-6 py-4 whitespace-nowrap">Kategori</th>
                <th className="px-6 py-4 whitespace-nowrap">Waktu & Tempat</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Peserta</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground font-medium">Memuat data agenda...</p>
                      </div>
                    </td>
                  </tr>
                ) : agendas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">Tidak Ada Agenda</h3>
                          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                            Belum ada agenda yang ditambahkan.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  agendas.map((agenda) => (
                  <tr key={agenda.id} className="bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-b border-outline-variant transition-colors group">
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#e3f2fd] text-[#1565c0]">
                        {agenda.category || "Semua"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center text-on-surface-variant">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-on-surface-variant" />
                          {new Date(agenda.date).toLocaleDateString('id-ID', {
                            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                          })} - {new Date(agenda.date).toLocaleTimeString('id-ID', {
                            hour: '2-digit', minute: '2-digit'
                          })} WITA
                        </span>
                        <span className="flex items-center text-on-surface-variant">
                          <MapPin className="w-3.5 h-3.5 mr-1.5" />
                          {agenda.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                        agenda.status === 'open' 
                          ? 'bg-[#EEF7F2] text-[#0d631b] border-[#0d631b]/20' 
                          : agenda.status === 'closed'
                            ? 'bg-[#fdefef] text-[#da1e28] border-[#da1e28]/20'
                            : 'bg-[#e3f2fd] text-[#1565c0] border-[#1565c0]/20'
                      }`}>
                        {agenda.status === 'open' ? 'Buka' : agenda.status === 'closed' ? 'Ditutup' : 'Selesai'}
                      </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link href={`/dashboard/agenda/${agenda.id}`} className="inline-block">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-surface-container-low text-[#1565c0] hover:text-white hover:bg-[#1565c0] border border-outline-variant" title="Lihat Pendaftar">
                            <Users className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 transition-opacity">
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
                    <label className="block text-sm font-bold text-foreground mb-1">Waktu Mulai</label>
                    <input type="datetime-local" required className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">Waktu Selesai</label>
                    <input type="datetime-local" className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
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
                  <textarea rows={4} className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="border border-border p-4 rounded-lg bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-foreground">Rundown Acara (Opsional)</label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddRundown} className="h-8 gap-1">
                      <Plus className="h-4 w-4" /> Tambah Rundown
                    </Button>
                  </div>
                  {formData.rundown.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-2">Belum ada rundown acara yang ditambahkan.</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.rundown.map((item, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="w-1/3">
                            <input 
                              type="text" 
                              placeholder="08:00 - 09:00" 
                              className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-sm" 
                              value={item.time} 
                              onChange={(e) => handleUpdateRundown(index, 'time', e.target.value)} 
                            />
                          </div>
                          <div className="w-full flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Kegiatan / Acara" 
                              className="w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all text-sm" 
                              value={item.title} 
                              onChange={(e) => handleUpdateRundown(index, 'title', e.target.value)} 
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
                              onClick={() => handleRemoveRundown(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sertifikat Form Builder */}
                <div className="border border-border p-4 rounded-lg bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-bold text-primary">Form Evaluasi Sertifikat (Opsional)</label>
                      <p className="text-xs text-muted-foreground mt-0.5">Pertanyaan yang wajib diisi peserta sebelum bisa mengunduh sertifikat.</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddFormField} className="h-8 gap-1 border-primary text-primary hover:bg-primary hover:text-white shrink-0">
                      <Plus className="h-4 w-4" /> Tambah Pertanyaan
                    </Button>
                  </div>
                  
                  {formData.sertifikat_form_fields.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4 bg-white/50 rounded-lg">Peserta bisa langsung unduh sertifikat tanpa mengisi evaluasi.</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.sertifikat_form_fields.map((field, index) => (
                        <div key={field.id || index} className="p-3 bg-white border border-border rounded-lg space-y-3 relative group">
                          <div className="absolute -top-2.5 -right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFormField(index)}
                              className="bg-destructive text-white rounded-full p-1 shadow-sm hover:bg-destructive/90"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Pertanyaan</label>
                              <input 
                                type="text" 
                                placeholder="Cth: Bagaimana pendapat Anda tentang materi ini?" 
                                className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm" 
                                value={field.question} 
                                onChange={(e) => handleUpdateFormField(index, 'question', e.target.value)} 
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Tipe Jawaban</label>
                              <select 
                                className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm"
                                value={field.type}
                                onChange={(e) => handleUpdateFormField(index, 'type', e.target.value as any)}
                              >
                                <option value="text">Teks Singkat</option>
                                <option value="textarea">Paragraf Panjang</option>
                                <option value="select">Pilihan Ganda (Dropdown)</option>
                              </select>
                            </div>
                          </div>
                          
                          {field.type === 'select' && (
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground mb-1">Pilihan Jawaban (Pisahkan dengan koma)</label>
                              <input 
                                type="text" 
                                placeholder="Sangat Baik, Baik, Cukup, Kurang" 
                                className="w-full p-2 border border-border rounded-md focus:ring-1 focus:ring-primary focus:outline-none text-sm bg-muted/30" 
                                value={(field.options || []).join(', ')} 
                                onChange={(e) => handleUpdateFormOptions(index, e.target.value)} 
                                required
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
                    <select 
                      className={`w-full p-2 border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all ${
                        formData.status === 'open' ? 'text-[#0d631b] bg-[#EEF7F2] font-semibold' :
                        formData.status === 'closed' ? 'text-[#da1e28] bg-[#fdefef] font-semibold' :
                        'text-[#1565c0] bg-[#e3f2fd] font-semibold'
                      }`} 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="open" className="text-[#0d631b] font-semibold">Buka (Open)</option>
                      <option value="closed" className="text-[#da1e28] font-semibold">Tutup (Closed)</option>
                      <option value="completed" className="text-[#1565c0] font-semibold">Selesai (Completed)</option>
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
