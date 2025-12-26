import Link from 'next/link';
import Image from 'next/image';

export default function Gallery({ content, isEditable = false, onEdit }) {
  const defaultImages = [
    { src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=600&fit=crop', title: '2 Kişilik Oda' },
    { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=600&fit=crop', title: 'Yemekhane' },
    { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=600&fit=crop', title: 'Oturma Salonu' },
    { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop', title: 'Etüt Odası' }
  ];

  const defaultContent = {
    title: 'Yurdumuzdan',
    highlight: 'Kareler',
    subtitle: 'Galeri',
    images: defaultImages
  };

  const data = content || defaultContent;

  const renderEditableText = (key, value, className, tag = 'span') => {
    if (!isEditable) {
      return tag === 'h2' ? <h2 className={className}>{value}</h2> : 
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

  const handleImageEdit = (index, field, value) => {
    if (!onEdit) return;
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    onEdit('images', newImages);
  };

  return (
    <section id="galeri" className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <div className="text-primary font-semibold text-sm uppercase tracking-wider">
            {renderEditableText('subtitle', data.subtitle, '', 'span')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 flex justify-center gap-2">
            {renderEditableText('title', data.title, '', 'span')}
            <span className="gradient-text">
              {renderEditableText('highlight', data.highlight, 'gradient-text', 'span')}
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
          {data.images.map((img, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer aspect-square">
              <Image 
                src={img.src} 
                alt={img.title} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {isEditable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white">
                    <i className="fas fa-camera text-2xl mb-2"></i>
                    <span className="text-xs font-semibold">Fotoğrafı Değiştir</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e, idx)}
                    />
                  </label>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <h3 className="text-white font-bold text-sm md:text-base">
                  {isEditable ? (
                    <input
                      type="text"
                      value={img.title}
                      onChange={(e) => handleImageEdit(idx, 'title', e.target.value)}
                      className="w-full border-2 border-dashed border-white/70 bg-black/20 rounded px-2 focus:border-white focus:outline-none text-white placeholder-white/70"
                    />
                  ) : img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/galeri" className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 group">
            <i className="fas fa-camera mr-2"></i> Tüm Fotoğrafları Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
