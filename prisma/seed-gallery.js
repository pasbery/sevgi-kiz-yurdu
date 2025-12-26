const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding gallery page content...');

  const galleryContent = {
    hero: {
      title: 'Fotoğraf',
      highlight: 'Galerisi',
      description: 'Öğrencilerimizin güvenli ve konforlu yaşam alanlarını yakından inceleyin.'
    },
    categories: [
      { id: 'all', name: 'Tümü', icon: 'fa-th-large' },
      { id: 'odalar', name: 'Odalar', icon: 'fa-bed' },
      { id: 'yemekhane', name: 'Yemekhane', icon: 'fa-utensils' },
      { id: 'ortak', name: 'Ortak Alanlar', icon: 'fa-couch' },
      { id: 'etut', name: 'Etüt Odaları', icon: 'fa-book-reader' }
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop', category: 'odalar', title: '2 Kişilik Oda' },
      { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', category: 'odalar', title: '1 Kişilik Oda' },
      { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop', category: 'yemekhane', title: 'Modern Yemekhane' },
      { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', category: 'ortak', title: 'Oturma Salonu' },
      { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', category: 'ortak', title: 'TV & Oyun Odası' },
      { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop', category: 'odalar', title: 'Yurt Dış Cephe' },
      { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', category: 'etut', title: 'Sessiz Etüt Odası' },
      { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', category: 'etut', title: 'Grup Çalışma Masaları' }
    ]
  };

  await prisma.pageContent.upsert({
    where: { id: 'gallery' },
    update: { content: JSON.stringify(galleryContent) },
    create: { id: 'gallery', content: JSON.stringify(galleryContent) }
  });
  console.log('✓ Gallery page content created');

  console.log('\n✅ Gallery page seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding gallery:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
