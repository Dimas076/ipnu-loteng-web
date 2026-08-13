import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "Kontak | IPNU Lombok Tengah",
  description: "Hubungi pengurus cabang IPNU Lombok Tengah.",
};

export default function KontakPage() {
  return (
    <MainLayout>
      <div className="bg-primary/5 py-12 md:py-20 border-b text-on-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
            Hubungi <span className="font-semibold">Kami</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan, saran, atau ingin berkolaborasi? Kami siap mendengarkan dan merespons pesan Anda.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info Kontak */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
              <div className="grid gap-6">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0 text-on-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Alamat Sekretariat</h4>
                      <p className="text-muted-foreground mt-1">
                        Gedung PCNU Lombok Tengah<br />
                        Jl. Jenderal Sudirman, Kec. Praya<br />
                        Kabupaten Lombok Tengah, NTB 83511
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0 text-on-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Telepon / WhatsApp</h4>
                      <p className="text-muted-foreground mt-1">
                        +62 812 3456 7890 (Sekretariat)<br />
                        +62 819 8765 4321 (Humas)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0 text-on-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email</h4>
                      <p className="text-muted-foreground mt-1">
                        info@ipnuloteng.or.id<br />
                        sekretariat@ipnuloteng.or.id
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="p-0 flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-full shrink-0 text-on-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Jam Operasional</h4>
                      <p className="text-muted-foreground mt-1">
                        Senin - Jumat: 08.00 - 16.00 WITA<br />
                        Sabtu - Minggu: Tutup (Kecuali ada kegiatan khusus)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Kirim Pesan</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="name">Nama Lengkap</label>
                      <Input id="name" placeholder="Masukkan nama Anda" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="alamat@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="subject">Subjek</label>
                    <Input id="subject" placeholder="Perihal pesan" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="message">Pesan</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      className="flex w-full rounded-[12px] border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                      placeholder="Tulis pesan Anda di sini..."
                    ></textarea>
                  </div>
                  <Button type="button" className="w-full" size="lg">
                    Kirim Pesan Sekarang
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
