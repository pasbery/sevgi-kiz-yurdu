# Admin Paneli Yapısal Düzenleme Planı

"Başka bir şey var mı?" diye sorduğunuzda haklısınız, sadece görsel bir fazlalık değil, **mantıksal bir çakışma** da var. Şu anki yapıda "Site Ayarları" başlığın *sonunu* (`| Marka Adı`), "SEO Kokpiti" ise başlığın *başını* belirliyor. Bu ilişkiyi netleştirmemiz lazım.

## Tespit Edilen Karmaşa
1.  **Çift Başlılık**: Ana sayfanın açıklamasını hem "Site Ayarları"ndan hem de "SEO Kokpiti"nden değiştirebiliyorsunuz. Hangisinin geçerli olduğu belirsiz.
2.  **Suffix (Son Ek) Sorunu**: SEO başlıklarının sonuna otomatik eklenen "Marka Adı" (`| Doruk Yurdu` gibi) şu an Site Ayarları'ndan geliyor ama kullanıcı bunun SEO'yu etkilediğinin farkında olmayabilir.

## Kesin Çözüm Planı: "Tam Ayrıştırma"

### 1. Veritabanı ve Şema Temizliği
*   `SiteConfig` tablosundaki `keywords` ve `brandDesc` (Site Açıklaması) alanlarını **iptal edeceğiz**.
*   Bu alanlardaki verileri alıp, `SEOMetadata` tablosunda Ana Sayfa (`/`) kaydı olarak saklayacağız. Böylece veri kaybı olmayacak.

### 2. Site Ayarları (`/admin/ayarlar`) - "Kurumsal Kimlik"
Bu sayfanın adı ve işlevi değişecek:
*   **Yeni Adı**: "Kurumsal Kimlik & İletişim"
*   **İçerik**: Sadece sitenin **görünen** kısımları kalacak.
    *   Marka Adı (Logo ve Footer'da görünen)
    *   Telefon, Adres, Sosyal Medya
    *   *Yeni Özellik*: **Varsayılan Başlık Uzantısı** (Örn: `| Doruk Kız Yurdu`). Kullanıcıya "Bu metin tüm sayfaların başlığının sonuna eklenir" bilgisi verilecek.
*   **Kaldırılacaklar**: Meta Description, Keywords (Bunlar tamamen SEO Kokpiti'ne devredilecek).

### 3. SEO Kokpiti (`/admin/seo`) - "Arama Motoru Ayarları"
*   Burası artık SEO ile ilgili **tek yetkili merci** olacak.
*   Ana Sayfa (`/`) ayarları burada "Sabitlenmiş" olarak en üstte gösterilebilir.

### 4. Kod Mantığı (`layout.js`)
*   `layout.js` artık `description` ve `keywords` için ASLA `SiteConfig` tablosuna bakmayacak. Sadece `SEOMetadata` tablosunu kullanacak.

Bu planla "Acaba hangisini değiştirmeliyim?" sorusunu kökten çözüyoruz. Onaylarsanız uygulamaya geçiyorum.
