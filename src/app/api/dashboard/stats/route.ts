import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalBerita,
      totalAgenda,
      agendaSelesai,
      totalPengurus,
      totalGaleri,
    ] = await Promise.all([
      prisma.berita.count({ where: { status: 'published' } }),
      prisma.agenda.count(),
      prisma.agenda.count({ where: { status: 'completed' } }),
      prisma.pengurus.count(),
      prisma.galeri.count(),
    ]);

    return NextResponse.json({
      status: 'success',
      data: {
        totalBerita,
        totalAgenda,
        agendaSelesai,
        totalPengurus,
        totalGaleri,
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil statistik' }, { status: 500 });
  }
}
