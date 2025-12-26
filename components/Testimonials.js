"use client";
import { useEffect, useRef } from 'react';
import { useSite } from '@/context/SiteContext';

export default function Testimonials({ content, isEditable = false, onEdit }) {
  const { siteData } = useSite();
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let isPaused = false;
    let isDown = false;
    const scrollSpeed = 1;
    const scrollDelay = 30;

    const autoScrollInterval = setInterval(() => {
      if (!isPaused && !isDown && carousel) {
        carousel.scrollLeft += scrollSpeed;
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
          carousel.scrollLeft = 0;
        }
      }
    }, scrollDelay);

    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; isDown = false; };

    carousel.addEventListener('mouseenter', handleMouseEnter);
    carousel.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(autoScrollInterval);
      carousel?.removeEventListener('mouseenter', handleMouseEnter);
      carousel?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const defaultTestimonials = [
    { name: 'Elif Kaya', initial: 'EK', color: 'from-purple-500 to-pink-500', text: '3 yıldır bu yurtta kalıyorum. Hem güvenlik hem de temizlik konusunda çok memnunum. Personel her zaman ilgili.', time: '2 ay önce' },
    { name: 'Ayşe Yılmaz', initial: 'AY', color: 'from-blue-500 to-cyan-500', text: 'Ailemden uzakta olduğum için endişeliydim ama burada kendimi evimde gibi hissediyorum. Yemekler çok lezzetli.', time: '1 ay önce' },
    { name: 'Zeynep Demir', initial: 'ZD', color: 'from-green-500 to-emerald-500', text: 'Üniversiteye servis hizmeti hayat kurtarıcı. Odalar temiz ve konforlu. İnternet hızı da çok iyi.', time: '3 hafta önce' },
    { name: 'Selin Aksoy', initial: 'SA', color: 'from-amber-500 to-orange-500', text: 'Yurdun konumu çok merkezi, her yere kolayca ulaşabiliyorum. Yönetim ve personel çok ilgili.', time: '1 hafta önce' }
  ];

  const defaultContent = {
    title: 'Öğrencilerimiz',
    highlight: 'Ne Diyor?',
    subtitle: 'Yorumlar',
    items: defaultTestimonials
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

  const handleItemEdit = (index, field, value) => {
    if (!onEdit) return;
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onEdit('items', newItems);
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-16">
          <div className="text-primary font-semibold text-sm uppercase tracking-wider">
            {renderEditableText('subtitle', data.subtitle, '', 'span')}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mt-3 flex flex-wrap justify-center gap-1 md:gap-2">
            {renderEditableText('title', data.title, '', 'span')}
            <span className="gradient-text">
              {renderEditableText('highlight', data.highlight, 'gradient-text', 'span')}
            </span>
          </h2>
          <a href="#" className="inline-flex items-center gap-2 mt-4 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:shadow-md transition group">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="font-bold text-gray-800">{siteData?.stats?.rating || '4.9'}</span>
            <div className="flex gap-0.5 text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => <i key={i} className="fas fa-star"></i>)}
            </div>
            <span className="text-gray-500 text-sm">({siteData?.stats?.reviewCount || '50+'})</span>
            <i className="fas fa-external-link-alt text-gray-400 text-xs group-hover:text-primary transition ml-1"></i>
          </a>
        </div>
        <div ref={carouselRef} className="testimonials-carousel relative overflow-hidden -mx-4 px-4">
          <div className="flex gap-4 md:gap-6">
            {data.items.map((testimonial, idx) => (
              <div key={idx} className="flex-shrink-0 w-72 sm:w-80 bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star text-sm ${i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-200'}`}></i>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">Google</span>
                </div>
                <div className="text-gray-700 mb-4 text-sm italic h-24 overflow-hidden">
                  {isEditable ? (
                    <textarea
                      value={testimonial.text}
                      onChange={(e) => handleItemEdit(idx, 'text', e.target.value)}
                      className="w-full h-full border-2 border-dashed border-primary/50 bg-primary/5 rounded p-1 resize-none focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <p className="line-clamp-4">&quot;{testimonial.text}&quot;</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.initial}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {isEditable ? (
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => handleItemEdit(idx, 'name', e.target.value)}
                          className="w-full border-2 border-dashed border-primary/50 bg-primary/5 rounded px-1 focus:border-primary focus:outline-none"
                        />
                      ) : testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isEditable ? (
                        <input
                          type="text"
                          value={testimonial.time}
                          onChange={(e) => handleItemEdit(idx, 'time', e.target.value)}
                          className="w-full border-2 border-dashed border-primary/50 bg-primary/5 rounded px-1 focus:border-primary focus:outline-none"
                        />
                      ) : testimonial.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
