import RoomsPageClient from '@/components/RoomsPageClient';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/odalar' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  return {
    title: seo?.title || generateTitle('rooms', {}, brandName),
    description: seo?.description || generateDescription('rooms'),
    keywords: seo?.keywords || generateKeywords('rooms'),
    alternates: {
      canonical: `${siteUrl}/odalar`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: seo?.title || `Odalarımız | ${brandName}`,
      description: seo?.description || '1, 2, 3 ve 4 kişilik konforlu, güvenli ve modern öğrenci odalarımızı inceleyin.',
      url: `${siteUrl}/odalar`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || `Odalarımız | ${brandName}`,
      description: seo?.description || '1, 2, 3 ve 4 kişilik konforlu, güvenli ve modern öğrenci odalarımızı inceleyin.',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function OdalarPage() {
  return <RoomsPageClient />;
}
