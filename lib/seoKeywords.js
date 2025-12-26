/**
 * Dinamik SEO Keyword Üretici
 * Doruk Kız Öğrenci Yurdu + Uşak bazlı otomatik keyword üretimi
 */

const SEO_CONFIG = {
  // Marka bilgileri
  brand: {
    name: 'Doruk Kız Öğrenci Yurdu',
    short: 'Doruk Yurdu',
    aliases: ['doruk kız yurdu', 'doruk öğrenci yurdu', 'doruk yurdu uşak']
  },
  
  // Konum bilgileri
  location: {
    city: 'uşak',
    cityCapital: 'Uşak',
    nearby: ['uşak üniversitesi', 'uşak merkez']
  },
  
  // İşletme türü varyasyonları
  businessTypes: [
    'kız yurdu',
    'kız öğrenci yurdu', 
    'öğrenci yurdu',
    'kız yurtları',
    'özel yurt',
    'özel kız yurdu',
    'yurt'
  ],
  
  // Eski siteden gelen temel keywordler
  legacyKeywords: [
    'uşak kız yurdu',
    'uşak yurtları', 
    'uşak yurt',
    'uşak kız yurtları',
    'uşak özel yurtlar',
    'uşak öğrenci yurdu',
    'uşak öğrenci yurtları',
    'uşak kız apartları',
    'uşak kız apart',
    'uşak apart',
    'yarı özel yurt uşak',
    'uşaktaki yurtlar',
    'uşak üniversitesi en iyi yurt',
    'uşaktaki en iyi yurtlar',
    'uşak yurt fiyatları',
    'uşak merkezde kız öğrenci yurdu',
    'uşak güvenli kız yurdu',
    'uşak kız öğrenci yurtları fiyatları',
    'uşak en iyi özel yurtlar',
    'uşak üniversitesi kız yurtları',
    'uşak özel kız yurtları'
  ],
  
  // Özellikler
  features: ['güvenli', 'konforlu', '3 öğün yemekli', 'klimali', 'wifi', '7/24 güvenlik'],
  
  // Zaman
  temporal: ['2025', '2024-2025']
};

/**
 * Sayfa türüne göre otomatik keyword üretir
 * @param {string} pageType - Sayfa türü (home, rooms, room-detail, about, contact, features, gallery)
 * @param {object} options - Ek seçenekler (roomSlug, roomLabel vb.)
 * @returns {string} Virgülle ayrılmış keywordler
 */
export function generateKeywords(pageType, options = {}) {
  const { brand, location, businessTypes, legacyKeywords, features, temporal } = SEO_CONFIG;
  const city = location.city;
  
  // Temel keywordler - her sayfada
  const baseKeywords = [
    ...brand.aliases,
    `${city} kız yurdu`,
    `${city} öğrenci yurdu`,
    `${city} kız öğrenci yurdu`
  ];
  
  let keywords = [];
  
  switch (pageType) {
    case 'home':
      keywords = [
        ...baseKeywords,
        ...legacyKeywords.slice(0, 15),
        `${city} en iyi kız yurdu`,
        `${city} güvenli kız yurdu`,
        `${city} konforlu öğrenci yurdu`,
        `${city} üniversitesi yakını kız yurdu`,
        `${city} kız öğrenci yurdu ${temporal[0]}`,
        `${city} merkez kız yurdu`
      ];
      break;
      
    case 'rooms':
      keywords = [
        ...baseKeywords,
        `${city} yurt odaları`,
        `${city} kız yurdu odaları`,
        `${city} tek kişilik oda`,
        `${city} 2 kişilik oda`,
        `${city} 3 kişilik oda`,
        `${city} 4 kişilik oda`,
        `${city} yurt oda fiyatları`,
        `${city} öğrenci yurdu oda seçenekleri`,
        `${city} yurt fiyatları`,
        `${city} kız yurdu fiyatları`
      ];
      break;
      
    case 'room-detail':
      const { roomSlug, roomLabel } = options;
      const roomNumber = roomSlug?.split('-')[0] || '';
      const roomText = roomNumber ? `${roomNumber} kişilik` : roomLabel;
      
      keywords = [
        `${city} ${roomText} oda`,
        `${city} ${roomText} yurt odası`,
        `${city} ${roomText} oda fiyatı`,
        `${city} kız yurdu ${roomText}`,
        `${city} ${roomText} öğrenci odası`,
        `${city} üniversitesi ${roomText} oda`,
        `${city} ${roomText} oda fiyatları ${temporal[0]}`,
        `doruk yurdu ${roomText} oda`,
        `${city} özel yurt ${roomText}`,
        ...baseKeywords.slice(0, 3)
      ];
      break;
      
    case 'about':
      keywords = [
        ...baseKeywords,
        `${city} kız yurdu hakkında`,
        `${city} güvenilir kız yurdu`,
        `${city} kaliteli öğrenci yurdu`,
        `doruk kız yurdu hakkında`,
        `${city} en iyi kız yurdu`,
        `${city} özel yurt yorumları`,
        `${city} kız yurdu yorumları`
      ];
      break;
      
    case 'contact':
      keywords = [
        `${city} kız yurdu iletişim`,
        `${city} öğrenci yurdu telefon`,
        `${city} kız yurdu adres`,
        `${city} yurt nerede`,
        `doruk yurdu iletişim`,
        `doruk yurdu telefon`,
        `doruk yurdu adres`,
        `${city} kız yurdu konum`,
        ...baseKeywords.slice(0, 3)
      ];
      break;
      
    case 'features':
      keywords = [
        `${city} kız yurdu özellikleri`,
        `${city} 3 öğün yemekli yurt`,
        `${city} klimali kız yurdu`,
        `${city} wifi yurt`,
        `${city} 7/24 güvenlikli yurt`,
        `${city} etüt odası yurt`,
        `${city} öğrenci yurdu hizmetleri`,
        `${city} kız yurdu imkanları`,
        ...baseKeywords.slice(0, 3)
      ];
      break;
      
    case 'gallery':
      keywords = [
        `${city} kız yurdu fotoğrafları`,
        `${city} öğrenci yurdu resimleri`,
        `${city} yurt odaları görselleri`,
        `doruk yurdu fotoğraflar`,
        `${city} kız yurdu galeri`,
        `${city} yurt nasıl`,
        ...baseKeywords.slice(0, 3)
      ];
      break;
      
    default:
      keywords = baseKeywords;
  }
  
  // Tekrarları kaldır ve virgülle birleştir
  const uniqueKeywords = [...new Set(keywords)];
  return uniqueKeywords.join(', ');
}

