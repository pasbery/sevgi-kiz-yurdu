import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch page content by id
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('id');

    if (pageId) {
      const page = await prisma.pageContent.findUnique({
        where: { id: pageId }
      });

      if (!page) {
        return NextResponse.json({
          success: true,
          data: null
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          id: page.id,
          content: JSON.parse(page.content)
        }
      });
    }

    // Return all pages if no id specified
    const pages = await prisma.pageContent.findMany();
    
    return NextResponse.json({
      success: true,
      data: pages.map(p => ({
        id: p.id,
        content: JSON.parse(p.content)
      }))
    });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

// PUT - Update page content
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Page ID is required' },
        { status: 400 }
      );
    }

    await prisma.pageContent.upsert({
      where: { id },
      update: {
        content: JSON.stringify(content)
      },
      create: {
        id,
        content: JSON.stringify(content)
      }
    });

    return NextResponse.json({ success: true, message: 'Page content updated' });
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}
