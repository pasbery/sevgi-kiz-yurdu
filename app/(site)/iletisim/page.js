import ContactPageClient from '@/components/ContactPageClient';
import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/iletisim' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  return {
    title: seo?.title || generateTitle('contact', {}, brandName),
    description: seo?.description || generateDescription('contact'),
    keywords: seo?.keywords || generateKeywords('contact'),
    alternates: {
      canonical: `${siteUrl}/iletisim`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title: seo?.title || `İletişim | ${brandName}`,
      description: seo?.description || 'Bizimle iletişime geçin. Adres, telefon, e-posta ve konum bilgilerimiz.',
      url: `${siteUrl}/iletisim`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.title || `İletişim | ${brandName}`,
      description: seo?.description || 'Bizimle iletişime geçin. Adres, telefon, e-posta ve konum bilgilerimiz.',
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

export default function IletisimPage() {
  return <ContactPageClient />;
}
