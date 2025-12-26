"use client";
import { useSite } from '@/context/SiteContext';

export default function CTA({ content, isEditable = false, onEdit }) {
  const { siteData } = useSite();
  
  const defaultContent = {
    title: 'Yerinizi Ayırtın!',
    description: siteData?.registration?.description || '2024-2025 akademik yılı için kayıtlarımız devam ediyor. Sınırlı kontenjanımız dolmadan yerinizi garantiye alın.',
    phoneButton: `Hemen Ara: ${siteData?.contact?.phone || '0312 123 45 67'}`,
    whatsappButton: 'WhatsApp'
  };

  const data = content || defaultContent;

  const renderEditableText = (key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h2' ? <h2 className={className} style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>{value}</h2> : 
             tag === 'p' ? <p className={className} style={{textShadow: '1px 1px 3px rgba(0,0,0,0.3)'}}>{value}</p> :
             <span className={className}>{value}</span>;
    }

    if (tag === 'textarea') {
       return (
        <textarea
          value={value}
          onChange={(e) => onEdit(key, e.target.value)}
          className={`${className} border-2 border-dashed border-white/50 bg-black/20 rounded p-2 w-full text-center focus:border-white focus:outline-none transition-all`}
          rows={3}
          style={{textShadow: '1px 1px 3px rgba(0,0,0,0.3)'}}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onEdit(key, e.target.value)}
        className={`${className} border-2 border-dashed border-white/50 bg-black/20 rounded px-2 focus:border-white focus:outline-none transition-all min-w-[50px] text-center`}
        style={tag === 'h2' ? {textShadow: '2px 2px 4px rgba(0,0,0,0.3)'} : {}}
      />
    );
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {renderEditableText('title', data.title, 'text-4xl font-bold text-white mb-6', 'h2')}
        
        {renderEditableText('description', data.description, 'text-white text-lg mb-10 max-w-2xl mx-auto', 'textarea')}

        {/* İletişim Kartları */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <a href={`tel:${siteData?.contact?.phoneRaw || '03121234567'}`} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <i className="fas fa-phone text-white text-lg"></i>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-xs">Bizi Arayın</p>
              <p className="text-white font-semibold">{siteData?.contact?.phone || '0312 123 45 67'}</p>
            </div>
          </a>
          
          <a href={`https://wa.me/${siteData?.contact?.whatsapp || '905551234567'}`} target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <i className="fab fa-whatsapp text-white text-xl"></i>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-xs">WhatsApp</p>
              <p className="text-white font-semibold">Mesaj Gönderin</p>
            </div>
          </a>
          
          <a href="/iletisim" className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4 hover:bg-white/20 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <i className="fas fa-map-marker-alt text-white text-lg"></i>
            </div>
            <div className="text-left">
              <p className="text-white/70 text-xs">Adresimiz</p>
              <p className="text-white font-semibold">Yol Tarifi Al</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
