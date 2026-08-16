import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // e.g. ?status=published
    const limit = searchParams.get('limit');   // e.g. ?limit=3

    const posts = await prisma.berita.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });
    return NextResponse.json({ status: 'success', data: posts });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal mengambil berita' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, status, image, category, excerpt, authorName } = body;

    const post = await prisma.berita.create({
      data: {
        title: title || 'Berita Baru',
        slug: slug || `berita-${Date.now()}`,
        content: content || '',
        excerpt: excerpt || null,
        status: status || 'draft',
        image: image || null,
        category: category || 'Umum',
        authorName: authorName || null,
      }
    });

    return NextResponse.json({ status: 'success', message: 'Berita berhasil disimpan.', data: post });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Gagal menyimpan berita' }, { status: 500 });
  }
}
