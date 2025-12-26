# SEO İyileştirme Planı

Projenizde Next.js'in yerleşik SEO özelliklerinin temel bir kısmı (Layout metadata, Sitemap, Robots) kullanılmış, ancak Google'ın sitenizi "düzgün ve güzel" anlaması için kritik eksikler var. Özellikle dinamik sayfalarda ve yapısal veri tarafında iyileştirmeler gerekiyor.

## Tespit Edilen Eksikler ve Çözümler

### 1. Dinamik Oda Sayfaları İçin Metadata Eksikliği
**Durum:** `app/(site)/odalar/[slug]/page.js` dosyasında `generateMetadata` fonksiyonu yok.
**Sorun:** Tüm oda detay sayfaları (Tek kişilik, 2 kişilik vb.) aynı varsayılan başlığı ve açıklamayı kullanıyor. Google bu sayfaları birbirinden ayırt etmekte zorlanır.
**Çözüm:** Her oda tipi için özel başlık ve açıklama üreten `generateMetadata` fonksiyonu eklenecek.

### 2. Robots.txt Yapılandırması
**Durum:** `app/robots.js` dosyası `/private/` yolunu engelliyor, ancak admin paneliniz `/admin` altında.
**Çözüm:** Admin panelinin Google tarafından taranmasını engellemek için kural `/admin/` olarak güncellenecek.

### 3. Yapısal Veri (Structured Data / JSON-LD) Eksikliği
**Durum:** Sitenizde Google'ın işletmenizi (Yurt) daha iyi anlamasını sağlayan şema işaretlemeleri yok.
**Çözüm:** Ana sayfaya "LocalBusiness" veya "Hostel" tipinde yapısal veri eklenecek. Bu sayede arama sonuçlarında (adres, telefon, fiyat aralığı gibi) daha zengin görünüm elde edilebilir.

### 4. Global Metadata İyileştirmeleri
**Durum:** `app/layout.js` temel etiketlere sahip ancak `canonical` URL ve robot indeksleme direktifleri eksik olabilir.
**Çözüm:** Standart URL yapısını (Canonical) ve robot kurallarını netleştiren etiketler eklenecek.

## Uygulama Adımları

1.  **Robots.txt Güncellemesi**: `app/robots.js` dosyasındaki `disallow` kuralı düzeltilecek.
2.  **Dinamik Metadata Eklenmesi**: `app/(site)/odalar/[slug]/page.js` dosyasına `roomsData` kullanılarak dinamik başlık ve açıklama oluşturucu eklenecek.
3.  **Global Metadata Güncellemesi**: `app/layout.js` dosyasına `metadataBase` ve eksik meta etiketleri eklenecek.
4.  **JSON-LD Entegrasyonu**: Ana sayfaya işletme bilgilerinizi içeren yapısal veri eklenecek.

Bu adımlar tamamlandığında siteniz SEO açısından çok daha güçlü bir yapıya kavuşacak. Onaylarsanız uygulamaya başlayabilirim.
