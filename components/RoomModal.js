"use client";
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';

export default function RoomModal({ isOpen, onClose, room }) {
  const { siteData } = useSite();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Modal açıldığında scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !room) return null;

  const images = room.images || [];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getFeatureIcon = (feature) => {
    if (feature.includes('Yatak')) return 'fa-bed';
    if (feature.includes('Banyo')) return 'fa-bath';
    if (feature.includes('Klima')) return 'fa-wind';
    if (feature.includes('TV')) return 'fa-tv';
    if (feature.includes('Salon')) return 'fa-couch';
    if (feature.includes('Masa')) return 'fa-desk';
    if (feature.includes('Dolap')) return 'fa-box';
    if (feature.includes('Buzdolabı')) return 'fa-snowflake';
    if (feature.includes('Balkon')) return 'fa-door-open';
    return 'fa-check';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
      
      <div className="bg-white w-full max-w-5xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col sm:flex-row animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Left: Image Slider */}
        <div className="w-full sm:w-1/2 h-64 sm:h-auto bg-gray-900 relative group">
          <img 
            src={images[currentImageIndex]} 
            alt={room.name} 
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100">
                <i className="fas fa-chevron-right"></i>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Content */}
        <div className="w-full sm:w-1/2 flex flex-col h-full overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${room.status === 'Müsait' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {room.status}
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-gray-500 font-medium">{room.floor}</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">{room.name}</h2>
            <p className="text-primary font-bold text-xl mb-6">{room.size}</p>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Oda Hakkında</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {room.description} Geniş ve ferah yaşam alanı, modern mobilyalar ve ergonomik çalışma düzeni ile konforunuz için tasarlandı.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Özellikler</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.features?.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 p-2 rounded-lg">
                    <i className={`fas ${getFeatureIcon(feature)} text-primary`}></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex gap-3">
              <a href={`tel:${siteData?.contact?.phoneRaw || '05xxxxxxxxx'}`} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-center hover:bg-black transition text-sm flex items-center justify-center gap-2">
                <i className="fas fa-phone"></i> Ara
              </a>
              <a href={`https://wa.me/${siteData?.contact?.whatsapp || '905xxxxxxxxx'}`} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-center hover:bg-green-600 transition text-sm flex items-center justify-center gap-2">
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
