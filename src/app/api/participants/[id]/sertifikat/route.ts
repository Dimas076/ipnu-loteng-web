import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const body = await request.json();
    const { url } = body;

    const participant = await prisma.peserta.update({
      where: { id: parseInt(id) },
      data: { 
        sertifikat_file: url,
        status_sertifikat: 'approved' // Automatically approve if uploaded
      }
    });

    return NextResponse.json({ status: 'success', data: participant });
  } catch (error) {
    console.error("Gagal menyimpan sertifikat:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal menyimpan sertifikat' }, { status: 500 });
  }
}
