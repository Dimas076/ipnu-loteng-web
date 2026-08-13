const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test participant...");
  
  // Create an agenda if none exists
  let agenda = await prisma.agenda.findFirst();
  if (!agenda) {
    agenda = await prisma.agenda.create({
      data: {
        title: "Pelatihan Kepemimpinan Dasar",
        description: "PKD IPNU 2026",
        category: "Pelatihan",
        date: new Date(),
        location: "Gedung NU Center",
      }
    });
  }

  // Create a test participant
  const peserta = await prisma.peserta.create({
    data: {
      agendaId: agenda.id,
      nama_lengkap: "Ahmad Kader",
      asal_pimpinan: "PAC Praya",
      nomor_hp: "081234567890",
      status_sertifikat: "pending"
    }
  });

  console.log(`Berhasil membuat peserta tes: ${peserta.nama_lengkap} (HP: ${peserta.nomor_hp})`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
