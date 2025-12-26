"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const RoomsContext = createContext();

// Default room types (fallback)
const defaultRoomTypes = [
  { key: '1-kisilik', label: '1 Kişilik', color: 'bg-amber-500', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop', price: '₺9.000', description: 'Maksimum konfor ve özel alan.' },
  { key: '2-kisilik', label: '2 Kişilik', color: 'bg-purple-500', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop', price: '₺6.500', description: 'Arkadaşınızla birlikte ideal.' },
  { key: '3-kisilik', label: '3 Kişilik', color: 'bg-green-500', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&h=300&fit=crop', price: '₺5.500', description: 'Ekonomik ve sosyal seçenek.' },
  { key: '4-kisilik', label: '4 Kişilik', color: 'bg-blue-500', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop', price: '₺4.500', description: 'Geniş ve ferah ortam.' }
];

export function RoomsProvider({ children }) {
  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);
  const [roomsDetail, setRoomsDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch rooms data from API on mount
  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const response = await fetch('/api/rooms');
        const result = await response.json();
        if (result.success && result.data) {
          // Transform API data to match frontend structure
          const transformedTypes = result.data.roomTypes.map(rt => ({
            key: rt.slug,
            label: rt.label,
            price: rt.price,
            description: rt.description,
            color: rt.color,
            img: rt.image
          }));
          setRoomTypes(transformedTypes);
          setRoomsDetail(result.data.roomsDetail || {});
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomsData();
  }, []);

  // Save rooms data to database
  const saveRoomsData = async () => {
    setIsSaving(true);
    try {
      // Transform frontend data to API format
      const apiRoomTypes = roomTypes.map(rt => ({
        slug: rt.key,
        label: rt.label,
        price: rt.price,
        description: rt.description,
        color: rt.color,
        image: rt.img
      }));

      const response = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomTypes: apiRoomTypes,
          roomsDetail
        })
      });
      const result = await response.json();
      if (result.success) {
        return { success: true, message: 'Oda bilgileri kaydedildi!' };
      } else {
        return { success: false, message: 'Kaydetme başarısız oldu.' };
      }
    } catch (error) {
      console.error('Error saving rooms:', error);
      return { success: false, message: 'Bir hata oluştu.' };
    } finally {
      setIsSaving(false);
    }
  };

  const updateRoomType = (index, field, value) => {
    const newTypes = [...roomTypes];
    const oldKey = newTypes[index].key;
    newTypes[index] = { ...newTypes[index], [field]: value };
    setRoomTypes(newTypes);

    // Sync with roomsDetail if label changes
    if (field === 'label' && roomsDetail[oldKey]) {
      const newDetail = { ...roomsDetail };
      newDetail[oldKey] = {
        ...newDetail[oldKey],
        title: `${value} Odalar`,
        subtitle: `${value} odalarımızı inceleyin`
      };
      setRoomsDetail(newDetail);
    }

    // Sync price
    if (field === 'price' && roomsDetail[oldKey]) {
      const newDetail = { ...roomsDetail };
      newDetail[oldKey] = {
        ...newDetail[oldKey],
        price: `${value}/ay`
      };
      setRoomsDetail(newDetail);
    }
  };

  const addRoomType = (newType) => {
    setRoomTypes(prev => [...prev, newType]);
    // Create empty room detail entry
    setRoomsDetail(prev => ({
      ...prev,
      [newType.key]: {
        title: `${newType.label} Odalar`,
        subtitle: `${newType.label} odalarımızı inceleyin`,
        price: `${newType.price}/ay`,
        rooms: []
      }
    }));
  };

  const deleteRoomType = (index) => {
    const keyToDelete = roomTypes[index].key;
    setRoomTypes(prev => prev.filter((_, i) => i !== index));
    setRoomsDetail(prev => {
      const newDetail = { ...prev };
      delete newDetail[keyToDelete];
      return newDetail;
    });
  };

  const updateRoomDetail = (slug, data) => {
    setRoomsDetail(prev => ({
      ...prev,
      [slug]: data
    }));
  };

  const getRoomTypeBySlug = (slug) => {
    return roomTypes.find(rt => rt.key === slug);
  };

  const getRoomDetailBySlug = (slug) => {
    const roomType = getRoomTypeBySlug(slug);
    const detail = roomsDetail[slug];
    
    if (!detail) return null;
    
    // Merge roomType info into detail
    return {
      ...detail,
      title: roomType ? `${roomType.label} Odalar` : detail.title,
      subtitle: roomType ? `${roomType.label} odalarımızı inceleyin` : detail.subtitle,
      price: roomType ? `${roomType.price}/ay` : detail.price
    };
  };

  return (
    <RoomsContext.Provider value={{
      roomTypes,
      setRoomTypes,
      roomsDetail,
      isLoading,
      isSaving,
      updateRoomType,
      addRoomType,
      deleteRoomType,
      updateRoomDetail,
      getRoomTypeBySlug,
      getRoomDetailBySlug,
      saveRoomsData
    }}>
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
}
