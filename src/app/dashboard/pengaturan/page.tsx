"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { User, Lock, Save, LayoutGrid, Link2, Image as ImageIcon, Trash2, Edit } from "lucide-react";
import { useSite } from "@/contexts/SiteContext";

export default function PengaturanPage() {
  const [loading, setLoading] = useState(false);
  const { logoUrl, setLogoUrl } = useSite();
  const [previewLogo, setPreviewLogo] = useState<string | null>(logoUrl);
  const [activeTab, setActiveTab] = useState<'profil' | 'web'>('profil');

  // Hero Images State
  const [heroImage1Url, setHeroImage1Url] = useState("");
  const [heroImage2Url, setHeroImage2Url] = useState("");
  const [heroImage3Url, setHeroImage3Url] = useState("");
  const [tentangKamiImageUrl, setTentangKamiImageUrl] = useState("");
  const [heroImage1File, setHeroImage1File] = useState<File | null>(null);
  const [heroImage2File, setHeroImage2File] = useState<File | null>(null);
  const [heroImage3File, setHeroImage3File] = useState<File | null>(null);
  const [tentangKamiImageFile, setTentangKamiImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/profile");
        if (res.data.profile) {
          setHeroImage1Url(res.data.profile.hero_image_1 || "");
          setHeroImage2Url(res.data.profile.hero_image_2 || "");
          setHeroImage3Url(res.data.profile.hero_image_3 || "");
          setTentangKamiImageUrl(res.data.profile.tentang_kami_image || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Upload new hero images if any
      let finalHero1 = heroImage1Url;
      let finalHero2 = heroImage2Url;
      let finalHero3 = heroImage3Url;
      let finalTentangKami = tentangKamiImageUrl;

      const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data.url;
      };

      if (heroImage1File) finalHero1 = await uploadImage(heroImage1File);
      if (heroImage2File) finalHero2 = await uploadImage(heroImage2File);
      if (heroImage3File) finalHero3 = await uploadImage(heroImage3File);
      if (tentangKamiImageFile) finalTentangKami = await uploadImage(tentangKamiImageFile);

      // 2. Update Profile DB
      await axios.post("/api/profile", {
        heroImage1: finalHero1,
        heroImage2: finalHero2,
        heroImage3: finalHero3,
        tentangKamiImage: finalTentangKami,
      });

      // 3. Update Context
      setLogoUrl(previewLogo);
      setHeroImage1Url(finalHero1);
      setHeroImage2Url(finalHero2);
      setHeroImage3Url(finalHero3);
      setTentangKamiImageUrl(finalTentangKami);
      setHeroImage1File(null);
      setHeroImage2File(null);
      setHeroImage3File(null);
      setTentangKamiImageFile(null);

      alert("Pengaturan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-lg border border-outline-variant">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Pengaturan Sistem</h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">Kelola informasi profil admin dan konfigurasi website publik Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Navigasi Pengaturan */}
        <div className="flex flex-row overflow-x-auto lg:flex-col lg:col-span-3 space-x-2 lg:space-x-0 lg:space-y-1 lg:sticky lg:top-28 h-fit pb-2 lg:pb-0">
          <button 
            type="button"
            onClick={() => setActiveTab('profil')}
            className={`${activeTab === 'profil' ? 'bg-[#EEF7F2] text-primary border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-primary' : 'text-on-surface-variant border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent hover:bg-[#F5F7F8] hover:text-on-surface'} font-bold px-4 py-3 flex items-center justify-start cursor-pointer transition-colors rounded-lg whitespace-nowrap w-full text-left`}
          >
            <User className="w-4 h-4 mr-3" />
            Profil & Keamanan
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('web')}
            className={`${activeTab === 'web' ? 'bg-[#EEF7F2] text-primary border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-primary' : 'text-on-surface-variant border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent hover:bg-[#F5F7F8] hover:text-on-surface'} font-bold px-4 py-3 flex items-center justify-start cursor-pointer transition-colors rounded-lg whitespace-nowrap w-full text-left`}
          >
            <LayoutGrid className="w-4 h-4 mr-3" />
            Konfigurasi Website
          </button>
        </div>

        {/* Kolom Kanan: Form Pengaturan */}
        <div className="lg:col-span-9 space-y-8">
          
          <form onSubmit={handleSave} className="space-y-8">
            
            {activeTab === 'profil' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      Profil Administrator
                    </h2>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface">Nama Lengkap</label>
                        <input 
                          type="text" 
                          defaultValue="Admin IPNU"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface">Email Utama</label>
                        <input 
                          type="email" 
                          defaultValue="admin@ipnuloteng.or.id"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-primary" />
                      Keamanan & Kata Sandi
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant">Kata Sandi Baru</label>
                        <input 
                          type="password" 
                          placeholder="Minimal 8 karakter..."
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all bg-surface-container-lowest placeholder:text-[#9CA3AF] text-on-surface"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-on-surface-variant">Konfirmasi Sandi Baru</label>
                        <input 
                          type="password" 
                          placeholder="Ulangi sandi baru..."
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all bg-surface-container-lowest placeholder:text-[#9CA3AF] text-on-surface"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'web' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Card 1: Logo & Identitas Visual */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      Logo & Identitas Visual
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Ubah logo IPNU yang akan tampil di navigasi web dan dashboard Anda.</p>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      {/* Current Logo Preview */}
                      <div className="w-24 h-24 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center shrink-0 overflow-hidden relative group">
                        {previewLogo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={previewLogo} alt="Preview" className="w-full h-full object-contain" />
                        ) : (
                          <span className="font-bold text-2xl text-on-surface-variant">IP</span>
                        )}
                      </div>
                      
                      <div className="space-y-3 flex-1 w-full">
                        <label className="text-sm font-bold text-on-surface">Unggah Logo Baru</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#DDF3E8] file:text-primary hover:file:bg-[#EEF7F2] file:transition-colors file:cursor-pointer cursor-pointer border border-outline rounded-lg p-2 bg-surface-container-lowest"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-on-surface-variant font-medium">Format: PNG (Transparan) rasio 1:1. Maksimal 2MB.</p>
                          {previewLogo && (
                            <button type="button" onClick={() => setPreviewLogo(null)} className="text-xs text-[#da1e28] font-bold hover:underline flex items-center">
                              <Trash2 className="w-3 h-3 mr-1" /> Hapus Logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Foto Hero Homepage */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden mt-8">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      Foto Hero Halaman Utama
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Tiga foto ini akan ditampilkan pada bagian hero (paling atas) di halaman utama website.</p>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Foto Hero 1 */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-on-surface">Foto Utama (Besar Kiri)</label>
                        <div className="relative group cursor-pointer w-full">
                          {(heroImage1Url || heroImage1File) ? (
                            <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant relative bg-surface-container-low">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={heroImage1File ? URL.createObjectURL(heroImage1File) : heroImage1Url} alt="Hero 1" className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 flex items-center gap-2">
                                <label className="text-white cursor-pointer p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors shadow-sm" title="Ubah Foto">
                                  <Edit className="w-4 h-4" />
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage1File(e.target.files[0]) }} />
                                </label>
                                <button type="button" onClick={() => { setHeroImage1File(null); setHeroImage1Url(""); }} className="text-white cursor-pointer p-2 bg-[#da1e28]/80 hover:bg-[#da1e28] rounded-lg transition-colors shadow-sm" title="Hapus Foto">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-40 rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                              <ImageIcon className="h-6 w-6 mb-2" />
                              <span className="text-xs font-medium">Upload Foto 1</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage1File(e.target.files[0]) }} />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Foto Hero 2 */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-on-surface">Foto 2 (Kanan Atas)</label>
                        <div className="relative group cursor-pointer w-full">
                          {(heroImage2Url || heroImage2File) ? (
                            <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant relative bg-surface-container-low">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={heroImage2File ? URL.createObjectURL(heroImage2File) : heroImage2Url} alt="Hero 2" className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 flex items-center gap-2">
                                <label className="text-white cursor-pointer p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors shadow-sm" title="Ubah Foto">
                                  <Edit className="w-4 h-4" />
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage2File(e.target.files[0]) }} />
                                </label>
                                <button type="button" onClick={() => { setHeroImage2File(null); setHeroImage2Url(""); }} className="text-white cursor-pointer p-2 bg-[#da1e28]/80 hover:bg-[#da1e28] rounded-lg transition-colors shadow-sm" title="Hapus Foto">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-40 rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                              <ImageIcon className="h-6 w-6 mb-2" />
                              <span className="text-xs font-medium">Upload Foto 2</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage2File(e.target.files[0]) }} />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Foto Hero 3 */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-on-surface">Foto 3 (Kanan Bawah)</label>
                        <div className="relative group cursor-pointer w-full">
                          {(heroImage3Url || heroImage3File) ? (
                            <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant relative bg-surface-container-low">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={heroImage3File ? URL.createObjectURL(heroImage3File) : heroImage3Url} alt="Hero 3" className="w-full h-full object-cover" />
                              <div className="absolute top-2 right-2 flex items-center gap-2">
                                <label className="text-white cursor-pointer p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors shadow-sm" title="Ubah Foto">
                                  <Edit className="w-4 h-4" />
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage3File(e.target.files[0]) }} />
                                </label>
                                <button type="button" onClick={() => { setHeroImage3File(null); setHeroImage3Url(""); }} className="text-white cursor-pointer p-2 bg-[#da1e28]/80 hover:bg-[#da1e28] rounded-lg transition-colors shadow-sm" title="Hapus Foto">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="w-full h-40 rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                              <ImageIcon className="h-6 w-6 mb-2" />
                              <span className="text-xs font-medium">Upload Foto 3</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setHeroImage3File(e.target.files[0]) }} />
                            </label>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Card 2B: Pengaturan Foto Tentang Kami (Beranda) */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden mt-8">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                      Foto Tentang Kami (Halaman Utama)
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Foto ini akan ditampilkan di bagian Tentang Kami pada halaman utama (Beranda).</p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="max-w-md space-y-3">
                      <label className="text-sm font-bold text-on-surface">Upload Foto</label>
                      <div className="relative group cursor-pointer w-full">
                        {(tentangKamiImageUrl || tentangKamiImageFile) ? (
                          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant relative bg-surface-container-low">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tentangKamiImageFile ? URL.createObjectURL(tentangKamiImageFile) : tentangKamiImageUrl} alt="Tentang Kami" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex items-center gap-2">
                              <label className="text-white cursor-pointer p-2 bg-black/60 rounded-lg hover:bg-black/80 transition-colors shadow-sm" title="Ubah Foto">
                                <Edit className="w-4 h-4" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setTentangKamiImageFile(e.target.files[0]) }} />
                              </label>
                              <button type="button" onClick={() => { setTentangKamiImageFile(null); setTentangKamiImageUrl(""); }} className="text-white cursor-pointer p-2 bg-[#da1e28]/80 hover:bg-[#da1e28] rounded-lg transition-colors shadow-sm" title="Hapus Foto">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="w-full aspect-[4/3] rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-sm font-medium">Upload Foto Tentang Kami</span>
                            <span className="text-xs mt-1">Rekomendasi rasio 4:3</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { if(e.target.files?.[0]) setTentangKamiImageFile(e.target.files[0]) }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Pengaturan Web Publik (Informasi Website) */}
                <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden mt-8">
                  <div className="border-b border-outline-variant bg-surface-container-low p-6">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <LayoutGrid className="w-5 h-5 mr-2 text-primary" />
                      Informasi Website
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1 font-medium">Data ini akan ditampilkan di halaman kontak pengunjung.</p>
                  </div>
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-on-surface">Alamat Sekretariat</label>
                      <textarea 
                        rows={3}
                        defaultValue="Gedung PCNU Kab. Lombok Tengah, Jl. Basuki Rahmat, Praya"
                        className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface">Nomor Telepon / WA</label>
                        <input 
                          type="text" 
                          defaultValue="+62 812-3456-7890"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center">
                          <Link2 className="w-3 h-3 mr-1 text-on-surface-variant" />
                          Link Instagram
                        </label>
                        <input 
                          type="url" 
                          defaultValue="https://instagram.com/ipnuloteng"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center">
                          <Link2 className="w-3 h-3 mr-1 text-on-surface-variant" />
                          Link Facebook
                        </label>
                        <input 
                          type="url" 
                          defaultValue="https://facebook.com/ipnuloteng"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-on-surface flex items-center">
                          <Link2 className="w-3 h-3 mr-1 text-on-surface-variant" />
                          Link YouTube
                        </label>
                        <input 
                          type="url" 
                          defaultValue="https://youtube.com/@ipnuloteng"
                          className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Submit Button Floating */}
            <div className="flex justify-end pt-4 pb-10">
              <Button 
                type="submit" 
                disabled={loading}
                className="rounded-lg px-10 py-6 font-bold bg-primary hover:bg-[#0B5A39] text-[#FFFFFF] transition-all text-on-primary"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-3 border-2 border-white/20 border-t-white rounded-full h-5 w-5"></span>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Semua Pengaturan
                  </span>
                )}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
