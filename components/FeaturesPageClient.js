"use client";
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import Link from 'next/link';

export default function FeaturesPageClient() {
  const { isEditable, setIsEditable, isAdmin, siteData } = useSite();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  // Load features page data from database on mount
  useEffect(() => {
    const fetchFeaturesData = async () => {
      try {
        const response = await fetch('/api/pages?id=features');
        const result = await response.json();
        if (result.success && result.data?.content) {
          setData(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching features page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturesData();
  }, []);

  const handleHeroEdit = (key, value) => {
    setData(prev => ({
      ...prev,
      hero: { ...prev.hero, [key]: value }
    }));
  };

  const handleCategoryTitleEdit = (index, value) => {
    const newCategories = [...data.categories];
    newCategories[index] = { ...newCategories[index], title: value };
    setData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleFeatureEdit = (catIndex, featureIndex, field, value) => {
    const newCategories = [...data.categories];
    const newFeatures = [...newCategories[catIndex].features];
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], [field]: value };
    newCategories[catIndex] = { ...newCategories[catIndex], features: newFeatures };
    setData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleFeatureImageUpload = (e, catIndex, featureIndex) => {
    const file = e.target.files[0];
    if (file && isEditable) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCategories = [...data.categories];
        const newFeatures = [...newCategories[catIndex].features];
        newFeatures[featureIndex] = { ...newFeatures[featureIndex], image: reader.result };
        newCategories[catIndex] = { ...newCategories[catIndex], features: newFeatures };
        setData(prev => ({ ...prev, categories: newCategories }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFeature = (catIndex) => {
    const newFeature = {
      icon: 'fa-star',
      title: 'Yeni Özellik',
      desc: 'Açıklama ekleyin',
      color: 'from-gray-400 to-gray-500'
    };
    const newCategories = [...data.categories];
    newCategories[catIndex].features = [...newCategories[catIndex].features, newFeature];
    setData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleDeleteFeature = (catIndex, featureIndex) => {
    const newCategories = [...data.categories];
    newCategories[catIndex].features = newCategories[catIndex].features.filter((_, i) => i !== featureIndex);
    setData(prev => ({ ...prev, categories: newCategories }));
  };

  const handleCtaEdit = (key, value) => {
    setData(prev => ({
      ...prev,
      cta: { ...prev.cta, [key]: value }
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'features', content: data })
      });
      const result = await response.json();
      if (result.success) {
        alert('Özellikler sayfası veritabanına kaydedildi!');
      } else {
        alert('Kaydetme başarısız oldu.');
      }
    } catch (error) {
      console.error('Error saving features page:', error);
      alert('Bir hata oluştu.');
    }
    setIsEditable(false);
  };

  const renderEditableText = (section, key, value, className, tag = 'span', indices = null) => {
    if (!isEditable) {
      return tag === 'h1' ? <h1 className={className}>{value}</h1> :
             tag === 'h2' ? <h2 className={className}>{value}</h2> :
             tag === 'h3' ? <h3 className={className}>{value}</h3> :
             tag === 'p' ? <p className={className}>{value}</p> :
             <span className={className}>{value}</span>;
    }

    if (tag === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => {
            if (section === 'hero' || section === 'cta') {
              section === 'hero' ? handleHeroEdit(key, e.target.value) : handleCtaEdit(key, e.target.value);
            } else if (section === 'feature') {
              handleFeatureEdit(indices.catIndex, indices.featureIndex, key, e.target.value);
            }
          }}
          className={`${className} bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded p-2 w-full focus:border-primary focus:outline-none transition-all`}
          rows={3}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (section === 'hero' || section === 'cta') {
            section === 'hero' ? handleHeroEdit(key, e.target.value) : handleCtaEdit(key, e.target.value);
          } else if (section === 'category') {
            handleCategoryTitleEdit(indices.catIndex, e.target.value);
          } else if (section === 'feature') {
            handleFeatureEdit(indices.catIndex, indices.featureIndex, key, e.target.value);
          }
        }}
        className={`${className} bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none transition-all min-w-[50px]`}
      />
    );
  };

  // Show loading state while data is being fetched from database
  if (isLoading || !data) {
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
      
      {/* Hero Section */}
      <div className="bg-white pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4 uppercase tracking-wider">
            {renderEditableText('hero', 'badge', data.hero.badge, '', 'span')}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 flex flex-col md:block items-center justify-center gap-2">
            {renderEditableText('hero', 'title', data.hero.title, '', 'span')}
            <span className="gradient-text ml-0 md:ml-2">
              {renderEditableText('hero', 'highlight', data.hero.highlight, 'gradient-text', 'span')}
            </span>
          </h1>
          <div className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {renderEditableText('hero', 'description', data.hero.description, 'w-full text-center', 'textarea')}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="space-y-16">
          {(data.categories || []).map((category, catIdx) => (
            <div key={catIdx} className="scroll-mt-28" id={`category-${catIdx}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-200 flex-1"></div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                   {renderEditableText('category', 'title', category.title, 'text-center', 'span', { catIndex: catIdx })}
                </div>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(category.features || []).map((feature, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 group relative">
                    {isEditable && (
                      <button
                        onClick={() => handleDeleteFeature(catIdx, idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-20"
                        title="Sil"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color || 'from-primary to-purple-500'} rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden group/icon`}>
                      {feature.image ? (
                        <img 
                          src={feature.image} 
                          alt="icon" 
                          className="object-contain"
                          style={{ width: `${feature.size || 24}px`, height: `${feature.size || 24}px` }}
                        />
                      ) : (
                        <i 
                          className={`fas ${feature.icon} text-white`}
                          style={{ fontSize: `${feature.size || 24}px` }}
                        ></i>
                      )}

                      {isEditable && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity z-10">
                          <label className="cursor-pointer p-1">
                            <i className="fas fa-upload text-white text-xs"></i>
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleFeatureImageUpload(e, catIdx, idx)}
                            />
                          </label>
                          <input 
                            type="range" 
                            min="12" 
                            max="48" 
                            value={feature.size || 24}
                            onChange={(e) => handleFeatureEdit(catIdx, idx, 'size', e.target.value)}
                            className="w-10 h-1 mt-1 accent-primary cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {renderEditableText('feature', 'title', feature.title, 'w-full font-bold', 'span', { catIndex: catIdx, featureIndex: idx })}
                    </h3>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {renderEditableText('feature', 'desc', feature.desc, 'w-full text-sm', 'textarea', { catIndex: catIdx, featureIndex: idx })}
                    </div>
                  </div>
                ))}
                {isEditable && (
                  <button
                    onClick={() => handleAddFeature(catIdx)}
                    className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                      <i className="fas fa-plus text-2xl text-gray-400"></i>
                    </div>
                    <span className="text-gray-500 font-medium">Yeni Özellik Ekle</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            {renderEditableText('cta', 'title', data.cta.title, 'text-white', 'span')}
          </h2>
          <div className="text-white/90 text-lg mb-8 max-w-2xl mx-auto relative z-10">
             {renderEditableText('cta', 'description', data.cta.description, 'text-white/90 text-center', 'textarea')}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a href={`tel:${siteData?.contact?.phoneRaw || '03121234567'}`} className="bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg">
              <i className="fas fa-phone mr-2"></i> 
              {renderEditableText('cta', 'phoneButton', data.cta.phoneButton, '', 'span')}
            </a>
            <a href="/iletisim" className="bg-black/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition">
              {renderEditableText('cta', 'contactButton', data.cta.contactButton, '', 'span')}
            </a>
          </div>
        </div>
      </div>

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
    </div>
  );
}
