import { getDepartment, getAllDepartmentSlugs, departments } from '@/data/departments';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

// 1. Dinamik SEO Metadata
export async function generateMetadata({ params }) {
  const department = getDepartment(params.slug);
  if (!department) return { title: 'Sayfa Bulunamadı' };

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const siteUrl = config.siteUrl;

  return {
    title: `${department.title} Öğrencileri İçin Yurt | Doruk Kız Öğrenci Yurdu`,
    description: `${department.title} öğrencileri için en ideal konaklama. ${department.campus}'ne sadece ${department.distance} dk ${department.transport} mesafede. Güvenli, konforlu ve uygun fiyatlı.`,
    keywords: `${department.shortTitle} yurt, ${department.title} yurt, uşak yurt, uşak kız yurdu, ${department.campus} yurt`,
    alternates: {
      canonical: `${siteUrl}/yurt/${params.slug}`,
    },
    openGraph: {
      title: `${department.title} Yakını Kız Yurdu - Doruk Yurt`,
      description: `${department.campus}'ne ${department.distance} dk mesafedeki yurdumuzda yerinizi ayırtın.`,
      url: `${siteUrl}/yurt/${params.slug}`,
    }
  };
}

// 2. Statik Sayfa Üretimi
export async function generateStaticParams() {
  const slugs = getAllDepartmentSlugs();
  return slugs.map((slug) => ({ slug: slug }));
}

// 3. Sayfa Tasarımı
export default async function DepartmentPage({ params }) {
  const department = getDepartment(params.slug);
  if (!department) notFound();

  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-28 sm:pt-32 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
              <i className="fas fa-map-marker-alt text-primary"></i>
              {department.campus} • {department.distance} dk {department.transport}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {department.title}
              <span className="block mt-2 gradient-text">Öğrencileri İçin Yurt</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              {department.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/iletisim" 
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/30"
              >
                <i className="fas fa-phone"></i>
                Hemen Başvur
              </Link>
              <Link 
                href="/odalar" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition border border-white/20"
              >
                <i className="fas fa-door-open"></i>
                Odaları İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
              Özellikler
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {department.shortTitle} <span className="gradient-text">İçin Neden Biz?</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {department.features.map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-check text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature}</h3>
                <p className="text-gray-500 text-sm">
                  {department.shortTitle} öğrencileri için özel olarak sunulan hizmetimiz.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary to-purple-600 p-8 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-walking text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Kampüse Yakın</h3>
              <p className="text-white/80">
                {department.campus}'ne sadece <strong>{department.distance} dakika</strong> {department.transport} mesafede.
              </p>
            </div>

            <div className="bg-gray-900 p-8 rounded-2xl text-white">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-shield-alt text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">7/24 Güvenlik</h3>
              <p className="text-gray-400">
                Kamera sistemi, kartlı giriş ve güvenlik personeli ile kesintisiz koruma.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <i className="fas fa-utensils text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3 Öğün Yemek</h3>
              <p className="text-gray-500">
                Kahvaltı, öğle ve akşam yemeği dahil besleyici menüler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-purple-600 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Yerinizi Ayırtın
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {department.title} öğrencileri için sınırlı kontenjan! Hemen kayıt olun, erken kayıt avantajlarından yararlanın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`tel:${config?.phone?.replace(/\s/g, '') || '05551234567'}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              <i className="fas fa-phone"></i>
              {config?.phone || 'Hemen Ara'}
            </a>
            <a 
              href={`https://wa.me/${config?.whatsapp || '905551234567'}`}
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition shadow-lg"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Other Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl font-semibold text-gray-800">Diğer Fakülteler</h3>
            <p className="text-gray-500 text-sm mt-1">Tüm fakülte öğrencilerine hizmet veriyoruz</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {departments
              .filter(d => d.slug !== department.slug)
              .slice(0, 8)
              .map((dept) => (
                <Link 
                  key={dept.slug} 
                  href={`/yurt/${dept.slug}`}
                  className="bg-white px-5 py-2.5 rounded-full text-sm text-gray-600 hover:text-primary hover:shadow-md transition border border-gray-200 hover:border-primary"
                >
                  {dept.shortTitle}
                </Link>
              ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/ozellikler" 
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Tüm özellikleri görüntüle
              <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
