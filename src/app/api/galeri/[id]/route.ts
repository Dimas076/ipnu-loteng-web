import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await prisma.galeri.delete({ where: { id } });
    return NextResponse.json({ status: 'success', message: 'Foto berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menghapus foto' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json();
    const { title, image, category } = body;

    const photo = await prisma.galeri.update({
      where: { id },
      data: {
        title: title || undefined,
        image: image || undefined,
        category: category || undefined,
      }
    });

    return NextResponse.json({ status: 'success', message: 'Foto berhasil diubah.', data: photo });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengubah foto' }, { status: 500 });
  }
}
