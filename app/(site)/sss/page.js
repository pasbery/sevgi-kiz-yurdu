import prisma from '@/lib/prisma';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';
import FAQClient from '@/components/FAQClient';

export async function generateMetadata() {
  const seo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/sss' }
  });

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;
  const brandName = config.brandFull;

  const title = seo?.title || 'Sıkça Sorulan Sorular (SSS) | ' + brandName;
  const description = seo?.description || 'Uşak kız yurdu hakkında merak edilenler. Yurt fiyatları, kayıt, yemek, wifi, güvenlik ve daha fazlası hakkında sorularınızın cevapları.';
  const keywords = seo?.keywords || 'uşak yurt sss, uşak yurt fiyatları, uşak yurt kayıt, doruk yurdu sorular, uşak kız yurdu hakkında';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${siteUrl}/sss`,
    },
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/sss`,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

async function getFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    });
    return faqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

async function getSiteConfig() {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
    return config;
  } catch (error) {
    return null;
  }
}

export default async function SSSPage() {
  const faqs = await getFAQs();
  const config = await getSiteConfig();
  const siteUrl = config.siteUrl;

  // FAQPage Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FAQClient initialFaqs={faqs} />
    </>
  );
}
