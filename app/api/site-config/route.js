import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch site config
export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: 'main' }
    });

    // If no config exists, create default one
    if (!config) {
      config = await prisma.siteConfig.create({
        data: { id: 'main' }
      });
    }

    // Fetch social media
    const socialMedia = await prisma.socialMedia.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        site: {
          url: config.siteUrl,
          domain: config.siteDomain
        },
        brand: {
          name: config.brandName,
          fullName: config.brandFull,
          subtitle: config.brandSubtitle,
          description: config.brandDesc,
          slogan: config.slogan
        },
        contact: {
          phone: config.phone,
          phoneRaw: config.phoneRaw,
          email: config.email,
          address: config.address,
          workingHours: config.workingHours,
          whatsapp: config.whatsapp
        },
        socialMedia: socialMedia.map(s => ({
          id: s.id,
          icon: s.icon,
          bg: s.bg,
          url: s.url,
          name: s.name
        })),
        map: {
          embedUrl: config.mapEmbedUrl
        }
      }
    });
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site config' },
      { status: 500 }
    );
  }
}

// PUT - Update site config
export async function PUT(request) {
  try {
    const body = await request.json();
    const { site, brand, contact, socialMedia, map } = body;

    // Update main config
    const config = await prisma.siteConfig.upsert({
      where: { id: 'main' },
      update: {
        siteUrl: site?.url,
        siteDomain: site?.domain,
        brandName: brand?.name,
        brandFull: brand?.fullName,
        brandSubtitle: brand?.subtitle,
        brandDesc: brand?.description,
        slogan: brand?.slogan,
        keywords: brand?.keywords,
        phone: contact?.phone,
        phoneRaw: contact?.phoneRaw,
        email: contact?.email,
        address: contact?.address,
        workingHours: contact?.workingHours,
        whatsapp: contact?.whatsapp,
        mapEmbedUrl: map?.embedUrl
      },
      create: {
        id: 'main',
        siteUrl: site?.url,
        siteDomain: site?.domain,
        brandName: brand?.name,
        brandFull: brand?.fullName,
        brandSubtitle: brand?.subtitle,
        brandDesc: brand?.description,
        slogan: brand?.slogan,
        keywords: brand?.keywords,
        phone: contact?.phone,
        phoneRaw: contact?.phoneRaw,
        email: contact?.email,
        address: contact?.address,
        workingHours: contact?.workingHours,
        whatsapp: contact?.whatsapp,
        mapEmbedUrl: map?.embedUrl
      }
    });

    // Update social media if provided
    if (socialMedia && Array.isArray(socialMedia)) {
      // Delete existing and recreate
      await prisma.socialMedia.deleteMany({});
      
      for (let i = 0; i < socialMedia.length; i++) {
        const s = socialMedia[i];
        await prisma.socialMedia.create({
          data: {
            icon: s.icon,
            bg: s.bg,
            url: s.url,
            name: s.name,
            order: i
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Site config updated' });
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site config' },
      { status: 500 }
    );
  }
}
