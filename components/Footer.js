"use client";
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Footer() {
  const { isEditable, updateSiteData, siteData } = useSite();
  
  // Use siteData directly - tüm veriler veritabanından gelecek
  const data = {
    brand: siteData?.brand || {},
    contact: siteData?.contact || {}
  };

  const updateFooter = (section, key, value) => {
    updateSiteData(section, key, value);
  };

  const renderEditableText = (section, key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h3' ? <h3 className={className}>{value}</h3> : 
             tag === 'p' ? <p className={className}>{value}</p> :
             <span className={className}>{value}</span>;
    }

    if (tag === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => updateFooter(section, key, e.target.value)}
          className={`${className} bg-transparent border-2 border-dashed border-gray-600 rounded p-2 w-full focus:border-primary focus:outline-none`}
          rows={3}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => updateFooter(section, key, e.target.value)}
        className={`${className} bg-transparent border-2 border-dashed border-gray-600 rounded px-2 focus:border-primary focus:outline-none min-w-[50px]`}
      />
    );
  };

  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SEO Linkleri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-gray-800">
          <div>
            <h4 className="text-white font-semibold mb-4">Sayfalar</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-primary text-sm transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-primary text-sm transition-colors">Hakkımızda</Link></li>
              <li><Link href="/odalar" className="text-gray-400 hover:text-primary text-sm transition-colors">Oda Tipleri</Link></li>
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">Yurt Özellikleri</Link></li>
              <li><Link href="/galeri" className="text-gray-400 hover:text-primary text-sm transition-colors">Fotoğraf Galerisi</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-primary text-sm transition-colors">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">7/24 Güvenlik</Link></li>
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">3 Öğün Yemek</Link></li>
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">Yüksek Hızlı İnternet</Link></li>
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">Etüt Odaları</Link></li>
              <li><Link href="/ozellikler" className="text-gray-400 hover:text-primary text-sm transition-colors">Çamaşırhane</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Oda Seçenekleri</h4>
            <ul className="space-y-2">
              <li><Link href="/odalar" className="text-gray-400 hover:text-primary text-sm transition-colors">1 Kişilik Oda</Link></li>
              <li><Link href="/odalar" className="text-gray-400 hover:text-primary text-sm transition-colors">2 Kişilik Oda</Link></li>
              <li><Link href="/odalar" className="text-gray-400 hover:text-primary text-sm transition-colors">3 Kişilik Oda</Link></li>
              <li><Link href="/odalar" className="text-gray-400 hover:text-primary text-sm transition-colors">4 Kişilik Oda</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Bilgi</h4>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-primary text-sm transition-colors">Yurt Hakkında</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-primary text-sm transition-colors">Kayıt Bilgisi</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-primary text-sm transition-colors">Ziyaret Saatleri</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-primary text-sm transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>
        </div>

        {/* Alt Bölüm - Sosyal Medya ve Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {siteData?.brand?.fullName || 'Doruk Kız Öğrenci Yurdu'}. Tüm hakları saklıdır.
          </p>
          
          <div className="flex gap-3">
            {(siteData?.socialMedia || []).map((social, idx) => {
              const isWhatsApp = social.name?.toLowerCase() === 'whatsapp';
              const url = isWhatsApp ? `https://wa.me/${siteData?.contact?.whatsapp || ''}` : (social.url || '#');
              return (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                  <i className={`fab ${social.icon} text-white`}></i>
                </a>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <a href={`https://wa.me/${siteData?.contact?.whatsapp || ''}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-xl transition-all duration-300 z-50 group">
        <i className="fab fa-whatsapp text-3xl group-hover:rotate-12 transition-transform"></i>
      </a>
    </footer>
  );
}
