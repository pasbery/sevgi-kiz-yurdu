# Ana Sayfa Kapsamlı Veri Entegrasyon Planı

Ana sayfayı "iyice inceledim" ve sadece özelliklerin değil, **tüm içeriğin** Google ile senkronize olması gerektiğini tespit ettim. İşte ana sayfadaki her bir bölüm için yapacağımız entegrasyonlar:

## 1. Hero (Giriş) Bölümü
*   **Görsel Düzenleme**: Siz "Hoşgeldiniz" başlığını değiştirdiğinizde;
*   **Google Entegrasyonu**: Bu başlık `Hostel` şemasındaki `slogan` veya `alternativeHeadline` alanına otomatik işlenecek.
*   **Aksiyon**: `layout.js` içine Hero verilerini okuyan kod eklenecek.

## 2. Özellikler (Features) Bölümü
*   **Görsel Düzenleme**: "7/24 Güvenlik", "Fiber İnternet" kutucukları.
*   **Google Entegrasyonu**: Her bir kutucuk `LocationFeatureSpecification` olarak şemaya eklenecek.
*   **Detay**: İkonlar değil, sadece başlıklar (text) Google'a gönderilecek.

## 3. Odalar (Rooms) Bölümü (Vitrin)
*   **Görsel Düzenleme**: Ana sayfada listelenen öne çıkan odalar.
*   **Google Entegrasyonu**: Bu odalar şemada `containsPlace` (İçerdiği Mekanlar) olarak tanımlanacak.
    *   Örn: "Tek Kişilik Oda" -> `HotelRoom` şeması altında, fiyatı ve kapasitesiyle birlikte Google'a sunulacak.
    *   Bu, arama sonuçlarında "Fiyatlar: 5000 TL'den başlıyor" gibi zengin sonuçların çıkmasını sağlar.

## 4. Galeri/Görseller
*   **Görsel Düzenleme**: Ana sayfadaki slider veya galeri resimleri.
*   **Google Entegrasyonu**: `image` dizisine tüm bu resimlerin URL'leri eklenecek. Google Görseller'de çıkma şansınız artacak.

## 5. İletişim & Konum (Footer)
*   **Görsel Düzenleme**: Adres, Telefon.
*   **Google Entegrasyonu**: `address`, `telephone` ve `geo` (Koordinat) alanları canlı olarak buraya bağlanacak.

## Teknik Yol Haritası
1.  **Veri Toplayıcı (Aggregator)**: `layout.js` içinde `prisma` sorgularını genişletip; `PageContent` (Hero, Features), `RoomType` (Odalar) ve `SiteConfig` (İletişim) tablolarının hepsini tek seferde çekeceğim.
2.  **Akıllı JSON-LD Oluşturucu**: Bu ham verileri Google'ın anlayacağı hiyerarşik yapıya dönüştüren bir fonksiyon yazacağım.
3.  **Test**: Sitede bir harf değiştirdiğimizde, "Kaynağı Görüntüle" diyerek JSON-LD kodunun da değiştiğini teyit edeceğiz.

Bu sayede ana sayfanızın her pikseli Google için anlamlı bir veriye dönüşecek.
