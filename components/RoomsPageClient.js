"use client";
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import { useRooms } from '@/context/RoomsContext';
import Link from 'next/link';

export default function RoomsPageClient() {
  const { isEditable, setIsEditable, isAdmin } = useSite();
  const { roomTypes, updateRoomType, addRoomType, deleteRoomType, setRoomTypes, saveRoomsData, isSaving, isLoading: roomsLoading } = useRooms();
  const [isLoading, setIsLoading] = useState(true);
  const [hero, setHero] = useState(null);

  // Load rooms page data from database on mount
  useEffect(() => {
    const fetchRoomsPageData = async () => {
      try {
        const response = await fetch('/api/pages?id=rooms');
        const result = await response.json();
        if (result.success && result.data?.content?.hero) {
          setHero(result.data.content.hero);
        }
      } catch (error) {
        console.error('Error fetching rooms page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomsPageData();
  }, []);

  const colorOptions = [
    { value: 'bg-amber-500', label: 'Amber' },
    { value: 'bg-purple-500', label: 'Mor' },
    { value: 'bg-green-500', label: 'Yeşil' },
    { value: 'bg-blue-500', label: 'Mavi' },
    { value: 'bg-cyan-500', label: 'Turkuaz' },
    { value: 'bg-red-500', label: 'Kırmızı' },
    { value: 'bg-pink-500', label: 'Pembe' },
    { value: 'bg-indigo-500', label: 'İndigo' },
    { value: 'bg-teal-500', label: 'Teal' },
    { value: 'bg-orange-500', label: 'Turuncu' }
  ];

  const handleHeroEdit = (key, value) => {
    setHero(prev => ({ ...prev, [key]: value }));
  };

  const handleRoomTypeEdit = (index, field, value) => {
    updateRoomType(index, field, value);
  };

  const handleRoomTypeImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file && isEditable) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateRoomType(index, 'img', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRoomType = () => {
    const newKey = `oda-tipi-${Date.now()}`;
    addRoomType({
      key: newKey,
      label: 'Yeni Oda Tipi',
      color: 'bg-gray-500',
      img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop',
      price: '₺0',
      description: 'Oda açıklaması'
    });
  };

  const handleDeleteRoomType = (index) => {
    if (confirm('Bu oda tipini silmek istediğinize emin misiniz?')) {
      deleteRoomType(index);
    }
  };

  const handleSave = async () => {
    const result = await saveRoomsData();
    if (result.success) {
      alert('Oda bilgileri veritabanına kaydedildi!');
    } else {
      alert('Kaydetme başarısız: ' + result.message);
    }
    setIsEditable(false);
  };

  // Show loading state while data is being fetched from database
  if (isLoading || !hero || roomsLoading) {
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
    <div className="pt-28 sm:pt-32 pb-16 bg-gray-50 min-h-screen">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isEditable ? (
              <input 
                type="text" 
                value={hero.title} 
                onChange={(e) => handleHeroEdit('title', e.target.value)} 
                className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/50 rounded-lg px-4 py-2 focus:outline-none text-center w-full max-w-md"
              />
            ) : hero.title}
          </h1>
          <div className="text-white/90 text-lg max-w-2xl mx-auto">
            {isEditable ? (
              <textarea 
                value={hero.description} 
                onChange={(e) => handleHeroEdit('description', e.target.value)} 
                className="w-full bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/50 rounded-lg px-4 py-2 focus:outline-none text-center resize-none"
                rows={2}
              />
            ) : <p>{hero.description}</p>}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <section id="odalar" className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Add Button (Edit Mode) */}
          {isEditable && (
            <div className="flex justify-center mb-8">
              <button 
                onClick={handleAddRoomType}
                className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-plus"></i>
                Yeni Oda Tipi Ekle
              </button>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-10 sm:gap-14 lg:gap-16">
            {roomTypes.map((type, idx) => (
              <div key={type.key} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative w-44 sm:w-48 lg:w-52">
                
                {/* Delete Button (Edit Mode) */}
                {isEditable && (
                  <button 
                    onClick={() => handleDeleteRoomType(idx)}
                    className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                    title="Sil"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                )}

                <div className="relative overflow-hidden">
                  <img 
                    src={type.img} 
                    alt={type.label} 
                    className="w-full h-32 sm:h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Image Upload Overlay (Edit Mode) */}
                  {isEditable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white/90 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
                        <i className="fas fa-camera"></i>
                        Değiştir
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleRoomTypeImageUpload(e, idx)} 
                        />
                      </label>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2 right-2">
                    {isEditable ? (
                      <div className="flex items-center gap-1">
                        <select 
                          value={type.color}
                          onChange={(e) => handleRoomTypeEdit(idx, 'color', e.target.value)}
                          className={`${type.color} text-white text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium cursor-pointer`}
                        >
                          {colorOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span className={`${type.color} text-white text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium`}>{type.label}</span>
                    )}
                  </div>
                </div>

                <div className="p-2 sm:p-3 lg:p-4 flex flex-col h-44 sm:h-48">
                  {isEditable ? (
                    <>
                      <input 
                        type="text" 
                        value={type.label}
                        onChange={(e) => handleRoomTypeEdit(idx, 'label', e.target.value)}
                        className="w-full text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
                        placeholder="Oda Tipi Adı"
                      />
                      <input 
                        type="text" 
                        value={type.price}
                        onChange={(e) => handleRoomTypeEdit(idx, 'price', e.target.value)}
                        className="w-full text-primary font-semibold mb-1 text-[10px] sm:text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary"
                        placeholder="Fiyat"
                      />
                      <textarea 
                        value={type.description}
                        onChange={(e) => handleRoomTypeEdit(idx, 'description', e.target.value)}
                        className="w-full text-gray-600 mb-2 text-[10px] sm:text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary resize-none"
                        placeholder="Açıklama"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">{type.label} Oda</h3>
                      <p className="text-primary font-semibold mb-1 text-[10px] sm:text-xs">{type.price}/ay</p>
                      <p className="text-gray-500 text-[10px] sm:text-xs mb-2 line-clamp-2 flex-grow">{type.description}</p>
                    </>
                  )}
                  
                  <Link 
                    href={`/odalar/${type.key}`} 
                    className="block w-full text-center bg-gray-900 text-white py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-primary transition-colors group-hover:bg-primary text-[10px] sm:text-xs"
                  >
                    <i className="fas fa-door-open mr-1"></i>İncele
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
