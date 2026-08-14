"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, MapPin, Users, Edit, Building2, User, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PACPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pacData, setPacData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPACs = async () => {
    try {
      const res = await fetch("/api/pac");
      if (res.ok) {
        const data = await res.json();
        setPacData(data);
      }
    } catch (error) {
      console.error("Error fetching PACs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPACs();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus PAC ini?")) {
      try {
        const res = await fetch(`/api/pac/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchPACs();
        }
      } catch (error) {
        console.error("Error deleting PAC:", error);
      }
    }
  };

  const filteredPacs = pacData.filter((pac) => 
    pac.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pac.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMembers = pacData.reduce((acc, pac) => acc + pac.members, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Manajemen PAC</h1>
          <p className="text-on-surface-variant font-medium text-sm mt-1">Kelola data Pimpinan Anak Cabang se-Lombok Tengah</p>
        </div>
        <Button className="rounded-lg transition-all font-bold px-6 bg-primary hover:bg-[#0B5A39] text-[#FFFFFF] text-on-primary" asChild>
          <Link href="/dashboard/pac/create">
            <Plus className="h-5 w-5 mr-2" />
            Tambah Data PAC
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors group flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface group-hover:text-primary transition-colors">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Total PAC Terdaftar</p>
            <p className="text-3xl font-extrabold text-on-surface">{pacData.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-6 border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors group flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface group-hover:text-primary transition-colors">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">Total Keseluruhan Anggota</p>
            <p className="text-3xl font-extrabold text-on-surface">{totalMembers}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-outline-variant bg-surface-container-lowest">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-on-surface" />
            </div>
            <input
              type="text"
              placeholder="Cari nama PAC atau Kecamatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline rounded-lg text-sm font-medium focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Memuat data...</div>
          ) : filteredPacs.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">Belum ada data PAC.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPacs.map((pac) => (
                <div key={pac.id} className="flex flex-col sm:flex-row bg-surface-container-lowest border border-outline-variant hover:border-primary hover:bg-surface-container-low rounded-lg p-5 transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-on-surface">{pac.name}</h3>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${pac.status === 'Aktif' ? 'bg-[#DDF3E8] text-primary border-transparent' : 'bg-surface-container-lowest text-on-surface-variant border-outline'}`}>
                        {pac.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center text-sm font-medium text-on-surface">
                        <User className="w-4 h-4 mr-2 text-on-surface" />
                        Ketua: <span className="text-on-surface ml-1 font-bold">{pac.chairman}</span>
                      </div>
                      <div className="flex items-center text-sm font-medium text-on-surface">
                        <MapPin className="w-4 h-4 mr-2 text-on-surface" />
                        Wilayah: {pac.region}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col items-center justify-between sm:justify-center gap-4 sm:pl-6 sm:border-l border-outline-variant">
                    <div className="text-center">
                      <p className="text-xs font-bold text-on-surface uppercase tracking-wider">Anggota</p>
                      <p className="text-2xl font-extrabold text-primary">{pac.members}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg font-bold text-on-surface border-outline bg-surface-container-low hover:bg-[#111827] hover:text-[#FFFFFF] transition-colors" asChild>
                        <Link href={`/dashboard/pac/edit/${pac.id}`}>
                          <Edit className="w-4 h-4 mr-1.5" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" className="rounded-lg font-bold transition-colors" onClick={() => handleDelete(pac.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
