"use client";
import { useState } from 'react';

export default function FAQClient({ initialFaqs = [] }) {
  const [faqs] = useState(initialFaqs);
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'genel', label: 'Genel' },
    { value: 'fiyat', label: 'Fiyatlar' },
    { value: 'kayit', label: 'Kayıt' },
    { value: 'yurt-hayati', label: 'Yurt Hayatı' }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-16 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 py-16 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Uşak kız yurdu hakkında merak ettiklerinizin cevapları burada
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fas fa-question-circle text-4xl mb-4 opacity-50"></i>
              <p>Bu kategoride henüz soru bulunmuyor.</p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">
                    {faq.question}
                  </span>
                  <i className={`fas fa-chevron-down text-primary transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}></i>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Sorunuzun cevabını bulamadınız mı?</h2>
          <p className="text-white/90 mb-6">Bize doğrudan ulaşın, size yardımcı olalım.</p>
          <a
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <i className="fas fa-phone"></i>
            İletişime Geç
          </a>
        </div>
      </div>
    </div>
  );
}