/**
 * Sayfa türüne göre otomatik title üretir
 */
export function generateTitle(pageType, options = {}, brandName = 'Doruk Kız Öğrenci Yurdu') {
  const city = SEO_CONFIG.location.cityCapital;
  
  switch (pageType) {
    case 'home':
      return `${city} Kız Öğrenci Yurdu | ${brandName}`;
      
    case 'rooms':
      return `${city} Yurt Odaları ve Fiyatları 2025 | ${brandName}`;
      
    case 'room-detail':
      const { roomLabel } = options;
      return `${city} ${roomLabel} Yurt Odası | ${brandName}`;
      
    case 'about':
      return `Hakkımızda | ${city} ${brandName}`;
      
    case 'contact':
      return `İletişim & Adres | ${city} ${brandName}`;
      
    case 'features':
      return `Özellikler & Hizmetler | ${city} ${brandName}`;
      
    case 'gallery':
      return `Galeri & Fotoğraflar | ${city} ${brandName}`;
      
    default:
      return `${city} ${brandName}`;
  }
}

/**
 * Sayfa türüne göre otomatik description üretir
 */
export function generateDescription(pageType, options = {}) {
  const city = SEO_CONFIG.location.cityCapital;
  
  switch (pageType) {
    case 'home':
      return `${city}'ın en güvenli ve konforlu kız öğrenci yurdu. 7/24 güvenlik, 3 öğün yemek, klima, wifi. Uşak Üniversitesi'ne yakın merkezi konum. Hemen başvurun!`;
      
    case 'rooms':
      return `${city} kız yurdu oda seçenekleri ve 2025 fiyatları. Tek kişilik, 2, 3, 4 kişilik konforlu odalar. Doruk Kız Öğrenci Yurdu'nda yerinizi ayırtın.`;
      
    case 'room-detail':
      const { roomLabel, roomDescription } = options;
      return `${city} ${roomLabel} yurt odası. ${roomDescription || 'Konforlu ve güvenli konaklama.'} Fiyat ve detaylar için hemen inceleyin.`;
      
    case 'about':
      return `${city} Doruk Kız Öğrenci Yurdu hakkında. Güvenli, temiz ve aile ortamında kaliteli hizmet. Uşak'ın tercih edilen kız yurdu.`;
      
    case 'contact':
      return `${city} Doruk Kız Yurdu iletişim bilgileri. Adres, telefon, e-posta ve konum haritası. Sorularınız için bize ulaşın.`;
      
    case 'features':
      return `${city} kız yurdu özellikleri: 7/24 güvenlik, 3 öğün yemek, klima, ücretsiz wifi, etüt odası, çamaşırhane ve daha fazlası.`;
      
    case 'gallery':
      return `${city} Doruk Kız Yurdu fotoğraf galerisi. Odalar, yemekhane, etüt odası, ortak alanlar. Yurdumuzu yakından tanıyın.`;
      
    default:
      return `${city} kız öğrenci yurdu. Güvenli, konforlu, merkezi konum. Doruk Kız Öğrenci Yurdu.`;
  }
}

export default {
  generateKeywords,
  generateTitle,
  generateDescription,
  SEO_CONFIG
};
