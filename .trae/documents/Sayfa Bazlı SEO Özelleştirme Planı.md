# Ultimate SEO & İçerik Yönetim Ekosistemi

Kullanıcı "tekrar düşün ve daha iyi ne yapabiliriz" dediğinde, standart bir SEO panelinin ötesine geçip, sitenin **organik büyümesini** ve **kullanıcı deneyimini (UX)** de kapsayan bütüncül bir strateji geliştirmeliyiz. Sadece "Google için metin girmek" değil, Google'ın sevdiği "yaşayan, hızlı ve zengin" bir site yaratmak hedeflenmeli.

## 1. Akıllı ve Hiyerarşik SEO Mimarisi (Teknik Derinlik)

Standart `title/desc` yönetiminin ötesine geçiyoruz:

*   **Dinamik Sayfa Analizi**: Sistem, projedeki tüm rotaları (`/`, `/hakkimizda`, `/odalar/*` vb.) otomatik tarayıp veritabanına kaydedecek. Elle "sayfa ekle" derdi olmayacak.
*   **Fallback (Yedekleme) Mekanizması**: Bir sayfa için özel SEO girilmemişse, sistem akıllıca ana ayarları o sayfaya uyarlayacak (Örn: "[Sayfa Adı] | [Marka]" formatını otomatik üretecek). Boş meta etiketi asla olmayacak.
*   **Görsel SEO Otomasyonu**: Yüklenen her resme otomatik olarak sayfa içeriğiyle alakalı `alt` metni (görme engelliler ve Google Görseller için) oluşturma altyapısı.

## 2. Admin Paneli: "SEO Kokpiti" (UX Odaklı)

Sadece form doldurma değil, **yönlendirme** odaklı bir panel:

*   **SEO Sağlık Puanı**: Her sayfa için bir skor (0-100). "Başlık çok kısa", "Açıklama girilmemiş", "Anahtar kelime tekrarı var" gibi uyarılarla sizi yönlendirecek.
*   **SERP Önizlemesi (Gelişmiş)**: Google Mobil ve Masaüstü görünümünü birebir simüle eden canlı editör.
*   **Sosyal Medya Kartları**: Linki WhatsApp'tan attığınızda çıkacak resmi ve başlığı ayrı ayrı özelleştirme imkanı.

## 3. Blog / Haber Altyapısı (İçerik Pazarlaması)

Google'ın en sevdiği şey **güncel içeriktir**.
*   **Blog Modülü**: "Ankara'da Öğrenci Olmak", "Yurt Seçerken Dikkat Edilmesi Gerekenler" gibi yazılar paylaşabileceğiniz bir blog altyapısı. Bu, "Ankara öğrenci yurdu" kelimesinde sizi rakiplerin önüne geçirecek en büyük silahtır.
*   **Otomatik İç Linkleme**: Blog yazılarından odalar sayfanıza otomatik link verme kurgusu.

## 4. Performans ve Hız (Core Web Vitals)

SEO sadece kelime değildir, hızdır.
*   **Resim Optimizasyonu**: Panele yüklenen devasa fotoğrafları sunucuda otomatik olarak küçültüp (WebP formatına çevirip) ziyaretçiye sunan bir yapı.
*   **Önbellekleme (Caching)**: Veritabanı sorgularını azaltıp sayfaların milisaniyeler içinde açılmasını sağlayan stratejiler.

## Uygulama Sıralaması (Roadmap)

1.  **Veritabanı Devrimi**: `SEOMetadata` ve opsiyonel `BlogPost` tablolarının oluşturulması.
2.  **SEO Kokpiti**: Admin panelinde sayfa listesi, puanlama ve canlı önizleme ekranının kodlanması.
3.  **Otomasyon**: Otomatik sitemap ve resim optimizasyonu entegrasyonu.
4.  **Entegrasyon**: `layout.js` ve sayfa yapılarının bu yeni beyinle konuşur hale getirilmesi.

Bu plan, sitenizi statik bir broşürden, Google ile konuşan akıllı bir platforma dönüştürür.
