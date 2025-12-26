import { getDepartment, getAllDepartmentSlugs, departments } from '@/data/departments';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

// 1. Dinamik SEO Metadata (Google'da çıkması için)
export async function generateMetadata({ params }) {
  const department = getDepartment(params.slug);
  if (!department) return { title: 'Sayfa Bulunamadı' };

  return {
    title: `${department.title} Öğrencileri İçin Yurt | Doruk Kız Öğrenci Yurdu`,
    description: `${department.title} öğrencileri için en ideal konaklama. ${department.campus}'ne sadece ${department.distance} dk ${department.transport} mesafede. Güvenli, konforlu ve ekonomik yurt.`,
    keywords: `${department.shortTitle} yurt, ${department.title} yurt, uşak yurt, uşak kız yurdu, ${department.campus} yurt`,
    openGraph: {
      title: `${department.title} Yakını Kız Yurdu - Doruk Yurt`,
      description: `${department.campus}'ne ${department.distance} dk mesafedeki yurdumuzda yerinizi ayırtın.`,
      images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=630&fit=crop'],
    }
  };
}

// 2. Statik Sayfa Üretimi (Hız için)
export async function generateStaticParams() {
  const slugs = getAllDepartmentSlugs();
  return slugs.map((slug) => ({ slug: slug }));
}

// 3. Sayfa Tasarımı
export default function DepartmentPage({ params }) {
  const department = getDepartment(params.slug);
  if (!department) notFound();

  const breadcrumbItems = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Bölümler', url: '/#bolumler' },
    { name: department.shortTitle, url: `/yurt/${department.slug}` }
  ];

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Navbar Spacer (Eğer navbar fixed ise) */}
      <div className="h-20 bg-white lg:hidden"></div>

      {/* Breadcrumb Area */}
      <div className="bg-white border-b border-gray-100 pt-4 pb-4">
         <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Section */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold ring-1 ring-primary/20">
                  <i className="fas fa-university text-xs"></i>
                  {department.campus}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold ring-1 ring-green-600/20">
                  <i className="fas fa-walking text-xs"></i>
                  {department.distance} dk {department.transport}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] tracking-tight">
                {department.title} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                  Öğrencileri İçin Yurt
                </span>
              </h1>
            </div>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 group">
              <Image
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&h=800&fit=crop"
                alt={`${department.title} Yurt İmkanları`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white font-medium text-lg backdrop-blur-sm bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                  🏠 Sizin için en konforlu yaşam alanı
                </p>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                  <i className="fas fa-quote-left text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Bölümünüze Özel Ayrıcalıklar
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {department.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i className="fas fa-star text-yellow-400"></i>
                Öne Çıkan Özellikler
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {department.features.map((feature, idx) => (
                  <div key={idx} className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-purple-50 group-hover:from-primary group-hover:to-purple-500 flex items-center justify-center flex-shrink-0 text-primary group-hover:text-white transition-all duration-300">
                      <i className="fas fa-check text-lg"></i>
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Preview (Static for now) */}
            <div className="bg-gray-900 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                 <Image src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800" alt="bg" fill className="object-cover" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Daha Fazlasını Görün</h3>
                <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                  Odalarımızı, sosyal alanlarımızı ve çalışma salonlarımızı yakından inceleyin.
                </p>
                <Link href="/galeri" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
                  Galeriye Git
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>

          </div>

          {/* Sidebar Area (Right) - Sticky */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Call to Action Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-primary/5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Erken Kayıt Fırsatı</h3>
                    <p className="text-gray-500 text-sm mt-1">Sınırlı kontenjan, yerinizi hemen ayırtın.</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Kampüse</span>
                      </div>
                      <span className="font-bold text-gray-900">{department.distance} Dk</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                          <i className="fas fa-utensils"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Yemek</span>
                      </div>
                      <span className="font-bold text-gray-900">3 Öğün</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                          <i className="fas fa-wifi"></i>
                        </div>
                        <span className="text-sm font-medium text-gray-600">İnternet</span>
                      </div>
                      <span className="font-bold text-gray-900">Fiber</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      href="/#iletisim" 
                      className="block w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all text-center"
                    >
                      Hemen Başvur
                    </Link>
                    <Link 
                      href={`https://wa.me/905551234567?text=Merhaba, ${department.title} öğrencisiyim. Yurt hakkında bilgi almak istiyorum.`}
                      target="_blank"
                      className="block w-full bg-[#25D366] text-white py-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all text-center flex items-center justify-center gap-2"
                    >
                      <i className="fab fa-whatsapp text-xl"></i>
                      WhatsApp
                    </Link>
                  </div>
                </div>
              </div>

              {/* Other Departments Links */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-compass text-gray-400"></i>
                  Diğer Bölümler
                </h4>
                <div className="flex flex-wrap gap-2">
                  {departments
                    .filter(d => d.slug !== department.slug)
                    .sort(() => 0.5 - Math.random()) // Randomize slightly
                    .slice(0, 8)
                    .map((dept) => (
                    <Link 
                      key={dept.slug}
                      href={`/yurt/${dept.slug}`}
                      className="text-xs font-semibold bg-gray-50 text-gray-600 px-3 py-2 rounded-lg border border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {dept.shortTitle}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
