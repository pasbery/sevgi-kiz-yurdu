const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default site config
  await prisma.siteConfig.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteUrl: 'https://www.dorukyurdu.com',
      siteDomain: 'dorukyurdu.com',
      brandName: 'Doruk Yurdu',
      brandFull: 'Doruk Kız Öğrenci Yurdu',
      brandSubtitle: 'Kız Öğrenci Yurdu',
      slogan: 'Güvenli ve Konforlu Konaklama',
      phone: '0276 123 45 67',
      phoneRaw: '02761234567',
      email: 'info@dorukyurdu.com',
      address: 'Uşak Merkez',
      workingHours: '7/24 Açık',
      whatsapp: '905001234567',
      mapEmbedUrl: ''
    }
  });
  console.log('✓ Site config created');

  // Create social media links
  const socialMediaData = [
    { icon: 'facebook-f', bg: 'bg-blue-600', url: 'https://www.facebook.com/dorukkizyurdu', name: 'Facebook', order: 0 },
    { icon: 'instagram', bg: 'bg-gradient-to-br from-purple-600 to-pink-500', url: 'https://www.instagram.com/usak_doruk_kiz_ogrenci_yurdu', name: 'Instagram', order: 1 },
    { icon: 'twitter', bg: 'bg-sky-500', url: 'https://twitter.com', name: 'Twitter', order: 2 },
    { icon: 'youtube', bg: 'bg-red-600', url: 'https://youtube.com', name: 'YouTube', order: 3 }
  ];

  await prisma.socialMedia.deleteMany({});
  for (const social of socialMediaData) {
    await prisma.socialMedia.create({ data: social });
  }
  console.log('✓ Social media links created');

  // Create room types
  const roomTypesData = [
    { slug: '1-kisilik', label: 'Tek Kişilik Konfor', price: 'Fiyat Alınız', description: 'Kendinize ait özel yaşam alanı', color: 'from-blue-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop', order: 0 },
    { slug: '2-kisilik', label: 'İki Kişilik Oda', price: 'Fiyat Alınız', description: 'Arkadaşınızla paylaşabileceğiniz ferah oda', color: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop', order: 1 },
    { slug: '3-kisilik', label: 'Üç Kişilik Oda', price: 'Fiyat Alınız', description: 'Sosyal ve ekonomik seçenek', color: 'from-green-500 to-emerald-500', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop', order: 2 },
    { slug: '4-kisilik', label: 'Dört Kişilik Oda', price: 'Fiyat Alınız', description: 'Geniş ve paylaşımcı yaşam alanı', color: 'from-orange-500 to-amber-500', image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop', order: 3 }
  ];

  await prisma.roomType.deleteMany({});
  for (const rt of roomTypesData) {
    const roomType = await prisma.roomType.create({ data: rt });
    
    // Create sample rooms for each type
    const roomsData = [
      {
        roomTypeId: roomType.id,
        name: `${rt.label} - A Blok`,
        floor: '1. Kat',
        view: 'Şehir Manzaralı',
        size: 'Geniş m²',
        status: 'available',
        description: 'Ortopedik yataklar, kişisel çalışma masası, geniş gardırop ve sınırsız fiber internet ile donatılmış modern oda.',
        features: JSON.stringify(['Ortopedik Yatak', 'Kişisel Çalışma Masası', 'Sınırsız Fiber İnternet', 'Kişisel Dolap', 'Buzdolabı']),
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop'
        ]),
        order: 0
      }
    ];

    for (const room of roomsData) {
      await prisma.room.create({ data: room });
    }
  }
  console.log('✓ Room types and rooms created');

  // Create gallery images
  const galleryData = [
    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=600&fit=crop', title: '2 Kişilik Oda', category: 'Odalar', order: 0 },
    { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=600&fit=crop', title: 'Yemekhane', category: 'Ortak Alanlar', order: 1 },
    { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=600&fit=crop', title: 'Oturma Salonu', category: 'Ortak Alanlar', order: 2 },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop', title: 'Etüt Odası', category: 'Ortak Alanlar', order: 3 },
    { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop', title: '1 Kişilik Oda', category: 'Odalar', order: 4 },
    { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop', title: 'Bahçe', category: 'Dış Mekan', order: 5 }
  ];

  await prisma.galleryImage.deleteMany({});
  for (const img of galleryData) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log('✓ Gallery images created');

  // Create testimonials
  const testimonialsData = [
    { name: 'Elif Kaya', initial: 'EK', color: 'from-purple-500 to-pink-500', text: '3 yıldır bu yurtta kalıyorum. Hem güvenlik hem de temizlik konusunda çok memnunum.', time: '2 ay önce', order: 0 },
    { name: 'Ayşe Yılmaz', initial: 'AY', color: 'from-blue-500 to-cyan-500', text: 'Ailemden uzakta olduğum için endişeliydim ama burada kendimi evimde gibi hissediyorum.', time: '1 ay önce', order: 1 },
    { name: 'Zeynep Demir', initial: 'ZD', color: 'from-green-500 to-emerald-500', text: 'Üniversiteye servis hizmeti hayat kurtarıcı. Odalar temiz ve konforlu.', time: '3 hafta önce', order: 2 },
    { name: 'Selin Aksoy', initial: 'SA', color: 'from-amber-500 to-orange-500', text: 'Yurdun konumu çok merkezi, her yere kolayca ulaşabiliyorum.', time: '1 hafta önce', order: 3 }
  ];

  await prisma.testimonial.deleteMany({});
  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: { ...t, rating: 5 } });
  }
  console.log('✓ Testimonials created');

  // Create FAQ (Sıkça Sorulan Sorular)
  const faqData = [
    { 
      question: 'Uşak yurt fiyatları 2025 ne kadar?',
      answer: 'Oda tiplerine göre fiyatlarımız değişmektedir. Tek kişilik, 2 kişilik, 3 kişilik ve 4 kişilik oda seçeneklerimiz bulunmaktadır. Güncel fiyat bilgisi için bizimle iletişime geçebilir veya Odalar sayfamızı ziyaret edebilirsiniz.',
      category: 'fiyat',
      order: 0
    },
    { 
      question: 'Uşak Üniversitesi\'ne ne kadar uzak?',
      answer: 'Yurdumuz Uşak Üniversitesi\'ne çok yakın, merkezi bir konumdadır. Üniversite servislerimiz düzenli olarak çalışmaktadır. Toplu taşıma ile de kolayca ulaşım sağlanabilir.',
      category: 'genel',
      order: 1
    },
    { 
      question: 'Yurtta 3 öğün yemek var mı?',
      answer: 'Evet, yurdumuzda sabah kahvaltısı, öğle yemeği ve akşam yemeği olmak üzere 3 öğün yemek hizmeti sunulmaktadır. Yemeklerimiz hijyenik koşullarda, besleyici ve lezzetli olarak hazırlanmaktadır.',
      category: 'yurt-hayati',
      order: 2
    },
    { 
      question: 'Kayıt için hangi belgeler gerekli?',
      answer: 'Kayıt için nüfus cüzdanı fotokopisi, öğrenci belgesi, 2 adet vesikalık fotoğraf ve veli izin belgesi gerekmektedir. Detaylı bilgi için bizimle iletişime geçebilirsiniz.',
      category: 'kayit',
      order: 3
    },
    { 
      question: 'Yurtta wifi var mı? Hızı nasıl?',
      answer: 'Evet, yurdumuzda tüm odalarda ve ortak alanlarda ücretsiz, yüksek hızlı fiber internet bulunmaktadır. Online ders ve araştırma için kesintisiz bağlantı sağlanmaktadır.',
      category: 'yurt-hayati',
      order: 4
    },
    { 
      question: 'Misafir kabul ediliyor mu?',
      answer: 'Yurdumuzda belirli saatler içinde ve önceden haber vermek koşuluyla ailelerin ziyareti kabul edilmektedir. Güvenlik nedeniyle gece konaklaması yapılamamaktadır.',
      category: 'yurt-hayati',
      order: 5
    },
    { 
      question: 'Yurtta klima var mı?',
      answer: 'Evet, tüm odalarımızda klima bulunmaktadır. Yaz ve kış aylarında konforlu bir ortam sağlanmaktadır.',
      category: 'yurt-hayati',
      order: 6
    },
    { 
      question: 'Çamaşır yıkama imkanı var mı?',
      answer: 'Evet, yurdumuzda öğrencilerimizin kullanımına açık çamaşırhane bulunmaktadır. Çamaşır makineleri ve kurutma makineleri mevcuttur.',
      category: 'yurt-hayati',
      order: 7
    },
    { 
      question: 'Etüt odası var mı?',
      answer: 'Evet, yurdumuzda sessiz ve ferah etüt odaları bulunmaktadır. 7/24 açık olan etüt odalarımızda rahatça çalışabilirsiniz.',
      category: 'yurt-hayati',
      order: 8
    },
    { 
      question: 'Yurt güvenliği nasıl sağlanıyor?',
      answer: 'Yurdumuzda 7/24 güvenlik personeli, kamera sistemi ve kartlı giriş sistemi bulunmaktadır. Erkek ziyaretçi girişi kesinlikle yasaktır. Öğrencilerimizin güvenliği en öncelikli konumuzdur.',
      category: 'genel',
      order: 9
    }
  ];

  await prisma.fAQ.deleteMany({});
  for (const faq of faqData) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✓ FAQ created');

  // Create SEO Metadata
  const seoData = [
    {
      pageRoute: '/',
      title: 'Uşak Kız Yurdu | Doruk Kız Öğrenci Yurdu - Üniversiteye En Yakın & Güvenli',
      description: 'Uşak\'ta yurt arayanlar için 1 numaralı tercih. MEB onaylı, depreme dayanıklı, her şey dahil konsept. Erken kayıt avantajlarını kaçırmayın!',
      keywords: 'uşak kız yurdu tavsiye, uşak en iyi özel yurt, uşak üniversitesi yurt fiyatları 2024, doruk kız yurdu, uşak merkez yurt'
    },
    {
      pageRoute: '/hakkimizda',
      title: 'Neden Doruk Kız Yurdu? | Uşak\'taki Güvenli Limanınız',
      description: '"Kızınız bize emanet." 2017\'den beri yüzlerce öğrenciyi mezun ettik. Cemaat/vakıf bağlantısı olmayan, Atatürk ilke ve inkılaplarına bağlı çağdaş yurt.',
      keywords: 'uşak güvenilir yurt, doruk yurdu kimin, uşak meb onaylı yurtlar, uşak çağdaş yurt'
    },
    {
      pageRoute: '/odalar',
      title: 'Uşak Yurt Fiyatları ve Oda Seçenekleri | 1-2-3-4 Kişilik Lüks Odalar',
      description: 'Sıkışık odalara son! Geniş, ferah ve modern dizayn edilmiş odalarımızı 360° sanal tur ile gezin. Bütçenize en uygun odayı hemen seçin.',
      keywords: 'uşak tek kişilik yurt fiyatları, uşak 2 kişilik yurt, uşak uygun fiyatlı yurt, uşak lüks yurt odası'
    },
    {
      pageRoute: '/galeri',
      title: 'Fotoğraf Galerisi | Doruk Kız Yurdu Yaşam Alanları',
      description: 'Gerçek fotoğraflarla yurdumuzu keşfedin. Odalar, etüt salonları, yemekhane ve sosyal alanlarımızı yakından inceleyin.',
      keywords: 'doruk kız yurdu fotoğrafları, uşak yurt görselleri, uşak yurt odası resimleri'
    },
    {
      pageRoute: '/iletisim',
      title: 'İletişim ve Konum | Uşak Üniversitesi\'ne En Kolay Ulaşım',
      description: 'Şehrin merkezinde, tüm sosyal alanlara yürüme mesafesinde. Üniversite duraklarına 2 dakika. Konumumuzu haritada inceleyin ve hemen arayın.',
      keywords: 'doruk kız yurdu telefon, doruk kız yurdu adres, uşak yurt yol tarifi, uşak üniversitesi yurt ulaşım'
    },
    {
      pageRoute: '/ozellikler',
      title: 'Uşak\'ta 5 Yıldızlı Otel Konforunda Öğrenci Yurdu Hizmetleri',
      description: 'Sadece uyumaya gelmeyin, yaşamaya gelin. Açık büfe kahvaltı, 4 çeşit akşam yemeği, sınırsız fiber internet, ücretsiz çamaşırhane ve etüt salonu.',
      keywords: 'uşak yemekli yurt, uşak servisli yurt, uşak her şey dahil yurt, uşak internetli yurt'
    },
    {
      pageRoute: '/odalar/1-kisilik',
      title: 'Tek Kişilik VIP Oda | Sessizlik ve Özel Alan İsteyenler İçin - Uşak',
      description: 'Kendinize ait özel bir krallık. Geniş çalışma masası, ortopedik yatak ve size özel depolama alanlarıyla maksimum konfor ve verimlilik.',
      keywords: 'uşak tek kişilik kız yurdu, uşak vip yurt odası, uşak özel oda fiyatları'
    },
    {
      pageRoute: '/odalar/2-kisilik',
      title: '2 Kişilik Konfor Oda | Arkadaşınla Birlikte Kal - Uşak Yurt',
      description: 'Hem sosyalleşin hem de özel alanınızı koruyun. İki kişilik geniş odalarımızda dostluklar kurarken derslerinize odaklanın.',
      keywords: 'uşak 2 kişilik yurt odası, arkadaşla kalınacak yurt, uşak çift kişilik oda'
    },
    {
      pageRoute: '/odalar/3-kisilik',
      title: '3 Kişilik Ferah Oda | Sosyal ve Ekonomik Konaklama - Uşak',
      description: 'Bütçe dostu ve konforlu. Geniş kullanım alanı, kişisel dolaplar ve aydınlık ortamıyla ideal öğrenci odası.',
      keywords: 'uşak 3 kişilik yurt fiyatı, uşak ekonomik yurt, uşak ucuz kız yurdu'
    },
    {
      pageRoute: '/odalar/4-kisilik',
      title: '4 Kişilik Geniş Oda | Paylaşımcı ve Eğlenceli - Uşak Yurt',
      description: 'Yalnızlık çekmek istemeyenler için. Geniş ve aydınlık 4 kişilik odalarımızda güvenli ve keyifli bir yurt deneyimi yaşayın.',
      keywords: 'uşak 4 kişilik yurt odası, uşak öğrenci yurdu oda arkadaşı'
    }
  ];

  await prisma.sEOMetadata.deleteMany({});
  for (const seo of seoData) {
    await prisma.sEOMetadata.create({ data: seo });
  }
  console.log('✓ SEO Metadata created');

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
