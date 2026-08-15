import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const pengurus = await prisma.pengurus.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      status: 'success',
      pengurus: pengurus
    });
  } catch (error: any) {
    console.error('Error fetching pengurus:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch pengurus data', detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pengurus } = body;

    // Sync Pengurus
    if (Array.isArray(pengurus)) {
      // Delete existing
      await prisma.pengurus.deleteMany();
      
      // Create new
      if (pengurus.length > 0) {
        await Promise.all(
          pengurus.map((item: any, index: number) => 
            prisma.pengurus.create({
              data: {
                nama: item.nama || '',
                jabatan: item.jabatan || '',
                divisi: item.divisi || null,
                tier: parseInt(item.tier) || 3,
                foto: item.fotoUrl || null,
                order: index
              }
            })
          )
        );
      }
    }

    return NextResponse.json({ status: 'success', message: 'Pengurus updated successfully' });
  } catch (error) {
    console.error('Error saving pengurus:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save pengurus' }, { status: 500 });
  }
}
