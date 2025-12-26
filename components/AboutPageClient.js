"use client";
import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';
import Link from 'next/link';

export default function AboutPageClient() {
  const { isEditable, setIsEditable, isAdmin } = useSite();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  // Load about page data from database on mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/pages?id=about');
        const result = await response.json();
        if (result.success && result.data?.content) {
          setData(result.data.content);
        }
      } catch (error) {
        console.error('Error fetching about page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  const handleEdit = (section, key, value, index = null) => {
    setData(prev => {
      if (section === 'stats' || (section === 'values' && key === 'items')) {
        const newArray = [...prev[section]];
        if (section === 'values') {
           const newItems = [...prev.values.items];
           newItems[index] = { ...newItems[index], ...value }; // value object like { title: '...' }
           return { ...prev, values: { ...prev.values, items: newItems } };
        }
        newArray[index] = { ...newArray[index], [key]: value };
        return { ...prev, [section]: newArray };
      } else if (section === 'header' || section === 'main') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [key]: value
          }
        };
      } else if (section === 'values') { // values title
         return {
             ...prev,
             values: {
                 ...prev.values,
                 [key]: value
             }
         }
      }
      return prev;
    });
  };

  const handleStatsEdit = (index, field, value) => {
      const newStats = [...data.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      setData(prev => ({ ...prev, stats: newStats }));
  };

  const handleValueItemEdit = (index, field, value) => {
      const newItems = [...data.values.items];
      newItems[index] = { ...newItems[index], [field]: value };
      setData(prev => ({ ...prev, values: { ...prev.values, items: newItems } }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && isEditable) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({
          ...prev,
          main: {
            ...prev.main,
            image: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'about', content: data })
      });
      const result = await response.json();
      if (result.success) {
        alert('Hakkımızda sayfası veritabanına kaydedildi!');
      } else {
        alert('Kaydetme başarısız oldu.');
      }
    } catch (error) {
      console.error('Error saving about page:', error);
      alert('Bir hata oluştu.');
    }
    setIsEditable(false);
  };

  const renderEditableText = (section, key, value, className, tag = 'span') => {
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
          onChange={(e) => handleEdit(section, key, e.target.value)}
          className={`${className} bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded p-2 w-full focus:border-primary focus:outline-none transition-all`}
          rows={4}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleEdit(section, key, e.target.value)}
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
    <div className="pt-28 sm:pt-32 pb-16 bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 py-16 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {renderEditableText('header', 'title', data.header.title, 'text-4xl md:text-5xl font-bold text-white mb-4', 'h1')}
          <div className="text-white/90 text-lg max-w-2xl mx-auto">
             {isEditable ? (
                <textarea
                    value={data.header.description}
                    onChange={(e) => handleEdit('header', 'description', e.target.value)}
                    className="w-full bg-white/10 border-2 border-dashed border-white/50 rounded p-2 text-white placeholder-white/70 focus:outline-none focus:border-white text-center"
                    rows={2}
                />
             ) : (
                <p>{data.header.description}</p>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="relative group">
                <img 
                src={data.main.image} 
                alt="Güneş Kız Öğrenci Yurdu" 
                className="rounded-2xl shadow-xl w-full"
                />
                {isEditable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer z-20">
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white">
                    <i className="fas fa-camera text-3xl mb-2"></i>
                    <span className="text-sm font-semibold">Fotoğrafı Değiştir</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                    />
                    </label>
                </div>
                )}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex flex-wrap gap-2">
              {renderEditableText('main', 'title', data.main.title, '', 'span')}
              <span className="gradient-text">
                {renderEditableText('main', 'highlight', data.main.highlight, 'gradient-text', 'span')}
              </span>
            </h2>
            <div className="text-gray-700 leading-relaxed mb-4">
                {renderEditableText('main', 'description1', data.main.description1, '', 'textarea')}
            </div>
            <div className="text-gray-700 leading-relaxed mb-4">
                {renderEditableText('main', 'description2', data.main.description2, '', 'textarea')}
            </div>
            <div className="text-gray-700 leading-relaxed">
                {renderEditableText('main', 'description3', data.main.description3, '', 'textarea')}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg mb-16">
          <div className="text-center mb-8">
             {renderEditableText('values', 'title', data.values.title, 'text-3xl font-bold text-gray-800', 'h2')}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.values.items.map((value, idx) => (
              <div key={idx} className="text-center">
                <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden group/icon">
                  {value.image ? (
                    <img 
                      src={value.image} 
                      alt="icon" 
                      className="object-contain"
                      style={{ width: `${value.size || 24}px`, height: `${value.size || 24}px` }}
                    />
                  ) : (
                    <i 
                      className={`fas ${value.icon} text-primary`}
                      style={{ fontSize: `${value.size || 24}px` }}
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
                          onChange={(e) => handleValueImageUpload(e, idx)}
                        />
                      </label>
                      <input 
                        type="range" 
                        min="12" 
                        max="48" 
                        value={value.size || 24}
                        onChange={(e) => handleValueItemEdit(idx, 'size', e.target.value)}
                        className="w-10 h-1 mt-1 accent-primary cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {isEditable ? (
                        <input
                            type="text"
                            value={value.title}
                            onChange={(e) => handleValueItemEdit(idx, 'title', e.target.value)}
                            className="w-full bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center"
                        />
                    ) : value.title}
                </h3>
                <div className="text-gray-600">
                    {isEditable ? (
                        <textarea
                            value={value.desc}
                            onChange={(e) => handleValueItemEdit(idx, 'desc', e.target.value)}
                            className="w-full bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded p-2 focus:border-primary focus:outline-none text-center"
                            rows={3}
                        />
                    ) : (
                        <p>{value.desc}</p>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {isEditable ? (
                    <input
                        type="text"
                        value={stat.number}
                        onChange={(e) => handleStatsEdit(idx, 'number', e.target.value)}
                        className="w-full bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center"
                    />
                  ) : stat.number}
              </div>
              <div className="text-gray-600 text-sm">
                  {isEditable ? (
                    <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatsEdit(idx, 'label', e.target.value)}
                        className="w-full bg-transparent border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none text-center"
                    />
                  ) : stat.label}
              </div>
            </div>
          ))}
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
