import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await prisma.agenda.delete({
      where: { id }
    });
    return NextResponse.json({ status: 'success', message: 'Agenda berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menghapus agenda' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const agenda = await prisma.agenda.findUnique({
      where: { id }
    });
    
    if (!agenda) {
      return NextResponse.json({ status: 'error', message: 'Agenda tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data: agenda });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil agenda' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json();
    const { title, description, category, date, endDate, location, map_link, latitude, longitude, whatsapp_group_link, status, image } = body;

    const agenda = await prisma.agenda.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        category: category || undefined,
        date: date ? new Date(date) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        location: location || undefined,
        map_link: map_link || null,
        latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : undefined,
        longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : undefined,
        whatsapp_group_link: whatsapp_group_link || null,
        status: status || undefined,
        image: image !== undefined ? image : undefined,
      }
    });

    return NextResponse.json({ status: 'success', message: 'Agenda berhasil diubah.', data: agenda });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengubah agenda' }, { status: 500 });
  }
}
