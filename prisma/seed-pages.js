const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding page content...');

  // Homepage content
  const homepageContent = {
    heroData: {
      badge: '2024-2025 Kayıtları Başladı',
      title: 'Evinizden Uzakta,',
      highlight: 'Sıcak Bir Yuva',
      description: 'Güvenli, konforlu ve huzurlu bir yaşam alanı.',
      stats: {
        students: '500+',
        experience: '15+',
        rating: '4.9'
      },
      statsLabels: {
        students: 'Mutlu Öğrenci',
        experience: 'Yıl Tecrübe',
        rating: 'Puan'
      },
      floatingImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=700&fit=crop',
      slides: [
        { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop', title: 'Yurt Odası' },
        { img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop', title: 'Ortak Alan' },
        { img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=300&fit=crop', title: 'Çalışma Alanı' }
      ],
      floatingCards: [
        { icon: 'fa-shield-alt', color: 'bg-green-100 text-green-600', title: '7/24 Güvenlik', subtitle: 'Kamera Sistemi', image: null, size: 20 },
        { icon: 'fa-wifi', color: 'bg-purple-100 text-purple-600', title: 'Yüksek Hızlı', subtitle: 'Fiber İnternet', image: null, size: 20 },
        { icon: 'fa-utensils', color: 'bg-orange-100 text-orange-600', title: '3 Öğün', subtitle: 'Yemek Dahil', image: null, size: 20 }
      ]
    },
    aboutData: {
      sectionTitle: 'Hakkımızda',
      title: 'Öğrencilerimizin',
      highlight: 'İkinci Evi',
      description: '2009 yılından bu yana, üniversite öğrencilerine güvenli, konforlu ve aile sıcaklığında bir yaşam alanı sunuyoruz. Modern tesislerimiz ve deneyimli kadromuzla, başarınıza odaklanmanız için buradayız.',
      experience: '15+',
      experienceLabel: 'Yıllık Deneyim',
      features: ['Merkezi Konum', 'Modern Odalar', '3 Öğün Yemek', 'Etüt Odaları'],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop'
    },
    featuresData: {
      title: 'Neden',
      highlight: 'Doruk Yurdu?',
      subtitle: 'Özelliklerimiz',
      items: [
        { icon: 'fa-shield-alt', color: 'from-green-400 to-emerald-500', title: '7/24 Güvenlik', desc: 'Kesintisiz koruma.', image: null, size: 24 },
        { icon: 'fa-utensils', color: 'from-orange-400 to-pink-500', title: '3 Öğün Yemek', desc: 'Sağlıklı yemekler.', image: null, size: 24 },
        { icon: 'fa-wifi', color: 'from-blue-400 to-indigo-500', title: 'Fiber İnternet', desc: 'Hızlı internet.', image: null, size: 24 },
        { icon: 'fa-book-reader', color: 'from-purple-400 to-violet-500', title: 'Etüt Odaları', desc: 'Çalışma alanları.', image: null, size: 24 },
        { icon: 'fa-tshirt', color: 'from-pink-400 to-rose-500', title: 'Çamaşırhane', desc: 'Modern makineler.', image: null, size: 24 },
        { icon: 'fa-tv', color: 'from-cyan-400 to-teal-500', title: 'Sosyal Alanlar', desc: 'TV ve dinlenme.', image: null, size: 24 },
        { icon: 'fa-snowflake', color: 'from-sky-400 to-blue-500', title: 'Klima Sistemi', desc: 'Yıl boyu konfor.', image: null, size: 24 },
        { icon: 'fa-bus', color: 'from-amber-400 to-yellow-500', title: 'Servis Hizmeti', desc: 'Kolay ulaşım.', image: null, size: 24 }
      ]
    },
    galleryData: {
      title: 'Yurdumuzdan',
      highlight: 'Kareler',
      subtitle: 'Galeri',
      images: [
        { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=600&fit=crop', title: '2 Kişilik Oda' },
        { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=600&fit=crop', title: 'Yemekhane' },
        { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=600&fit=crop', title: 'Oturma Salonu' },
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop', title: 'Etüt Odası' }
      ]
    },
    testimonialsData: {
      title: 'Öğrencilerimiz',
      highlight: 'Ne Diyor?',
      subtitle: 'Yorumlar',
      items: [
        { name: 'Elif Kaya', initial: 'EK', color: 'from-purple-500 to-pink-500', text: '3 yıldır bu yurtta kalıyorum. Hem güvenlik hem de temizlik konusunda çok memnunum. Personel her zaman ilgili.', time: '2 ay önce' },
        { name: 'Ayşe Yılmaz', initial: 'AY', color: 'from-blue-500 to-cyan-500', text: 'Ailemden uzakta olduğum için endişeliydim ama burada kendimi evimde gibi hissediyorum. Yemekler çok lezzetli.', time: '1 ay önce' },
        { name: 'Zeynep Demir', initial: 'ZD', color: 'from-green-500 to-emerald-500', text: 'Üniversiteye servis hizmeti hayat kurtarıcı. Odalar temiz ve konforlu. İnternet hızı da çok iyi.', time: '3 hafta önce' },
        { name: 'Selin Aksoy', initial: 'SA', color: 'from-amber-500 to-orange-500', text: 'Yurdun konumu çok merkezi, her yere kolayca ulaşabiliyorum. Yönetim ve personel çok ilgili.', time: '1 hafta önce' }
      ]
    },
    ctaData: {
      title: 'Yerinizi Ayırtın!',
      description: '2024-2025 akademik yılı için kayıtlarımız devam ediyor. Sınırlı kontenjanımız dolmadan yerinizi garantiye alın.',
      phoneButton: 'Hemen Ara: 0312 123 45 67',
      whatsappButton: 'WhatsApp'
    }
  };

  await prisma.pageContent.upsert({
    where: { id: 'homepage' },
    update: { content: JSON.stringify(homepageContent) },
    create: { id: 'homepage', content: JSON.stringify(homepageContent) }
  });
  console.log('✓ Homepage content created');

  // About page content
  const aboutContent = {
    header: {
      title: 'Hakkımızda',
      description: '15 yılı aşkın tecrübemizle öğrencilerimize güvenli ve konforlu bir yaşam alanı sunuyoruz'
    },
    main: {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop',
      title: 'Öğrencilerimizin',
      highlight: 'İkinci Evi',
      description1: '2009 yılından bu yana, üniversite öğrencilerine güvenli ve konforlu bir yaşam alanı sunuyoruz. Doruk Kız Öğrenci Yurdu olarak misyonumuz, öğrencilerimizin akademik başarılarına odaklanabilecekleri, huzurlu ve destekleyici bir ortam sağlamaktır.',
      description2: 'Modern tesislerimiz, deneyimli kadromuz ve aile sıcaklığındaki yaklaşımımızla, ailelerinden uzakta olan kız öğrencilerimizin kendilerini evlerinde hissetmelerini sağlıyoruz.',
      description3: "Ankara'nın merkezi konumunda yer alan yurdumuz, üniversitelere kolay ulaşım imkanı sunmaktadır. 7/24 güvenlik, 3 öğün yemek, fiber internet ve servis hizmeti gibi olanaklarımızla öğrencilerimizin tüm ihtiyaçlarını karşılıyoruz."
    },
    values: {
      title: 'Değerlerimiz',
      items: [
        { icon: 'fa-shield-alt', title: 'Güvenlik', desc: 'Öğrencilerimizin güvenliği bizim önceliğimizdir. 7/24 güvenlik ve kamera sistemi.', image: null, size: 24 },
        { icon: 'fa-heart', title: 'Aile Ortamı', desc: 'Sıcak ve samimi bir ortamda, öğrencilerimiz kendilerini evlerinde hisseder.', image: null, size: 24 },
        { icon: 'fa-star', title: 'Kalite', desc: 'Modern tesisler ve kaliteli hizmet anlayışıyla en iyi deneyimi sunuyoruz.', image: null, size: 24 }
      ]
    },
    stats: [
      { number: '500+', label: 'Mutlu Öğrenci' },
      { number: '15+', label: 'Yıl Tecrübe' },
      { number: '4.9', label: 'Ortalama Puan' },
      { number: '100%', label: 'Memnuniyet' }
    ]
  };

  await prisma.pageContent.upsert({
    where: { id: 'about' },
    update: { content: JSON.stringify(aboutContent) },
    create: { id: 'about', content: JSON.stringify(aboutContent) }
  });
  console.log('✓ About page content created');

  // Features page content
  const featuresContent = {
    hero: {
      badge: 'Ayrıcalıklar Dünyası',
      title: 'Sizin Konforunuz,',
      highlight: 'Bizim Önceliğimiz',
      description: 'Doruk Kız Öğrenci Yurdu olarak, öğrencilerimize en iyi yaşam koşullarını sunmak için sürekli kendimizi geliştiriyoruz.'
    },
    categories: [
      {
        title: 'Güvenlik & Teknoloji',
        features: [
          { icon: 'fa-shield-alt', title: '7/24 Güvenlik', desc: 'Profesyonel güvenlik ekibi ve gelişmiş kamera sistemi ile kesintisiz koruma.', image: null, size: 24 },
          { icon: 'fa-video', title: 'Kamera Sistemi', desc: 'Tüm ortak alanlarda HD kamera kaydı ve anlık izleme imkanı.', image: null, size: 24 },
          { icon: 'fa-wifi', title: 'Fiber İnternet', desc: '100 Mbps fiber altyapı ile kesintisiz ve hızlı internet erişimi.', image: null, size: 24 },
          { icon: 'fa-id-card', title: 'Kartlı Giriş', desc: 'Güvenli kartlı giriş sistemi ile kontrollü bina erişimi.', image: null, size: 24 }
        ]
      },
      {
        title: 'Konfor & Yaşam',
        features: [
          { icon: 'fa-utensils', title: '3 Öğün Yemek', desc: 'Diyetisyen kontrolünde hazırlanan sağlıklı ve lezzetli yemekler.', image: null, size: 24 },
          { icon: 'fa-snowflake', title: 'Klima Sistemi', desc: 'Tüm odalarda bireysel klima ile yıl boyu ideal sıcaklık.', image: null, size: 24 },
          { icon: 'fa-tshirt', title: 'Çamaşırhane', desc: 'Modern çamaşır ve kurutma makineleri ile ücretsiz hizmet.', image: null, size: 24 },
          { icon: 'fa-bed', title: 'Konforlu Odalar', desc: 'Ergonomik mobilyalar ve kaliteli yataklar ile rahat uyku.', image: null, size: 24 }
        ]
      }
    ],
    cta: {
      title: 'Daha Fazla Bilgiye mi İhtiyacınız Var?',
      description: 'Hizmetlerimiz hakkında aklınıza takılan tüm sorular için bize ulaşabilirsiniz.',
      phoneButton: 'Bizi Arayın',
      contactButton: 'İletişime Geçin'
    }
  };

  await prisma.pageContent.upsert({
    where: { id: 'features' },
    update: { content: JSON.stringify(featuresContent) },
    create: { id: 'features', content: JSON.stringify(featuresContent) }
  });
  console.log('✓ Features page content created');

  console.log('\n✅ All page content seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding page content:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
