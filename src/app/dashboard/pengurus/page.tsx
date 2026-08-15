"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Edit
} from "lucide-react";

export default function PengurusPage() {
  const [loading, setLoading] = useState(false);
  const [pengurus, setPengurus] = useState<any[]>([]);

  useEffect(() => {
    const fetchPengurus = async () => {
      try {
        const res = await axios.get("/api/pengurus");
        const data = res.data;

        if (data.pengurus && data.pengurus.length > 0) {
          setPengurus(data.pengurus.map((p: any) => ({
            id: p.id,
            nama: p.nama,
            jabatan: p.jabatan,
            tier: p.tier.toString(),
            foto: null,
            fotoUrl: p.foto || "",
            divisi: p.divisi || ""
          })));
        } else {
          setPengurus([]);
        }
      } catch (error) {
        console.error("Error fetching pengurus data", error);
      }
    };
    fetchPengurus();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
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

      await axios.post("/api/pengurus", {
        pengurus: finalPengurus,
      });

      alert("Data pengurus berhasil disimpan!");
    } catch (error) {
      console.error("Error saving pengurus:", error);
      alert("Gagal menyimpan pengurus.");
    } finally {
      setLoading(false);
    }
  };

  const addPengurus = () => {
    setPengurus([{ id: Date.now(), nama: "", jabatan: "", divisi: "", tier: "3", foto: null, fotoUrl: "" }, ...pengurus]);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container p-6 rounded-xl border border-outline">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface flex items-center">
            <Users className="w-8 h-8 mr-3 text-primary" />
            Susunan Pengurus
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl text-sm leading-relaxed">
            Kelola susunan kepengurusan organisasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors overflow-hidden animate-in fade-in duration-300">
              <div className="border-b border-outline-variant bg-surface-container-low p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Data Pengurus
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">Data pengurus yang tampil di halaman pengurus publik.</p>
                </div>
                <Button type="button" onClick={addPengurus} variant="outline" className="w-full sm:w-auto rounded-lg h-9 text-xs font-bold border-primary text-primary hover:bg-[#EEF7F2] mt-4 sm:mt-0">
                  <Plus className="w-3 h-3 mr-1" /> Tambah Pengurus
                </Button>
              </div>
              <div className="p-6 sm:p-8 space-y-4">
                {pengurus.map((item, index) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-5 border border-outline-variant bg-surface-container-low items-center sm:items-start relative group">
                    
                    {/* Photo Placeholder */}
                    <div className="w-20 h-20 bg-surface-container-lowest border border-outline-variant flex flex-col items-center justify-center shrink-0 mx-auto sm:mx-0 relative overflow-hidden group/foto rounded-lg">
                      {(item.foto || item.fotoUrl) ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.foto ? URL.createObjectURL(item.foto) : item.fotoUrl} 
                            alt={item.nama} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-100 transition-opacity duration-300 z-10">
                            <label className="bg-surface-container-lowest/90 backdrop-blur-sm text-[#0d631b] hover:text-white hover:bg-[#0d631b] p-1.5 rounded border border-outline-variant transition-all duration-300 cursor-pointer">
                              <Edit className="w-3 h-3" />
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
                            <button 
                              type="button"
                              onClick={() => {
                                const newArr = [...pengurus];
                                newArr[index].foto = null;
                                newArr[index].fotoUrl = "";
                                setPengurus(newArr);
                              }}
                              className="bg-surface-container-lowest/90 backdrop-blur-sm text-[#da1e28] hover:text-white hover:bg-[#da1e28] p-1.5 rounded border border-outline-variant transition-all duration-300 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F4F6] transition-colors">
                          <ImageIcon className="w-6 h-6 text-[#9CA3AF] mb-1" />
                          <span className="text-[10px] font-bold text-[#9CA3AF]">FOTO</span>
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
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase">Divisi / Bagian</label>
                        <input 
                          type="text" 
                          value={item.divisi || ''}
                          onChange={(e) => {
                            const newArr = [...pengurus];
                            newArr[index].divisi = e.target.value;
                            setPengurus(newArr);
                          }}
                          placeholder="Cth: Departemen Organisasi"
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
