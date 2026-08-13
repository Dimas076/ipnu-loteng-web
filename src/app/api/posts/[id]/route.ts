import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    await prisma.berita.delete({ where: { id } });
    return NextResponse.json({ status: 'success', message: 'Berita berhasil dihapus.' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menghapus berita' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const post = await prisma.berita.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ status: 'error', message: 'Berita tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data: post });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil berita' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    const body = await request.json();
    const { title, content, status, image, category, excerpt } = body;

    const post = await prisma.berita.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
        excerpt: excerpt !== undefined ? excerpt : undefined,
        status: status || undefined,
        image: image !== undefined ? image : undefined,
        category: category || undefined,
      }
    });

    return NextResponse.json({ status: 'success', message: 'Berita berhasil diubah.', data: post });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengubah berita' }, { status: 500 });
  }
}
