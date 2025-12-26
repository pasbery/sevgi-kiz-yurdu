"use client";
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';

export default function ContactPageClient() {
  const { isEditable, setIsEditable, isAdmin, siteData, updateSiteData, updateSocialMedia, saveSiteData, isSaving, isLoading: siteLoading } = useSite();
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  // Load contact page data from database on mount
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/pages?id=contact');
        const result = await response.json();
        if (result.success && result.data?.content) {
          setPageData(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching contact page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactData();
  }, []);

  // Contact items derived from shared siteData
  const contactItems = [
    { icon: 'fa-map-marker-alt', label: 'Adres', field: 'address', extra: '' },
    { icon: 'fa-phone', label: 'Telefon', field: 'phone', extra: siteData.contact.workingHours },
    { icon: 'fa-envelope', label: 'E-posta', field: 'email', extra: '' }
  ];

  const handleHeroEdit = (key, value) => {
    setPageData(prev => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const handleContactEdit = (field, value) => {
    // Updates shared siteData - syncs with Footer and other components
    updateSiteData('contact', field, value);
  };

  const handleSocialEdit = (index, field, value) => {
    // Updates shared siteData - syncs with Footer
    updateSocialMedia(index, field, value);
  };

  const handleFormEdit = (key, value) => {
    setPageData(prev => ({ ...prev, form: { ...prev.form, [key]: value } }));
  };

  const handleMapEdit = (value) => {
    updateSiteData('map', 'embedUrl', value);
  };

  const handleSave = async () => {
    const result = await saveSiteData();
    if (result.success) {
      alert('İletişim bilgileri veritabanına kaydedildi!');
    } else {
      alert('Kaydetme başarısız: ' + result.message);
    }
    setIsEditable(false);
  };

  // Show loading state while data is being fetched from database
  if (isLoading || !pageData || siteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-28">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-28 sm:pt-32 pb-20">
      
      {/* Hero */}
      <div className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
            {isEditable ? (
              <input type="text" value={pageData.hero.badge} onChange={(e) => handleHeroEdit('badge', e.target.value)} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none text-center" />
            ) : pageData.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex flex-col md:flex-row items-center justify-center gap-2">
            {isEditable ? (
              <input type="text" value={pageData.hero.title} onChange={(e) => handleHeroEdit('title', e.target.value)} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none text-center" />
            ) : pageData.hero.title}
            <span className="gradient-text">
              {isEditable ? (
                <input type="text" value={pageData.hero.highlight} onChange={(e) => handleHeroEdit('highlight', e.target.value)} className="gradient-text bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none text-center" />
              ) : pageData.hero.highlight}
            </span>
          </h1>
          <div className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {isEditable ? (
              <textarea value={pageData.hero.description} onChange={(e) => handleHeroEdit('description', e.target.value)} className="w-full bg-transparent border-2 border-dashed border-primary/50 rounded p-2 focus:outline-none text-center" rows={2} />
            ) : <p>{pageData.hero.description}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditable ? (
                  <input type="text" value={pageData.contactSectionTitle} onChange={(e) => setPageData(prev => ({ ...prev, contactSectionTitle: e.target.value }))} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none w-full" />
                ) : pageData.contactSectionTitle}
              </h3>
              <p className="text-xs text-primary/70 mb-4 italic">{isEditable && '(İletişim bilgileri tüm sitede senkronize güncellenir)'}</p>
              <div className="space-y-6">
                {contactItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${item.icon} text-primary text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 mb-1">{item.label}</p>
                      <p className="text-gray-600">
                        {isEditable ? (
                          <input type="text" value={siteData.contact[item.field]} onChange={(e) => handleContactEdit(item.field, e.target.value)} className="bg-transparent border-b border-dashed border-primary/50 focus:outline-none w-full" />
                        ) : siteData.contact[item.field]}
                      </p>
                      {item.extra && (
                        <p className="text-gray-500 text-sm mt-1">{item.extra}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditable ? (
                  <input type="text" value={pageData.socialSectionTitle} onChange={(e) => setPageData(prev => ({ ...prev, socialSectionTitle: e.target.value }))} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none w-full" />
                ) : pageData.socialSectionTitle}
              </h3>
              <p className="text-xs text-primary/70 mb-4 italic">{isEditable && '(Sosyal medya linkleri tüm sitede senkronize güncellenir)'}</p>
              <div className="flex gap-4 flex-wrap">
                {siteData.socialMedia.map((social, idx) => (
                  <div key={idx} className="relative group">
                    <a href={social.url} className={`${social.bg} w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-gray-200`}>
                      <i className={`fab fa-${social.icon}`}></i>
                    </a>
                    {isEditable && (
                      <input type="text" value={social.url} onChange={(e) => handleSocialEdit(idx, 'url', e.target.value)} className="absolute -bottom-8 left-0 w-24 text-xs bg-white border border-gray-300 rounded px-1 focus:outline-none" placeholder="URL" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditable ? (
                <input type="text" value={pageData.form.title} onChange={(e) => handleFormEdit('title', e.target.value)} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none w-full" />
              ) : pageData.form.title}
            </h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="05XX XXX XX XX" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" placeholder="email@example.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition">
                  {pageData.form.subjects.map((subject, idx) => (
                    <option key={idx}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none" placeholder="Mesajınız..."></textarea>
              </div>

              <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30">
                {isEditable ? (
                  <input type="text" value={pageData.form.submitButton} onChange={(e) => handleFormEdit('submitButton', e.target.value)} className="bg-transparent border-b border-dashed border-white/50 focus:outline-none text-center w-full" />
                ) : pageData.form.submitButton}
              </button>
            </form>
          </div>

        </div>

        {/* Map */}
        <div className="mt-12 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          {isEditable && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Harita Embed URL</label>
              <input type="text" value={siteData.map.embedUrl} onChange={(e) => handleMapEdit(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:outline-none text-sm" placeholder="Google Maps Embed URL" />
            </div>
          )}
          <div className="w-full h-96 rounded-2xl overflow-hidden">
            <iframe 
              src={siteData.map.embedUrl}
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Floating Edit/Save Button */}
      <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-3">
        {isEditable ? (
          <>
            <button onClick={() => setIsEditable(false)} className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all" title="İptal">
              <i className="fas fa-times text-xl"></i>
            </button>
            <button onClick={handleSave} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all" title="Kaydet">
              <i className="fas fa-save text-xl"></i>
            </button>
          </>
        ) : isAdmin ? (
          <button onClick={() => setIsEditable(true)} className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all" title="Düzenle">
            <i className="fas fa-pen text-xl"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
}
