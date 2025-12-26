"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSite } from '@/context/SiteContext';

export default function Hero({ content, isEditable = false, onEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [allFeatures, setAllFeatures] = useState([]);
  const [editingCardIndex, setEditingCardIndex] = useState(null);

  const defaultContent = {
    title: 'Evinizden Uzakta,',
    highlight: 'Sıcak Bir Yuva',
    description: 'Güvenli, konforlu ve huzurlu bir yaşam alanı.',
    stats: {
      students: '500+',
      experience: '15+',
      rating: '4.9'
    },
    statsLabels: {
      students: 'Mutlu Öğrenci',
      experience: 'Yıl Tecrübe',
      rating: 'Puan'
    },
    floatingImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=700&fit=crop',
    slides: [
      { img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&h=300&fit=crop', title: 'Yurt Odası' },
      { img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&h=300&fit=crop', title: 'Ortak Alan' },
      { img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&h=300&fit=crop', title: 'Çalışma Alanı' }
    ],
    badge: null, // Will use siteData.registration.badge
    floatingCards: [
      { icon: 'fa-shield-alt', color: 'bg-green-100 text-green-600', title: '7/24 Güvenlik', subtitle: 'Kamera Sistemi' },
      { icon: 'fa-wifi', color: 'bg-purple-100 text-purple-600', title: 'Yüksek Hızlı', subtitle: 'Fiber İnternet' },
      { icon: 'fa-utensils', color: 'bg-orange-100 text-orange-600', title: '3 Öğün', subtitle: 'Yemek Dahil' }
    ]
  };

  const data = content || defaultContent;
  const { siteData } = useSite();

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = data.slides || defaultContent.slides;
  const cards = data.floatingCards || defaultContent.floatingCards;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isEditable) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length, isEditable]);

  // Fetch all features for modal
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

  const openCardModal = (index) => {
    setEditingCardIndex(index);
    setShowModal(true);
  };

  const handleSelectFeature = (feature) => {
    if (editingCardIndex !== null && onEdit) {
      const newCards = [...cards];
      // Map feature colors to Hero card format
      const colorMap = {
        'from-green-400 to-emerald-500': 'bg-green-100 text-green-600',
        'from-orange-400 to-pink-500': 'bg-orange-100 text-orange-600',
        'from-blue-400 to-indigo-500': 'bg-blue-100 text-blue-600',
        'from-purple-400 to-violet-500': 'bg-purple-100 text-purple-600',
        'from-pink-400 to-rose-500': 'bg-pink-100 text-pink-600',
        'from-cyan-400 to-teal-500': 'bg-cyan-100 text-cyan-600',
        'from-sky-400 to-blue-500': 'bg-sky-100 text-sky-600',
        'from-amber-400 to-yellow-500': 'bg-amber-100 text-amber-600',
      };
      newCards[editingCardIndex] = {
        icon: feature.icon,
        color: colorMap[feature.color] || 'bg-primary/10 text-primary',
        title: feature.title,
        subtitle: feature.desc,
        image: feature.image
      };
      onEdit('floatingCards', newCards);
      setShowModal(false);
      setEditingCardIndex(null);
    }
  };

  const goToSlide = (index) => setCurrentSlide(index);

  const handleCardEdit = (index, field, value) => {
    if (!onEdit) return;
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    onEdit('floatingCards', newCards);
  };

  const handleImageUpload = (e, key, index = null) => {
    const file = e.target.files[0];
    if (file && onEdit) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (index !== null) {
          const newSlides = [...slides];
          newSlides[index] = { ...newSlides[index], img: reader.result };
          onEdit('slides', newSlides);
        } else {
          onEdit(key, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCardIconUpload = (e, index) => {
    const file = e.target.files[0];
    if (file && onEdit) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCards = [...cards];
        newCards[index] = { ...newCards[index], image: reader.result };
        onEdit('floatingCards', newCards);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditableText = (key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h1' ? <h1 className={className}>{value}</h1> : 
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
    <section id="anasayfa" className="min-h-[60vh] xs:min-h-[65vh] sm:min-h-[70vh] md:min-h-screen flex items-center bg-white relative overflow-hidden pt-20 xs:pt-22 sm:pt-28 md:pt-32">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-pink-50"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl hidden md:block"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl hidden md:block"></div>
      
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-10 md:py-16 lg:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-primary/10 px-2.5 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full mb-3 xs:mb-4 sm:mb-6 md:mb-8">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse"></span>
              {renderEditableText('badge', data.badge || siteData?.registration?.badge || '2024-2025 Kayıtları Başladı', 'text-[10px] xs:text-xs sm:text-sm font-medium text-primary', 'span')}
            </div>
            
            <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-2 xs:mb-3 sm:mb-4 md:mb-6">
              {renderEditableText('title', data.title, '', 'span')}
              <br />
              {isEditable ? (
                <input
                  type="text"
                  value={data.highlight}
                  onChange={(e) => onEdit('highlight', e.target.value)}
                  className="gradient-text border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none transition-all mt-2"
                />
              ) : (
                <span className="block gradient-text">{data.highlight}</span>
              )}
            </div>
            
            {isEditable ? (
              <textarea
                value={data.description}
                onChange={(e) => onEdit('description', e.target.value)}
                className="w-full text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-4 sm:mb-6 max-w-lg leading-relaxed mx-auto md:mx-0 border-2 border-dashed border-primary/50 bg-primary/5 rounded p-3 focus:border-primary focus:outline-none"
                rows={3}
              />
            ) : (
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-4 sm:mb-6 max-w-lg leading-relaxed mx-auto md:mx-0">
                {data.description}
              </p>
            )}
            
            {/* Mobile Slider */}
            <div className="md:hidden mb-4 sm:mb-6 relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl">
              <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, idx) => (
                  <div key={idx} className="relative w-full flex-shrink-0 group">
                    <Image 
                      src={slide.img} 
                      alt={slide.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority={idx === 0}
                    />
                    {isEditable && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white">
                          <i className="fas fa-camera text-2xl mb-1"></i>
                          <span className="text-xs font-semibold">Değiştir</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, 'slides', idx)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 right-2 xs:right-3 flex justify-between items-end">
                <div className="text-white">
                  <p className="text-[10px] xs:text-xs opacity-80">Keşfet</p>
                  <p className="font-semibold text-xs xs:text-sm">{slides[currentSlide].title}</p>
                </div>
                <div className="flex gap-1 xs:gap-1.5">
                  {slides.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex flex-row gap-3 md:gap-4 mb-8 md:mb-12">
              <Link href="/#iletisim" className="group bg-gray-900 text-white px-6 xl:px-8 py-3 xl:py-4 rounded-full font-medium hover:bg-primary transition-all flex items-center justify-center gap-2">
                Hemen Başvur
                <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </Link>
              <Link href="/#odalar" className="px-6 xl:px-8 py-3 xl:py-4 rounded-full font-medium text-gray-700 hover:text-primary transition border border-gray-200 hover:border-primary text-center">
                Odaları İncele
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-4 xs:gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              <div className="text-center md:text-left">
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.stats.students}
                      onChange={(e) => onEdit('stats.students', e.target.value)}
                      className="w-24 border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center md:text-left"
                    />
                  ) : (
                    data.stats.students
                  )}
                </div>
                <div className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-0.5 sm:mt-1">
                  {renderEditableText('statsLabels.students', data.statsLabels?.students || 'Mutlu Öğrenci', '', 'span')}
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.stats.experience}
                      onChange={(e) => onEdit('stats.experience', e.target.value)}
                      className="w-24 border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center md:text-left"
                    />
                  ) : (
                    data.stats.experience
                  )}
                </div>
                <div className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-0.5 sm:mt-1">
                  {renderEditableText('statsLabels.experience', data.statsLabels?.experience || 'Yıl Tecrübe', '', 'span')}
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  {isEditable ? (
                    <input
                      type="text"
                      value={data.stats.rating}
                      onChange={(e) => onEdit('stats.rating', e.target.value)}
                      className="w-24 border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center md:text-left"
                    />
                  ) : (
                    data.stats.rating
                  )}
                </div>
                <div className="text-gray-400 text-[10px] xs:text-xs sm:text-sm mt-0.5 sm:mt-1">
                  {renderEditableText('statsLabels.rating', data.statsLabels?.rating || 'Puan', '', 'span')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Floating Image */}
          <div className="relative hidden md:block">
            <div className="animate-float relative group">
              <Image 
                   src={data.floatingImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=700&fit=crop"} 
                   alt="Yurt Odası" 
                   width={400}
                   height={500}
                   priority
                   className="rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover"
                 />
              
              {isEditable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white">
                    <i className="fas fa-camera text-3xl mb-2"></i>
                    <span className="text-sm font-semibold">Fotoğrafı Değiştir</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, 'floatingImage')}
                    />
                  </label>
                </div>
              )}
            </div>
            
            {/* Dynamic Floating Cards */}
            {data.floatingCards && data.floatingCards.map((card, idx) => {
              const positions = [
                '-bottom-5 -left-5 animate-float-slow',
                '-top-5 -right-5 animate-float-delayed',
                'top-1/2 -right-10 animate-float-gentle'
              ];
              
              return (
                <div 
                  key={idx} 
                  onClick={() => isEditable && openCardModal(idx)}
                  className={`absolute ${positions[idx] || ''} bg-white p-2.5 sm:p-3 rounded-xl shadow-lg z-20 ${isEditable ? 'cursor-pointer ring-2 ring-dashed ring-primary/30 hover:ring-primary' : ''}`}
                >
                  {isEditable && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] z-30">
                      <i className="fas fa-exchange-alt"></i>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${card.color.split(' ')[0]} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {card.image ? (
                        <Image 
                          src={card.image} 
                          alt="icon" 
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      ) : (
                        <i 
                          className={`fas ${card.icon} ${card.color.split(' ')[1]} text-sm sm:text-base`}
                        ></i>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight">{card.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(false); setEditingCardIndex(null); }}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Özellik Seçin
                </h3>
                <button onClick={() => { setShowModal(false); setEditingCardIndex(null); }} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {editingCardIndex !== null && cards[editingCardIndex] && `"${cards[editingCardIndex].title}" yerine yeni bir özellik seçin`}
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {allFeatures.map((feature, idx) => {
                  const isCurrentlySelected = editingCardIndex !== null && cards[editingCardIndex]?.title === feature.title;
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
                onClick={() => { setShowModal(false); setEditingCardIndex(null); }}
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
