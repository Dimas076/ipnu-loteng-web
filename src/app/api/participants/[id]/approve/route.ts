import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const updatedPeserta = await prisma.peserta.update({
      where: { id: parseInt(id) },
      data: { status_sertifikat: 'approved' }
    });

    return NextResponse.json({ status: 'success', message: 'Sertifikat disetujui.', data: updatedPeserta });
  } catch (error) {
    console.error("Gagal menyetujui sertifikat:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal menyetujui sertifikat' }, { status: 500 });
  }
}
