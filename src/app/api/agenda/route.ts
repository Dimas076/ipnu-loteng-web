import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');

    const agenda = await prisma.agenda.findMany({
      where: status ? { status } : undefined,
      orderBy: { date: 'asc' },
      take: limit ? parseInt(limit) : undefined,
    });
    return NextResponse.json({ status: 'success', data: agenda });
  } catch (error) {
    console.error("GET /api/agenda Error:", error);
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil data' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, date, endDate, location, map_link, latitude, longitude, whatsapp_group_link, status, image, rundown } = body;

    const agenda = await prisma.agenda.create({
      data: {
        title: title || 'Agenda Baru',
        description: description || '',
        category: category || 'Semua',
        date: date ? new Date(date) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        location: location || '',
        map_link: map_link || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        whatsapp_group_link: whatsapp_group_link || null,
        status: status || 'upcoming',
        image: image || null,
        rundown: rundown || null,
      }
    });

    return NextResponse.json({ status: 'success', message: 'Agenda berhasil disimpan.', data: agenda });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menyimpan agenda' }, { status: 500 });
  }
}
