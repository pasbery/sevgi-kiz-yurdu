import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch all room types with their rooms
export async function GET() {
  try {
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { order: 'asc' },
      include: {
        rooms: {
          orderBy: { order: 'asc' }
        }
      }
    });

    // Transform data to match frontend structure
    const transformedRoomTypes = roomTypes.map(rt => ({
      slug: rt.slug,
      label: rt.label,
      price: rt.price,
      description: rt.description,
      color: rt.color,
      image: rt.image
    }));

    const roomsDetail = {};
    roomTypes.forEach(rt => {
      roomsDetail[rt.slug] = {
        rooms: rt.rooms.map(r => ({
          id: r.id,
          name: r.name,
          floor: r.floor,
          view: r.view,
          size: r.size,
          status: r.status,
          description: r.description,
          features: JSON.parse(r.features || '[]'),
          images: JSON.parse(r.images || '[]')
        }))
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        roomTypes: transformedRoomTypes,
        roomsDetail
      }
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

// PUT - Update room types and rooms
export async function PUT(request) {
  try {
    const body = await request.json();
    const { roomTypes, roomsDetail } = body;

    // Update room types
    if (roomTypes && Array.isArray(roomTypes)) {
      // Get existing room types
      const existingSlugs = (await prisma.roomType.findMany({ select: { slug: true } })).map(r => r.slug);
      const newSlugs = roomTypes.map(rt => rt.slug);

      // Delete removed room types
      const slugsToDelete = existingSlugs.filter(s => !newSlugs.includes(s));
      if (slugsToDelete.length > 0) {
        await prisma.roomType.deleteMany({
          where: { slug: { in: slugsToDelete } }
        });
      }

      // Upsert room types
      for (let i = 0; i < roomTypes.length; i++) {
        const rt = roomTypes[i];
        await prisma.roomType.upsert({
          where: { slug: rt.slug },
          update: {
            label: rt.label,
            price: rt.price,
            description: rt.description,
            color: rt.color,
            image: rt.image,
            order: i
          },
          create: {
            slug: rt.slug,
            label: rt.label,
            price: rt.price,
            description: rt.description,
            color: rt.color,
            image: rt.image,
            order: i
          }
        });
      }
    }

    // Update rooms detail
    if (roomsDetail) {
      for (const [slug, detail] of Object.entries(roomsDetail)) {
        const roomType = await prisma.roomType.findUnique({ where: { slug } });
        if (!roomType) continue;

        // Delete existing rooms for this type
        await prisma.room.deleteMany({
          where: { roomTypeId: roomType.id }
        });

        // Create new rooms
        if (detail.rooms && Array.isArray(detail.rooms)) {
          for (let i = 0; i < detail.rooms.length; i++) {
            const room = detail.rooms[i];
            await prisma.room.create({
              data: {
                roomTypeId: roomType.id,
                name: room.name,
                floor: room.floor,
                view: room.view,
                size: room.size,
                status: room.status || 'available',
                description: room.description,
                features: JSON.stringify(room.features || []),
                images: JSON.stringify(room.images || []),
                order: i
              }
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Rooms updated' });
  } catch (error) {
    console.error('Error updating rooms:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update rooms' },
      { status: 500 }
    );
  }
}
