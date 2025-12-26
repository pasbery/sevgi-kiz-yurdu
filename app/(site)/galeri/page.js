import GalleryPageClient from '@/components/GalleryPageClient';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/galeri' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  return {
    title: seo?.title || generateTitle('gallery', {}, brandName),
    description: seo?.description || generateDescription('gallery'),
    keywords: seo?.keywords || generateKeywords('gallery'),
    alternates: {
      canonical: `${siteUrl}/galeri`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: seo?.title || `Galeri | ${brandName}`,
      description: seo?.description || 'Yurdumuzun odaları, ortak alanları, yemekhanesi ve etüt odalarından fotoğrafları inceleyin.',
      url: `${siteUrl}/galeri`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || `Galeri | ${brandName}`,
      description: seo?.description || 'Yurdumuzun odaları, ortak alanları, yemekhanesi ve etüt odalarından fotoğrafları inceleyin.',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function GaleriPage() {
  return <GalleryPageClient />;
}
