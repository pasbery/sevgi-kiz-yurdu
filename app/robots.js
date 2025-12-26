import prisma from '@/lib/prisma';

export default async function robots() {
  // Veritabanından site URL'ini al
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
