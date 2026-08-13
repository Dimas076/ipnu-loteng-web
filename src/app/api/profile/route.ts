import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: 1 }
    });
    
    const pilars = await prisma.pilar.findMany({
      orderBy: { order: 'asc' }
    });

    const pengurus = await prisma.pengurus.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      status: 'success',
      profile: profile || null,
      pilars: pilars,
      pengurus: pengurus
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch profile data', detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sejarahText, sejarahImageUrl, arahGerak, pengurus } = body;

    // 1. Upsert Profile
    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        sejarah_text: sejarahText,
        sejarah_image: sejarahImageUrl
      },
      create: {
        id: 1,
        sejarah_text: sejarahText,
        sejarah_image: sejarahImageUrl
      }
    });

    // 2. Sync Pilars
    if (Array.isArray(arahGerak)) {
      // Delete existing
      await prisma.pilar.deleteMany();
      
      // Create new
      if (arahGerak.length > 0) {
        await Promise.all(
          arahGerak.map((item: any, index: number) => 
            prisma.pilar.create({
              data: {
                title: item.title || '',
                description: item.desc || item.description || '',
                order: index
              }
            })
          )
        );
      }
    }

    // 3. Sync Pengurus
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
                tier: parseInt(item.tier) || 3,
                foto: item.fotoUrl || null,
                order: index
              }
            })
          )
        );
      }
    }

    return NextResponse.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save profile' }, { status: 500 });
  }
}
