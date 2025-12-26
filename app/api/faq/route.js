import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Tüm FAQ'ları getir
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const showAll = searchParams.get('published') === 'false';

    if (id) {
      const faq = await prisma.fAQ.findUnique({
        where: { id }
      });
      return NextResponse.json({ success: true, data: faq });
    }

    const where = {};
    if (!showAll) {
      where.published = true;
    }
    if (category && category !== 'all') {
      where.category = category;
    }

    console.log('FAQ query where:', where);
    
    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    console.log('FAQ count:', faqs.length);
    
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Yeni FAQ ekle veya güncelle
export async function POST(request) {
  try {
    const body = await request.json();
    const { id, question, answer, category, order, published } = body;

    if (id) {
      // Güncelle
      const updated = await prisma.fAQ.update({
        where: { id },
        data: { question, answer, category, order, published }
      });
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Yeni ekle
      const created = await prisma.fAQ.create({
        data: {
          question,
          answer,
          category: category || 'genel',
          order: order || 0,
          published: published !== false
        }
      });
      return NextResponse.json({ success: true, data: created });
    }
  } catch (error) {
    console.error('Error saving FAQ:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE - FAQ sil
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID gerekli' }, { status: 400 });
    }

    await prisma.fAQ.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
