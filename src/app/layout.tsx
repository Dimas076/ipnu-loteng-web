import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SiteProvider } from "@/contexts/SiteContext";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});



export const metadata: Metadata = {
  title: {
    default: "IPNU Lombok Tengah | Belajar, Berjuang, Bertaqwa",
    template: "%s | IPNU Lombok Tengah"
  },
  description: "Portal resmi Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama (PC IPNU) Kabupaten Lombok Tengah. Pusat informasi kegiatan, direktori, dan kajian pelajar.",
  openGraph: {
    title: "IPNU Lombok Tengah",
    description: "Portal resmi Pimpinan Cabang Ikatan Pelajar Nahdlatul Ulama (PC IPNU) Kabupaten Lombok Tengah.",
    url: "https://ipnuloteng.or.id",
    siteName: "IPNU Lombok Tengah",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/id/3/3a/Logo_IPNU.png",
        width: 800,
        height: 600,
        alt: "Logo IPNU",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-background text-foreground">
        <SiteProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
