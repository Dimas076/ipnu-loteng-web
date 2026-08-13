import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const photos = await prisma.galeri.findMany({
      where: category && category !== 'Semua' ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });
    return NextResponse.json({ status: 'success', data: photos });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil galeri' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, image, category } = body;

    if (!title || !image) {
      return NextResponse.json({ status: 'error', message: 'Judul dan gambar wajib diisi' }, { status: 400 });
    }

    const photo = await prisma.galeri.create({
      data: {
        title,
        image,
        category: category || 'Umum',
      }
    });

    return NextResponse.json({ status: 'success', message: 'Foto berhasil disimpan.', data: photo });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menyimpan foto' }, { status: 500 });
  }
}
