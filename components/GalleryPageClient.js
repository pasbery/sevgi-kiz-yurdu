"use client";
import { useState, useRef, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';

export default function GalleryPageClient() {
  const { isEditable, setIsEditable, isAdmin } = useSite();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  // Load gallery page data from database on mount
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await fetch('/api/pages?id=gallery');
        const result = await response.json();
        if (result.success && result.data?.content) {
          setData(result.data.content);
        } else {
          // Fallback: load gallery images from gallery API
          const galleryResponse = await fetch('/api/gallery');
          const galleryResult = await galleryResponse.json();
          if (galleryResult.success && galleryResult.data) {
            setData({
              hero: {
                title: 'Fotoğraf',
                highlight: 'Galerisi',
                description: 'Öğrencilerimizin güvenli ve konforlu yaşam alanlarını yakından inceleyin.'
              },
              categories: [
                { id: 'all', name: 'Tümü', icon: 'fa-th-large' },
                { id: 'odalar', name: 'Odalar', icon: 'fa-bed' },
                { id: 'yemekhane', name: 'Yemekhane', icon: 'fa-utensils' },
                { id: 'ortak', name: 'Ortak Alanlar', icon: 'fa-couch' },
                { id: 'etut', name: 'Etüt Odaları', icon: 'fa-book-reader' }
              ],
              images: galleryResult.data
            });
          }
        }
      } catch (error) {
        console.error('Error fetching gallery data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryData();
  }, []);

  const handleHeroEdit = (key, value) => {
    setData(prev => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const handleImageEdit = (index, field, value) => {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setData(prev => ({ ...prev, images: newImages }));
  };

  const handleImageDelete = (index) => {
    if (confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
      const newImages = data.images.filter((_, i) => i !== index);
      setData(prev => ({ ...prev, images: newImages }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setData(prev => ({
            ...prev,
            images: [...prev.images, {
              src: reader.result,
              category: selectedCategory === 'all' ? 'odalar' : selectedCategory,
              title: file.name.replace(/\.[^/.]+$/, '') || 'Yeni Fotoğraf'
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      // Save gallery images to database
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: data.images })
      });
      const result = await response.json();
      if (result.success) {
        alert('Galeri veritabanına kaydedildi!');
      } else {
        alert('Kaydetme başarısız oldu.');
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      alert('Bir hata oluştu.');
    }
    setIsEditable(false);
  };

  // Show loading state while data is being fetched from database
  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-28">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const filteredImages = selectedCategory === 'all' 
    ? (data.images || [])
    : (data.images || []).filter(img => img.category === selectedCategory);

  const getOriginalIndex = (filteredIndex) => {
    const img = filteredImages[filteredIndex];
    return (data.images || []).findIndex(i => i === img);
  };

  return (
    <div className="bg-white min-h-screen pt-28 sm:pt-32 pb-20">
      
      {/* Hero */}
      <div className="text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex flex-col md:flex-row items-center justify-center gap-2">
          {isEditable ? (
            <input type="text" value={data.hero.title} onChange={(e) => handleHeroEdit('title', e.target.value)} className="bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none text-center" />
          ) : data.hero.title}
          <span className="gradient-text">
            {isEditable ? (
              <input type="text" value={data.hero.highlight} onChange={(e) => handleHeroEdit('highlight', e.target.value)} className="gradient-text bg-transparent border-2 border-dashed border-primary/50 rounded px-2 focus:outline-none text-center" />
            ) : data.hero.highlight}
          </span>
        </h1>
        <div className="text-xl text-gray-500 max-w-2xl mx-auto">
          {isEditable ? (
            <textarea value={data.hero.description} onChange={(e) => handleHeroEdit('description', e.target.value)} className="w-full bg-transparent border-2 border-dashed border-primary/50 rounded p-2 focus:outline-none text-center" rows={2} />
          ) : <p>{data.hero.description}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Kategori Filtreleme */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {data.categories.map((cat) => (
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

        {/* Upload Button (Edit Mode) */}
        {isEditable && (
          <div className="flex justify-center mb-8">
            <label className="cursor-pointer bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
              <i className="fas fa-cloud-upload-alt text-xl"></i>
              Yeni Fotoğraf Yükle
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img, idx) => {
            const originalIndex = getOriginalIndex(idx);
            return (
              <div 
                key={idx} 
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 bg-gray-100"
              >
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onClick={() => !isEditable && setSelectedImage(img)}
                />
                
                {/* Normal Hover Overlay */}
                {!isEditable && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={() => setSelectedImage(img)}>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="inline-block px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-md text-[10px] font-bold text-white uppercase tracking-wider mb-1">
                        {data.categories.find(c => c.id === img.category)?.name}
                      </span>
                      <h3 className="text-white font-bold text-sm md:text-base">{img.title}</h3>
                    </div>
                  </div>
                )}

                {/* Edit Mode Overlay */}
                {isEditable && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2 mb-3">
                      <button 
                        onClick={() => handleImageDelete(originalIndex)}
                        className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                        title="Sil"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                    <input 
                      type="text" 
                      value={img.title} 
                      onChange={(e) => handleImageEdit(originalIndex, 'title', e.target.value)}
                      className="w-[90%] bg-white/90 text-gray-800 text-sm px-3 py-2 rounded-lg focus:outline-none text-center mb-2"
                      placeholder="Fotoğraf başlığı"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <select 
                      value={img.category}
                      onChange={(e) => handleImageEdit(originalIndex, 'category', e.target.value)}
                      className="w-[90%] bg-white/90 text-gray-800 text-sm px-3 py-2 rounded-lg focus:outline-none text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {data.categories.filter(c => c.id !== 'all').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Zoom Icon (Non-edit mode) */}
                {!isEditable && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                    <i className="fas fa-search-plus text-white text-xs"></i>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add New Image Card (Edit Mode) */}
          {isEditable && (
            <label className="group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all duration-300 cursor-pointer flex flex-col items-center justify-center">
              <i className="fas fa-plus text-4xl text-gray-400 group-hover:text-primary mb-2 transition-colors"></i>
              <span className="text-gray-500 group-hover:text-primary text-sm font-medium transition-colors">Fotoğraf Ekle</span>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          )}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && !isEditable && (
          <div className="text-center py-16">
            <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">Bu kategoride henüz fotoğraf yok.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && !isEditable && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
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
                {data.categories.find(c => c.id === selectedImage.category)?.name}
              </p>
            </div>
          </div>
        </div>
      )}

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
