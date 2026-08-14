"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditPACPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    chairman: "",
    region: "",
    members: "",
    pk: "",
    pr: "",
    status: "Aktif"
  });

  useEffect(() => {
    const fetchPAC = async () => {
      try {
        const res = await fetch(`/api/pac/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name,
            chairman: data.chairman,
            region: data.region,
            members: data.members.toString(),
            pk: data.pk.toString(),
            pr: data.pr.toString(),
            status: data.status,
          });
        } else {
          alert("Gagal mengambil data PAC");
          router.push("/dashboard/pac");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchPAC();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/pac/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push("/dashboard/pac");
        router.refresh();
      } else {
        alert("Gagal memperbarui data PAC");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/pac">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Edit Data PAC</h1>
          <p className="text-on-surface-variant text-sm mt-1">Perbarui data Pimpinan Anak Cabang</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Nama PAC</label>
            <Input 
              required 
              placeholder="Contoh: PAC IPNU Praya" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Nama Ketua</label>
              <Input 
                required 
                placeholder="Nama lengkap ketua" 
                value={formData.chairman}
                onChange={(e) => setFormData({...formData, chairman: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Kecamatan / Wilayah</label>
              <Input 
                required 
                placeholder="Contoh: Kec. Praya" 
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Jumlah Anggota</label>
              <Input 
                type="number" 
                required 
                min="0"
                value={formData.members}
                onChange={(e) => setFormData({...formData, members: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Jumlah Pimpinan Ranting (PR)</label>
              <Input 
                type="number" 
                required 
                min="0"
                value={formData.pr}
                onChange={(e) => setFormData({...formData, pr: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Jumlah Pimpinan Komisariat (PK)</label>
              <Input 
                type="number" 
                required 
                min="0"
                value={formData.pk}
                onChange={(e) => setFormData({...formData, pk: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Status</label>
            <select 
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Aktif">Aktif</option>
              <option value="Kurang Aktif">Kurang Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant">
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-[#0B5A39] text-[#FFFFFF] font-bold">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
