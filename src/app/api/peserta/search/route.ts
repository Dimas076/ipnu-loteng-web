import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hp = searchParams.get('hp');

    if (!hp) {
      return NextResponse.json({ status: 'error', message: 'Nomor HP wajib diisi' }, { status: 400 });
    }

    // Clean phone number (remove non-digits, replace 62 with 0 for flexible search)
    let cleanHp = hp.replace(/\D/g, '');
    if (cleanHp.startsWith('62')) {
      cleanHp = '0' + cleanHp.substring(2);
    } else if (!cleanHp.startsWith('0')) {
      cleanHp = '0' + cleanHp;
    }

    // Find all approved certificates for this phone number
    const peserta = await prisma.peserta.findMany({
      where: {
        OR: [
          { nomor_hp: hp }, // exact match
          { nomor_hp: cleanHp }, // cleaned match
          { nomor_hp: { endsWith: cleanHp.substring(1) } } // flexible match
        ],
        status_sertifikat: 'approved'
      },
      include: {
        agenda: true // include agenda details like title, date, etc.
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      status: 'success',
      data: peserta
    });
  } catch (error) {
    console.error("Gagal mencari sertifikat:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal mencari sertifikat' }, { status: 500 });
  }
}
