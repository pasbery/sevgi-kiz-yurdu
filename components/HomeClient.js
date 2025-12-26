"use client";
import { useState } from 'react';
import { useSite } from '@/context/SiteContext';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Features from '@/components/Features';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';

export default function HomeClient({ initialData }) {
  const { isEditable, setIsEditable, isAdmin, footerData, siteData } = useSite();

  // Initialize with server-side data (SSR) - no loading state needed!
  const [heroData, setHeroData] = useState(initialData?.heroData || null);
  const [aboutData, setAboutData] = useState(initialData?.aboutData || null);
  const [featuresData, setFeaturesData] = useState(initialData?.featuresData || null);
  const [galleryData, setGalleryData] = useState(initialData?.galleryData || null);
  const [testimonialsData, setTestimonialsData] = useState(initialData?.testimonialsData || null);
  const [ctaData, setCtaData] = useState(initialData?.ctaData || null);

  const handleHeroEdit = (key, value) => {
    if (key.startsWith('stats.')) {
      const statKey = key.split('.')[1];
      setHeroData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statKey]: value
        }
      }));
    } else if (key.startsWith('statsLabels.')) {
      const labelKey = key.split('.')[1];
      setHeroData(prev => ({
        ...prev,
        statsLabels: {
          ...prev.statsLabels,
          [labelKey]: value
        }
      }));
    } else {
      setHeroData(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleAboutEdit = (key, value) => {
    setAboutData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeaturesEdit = (key, value) => {
    setFeaturesData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGalleryEdit = (key, value) => {
    setGalleryData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTestimonialsEdit = (key, value) => {
    setTestimonialsData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCtaEdit = (key, value) => {
    setCtaData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Save homepage content to database
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'homepage',
          content: { heroData, aboutData, featuresData, galleryData, testimonialsData, ctaData }
        })
      });
      const result = await response.json();
      if (result.success) {
        alert('Ana sayfa veritabanına kaydedildi!');
      } else {
        alert('Kaydetme başarısız oldu.');
      }
    } catch (error) {
      console.error('Error saving homepage:', error);
      alert('Bir hata oluştu.');
    }
    setIsEditable(false);
  };

  return (
    <>
      <Hero content={heroData} isEditable={isEditable} onEdit={handleHeroEdit} />
      <About content={aboutData} isEditable={isEditable} onEdit={handleAboutEdit} />
      <Features content={featuresData} isEditable={isEditable} onEdit={handleFeaturesEdit} />
      <Gallery content={galleryData} isEditable={isEditable} onEdit={handleGalleryEdit} />
      <Testimonials content={testimonialsData} isEditable={isEditable} onEdit={handleTestimonialsEdit} />
      
      {/* SSS Banner */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-question text-2xl text-primary"></i>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                Sorularınız mı Var?
              </h3>
              <p className="text-gray-500 text-sm">
                Yurt hayatı, fiyatlar ve kayıt süreci hakkında merak ettiklerinizi sizin için yanıtladık.
              </p>
            </div>
            <a 
              href="/sss" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition flex-shrink-0"
            >
              Sık Sorulan Sorular
              <i className="fas fa-chevron-right text-sm"></i>
            </a>
          </div>
        </div>
      </section>

      <CTA content={ctaData} isEditable={isEditable} onEdit={handleCtaEdit} />
      
      {/* Floating Edit/Save Button */}
      <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-3">
        {isEditable ? (
          <>
            <button 
              onClick={() => setIsEditable(false)}
              className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
              title="İptal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            <button 
              onClick={handleSave}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
              title="Kaydet"
            >
              <i className="fas fa-save text-xl"></i>
            </button>
          </>
        ) : isAdmin ? (
          <button 
            onClick={() => setIsEditable(true)}
            className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
            title="Düzenle"
          >
            <i className="fas fa-pen text-xl"></i>
          </button>
        ) : null}
      </div>
    </>
  );
}
