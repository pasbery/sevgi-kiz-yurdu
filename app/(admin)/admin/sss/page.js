"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSSS() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'genel',
    published: true
  });

  const categories = [
    { value: 'genel', label: 'Genel' },
    { value: 'fiyat', label: 'Fiyatlar' },
    { value: 'kayit', label: 'Kayıt' },
    { value: 'yurt-hayati', label: 'Yurt Hayatı' }
  ];

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faq?published=false');
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingFaq?.id,
          order: editingFaq?.order || faqs.length
        })
      });

      if (res.ok) {
        setFormData({ question: '', answer: '', category: 'genel', published: true });
        setEditingFaq(null);
        fetchFaqs();
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      published: faq.published
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu soruyu silmek istediğinize emin misiniz?')) return;
    
    try {
      await fetch(`/api/faq?id=${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleCancel = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'genel', published: true });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SSS Yönetimi</h1>
          <p className="text-gray-600">Sıkça sorulan soruları yönetin</p>
        </div>
        <Link 
          href="/sss" 
          target="_blank"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <i className="fas fa-external-link-alt"></i>
          Sayfayı Gör
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Soru</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                placeholder="Uşak yurt fiyatları ne kadar?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cevap</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
                rows={4}
                placeholder="Detaylı cevap yazın..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm text-gray-700">Yayında</label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg font-semibold transition"
              >
                {editingFaq ? 'Güncelle' : 'Ekle'}
              </button>
              {editingFaq && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Mevcut Sorular ({faqs.length})
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i> Yükleniyor...
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Henüz soru eklenmemiş.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`border rounded-lg p-4 ${
                    faq.published ? 'border-gray-200' : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{faq.question}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                          {categories.find(c => c.value === faq.category)?.label || faq.category}
                        </span>
                        {!faq.published && (
                          <span className="text-xs px-2 py-0.5 bg-orange-100 rounded-full text-orange-600">
                            Taslak
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-2 text-gray-400 hover:text-primary transition"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Info */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i> SEO Bilgisi
        </h3>
        <p className="text-sm text-blue-700">
          SSS sayfası otomatik olarak <strong>FAQPage Schema</strong> oluşturur. 
          Bu sayede Google'da "Uşak yurt fiyatları" gibi aramalarda sorularınız direkt arama sonuçlarında görünebilir.
        </p>
      </div>
    </div>
  );
}
