"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  History, 
  Target, 
  Users, 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp,
  ArrowDown,
  Image as ImageIcon 
} from "lucide-react";

export default function ProfilOrganisasiPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sejarah' | 'arah-gerak' | 'pengurus'>('sejarah');

  // State Mock Data
  const [sejarahText, setSejarahText] = useState("Ikatan Pelajar Nahdlatul Ulama (IPNU) didirikan secara resmi pada tanggal 24 Februari 1954 (20 Jumadil Akhir 1373 H) di Semarang, Jawa Tengah. Lahirnya IPNU diprakarsai pada saat pelaksanaan Konferensi Besar Lembaga Pendidikan Ma'arif NU.\n\nSebelum IPNU berdiri, telah banyak bermunculan perkumpulan pelajar berhaluan Ahlussunnah wal Jamaah yang bersifat kedaerahan, seperti Tsamrotul Mustafidin (Surabaya), Persano, dan PAMNO (Malang). Keinginan kuat untuk menyatukan seluruh potensi pelajar secara nasional inilah yang mendorong tokoh-tokoh pelopor seperti M. Shufyan Cholil, H. Musthafa, dan Prof. Dr. KH. M. Tolchah Mansoer (Ketua Umum Pertama) untuk mendirikan wadah bernama IPNU.\n\nDi Kabupaten Lombok Tengah, IPNU terus mengepakkan sayapnya sebagai Badan Otonom (Banom) NU yang mengayomi dan membina ribuan pelajar, santri, serta mahasiswa putra, demi mewujudkan generasi yang berilmu, berakhlakul karimah, dan tangguh di era modern.");
  const [sejarahImage, setSejarahImage] = useState<File | null>(null);
  const [sejarahImageUrl, setSejarahImageUrl] = useState("");
  
  const [arahGerak, setArahGerak] = useState([
    { id: 1, title: "Bergerak Riang Gembira", desc: "Menjalankan roda organisasi dengan penuh semangat, keikhlasan, dan kegembiraan, guna menciptakan iklim pergerakan yang positif bagi seluruh kader." },
    { id: 2, title: "Rekonsiliasi, Harmoni, Solid & Loyal", desc: "Menyatukan seluruh elemen pelajar NU dalam harmoni kebersamaan, membangun kesolidan, serta memupuk loyalitas tanpa batas kepada organisasi." },
    { id: 3, title: "Revitalisasi & Optimalisasi Kaderisasi", desc: "Menghidupkan kembali struktur kepengurusan hingga tingkat ranting dan mengoptimalkan sistem pengkaderan yang berkelanjutan dan terukur." }
  ]);

  const [pengurus, setPengurus] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        const data = res.data;
        if (data.profile) {
          setSejarahText(data.profile.sejarah_text || "");
          setSejarahImageUrl(data.profile.sejarah_image || "");
        }
        if (data.pilars && data.pilars.length > 0) {
          setArahGerak(data.pilars.map((p: any) => ({
            id: p.id,
            title: p.title,
            desc: p.description
          })));
        } else {
          setArahGerak([]);
        }
        if (data.pengurus && data.pengurus.length > 0) {
          setPengurus(data.pengurus.map((p: any) => ({
            id: p.id,
            nama: p.nama,
            jabatan: p.jabatan,
            tier: p.tier.toString(),
            foto: null,
            fotoUrl: p.foto || ""
          })));
        } else {
          setPengurus([]);
        }
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalSejarahUrl = sejarahImageUrl;
      if (sejarahImage) {
        const formData = new FormData();
        formData.append("file", sejarahImage);
        const res = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        finalSejarahUrl = res.data.url;
        setSejarahImageUrl(finalSejarahUrl);
        setSejarahImage(null);
      }

      const finalPengurus = await Promise.all(
        pengurus.map(async (p) => {
          let finalUrl = p.fotoUrl;
          if (p.foto) {
            const formData = new FormData();
            formData.append("file", p.foto);
            const res = await axios.post("/api/upload", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            finalUrl = res.data.url;
          }
          return { ...p, fotoUrl: finalUrl, foto: null };
        })
      );
      setPengurus(finalPengurus);

      await axios.post("/api/profile", {
        sejarahText,
        sejarahImageUrl: finalSejarahUrl,
        arahGerak,
        pengurus: finalPengurus,
      });

      alert("Data profil organisasi berhasil disimpan!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Gagal menyimpan profil.");
    } finally {
      setLoading(false);
    }
  };

  const addArahGerak = () => {
    setArahGerak([{ id: Date.now(), title: "", desc: "" }, ...arahGerak]);
  };

  const removeArahGerak = (id: number) => {
    setArahGerak(arahGerak.filter(item => item.id !== id));
  };

  const moveArahGerak = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newArr = [...arahGerak];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      setArahGerak(newArr);
    } else if (direction === 'down' && index < arahGerak.length - 1) {
      const newArr = [...arahGerak];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      setArahGerak(newArr);
    }
  };

  const addPengurus = () => {
    setPengurus([{ id: Date.now(), nama: "", jabatan: "", tier: "3", foto: null, fotoUrl: "" }, ...pengurus]);
  };

  const removePengurus = (id: number) => {
    setPengurus(pengurus.filter(item => item.id !== id));
  };

  const movePengurus = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newArr = [...pengurus];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      setPengurus(newArr);
    } else if (direction === 'down' && index < pengurus.length - 1) {
      const newArr = [...pengurus];
      [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
      setPengurus(newArr);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-lg border border-outline-variant flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Profil & Pengurus</h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">Kelola informasi sejarah, arah gerak, dan struktur kepengurusan IPNU Loteng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Navigasi */}
        <div className="flex flex-row overflow-x-auto overflow-y-hidden snap-x lg:flex-col lg:col-span-3 space-x-2 lg:space-x-0 lg:space-y-1 lg:sticky lg:top-28 h-fit pb-2 lg:pb-0 scrollbar-hide border-b border-outline-variant lg:border-b-0">
          <button 
            type="button"
            onClick={() => setActiveTab('sejarah')}
            className={`${activeTab === 'sejarah' ? 'bg-[#EEF7F2] text-primary border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-primary' : 'text-on-surface-variant border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent hover:bg-[#F5F7F8] hover:text-on-surface'} font-bold px-4 py-3 flex items-center justify-start cursor-pointer transition-colors rounded-lg whitespace-nowrap w-full text-left`}
          >
            <History className="w-4 h-4 mr-3" />
            Sejarah Organisasi
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('arah-gerak')}
            className={`${activeTab === 'arah-gerak' ? 'bg-[#EEF7F2] text-primary border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-primary' : 'text-on-surface-variant border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent hover:bg-[#F5F7F8] hover:text-on-surface'} font-bold px-4 py-3 flex items-center justify-start cursor-pointer transition-colors rounded-lg whitespace-nowrap w-full text-left`}
          >
            <Target className="w-4 h-4 mr-3" />
            Arah Gerak
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('pengurus')}
            className={`${activeTab === 'pengurus' ? 'bg-[#EEF7F2] text-primary border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-primary' : 'text-on-surface-variant border-b-[3px] lg:border-b-0 lg:border-l-[3px] border-transparent hover:bg-[#F5F7F8] hover:text-on-surface'} font-bold px-4 py-3 flex items-center justify-start cursor-pointer transition-colors rounded-lg whitespace-nowrap w-full text-left`}
          >
            <Users className="w-4 h-4 mr-3" />
            Susunan Pengurus
          </button>
        </div>

        {/* Kolom Kanan: Form */}
        <div className="lg:col-span-9 space-y-8">
          
          <form onSubmit={handleSave} className="space-y-8">
            
            {/* TAB SEJARAH */}
            {activeTab === 'sejarah' && (
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden animate-in fade-in duration-300">
                <div className="border-b border-outline-variant bg-surface-container-low p-6">
                  <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary" />
                    Sejarah Organisasi
                  </h2>
                </div>
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-on-surface">Foto Sejarah Organisasi</label>
                    <div className="relative group cursor-pointer w-full sm:w-1/2">
                      {(sejarahImageUrl || sejarahImage) ? (
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-outline-variant relative bg-surface-container-low">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={sejarahImage ? URL.createObjectURL(sejarahImage) : sejarahImageUrl} 
                            alt="Preview Sejarah" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-sm bg-black/50 px-3 py-1.5 rounded-lg">Ganti Foto</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-lg border border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant group-hover:bg-[#E5E7EB] transition-colors">
                          <ImageIcon className="h-8 w-8 mb-2 text-on-surface-variant group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium">Unggah Foto Sejarah</span>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSejarahImage(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface">Teks Sejarah Panjang</label>
                    <textarea 
                      rows={14}
                      value={sejarahText}
                      onChange={(e) => setSejarahText(e.target.value)}
                      className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all font-medium text-on-surface bg-surface-container-lowest resize-y leading-relaxed"
                    />
                    <p className="text-xs text-on-surface-variant">Gunakan paragraf yang jelas. Anda bisa menambahkan baris baru (Enter) untuk memisahkan paragraf.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB ARAH GERAK */}
            {activeTab === 'arah-gerak' && (
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden animate-in fade-in duration-300">
                <div className="border-b border-outline-variant bg-surface-container-low p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary" />
                      Arah Gerak (Visi & Misi)
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">Pilar utama pergerakan organisasi.</p>
                  </div>
                  <Button type="button" onClick={addArahGerak} variant="outline" className="w-full sm:w-auto rounded-lg h-9 text-xs font-bold border-primary text-primary hover:bg-[#EEF7F2] mt-4 sm:mt-0">
                    <Plus className="w-3 h-3 mr-1" /> Tambah Pilar
                  </Button>
                </div>
                <div className="p-6 sm:p-8 space-y-6">
                  {arahGerak.map((item, index) => (
                    <div key={item.id} className="p-5 border border-outline-variant bg-surface-container-low relative group">
                      <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => moveArahGerak(index, 'up')}
                          disabled={index === 0}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#EEF7F2]"
                          title="Pindah ke Atas"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveArahGerak(index, 'down')}
                          disabled={index === arahGerak.length - 1}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#EEF7F2]"
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeArahGerak(item.id)}
                          className="text-on-surface-variant hover:text-[#da1e28] p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#FFF1F1] ml-2"
                          title="Hapus Pilar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface">Judul Pilar {index + 1}</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => {
                              const newArr = [...arahGerak];
                              newArr[index].title = e.target.value;
                              setArahGerak(newArr);
                            }}
                            className="w-full px-3 py-2.5 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm font-bold bg-surface-container-lowest text-on-surface"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-on-surface">Deskripsi Pilar</label>
                          <textarea 
                            rows={3}
                            value={item.desc}
                            onChange={(e) => {
                              const newArr = [...arahGerak];
                              newArr[index].desc = e.target.value;
                              setArahGerak(newArr);
                            }}
                            className="w-full px-3 py-2.5 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm bg-surface-container-lowest text-on-surface-variant"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {arahGerak.length === 0 && (
                    <div className="text-center py-8 text-on-surface-variant text-sm border border-outline-variant bg-surface-container-low border-dashed">
                      Belum ada pilar arah gerak. Silakan tambahkan.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB PENGURUS */}
            {activeTab === 'pengurus' && (
              <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden animate-in fade-in duration-300">
                <div className="border-b border-outline-variant bg-surface-container-low p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                      <Users className="w-5 h-5 mr-2 text-primary" />
                      Susunan Pengurus
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">Data pengurus yang tampil di halaman profil publik.</p>
                  </div>
                  <Button type="button" onClick={addPengurus} variant="outline" className="w-full sm:w-auto rounded-lg h-9 text-xs font-bold border-primary text-primary hover:bg-[#EEF7F2] mt-4 sm:mt-0">
                    <Plus className="w-3 h-3 mr-1" /> Tambah Pengurus
                  </Button>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  {pengurus.map((item, index) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-5 border border-outline-variant bg-surface-container-low items-center sm:items-start relative group">
                      
                      {/* Photo Placeholder */}
                      <label className="w-20 h-20 bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center shrink-0 cursor-pointer hover:bg-[#F3F4F6] transition-colors mx-auto sm:mx-0 relative overflow-hidden group/foto">
                        {(item.foto || item.fotoUrl) ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={item.foto ? URL.createObjectURL(item.foto) : item.fotoUrl} 
                              alt={item.nama} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover/foto:flex">
                              <span className="text-[10px] font-bold text-white uppercase text-center leading-tight">Ganti<br/>Foto</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-[#9CA3AF] mb-1" />
                            <span className="text-[10px] font-bold text-[#9CA3AF]">FOTO</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const newArr = [...pengurus];
                              newArr[index].foto = e.target.files[0];
                              setPengurus(newArr);
                            }
                          }}
                        />
                      </label>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase">Nama Lengkap</label>
                          <input 
                            type="text" 
                            value={item.nama}
                            onChange={(e) => {
                              const newArr = [...pengurus];
                              newArr[index].nama = e.target.value;
                              setPengurus(newArr);
                            }}
                            placeholder="Cth: M. Abdul Ghafur"
                            className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm font-bold text-on-surface bg-surface-container-lowest"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase">Jabatan</label>
                          <input 
                            type="text" 
                            value={item.jabatan}
                            onChange={(e) => {
                              const newArr = [...pengurus];
                              newArr[index].jabatan = e.target.value;
                              setPengurus(newArr);
                            }}
                            placeholder="Cth: Ketua Umum"
                            className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm font-medium bg-surface-container-lowest text-on-surface-variant"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase">Tingkat Hirarki</label>
                          <select 
                            value={item.tier}
                            onChange={(e) => {
                              const newArr = [...pengurus];
                              newArr[index].tier = e.target.value;
                              setPengurus(newArr);
                            }}
                            className="w-full px-3 py-2 border border-outline rounded-lg focus:ring-1 focus:ring-[#0F6D46] focus:outline-none text-sm font-medium bg-surface-container-lowest text-on-surface-variant"
                          >
                            <option value="1">Tier 1 (Ketua - Tampil Besar)</option>
                            <option value="2">Tier 2 (Wakil - 2 Kolom)</option>
                            <option value="3">Tier 3 (Sek/Ben - 3 Kolom)</option>
                          </select>
                        </div>
                      </div>

                      <div className="absolute top-3 right-3 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => movePengurus(index, 'up')}
                          disabled={index === 0}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#EEF7F2]"
                          title="Pindah ke Atas"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => movePengurus(index, 'down')}
                          disabled={index === pengurus.length - 1}
                          className="text-on-surface-variant hover:text-primary disabled:opacity-30 disabled:hover:text-on-surface-variant p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#EEF7F2]"
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removePengurus(item.id)}
                          className="text-on-surface-variant hover:text-[#da1e28] p-1.5 bg-surface-container-lowest border border-outline-variant hover:bg-[#FFF1F1] ml-2"
                          title="Hapus Data Pengurus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pengurus.length === 0 && (
                    <div className="text-center py-8 text-on-surface-variant text-sm border border-outline-variant bg-surface-container-low border-dashed">
                      Belum ada data pengurus. Silakan klik Tambah Pengurus.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button Floating */}
            <div className="flex sm:justify-end pt-4 pb-10">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto rounded-lg px-10 py-6 font-bold bg-primary hover:bg-[#0B5A39] text-[#FFFFFF] transition-all text-on-primary"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-3 border-2 border-white/20 border-t-white rounded-full h-5 w-5"></span>
                    Menyimpan...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    Simpan Perubahan
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
