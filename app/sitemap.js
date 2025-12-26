import { roomsData } from '@/data/roomsData';
import { getAllDepartmentSlugs } from '@/data/departments';
import prisma from '@/lib/prisma';

export default async function sitemap() {
  // Veritabanından site URL'ini ve güncellenme tarihlerini al
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const baseUrl = config.siteUrl;
  const siteUpdatedAt = config.updatedAt || new Date();

  // Sayfa içeriklerinin güncellenme tarihlerini al
  const pages = await prisma.pageContent.findMany();
  const pageUpdates = {};
  pages.forEach(page => {
    pageUpdates[page.id] = page.updatedAt;
  });

  // Oda tiplerinin güncellenme tarihlerini al
  const rooms = await prisma.roomType.findMany();
  const roomUpdates = {};
  rooms.forEach(room => {
    roomUpdates[room.slug] = room.updatedAt;
  });

  // Statik sayfalar - dinamik lastModified
  const routes = [
    { route: '', pageId: 'homepage', priority: 1 },
    { route: '/hakkimizda', pageId: 'about', priority: 0.8 },
    { route: '/odalar', pageId: 'rooms', priority: 0.9 },
    { route: '/ozellikler', pageId: 'features', priority: 0.8 },
    { route: '/galeri', pageId: 'gallery', priority: 0.7 },
    { route: '/iletisim', pageId: 'contact', priority: 0.8 },
    { route: '/sss', pageId: 'faq', priority: 0.7 },
  ].map(({ route, pageId, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: pageUpdates[pageId] || siteUpdatedAt,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority,
  }));

  // Dinamik oda sayfaları - dinamik lastModified
  const roomRoutes = Object.keys(roomsData).map((slug) => ({
    url: `${baseUrl}/odalar/${slug}`,
    lastModified: roomUpdates[slug] || siteUpdatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dinamik bölüm sayfaları
  const departmentRoutes = getAllDepartmentSlugs().map((slug) => ({
    url: `${baseUrl}/yurt/${slug}`,
    lastModified: siteUpdatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...routes, ...roomRoutes, ...departmentRoutes];
}
