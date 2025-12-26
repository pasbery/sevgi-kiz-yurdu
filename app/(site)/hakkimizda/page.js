import AboutPageClient from '@/components/AboutPageClient';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/hakkimizda' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  return {
    title: seo?.title || generateTitle('about', {}, brandName),
    description: seo?.description || generateDescription('about'),
    keywords: seo?.keywords || generateKeywords('about'),
    alternates: {
      canonical: `${siteUrl}/hakkimizda`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: seo?.title || `Hakkımızda | ${brandName}`,
      description: seo?.description || 'Güvenli ve konforlu kız öğrenci yurdu hizmeti sunuyoruz.',
      url: `${siteUrl}/hakkimizda`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || `Hakkımızda | ${brandName}`,
      description: seo?.description || 'Güvenli ve konforlu kız öğrenci yurdu hizmeti sunuyoruz.',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function HakkimizdaPage() {
  return <AboutPageClient />;
}
