import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const agendas = await prisma.agenda.findMany();
  console.log(JSON.stringify(agendas, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
