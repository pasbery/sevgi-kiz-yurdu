import RoomDetailPageClient from '@/components/RoomDetailPageClient';
import { roomsData } from '@/data/roomsData';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

async function getSiteUrl() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  return config.siteUrl;
}

export async function generateMetadata({ params }) {
  const siteUrl = await getSiteUrl();
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const brandName = config.brandFull;

  // Get room data first
  const room = roomsData[params.slug];

  // 1. Check for manual override in DB
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: `/odalar/${params.slug}` }
  });

  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords || generateKeywords('room-detail', { roomSlug: params.slug, roomLabel: room?.title }),
      alternates: {
        canonical: `${siteUrl}/odalar/${params.slug}`,
      },
      robots: {
        index: !seo.noIndex,
        follow: !seo.noIndex,
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: `${siteUrl}/odalar/${params.slug}`,
        images: [`${siteUrl}/og-image.svg`],
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.title,
        description: seo.description,
        images: [`${siteUrl}/og-image.svg`],
      },
    };
  }

  // 2. Fallback to automated generation from roomsData
  if (!room) {
    return {
      title: 'Oda Bulunamadı',
      description: 'Aradığınız oda tipi bulunamadı.',
    };
  }

  return {
    title: generateTitle('room-detail', { roomLabel: room.title }, brandName),
    description: generateDescription('room-detail', { roomLabel: room.title, roomDescription: room.subtitle }),
    keywords: generateKeywords('room-detail', { roomSlug: params.slug, roomLabel: room.title }),
    alternates: {
      canonical: `${siteUrl}/odalar/${params.slug}`,
    },
    openGraph: {
      title: `${room.title} | ${brandName}`,
      description: `${room.title} - ${room.subtitle}`,
      url: `${siteUrl}/odalar/${params.slug}`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${room.title} | ${brandName}`,
      description: `${room.title} - ${room.subtitle}`,
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function RoomDetailPage({ params }) {
  return <RoomDetailPageClient slug={params.slug} />;
}

