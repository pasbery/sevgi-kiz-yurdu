"use client";
import { useState } from 'react';
import { useSite } from '@/context/SiteContext';
import { useRooms } from '@/context/RoomsContext';
import Link from 'next/link';
import RoomModal from '@/components/RoomModal';

export default function RoomDetailPageClient({ slug }) {
  const { isEditable, setIsEditable, isAdmin } = useSite();
  const { getRoomDetailBySlug, getRoomTypeBySlug, roomsDetail, updateRoomDetail, saveRoomsData } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);

  const roomType = getRoomTypeBySlug(slug);
  const detailData = getRoomDetailBySlug(slug);

  // Local state for rooms that syncs with context
  const [rooms, setRooms] = useState(detailData?.rooms || []);

  if (!detailData || !roomType) {
    return (
      <div className="bg-gray-50 min-h-screen pt-28 sm:pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sayfa Bulunamadı</h1>
          <Link href="/odalar" className="text-primary hover:underline">Tüm Odalara Dön</Link>
        </div>
      </div>
    );
  }

  // Data derived from context (synced with RoomsPageClient)
  const title = `${roomType.label} Odalar`;
  const subtitle = `${roomType.label} odalarımızı inceleyin`;
  const price = `${roomType.price}/ay`;

  const handleRoomEdit = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], [field]: value };
    setRooms(newRooms);
  };

  const handleFeatureEdit = (roomIndex, featureIndex, value) => {
    const newRooms = [...rooms];
    const newFeatures = [...newRooms[roomIndex].features];
    newFeatures[featureIndex] = value;
    newRooms[roomIndex] = { ...newRooms[roomIndex], features: newFeatures };
    setRooms(newRooms);
  };

  const handleAddFeature = (roomIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex] = { ...newRooms[roomIndex], features: [...newRooms[roomIndex].features, 'Yeni Özellik'] };
    setRooms(newRooms);
  };

  const handleDeleteFeature = (roomIndex, featureIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex] = { ...newRooms[roomIndex], features: newRooms[roomIndex].features.filter((_, i) => i !== featureIndex) };
    setRooms(newRooms);
  };

  const handleRoomImageUpload = (e, roomIndex) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRooms(prev => {
          const newRooms = [...prev];
          newRooms[roomIndex] = { ...newRooms[roomIndex], images: [...newRooms[roomIndex].images, reader.result] };
          return newRooms;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteRoomImage = (roomIndex, imageIndex) => {
    const newRooms = [...rooms];
    newRooms[roomIndex] = { ...newRooms[roomIndex], images: newRooms[roomIndex].images.filter((_, i) => i !== imageIndex) };
    setRooms(newRooms);
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      name: 'Yeni Oda',
      floor: '1. Kat',
      view: 'Bahçe Manzaralı',
      size: '20 m²',
      status: 'Müsait',
      features: ['Yatak', 'Banyo', 'Klima'],
      description: 'Oda açıklaması',
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop']
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const handleDeleteRoom = (index) => {
    if (confirm('Bu odayı silmek istediğinize emin misiniz?')) {
      setRooms(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    // Sync rooms back to context first
    updateRoomDetail(slug, { ...roomsDetail[slug], rooms });
    // Then save to database
    const result = await saveRoomsData();
    if (result.success) {
      alert('Oda detayları veritabanına kaydedildi!');
    } else {
      alert('Kaydetme başarısız: ' + result.message);
    }
    setIsEditable(false);
    setEditingRoomIndex(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/odalar" className="hover:text-primary transition flex items-center gap-1">
              <i className="fas fa-arrow-left"></i> Tüm Odalar
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
          <p className="text-xs text-gray-400 mt-2 italic">(Başlık, açıklama ve fiyat Odalar sayfasından düzenlenir)</p>
          
          <div className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
            <span className="text-gray-500">Başlangıç Fiyatı:</span>
            <span className="text-2xl font-bold text-primary">{price}</span>
          </div>
        </div>

        {isEditable && (
          <div className="flex justify-center mb-8">
            <button onClick={handleAddRoom} className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2">
              <i className="fas fa-plus"></i> Yeni Oda Ekle
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room, idx) => (
            <div key={room.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative ${isEditable ? '' : 'cursor-pointer hover:-translate-y-1'}`} onClick={() => !isEditable && setSelectedRoom(room)}>
              
              {isEditable && (
                <button onClick={(e) => { e.stopPropagation(); handleDeleteRoom(idx); }} className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 shadow-lg">
                  <i className="fas fa-trash text-xs"></i>
                </button>
              )}

              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                
                {isEditable && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setEditingRoomIndex(editingRoomIndex === idx ? null : idx); }} className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-2">
                      <i className="fas fa-images"></i> Görseller
                    </button>
                  </div>
                )}

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800">
                  {isEditable ? <input type="text" value={room.size} onChange={(e) => handleRoomEdit(idx, 'size', e.target.value)} className="w-14 bg-transparent focus:outline-none text-center" onClick={(e) => e.stopPropagation()} /> : room.size}
                </div>
                
                <div className="absolute bottom-3 left-3">
                  {isEditable ? (
                    <select value={room.status} onChange={(e) => handleRoomEdit(idx, 'status', e.target.value)} onClick={(e) => e.stopPropagation()} className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${room.status === 'Müsait' ? 'bg-green-500' : 'bg-red-500'}`}>
                      <option value="Müsait">Müsait</option>
                      <option value="Dolu">Dolu</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${room.status === 'Müsait' ? 'bg-green-500' : 'bg-red-500'}`}>{room.status}</span>
                  )}
                </div>
              </div>

              <div className="p-5">
                {isEditable ? (
                  <>
                    <input type="text" value={room.name} onChange={(e) => handleRoomEdit(idx, 'name', e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full text-lg font-bold text-gray-800 mb-1 bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none" />
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={room.floor} onChange={(e) => handleRoomEdit(idx, 'floor', e.target.value)} onClick={(e) => e.stopPropagation()} className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none" placeholder="Kat" />
                      <input type="text" value={room.view} onChange={(e) => handleRoomEdit(idx, 'view', e.target.value)} onClick={(e) => e.stopPropagation()} className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none" placeholder="Manzara" />
                    </div>
                    <textarea value={room.description} onChange={(e) => handleRoomEdit(idx, 'description', e.target.value)} onClick={(e) => e.stopPropagation()} className="w-full text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:outline-none resize-none mb-2" rows={2} placeholder="Açıklama" />
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{room.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{room.floor} • {room.view}</p>
                  </>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {isEditable ? (
                    <>
                      {room.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1 bg-gray-50 rounded-md">
                          <input type="text" value={f} onChange={(e) => handleFeatureEdit(idx, fIdx, e.target.value)} onClick={(e) => e.stopPropagation()} className="bg-transparent text-gray-600 px-2 py-1 text-xs w-16 focus:outline-none" />
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteFeature(idx, fIdx); }} className="text-red-400 hover:text-red-600 pr-1"><i className="fas fa-times text-[10px]"></i></button>
                        </div>
                      ))}
                      <button onClick={(e) => { e.stopPropagation(); handleAddFeature(idx); }} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs"><i className="fas fa-plus"></i></button>
                    </>
                  ) : (
                    <>
                      {room.features.slice(0, 3).map((f, fIdx) => <span key={fIdx} className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">{f}</span>)}
                      {room.features.length > 3 && <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-md text-xs">+{room.features.length - 3}</span>}
                    </>
                  )}
                </div>

                <button className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-2">
                  <i className="fas fa-search-plus"></i> İncele
                </button>
              </div>

              {isEditable && editingRoomIndex === idx && (
                <div className="border-t border-gray-100 p-4 bg-gray-50" onClick={(e) => e.stopPropagation()}>
                  <h4 className="text-sm font-bold text-gray-800 mb-3">Oda Görselleri</h4>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {room.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="relative aspect-square rounded-lg overflow-hidden group/img">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => handleDeleteRoomImage(idx, imgIdx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <i className="fas fa-times text-[8px]"></i>
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                      <i className="fas fa-plus text-gray-400"></i>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleRoomImageUpload(e, idx)} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <RoomModal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} room={selectedRoom} />

      <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-3">
        {isEditable ? (
          <>
            <button onClick={() => { setIsEditable(false); setEditingRoomIndex(null); }} className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"><i className="fas fa-times text-xl"></i></button>
            <button onClick={handleSave} className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"><i className="fas fa-save text-xl"></i></button>
          </>
        ) : isAdmin ? (
          <button onClick={() => setIsEditable(true)} className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"><i className="fas fa-pen text-xl"></i></button>
        ) : null}
      </div>
    </div>
  );
}
