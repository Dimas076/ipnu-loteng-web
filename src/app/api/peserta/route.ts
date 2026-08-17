import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { agendaId, nama_lengkap, asal_pimpinan, nomor_hp } = data;

    if (!agendaId || !nama_lengkap || !nomor_hp) {
      return NextResponse.json(
        { status: 'error', message: 'agendaId, nama_lengkap, dan nomor_hp wajib diisi' },
        { status: 400 }
      );
    }

    const newPeserta = await prisma.peserta.create({
      data: {
        agendaId: parseInt(agendaId),
        nama_lengkap,
        asal_pimpinan: asal_pimpinan || null,
        nomor_hp,
        status_sertifikat: 'pending'
      }
    });

    return NextResponse.json({
      status: 'success',
      data: newPeserta
    });
  } catch (error) {
    console.error("Gagal menambahkan peserta:", error);
    return NextResponse.json(
      { status: 'error', message: 'Gagal menambahkan peserta' },
      { status: 500 }
    );
  }
}
