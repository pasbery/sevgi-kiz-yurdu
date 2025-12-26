const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding contact and rooms page content...');

  // Contact page content
  const contactContent = {
    hero: {
      badge: 'Bize Ulaşın',
      title: 'İletişim',
      highlight: 'Bilgileri',
      description: 'Sorularınız, görüşleriniz veya kayıt işlemleri için bizimle iletişime geçebilirsiniz.'
    },
    contactSectionTitle: 'İletişim Kanalları',
    socialSectionTitle: 'Sosyal Medya',
    form: {
      title: 'Bize Yazın',
      submitButton: 'Gönder',
      subjects: ['Bilgi Almak İstiyorum', 'Kayıt İşlemleri', 'Fiyat Bilgisi', 'Diğer']
    }
  };

  await prisma.pageContent.upsert({
    where: { id: 'contact' },
    update: { content: JSON.stringify(contactContent) },
    create: { id: 'contact', content: JSON.stringify(contactContent) }
  });
  console.log('✓ Contact page content created');

  // Rooms page content
  const roomsContent = {
    hero: {
      title: 'Odalarımız',
      description: 'Her bütçeye ve ihtiyaca uygun, konforlu yaşam alanları'
    }
  };

  await prisma.pageContent.upsert({
    where: { id: 'rooms' },
    update: { content: JSON.stringify(roomsContent) },
    create: { id: 'rooms', content: JSON.stringify(roomsContent) }
  });
  console.log('✓ Rooms page content created');

  console.log('\n✅ Contact and Rooms pages seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
