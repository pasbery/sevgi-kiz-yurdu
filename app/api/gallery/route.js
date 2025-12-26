import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: images.map(img => ({
        id: img.id,
        src: img.src,
        title: img.title,
        category: img.category
      }))
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery images
export async function PUT(request) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { success: false, error: 'Images array is required' },
        { status: 400 }
      );
    }

    // Delete all existing and recreate
    await prisma.galleryImage.deleteMany({});

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await prisma.galleryImage.create({
        data: {
          src: img.src,
          title: img.title,
          category: img.category || 'Genel',
          order: i
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Gallery updated' });
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery' },
      { status: 500 }
    );
  }
}
