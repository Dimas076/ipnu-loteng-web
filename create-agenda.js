const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const currentYear = new Date().getFullYear();
  
  const agenda = await prisma.agenda.create({
    data: {
      title: "Dialog Publik HUT RI: Peran Pelajar dalam Mengisi Kemerdekaan",
      description: "Dalam rangka menyemarakkan Hari Ulang Tahun Republik Indonesia, PC IPNU Lombok Tengah menyelenggarakan Dialog Publik Kebangsaan.\n\nMari bersama-sama kita merefleksikan kembali semangat perjuangan para pahlawan dan merumuskan bagaimana kita, sebagai generasi terpelajar dan kader muda NU, bisa berkontribusi nyata bagi bangsa di era digital ini.\n\nFasilitas:\n- E-Sertifikat\n- Snack & Coffee Break\n- Ilmu & Relasi",
      category: "Dialog",
      date: new Date(`${currentYear}-08-16T13:00:00.000+08:00`), // 13:00 WITA
      location: "Bencingah Adiguna, Alun-Alun Tastura Lombok Tengah",
      latitude: -8.707740,
      longitude: 116.276850,
      status: "open",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
    }
  });
  console.log("Agenda berhasil dibuat:", agenda);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
