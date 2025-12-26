import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all SEO records
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');
    const id = searchParams.get('id');

    if (id) {
      // Fetch specific record by ID
      const metadata = await prisma.sEOMetadata.findUnique({
        where: { id }
      });
      return NextResponse.json({ success: true, data: metadata });
    }

    if (route) {
      // Fetch specific route
      const metadata = await prisma.sEOMetadata.findUnique({
        where: { pageRoute: route }
      });
      return NextResponse.json({ success: true, data: metadata });
    }

    // Fetch all routes
    const allMetadata = await prisma.sEOMetadata.findMany({
      orderBy: { pageRoute: 'asc' }
    });

    return NextResponse.json({ success: true, data: allMetadata });
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SEO metadata' },
      { status: 500 }
    );
  }
}

// POST - Create or Update SEO record
export async function POST(request) {
  try {
    const body = await request.json();
    const { pageRoute, title, description, keywords, ogImage, canonicalUrl, noIndex } = body;

    const metadata = await prisma.sEOMetadata.upsert({
      where: { pageRoute },
      update: {
        title,
        description,
        keywords,
        ogImage,
        canonicalUrl,
        noIndex
      },
      create: {
        pageRoute,
        title,
        description,
        keywords,
        ogImage,
        canonicalUrl,
        noIndex
      }
    });

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    console.error('Error updating SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update SEO metadata' },
      { status: 500 }
    );
  }
}

// DELETE - Remove SEO record
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.sEOMetadata.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting SEO metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete SEO metadata' },
      { status: 500 }
    );
  }
}