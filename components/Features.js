"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSite } from '@/context/SiteContext';

export default function Features({ content, isEditable = false, onEdit }) {
  const { siteData } = useSite();
  const [showModal, setShowModal] = useState(false);
  const [allFeatures, setAllFeatures] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const defaultFeatures = [
    { icon: 'fa-shield-alt', color: 'from-green-400 to-emerald-500', title: '7/24 Güvenlik', desc: 'Kesintisiz koruma.' },
    { icon: 'fa-utensils', color: 'from-orange-400 to-pink-500', title: '3 Öğün Yemek', desc: 'Sağlıklı yemekler.' },
    { icon: 'fa-wifi', color: 'from-blue-400 to-indigo-500', title: 'Fiber İnternet', desc: 'Hızlı internet.' },
    { icon: 'fa-book-reader', color: 'from-purple-400 to-violet-500', title: 'Etüt Odaları', desc: 'Çalışma alanları.' },
    { icon: 'fa-tshirt', color: 'from-pink-400 to-rose-500', title: 'Çamaşırhane', desc: 'Modern makineler.' },
    { icon: 'fa-tv', color: 'from-cyan-400 to-teal-500', title: 'Sosyal Alanlar', desc: 'TV ve dinlenme.' },
    { icon: 'fa-snowflake', color: 'from-sky-400 to-blue-500', title: 'Klima Sistemi', desc: 'Yıl boyu konfor.' },
    { icon: 'fa-bus', color: 'from-amber-400 to-yellow-500', title: 'Servis Hizmeti', desc: 'Kolay ulaşım.' }
  ];

  const defaultContent = {
    title: 'Neden',
    highlight: `${siteData?.brand?.name}?`,
    subtitle: 'Özelliklerimiz',
    items: defaultFeatures
  };

  const data = content || defaultContent;

  // Fetch all features from database
  useEffect(() => {
    if (showModal) {
      const fetchAllFeatures = async () => {
        try {
          const response = await fetch('/api/pages?id=features');
          const result = await response.json();
          if (result.success && result.data?.content?.categories) {
            const all = [];
            result.data.content.categories.forEach(cat => {
              cat.features.forEach(f => {
                all.push({ ...f, category: cat.title });
              });
            });
            setAllFeatures(all);
          }
        } catch (error) {
          console.error('Error fetching features:', error);
        }
      };
      fetchAllFeatures();
    }
  }, [showModal]);

  const openModalForCard = (index) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSelectFeature = (feature) => {
    if (editingIndex !== null) {
      const newItems = [...data.items];
      newItems[editingIndex] = { ...feature };
      delete newItems[editingIndex].category;
      onEdit('items', newItems);
      setShowModal(false);
      setEditingIndex(null);
    }
  };

  const renderEditableText = (key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h2' ? <h2 className={className}>{value}</h2> : 
             tag === 'p' ? <p className={className}>{value}</p> :
             <span className={className}>{value}</span>;
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onEdit(key, e.target.value)}
        className={`${className} border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none transition-all min-w-[50px]`}
      />
    );
  };

  return (
    <section id="ozellikler" className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-white to-violet-50/80">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-8">
          <div className="text-primary font-semibold text-[10px] xs:text-xs sm:text-sm uppercase tracking-wider">
            {renderEditableText('subtitle', data.subtitle, '', 'span')}
          </div>
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-1.5 xs:mt-2 sm:mt-3 flex justify-center gap-2">
            {renderEditableText('title', data.title, '', 'span')}
            <span className="gradient-text">
              {renderEditableText('highlight', data.highlight, 'gradient-text', 'span')}
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {data.items.map((feature, idx) => (
            <div 
              key={idx} 
              onClick={() => isEditable && openModalForCard(idx)}
              className={`bg-white border border-gray-200 shadow-md p-4 sm:p-5 rounded-xl hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative ${isEditable ? 'ring-2 ring-dashed ring-primary/50 hover:ring-primary' : ''}`}
            >
              {isEditable && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs z-10">
                  <i className="fas fa-exchange-alt text-[10px]"></i>
                </div>
              )}
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 bg-gradient-to-br ${feature.color || 'from-primary to-purple-500'} rounded-xl flex items-center justify-center overflow-hidden`}>
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
              </div>
              <h3 className="text-xs sm:text-base font-semibold text-gray-800 mb-0.5 sm:mb-1 text-center">
                {feature.title}
              </h3>
              <div className="text-gray-500 text-[10px] sm:text-sm hidden sm:block text-center">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Link href="/ozellikler" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30">
            Tüm Özellikleri İncele <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>

      {/* Feature Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(false); setEditingIndex(null); }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Özellik Seçin
                </h3>
                <button onClick={() => { setShowModal(false); setEditingIndex(null); }} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {editingIndex !== null && `"${data.items[editingIndex]?.title}" yerine yeni bir özellik seçin`}
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allFeatures.map((feature, idx) => {
                  const isCurrentlySelected = editingIndex !== null && data.items[editingIndex]?.title === feature.title;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectFeature(feature)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary hover:bg-primary/5 ${
                        isCurrentlySelected ? 'border-primary bg-primary/10' : 'border-gray-200'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${feature.color || 'from-primary to-purple-500'} rounded-xl flex items-center justify-center`}>
                        <i className={`fas ${feature.icon} text-white text-lg`}></i>
                      </div>
                      <h4 className="text-sm font-bold text-gray-800 text-center">{feature.title}</h4>
                      <p className="text-xs text-gray-500 text-center mt-1">{feature.category}</p>
                      {isCurrentlySelected && (
                        <div className="text-center mt-2">
                          <span className="text-xs text-primary font-medium">Mevcut</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => { setShowModal(false); setEditingIndex(null); }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
