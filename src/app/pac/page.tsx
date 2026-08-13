import { MainLayout } from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Direktori PAC | IPNU Lombok Tengah",
  description: "Daftar Pimpinan Anak Cabang (PAC) IPNU se-Kabupaten Lombok Tengah.",
};

const MOCK_PAC = [
  { slug: "praya", name: "PAC IPNU Praya", address: "Kec. Praya", members: 120, pk: 12, pr: 8 },
  { slug: "praya-tengah", name: "PAC IPNU Praya Tengah", address: "Kec. Praya Tengah", members: 85, pk: 8, pr: 5 },
  { slug: "praya-barat", name: "PAC IPNU Praya Barat", address: "Kec. Praya Barat", members: 92, pk: 10, pr: 6 },
  { slug: "praya-barat-daya", name: "PAC IPNU Praya Barat Daya", address: "Kec. Praya Barat Daya", members: 78, pk: 9, pr: 4 },
  { slug: "jonggat", name: "PAC IPNU Jonggat", address: "Kec. Jonggat", members: 150, pk: 15, pr: 12 },
  { slug: "pujut", name: "PAC IPNU Pujut", address: "Kec. Pujut", members: 110, pk: 14, pr: 7 },
  { slug: "kopang", name: "PAC IPNU Kopang", address: "Kec. Kopang", members: 135, pk: 11, pr: 9 },
  { slug: "mantang", name: "PAC IPNU Mantang", address: "Kec. Mantang", members: 60, pk: 6, pr: 3 },
  { slug: "batukliang", name: "PAC IPNU Batukliang", address: "Kec. Batukliang", members: 145, pk: 13, pr: 11 },
];

export default function PacPage() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-primary/5 to-background py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0F172A] mb-4">
            Direktori <span className="font-semibold">PAC</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg">
            Jaringan Pimpinan Anak Cabang IPNU yang tersebar di seluruh kecamatan se-Lombok Tengah.
          </p>
          
          <div className="max-w-xl mx-auto relative group mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari PAC berdasarkan kecamatan..." 
              className="w-full h-12 pl-12 pr-4 bg-white border border-border/80 hover:border-primary/50 focus:border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm text-base transition-all"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PAC.map((pac) => (
            <Card key={pac.slug} className="hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-4 border-b border-muted">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center font-bold shrink-0 border border-primary/20 text-on-primary">
                    {pac.name.charAt(9)}
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors leading-tight mb-1">
                      {pac.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1 shrink-0" />
                      {pac.address}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0F172A]">{pac.pk}</p>
                    <p className="text-xs text-muted-foreground">Komisariat</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0F172A]">{pac.pr}</p>
                    <p className="text-xs text-muted-foreground">Ranting</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{pac.members}</p>
                    <p className="text-xs text-muted-foreground">Anggota</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/pac/${pac.slug}`}>
                    Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
