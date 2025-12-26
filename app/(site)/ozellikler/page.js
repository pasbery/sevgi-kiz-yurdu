import FeaturesPageClient from '@/components/FeaturesPageClient';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/ozellikler' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
    alternates: {
      canonical: `${siteUrl}/ozellikler`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: seo?.title || `Özellikler & Hizmetler | ${brandName}`,
      description: seo?.description || '7/24 Güvenlik, 3 Öğün Yemek, Fiber İnternet ve daha fazlası.',
      url: `${siteUrl}/ozellikler`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || `Özellikler & Hizmetler | ${brandName}`,
      description: seo?.description || '7/24 Güvenlik, 3 Öğün Yemek, Fiber İnternet ve daha fazlası.',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function OzelliklerPage() {
  return <FeaturesPageClient />;
}
