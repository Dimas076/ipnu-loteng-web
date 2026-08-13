"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.data.status === "success") {
        const { access_token, user } = response.data.data;
        login(access_token, user);
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        // Simulasi berhasil jika backend tidak ada
        const dummyUser = { id: 1, name: "Admin IPNU", email: email, roles: ['Super Admin'] };
        login("dummy_token_123", dummyUser);
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-background w-full">
      {/* KIRI: Visual/Branding (Sembunyi di Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-primary text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-16">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Beranda</span>
          </Link>
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary font-bold text-3xl mb-8 shadow-xl">
            IP
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Selamat Datang <br /> Kembali.
          </h1>
          <p className="text-xl text-white/80 max-w-md leading-relaxed font-medium">
            Masuk ke Sistem Informasi Terpadu Pelajar Nahdlatul Ulama Kabupaten Lombok Tengah.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 font-medium">© 2026 PC IPNU Lombok Tengah</p>
        </div>
      </div>

      {/* KANAN: Form Login */}
      <div className="w-full md:w-1/2 flex-1 flex flex-col px-6 py-6 sm:px-10 sm:pb-6 lg:px-16 xl:px-24 relative bg-white md:overflow-y-auto">
        {/* Mobile Header (Hanya terlihat di Mobile) */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
            IP
          </div>
          <Link href="/" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto md:my-auto">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Masuk ke Akun</h2>
            <p className="text-muted-foreground text-sm">Silakan masukkan kredensial Anda untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-start gap-3 mb-6 border border-destructive/20 shadow-sm">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground" htmlFor="email">Alamat Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@ipnuloteng.or.id"
                  className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white text-sm rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground" htmlFor="password">Kata Sandi</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white text-sm rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 mt-4 text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk Sekarang"}
            </Button>
          </form>

        </div>

        {/* Footer Text */}
        <div className="mt-auto pt-8 pb-0 text-center md:hidden">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 PC IPNU Lombok Tengah. <br /> Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}
