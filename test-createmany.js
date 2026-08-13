const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.pengurus.createMany({
      data: [
        { nama: 'Test 1', jabatan: 'Test 1' },
        { nama: 'Test 2', jabatan: 'Test 2' }
      ]
    });
    console.log("createMany succeeded");
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
