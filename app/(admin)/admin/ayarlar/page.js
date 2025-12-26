"use client";
import { useState } from 'react';
import { useSite } from '@/context/SiteContext';

export default function SettingsPage() {
  const { siteData, updateSiteData, saveSiteData, isSaving } = useSite();
  const [activeTab, setActiveTab] = useState('seo');

  const tabs = [
    { id: 'seo', label: 'SEO & Genel', icon: 'fa-globe' },
    { id: 'contact', label: 'İletişim', icon: 'fa-phone' },
    { id: 'social', label: 'Sosyal Medya', icon: 'fa-share-alt' }
  ];

  const handleSave = async () => {
    const result = await saveSiteData();
    if (result.success) {
      alert('Ayarlar başarıyla kaydedildi!');
    } else {
      alert('Hata: ' + result.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Site Ayarları</h1>
          <p className="text-gray-600">SEO, iletişim ve genel site ayarlarını buradan yönetebilirsiniz.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Kaydediliyor...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              Kaydet
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                  <input
                    type="text"
                    value={siteData.site?.url || ''}
                    onChange={(e) => updateSiteData('site', 'url', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="https://www.example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">Sitemap, robots.txt ve SEO için kullanılır</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <input
                    type="text"
                    value={siteData.site?.domain || ''}
                    onChange={(e) => updateSiteData('site', 'domain', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="example.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">Google önizlemesinde görünür</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marka Adı (Kısa)</label>
                  <input
                    type="text"
                    value={siteData.brand.name}
                    onChange={(e) => updateSiteData('brand', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="Örn: Güneş Yurdu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marka Adı (Tam)</label>
                  <input
                    type="text"
                    value={siteData.brand.fullName}
                    onChange={(e) => updateSiteData('brand', 'fullName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="Örn: Güneş Kız Öğrenci Yurdu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Başlık</label>
                <input
                  type="text"
                  value={siteData.brand.subtitle}
                  onChange={(e) => updateSiteData('brand', 'subtitle', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Örn: Kız Öğrenci Yurdu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
                <input
                  type="text"
                  value={siteData.brand.slogan}
                  onChange={(e) => updateSiteData('brand', 'slogan', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  placeholder="Örn: Evinizden Uzakta Eviniz"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                 <div className="flex gap-3">
                   <div className="text-blue-600 mt-0.5">
                     <i className="fas fa-info-circle"></i>
                   </div>
                   <div>
                     <h4 className="font-medium text-blue-800 text-sm">SEO Ayarları Hakkında</h4>
                     <p className="text-sm text-blue-600 mt-1">
                       Sayfa başlıkları, açıklamalar ve anahtar kelimeler artık <strong>SEO Kokpiti</strong> menüsünden yönetilmektedir.
                       Buradaki "Marka Adı" alanı, tüm sayfa başlıklarının sonuna otomatik olarak eklenir.
                     </p>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon (Görünen)</label>
                  <input
                    type="text"
                    value={siteData.contact.phone}
                    onChange={(e) => updateSiteData('contact', 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon (Arama İçin)</label>
                  <input
                    type="text"
                    value={siteData.contact.phoneRaw}
                    onChange={(e) => updateSiteData('contact', 'phoneRaw', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="Boşluksuz: 03121234567"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={siteData.contact.whatsapp}
                    onChange={(e) => updateSiteData('contact', 'whatsapp', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    placeholder="90555..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={siteData.contact.email}
                    onChange={(e) => updateSiteData('contact', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                <textarea
                  value={siteData.contact.address}
                  onChange={(e) => updateSiteData('contact', 'address', e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={siteData.map?.embedUrl || ''}
                  onChange={(e) => updateSiteData('map', 'embedUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition text-sm font-mono"
                />
                <p className="mt-1 text-xs text-gray-500">Google Haritalar'dan "Paylaş" &gt; "Haritayı yerleştir" seçeneğindeki src="" içindeki linki yapıştırın.</p>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {siteData.socialMedia.map((social, idx) => {
                const isWhatsApp = social.name.toLowerCase() === 'whatsapp';
                const whatsappUrl = isWhatsApp ? `https://wa.me/${siteData.contact?.whatsapp || ''}` : social.url;
                
                return (
                  <div key={idx} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className={`w-10 h-10 ${social.bg} rounded-full flex items-center justify-center text-white shrink-0`}>
                      <i className={`fab fa-${social.icon}`}></i>
                    </div>
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Platform Adı</label>
                        <input
                          type="text"
                          value={social.name}
                          disabled
                          className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Link URL</label>
                        {isWhatsApp ? (
                          <input
                            type="text"
                            value={whatsappUrl}
                            disabled
                            className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm text-gray-400"
                            title="WhatsApp linki İletişim sekmesindeki WhatsApp numarasından otomatik oluşturulur"
                          />
                        ) : (
                          <input
                            type="text"
                            value={social.url}
                            onChange={(e) => {
                              const newSocials = [...siteData.socialMedia];
                              newSocials[idx] = { ...newSocials[idx], url: e.target.value };
                              updateSiteData('socialMedia', null, newSocials);
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:border-primary outline-none"
                            placeholder={`https://${social.name.toLowerCase()}.com/...`}
                          />
                        )}
                        {isWhatsApp && (
                          <p className="text-xs text-gray-400 mt-1">İletişim sekmesindeki WhatsApp numarasından otomatik oluşturulur</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}