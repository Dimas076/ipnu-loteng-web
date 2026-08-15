"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Image as ImageIcon, Layout, CheckCircle2, Edit, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function CreateBeritaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    category: "",
    status: "draft",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = formData.image;
      
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

      await axios.post("/api/posts", dataToSubmit);
      router.push("/dashboard/berita");
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat menyimpan berita.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/berita">
            <Button variant="ghost" size="icon" className="rounded-lg bg-surface-container-low hover:bg-[#E5E7EB] text-on-surface-variant">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Tulis Berita Baru</h1>
            <p className="text-sm text-on-surface-variant font-medium hidden sm:block">Buat dan publikasikan artikel untuk warga IPNU.</p>
          </div>
        </div>
        
        {/* Header Action Button (Mobile Only / Optional for Desktop) */}
        <div className="md:hidden">
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="rounded-lg"
          >
            {loading ? <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span> : <Save className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold">!</span>
          </div>
          {error}
        </div>
      )}

      <form id="beritaForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Editor Utama */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
              <Layout className="w-4 h-4" />
              Konten Utama
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Judul Berita</label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-5 py-4 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all text-lg font-medium text-on-surface placeholder:text-[#9CA3AF] bg-surface-container-lowest"
                placeholder="Tulis judul yang menarik perhatian..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Isi Berita</label>
              <RichTextEditor 
                value={formData.content} 
                onChange={(val) => setFormData({ ...formData, content: val })} 
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 sm:p-8 space-y-6 sticky top-28">
            <div className="flex items-center gap-2 mb-2 text-primary font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Pengaturan Publikasi
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface">Gambar Sampul</label>
              <div className="relative group cursor-pointer">
                {(formData.image || selectedFile) ? (
                  <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant relative group/foto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-100 transition-all duration-300 translate-y-0 z-10">
                      <label className="bg-surface-container-lowest/90 backdrop-blur-sm text-[#0d631b] hover:text-white hover:bg-[#0d631b] p-2 rounded-lg border border-outline-variant transition-all duration-300 cursor-pointer">
                        <Edit className="w-4 h-4" />
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => { setSelectedFile(null); setFormData({...formData, image: ""}); }}
                        className="bg-surface-container-lowest/90 backdrop-blur-sm text-[#da1e28] hover:text-white hover:bg-[#da1e28] p-2 rounded-lg border border-outline-variant transition-all duration-300 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-40 rounded-lg border border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant group-hover:bg-[#E5E7EB] transition-colors cursor-pointer">
                    <ImageIcon className="h-8 w-8 mb-2 text-on-surface-variant group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">Pratinjau Gambar</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-on-surface-variant font-medium">Klik pada area pratinjau di atas untuk mengunggah gambar.</p>
            </div>

            <div className="w-full h-px bg-[#E5E7EB] my-2"></div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface">Kategori Berita</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all text-sm bg-surface-container-lowest font-medium text-on-surface placeholder:text-[#9CA3AF]"
                placeholder="Misal: Kegiatan, Opini (opsional)"
              />
            </div>

            <div className="w-full h-px bg-[#E5E7EB] my-2"></div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-on-surface">Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all text-sm bg-surface-container-lowest font-medium text-on-surface appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="draft">Draf (Simpan Saja)</option>
                <option value="published">Terbitkan Sekarang</option>
              </select>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full rounded-lg py-6 font-bold bg-primary hover:bg-[#0B5A39] text-[#FFFFFF] transition-all mt-4 text-on-primary"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 border-2 border-white/20 border-t-white rounded-full h-5 w-5"></span>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  {formData.status === 'published' ? 'Terbitkan Berita' : 'Simpan Draf'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
