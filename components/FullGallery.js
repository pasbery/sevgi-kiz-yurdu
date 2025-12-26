"use client";
import { useState } from 'react';

export default function FullGallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', name: 'Tümü', icon: 'fa-th-large' },
    { id: 'odalar', name: 'Odalar', icon: 'fa-bed' },
    { id: 'yemekhane', name: 'Yemekhane', icon: 'fa-utensils' },
    { id: 'ortak', name: 'Ortak Alanlar', icon: 'fa-couch' },
    { id: 'etut', name: 'Etüt Odaları', icon: 'fa-book-reader' }
  ];

  const images = [
    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop', category: 'odalar', title: '2 Kişilik Oda' },
    { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', category: 'odalar', title: '1 Kişilik Oda' },
    { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop', category: 'yemekhane', title: 'Modern Yemekhane' },
    { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', category: 'ortak', title: 'Oturma Salonu' },
    { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', category: 'ortak', title: 'TV & Oyun Odası' },
    { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&h=600&fit=crop', category: 'odalar', title: 'Yurt Dış Cephe' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', category: 'etut', title: 'Sessiz Etüt Odası' },
    { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop', category: 'etut', title: 'Grup Çalışma Masaları' },
    { src: 'https://images.unsplash.com/photo-1512918760532-3ad861f80d12?w=800&h=600&fit=crop', category: 'ortak', title: 'Lobi' },
    { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop', category: 'odalar', title: '3 Kişilik Oda' },
    { src: 'https://images.unsplash.com/photo-1631049552057-403ddb786584?w=800&h=600&fit=crop', category: 'odalar', title: '4 Kişilik Oda' },
    { src: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&h=600&fit=crop', category: 'yemekhane', title: 'Kahvaltı Büfesi' },
  ];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div>
      {/* Kategori Filtreleme */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <i className={`fas ${cat.icon} mr-2`}></i>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setSelectedImage(img)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 bg-gray-100"
          >
            <img 
              src={img.src} 
              alt={img.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-md text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                  {categories.find(c => c.id === img.category)?.name}
                </span>
                <h3 className="text-white font-bold text-sm md:text-base">{img.title}</h3>
              </div>
            </div>
            
            {/* Zoom Icon */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
              <i className="fas fa-search-plus text-white text-xs"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <i className="fas fa-times text-2xl"></i>
          </button>

          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
              <p className="text-white/60 text-sm mt-1">
                {categories.find(c => c.id === selectedImage.category)?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
