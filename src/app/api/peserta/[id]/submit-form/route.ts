import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { responses } = body;

    if (!responses) {
      return NextResponse.json({ status: 'error', message: 'Jawaban evaluasi wajib diisi' }, { status: 400 });
    }

    const updatedPeserta = await prisma.peserta.update({
      where: { id: parseInt(id) },
      data: {
        sertifikat_form_responses: responses,
        has_filled_form: true
      }
    });

    return NextResponse.json({
      status: 'success',
      message: 'Evaluasi berhasil disimpan',
      data: updatedPeserta
    });
  } catch (error) {
    console.error("Gagal menyimpan evaluasi:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal menyimpan evaluasi' }, { status: 500 });
  }
}
