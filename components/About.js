"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useSite } from '@/context/SiteContext';

export default function About({ content, isEditable = false, onEdit }) {
  const { siteData } = useSite();
  const defaultContent = {
    title: 'Öğrencilerimizin',
    highlight: 'İkinci Evi',
    description: '2009 yılından bu yana, üniversite öğrencilerine güvenli, konforlu ve aile sıcaklığında bir yaşam alanı sunuyoruz. Modern tesislerimiz ve deneyimli kadromuzla, başarınıza odaklanmanız için buradayız.',
    experience: siteData?.stats?.experience || '15+',
    experienceLabel: siteData?.stats?.experienceLabel || 'Yıllık Deneyim',
    features: ['Merkezi Konum', 'Modern Odalar', '3 Öğün Yemek', 'Etüt Odaları'],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop'
  };

  const data = content || defaultContent;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && onEdit) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onEdit('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditableText = (key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h2' ? <h2 className={className}>{value}</h2> : 
             tag === 'p' ? <p className={className}>{value}</p> :
             <span className={className}>{value}</span>;
    }

    if (tag === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => onEdit(key, e.target.value)}
          className={`${className} border-2 border-dashed border-primary/50 bg-primary/5 rounded p-2 w-full focus:border-primary focus:outline-none transition-all`}
          rows={4}
        />
      );
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
    <section id="hakkimizda" className="py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="relative hidden lg:block group">
            <Image 
                 src={data.image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop"} 
                 alt="Yurt Hakkında" 
                 width={600}
                 height={500}
                 className="rounded-3xl shadow-xl w-full object-cover"
               />
            
            {isEditable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer z-20">
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

            <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-primary to-secondary p-6 rounded-2xl text-white shadow-xl z-50">
              <div className="text-4xl font-bold">
                {renderEditableText('experience', data.experience, '', 'span')}
              </div>
              <div className="text-sm opacity-90">
                {renderEditableText('experienceLabel', data.experienceLabel, '', 'span')}
              </div>
            </div>
          </div>
          <div>
            {renderEditableText('sectionTitle', data.sectionTitle, 'text-primary font-semibold text-sm uppercase tracking-wider', 'span')}
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 mt-2 lg:mt-3 mb-4 lg:mb-6 flex flex-wrap gap-2">
              {renderEditableText('title', data.title, '', 'span')} 
              <span className="gradient-text">
                {renderEditableText('highlight', data.highlight, 'gradient-text', 'span')}
              </span>
            </h2>
            
            <div className="text-gray-700 leading-relaxed mb-6 text-sm lg:text-base">
              {renderEditableText('description', data.description, '', 'textarea')}
            </div>
            
            <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-8">
              {data.features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-50 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-primary text-sm lg:text-xl"></i>
                  </div>
                  {isEditable ? (
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newFeatures = [...data.features];
                        newFeatures[idx] = e.target.value;
                        onEdit('features', newFeatures);
                      }}
                      className="font-medium text-gray-700 text-xs lg:text-base border-2 border-dashed border-primary/50 bg-primary/5 rounded px-2 focus:border-primary focus:outline-none w-full"
                    />
                  ) : (
                    <span className="font-medium text-gray-700 text-xs lg:text-base">{item}</span>
                  )}
                </div>
              ))}
            </div>

            <Link href="/hakkimizda" className="inline-flex items-center text-primary font-semibold hover:text-dark transition group">
              Devamını Oku <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
