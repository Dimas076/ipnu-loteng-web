const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 1 }
    });
    console.log("Profile:", profile);
    
    const pilars = await prisma.pilar.findMany();
    console.log("Pilars:", pilars);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
