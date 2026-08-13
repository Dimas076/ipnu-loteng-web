"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">IPNU Lombok Tengah</h1>
          </div>

          <Card className="shadow-lg border-primary/10">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-2xl font-bold">Lupa Kata Sandi?</CardTitle>
              <CardDescription>
                Informasi pemulihan akun
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-6">
              
              <div className="bg-primary/10 p-4 rounded-full text-on-primary">
                <AlertCircle className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Saat ini fitur pengiriman email otomatis (Reset Password) sedang dalam tahap pengembangan.
                </p>
                <p className="text-sm font-medium text-foreground">
                  Untuk mereset kata sandi Anda, silakan hubungi Administrator Pimpinan Cabang melalui WhatsApp dengan menyertakan Nama dan Asal PAC Anda.
                </p>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white" asChild>
                <a href="https://wa.me/6281234567890?text=Halo%20Admin%20SIP-IPNU,%20saya%20lupa%20kata%20sandi%20akun%20saya." target="_blank" rel="noopener noreferrer">
                  Hubungi Admin via WhatsApp
                </a>
              </Button>

              <div className="mt-4">
                <Link href="/auth/login" className="text-sm text-primary hover:underline flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Halaman Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
