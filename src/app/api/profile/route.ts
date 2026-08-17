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

    return NextResponse.json({
      status: 'success',
      profile: profile || null,
      pilars: pilars
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to fetch profile data', detail: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sejarahText, sejarahImageUrl, tentangKamiImage, arahGerak, heroImage1, heroImage2, heroImage3 } = body;

    // 1. Upsert Profile
    const updateData: any = {};
    if (sejarahText !== undefined) updateData.sejarah_text = sejarahText;
    if (sejarahImageUrl !== undefined) updateData.sejarah_image = sejarahImageUrl;
    if (tentangKamiImage !== undefined) updateData.tentang_kami_image = tentangKamiImage;
    if (heroImage1 !== undefined) updateData.hero_image_1 = heroImage1;
    if (heroImage2 !== undefined) updateData.hero_image_2 = heroImage2;
    if (heroImage3 !== undefined) updateData.hero_image_3 = heroImage3;

    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        ...updateData
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



    return NextResponse.json({ status: 'success', message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save profile' }, { status: 500 });
  }
}
