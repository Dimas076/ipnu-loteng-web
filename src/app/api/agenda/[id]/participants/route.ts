import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const participants = await prisma.peserta.findMany({
      where: { agendaId: parseInt(id) },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      status: 'success',
      data: participants
    });
  } catch (error) {
    console.error("Gagal mengambil peserta:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal memuat peserta' }, { status: 500 });
  }
}
