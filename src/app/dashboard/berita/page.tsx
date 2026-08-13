"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, FileText, Search, Filter, MoreHorizontal } from "lucide-react";

export default function BeritaPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await axios.delete(`/api/posts/${id}`);
        fetchPosts(); // Refresh list
      } catch (error) {
        console.error("Gagal menghapus berita:", error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Manajemen Berita</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Kelola, edit, dan publikasikan artikel IPNU.</p>
        </div>
        <Link href="/dashboard/berita/create">
          <Button className="rounded-lg transition-all font-bold px-6">
            <Plus className="h-5 w-5 mr-2" />
            Tulis Berita
          </Button>
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-6 border-b border-outline-variant flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Cari judul berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline rounded-lg text-sm focus:ring-1 focus:ring-[#0F6D46] focus:border-primary focus:outline-none transition-all bg-surface-container-lowest text-on-surface placeholder:text-[#9CA3AF]"
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto rounded-lg bg-surface-container-lowest text-on-surface-variant border-outline hover:bg-surface-container-low">
            <Filter className="h-4 w-4 mr-2 text-on-surface-variant" />
            Filter
          </Button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-surface-container-low text-on-surface border-b border-outline-variant font-bold">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Judul Berita</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap">Penulis</th>
                <th className="px-6 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                      <p className="text-muted-foreground font-medium">Memuat data berita...</p>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Belum Ada Berita</h3>
                        <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                          Anda belum menulis artikel atau berita apa pun. Mulai bagikan informasi penting sekarang!
                        </p>
                      </div>
                      <Link href="/dashboard/berita/create" className="mt-2">
                        <Button variant="outline" className="rounded-lg border-dashed border-2 border-border hover:border-primary hover:text-primary transition-colors">
                          <Plus className="h-4 w-4 mr-2" />
                          Buat Berita Pertama
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low border-b border-outline-variant transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-on-surface-variant shrink-0 group-hover:text-primary transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <p className="font-bold text-on-surface line-clamp-2 leading-tight">
                          {post.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold border tracking-wider ${
                        post.status === 'published' 
                          ? 'bg-[#DDF3E8] text-primary border-transparent' 
                          : 'bg-surface-container-lowest text-on-surface-variant border-outline'
                      }`}>
                        {post.status === 'published' && <span className="w-1.5 h-1.5 rounded-lg bg-primary mr-1.5 animate-pulse text-on-primary"></span>}
                        {post.status === 'published' ? 'Diterbitkan' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">
                      {post.author?.name || 'Admin'}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">
                      {new Date(post.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-on-surface-variant hover:text-primary hover:bg-[#EEF7F2]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-on-surface-variant hover:text-white hover:bg-[#da1e28]"
                          onClick={() => handleDelete(post.id)}
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
  );
}
