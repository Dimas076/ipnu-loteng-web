import { MainLayout } from "@/components/layouts/MainLayout";
import prisma from "@/lib/prisma";
import PacClient from "./PacClient";

export const metadata = {
  title: "Direktori PAC | IPNU Lombok Tengah",
  description: "Daftar Pimpinan Anak Cabang (PAC) IPNU se-Kabupaten Lombok Tengah.",
};

export const revalidate = 60;

export default async function PacPage() {
  const pacs = await prisma.pAC.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <MainLayout>
      <PacClient initialData={pacs} />
    </MainLayout>
  );
}
