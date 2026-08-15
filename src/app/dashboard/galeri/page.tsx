"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, Loader2 } from "lucide-react";
import axios from "@/lib/axios";

interface GaleriPhoto {
  id: number;
  title: string;
  image: string;
  category: string;
  createdAt: string;
}

const CATEGORIES = ["Umum", "Kegiatan", "Kaderisasi", "Sosial", "Organisasi", "Pelatihan"];

export default function GaleriPage() {
  const [photos, setPhotos] = useState<GaleriPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Umum");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch foto dari API
  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/galeri");
      if (res.data.status === "success") {
        setPhotos(res.data.data || []);
      }
    } catch (error) {
      console.error("Gagal memuat galeri:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setPreviewUrls(files.map(f => URL.createObjectURL(f)));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Judul foto wajib diisi.");
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Pilih minimal satu gambar terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      const imageUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (!uploadRes.data.success) throw new Error("Gagal upload gambar");
        imageUrls.push(uploadRes.data.url);
      }

      // 2. Simpan ke database dengan URL dipisah koma
      await axios.post("/api/galeri", { title, image: imageUrls.join(","), category });

      // 3. Reset form & refresh
      setTitle("");
      setCategory("Umum");
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsUploading(false);
      await fetchPhotos();
    } catch (error) {
      console.error("Gagal menyimpan foto:", error);
      alert("Gagal menyimpan foto ke galeri.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) return;
    try {
      await axios.delete(`/api/galeri/${id}`);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Manajemen Galeri</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Unggah dan kelola foto dokumentasi kegiatan IPNU. ({photos.length} foto)
          </p>
        </div>
        <Button
          onClick={() => setIsUploading(!isUploading)}
          className={`rounded-lg transition-all font-bold px-6 ${
            isUploading
              ? "bg-surface-container-low text-on-surface-variant hover:bg-[#E5E7EB] border border-outline-variant"
              : "bg-primary hover:bg-[#0B5A39] text-white"
          }`}
        >
          {isUploading ? "Batal" : (<><Plus className="h-5 w-5 mr-2" />Unggah Foto</>)}
        </Button>
      </div>

      {/* Upload Form */}
      {isUploading && (
        <div className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6 text-primary font-bold text-sm">
            <ImageIcon className="w-5 h-5" /> Form Unggah Foto
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Judul / Keterangan Foto <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all text-sm bg-surface-container-lowest text-on-surface"
                  placeholder="Contoh: Kegiatan Makesta 2026..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm bg-surface-container-lowest text-on-surface"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Pilih Gambar <span className="text-red-500">*</span></label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-primary file:text-white hover:file:bg-[#0B5A39] cursor-pointer"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-lg py-6 font-bold bg-primary hover:bg-[#0B5A39] text-white transition-colors mt-2"
              >
                {saving ? (
                  <span className="flex items-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" />Menyimpan...</span>
                ) : (
                  <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" />Simpan ke Galeri</span>
                )}
              </Button>
            </div>

            {/* Preview */}
            <div className="w-full h-full min-h-[200px] rounded-lg border border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant overflow-hidden p-4">
              {previewUrls.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-full overflow-y-auto max-h-[300px]">
                  {previewUrls.map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt={`Preview ${i}`} className="w-full aspect-square object-cover rounded-md" />
                  ))}
                </div>
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 mb-3 text-[#9CA3AF]" />
                  <span className="text-sm font-bold text-on-surface-variant">Pratinjau Gambar</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest">
          <ImageIcon className="w-16 h-16 text-on-surface-variant/30 mb-4" />
          <h3 className="text-lg font-bold text-on-surface mb-2">Belum Ada Foto</h3>
          <p className="text-sm text-on-surface-variant max-w-sm">
            Klik tombol "Unggah Foto" untuk menambahkan foto dokumentasi kegiatan ke galeri.
          </p>
        </div>
      )}

      {/* Gallery Grid */}
      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant transition-all duration-300 hover:border-primary">
              <div className="relative aspect-video w-full overflow-hidden bg-surface-container-low">
                {/* Ambil foto pertama jika ada koma */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.image.includes(',') ? photo.image.split(',')[0] : photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                {photo.image.includes(',') && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-medium">
                    +{photo.image.split(',').length - 1} Foto
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm text-[#da1e28] hover:text-white hover:bg-[#da1e28] p-2.5 rounded-lg border border-outline-variant opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 border-t border-outline-variant">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-on-surface text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{photo.title}</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0 ml-2">{photo.category}</span>
                </div>
                <p className="text-xs font-semibold text-on-surface-variant">
                  {new Date(photo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
