"use client";
import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSite } from '@/context/SiteContext';

export default function SeoEditPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { siteData } = useSite();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = params.id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    pageRoute: '',
    title: '',
    description: '',
    keywords: '',
    noIndex: false
  });

  useEffect(() => {
    if (isNew) {
      // Yeni kayıt için URL'den route parametresini al
      const routeParam = searchParams.get('route');
      if (routeParam) {
        setFormData(prev => ({ ...prev, pageRoute: routeParam }));
      }
    } else {
      const fetchData = async () => {
        try {
          const res = await fetch(`/api/seo?id=${params.id}`);
          const json = await res.json();
          if (json.success && json.data) {
            setFormData({
              pageRoute: json.data.pageRoute,
              title: json.data.title || '',
              description: json.data.description || '',
              keywords: json.data.keywords || '',
              noIndex: json.data.noIndex || false
            });
          }
        } catch (error) {
          console.error('Error fetching SEO data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isNew, params.id, searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/admin/seo');
        router.refresh();
      } else {
        alert('Kaydetme hatası!');
      }
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Google Preview Component
  const GooglePreview = () => {
    const siteDomain = siteData?.brand?.domain || 'dorukkizyurdu.com';
    const siteUrl = siteData?.brand?.siteUrl || 'https://www.dorukkizyurdu.com';
    
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wide">Google Önizlemesi</h3>
        <div className="max-w-[600px] font-sans">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center p-1">
              <i className="fas fa-sun text-primary text-xs"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-[#202124]">{siteDomain}</span>
              <span className="text-xs text-[#5f6368] -mt-0.5">{`${siteUrl}${formData.pageRoute}`}</span>
            </div>
            <i className="fas fa-ellipsis-v text-xs text-[#5f6368] ml-auto"></i>
          </div>
          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate font-normal">
            {formData.title || "Sayfa Başlığı Buraya Gelecek"}
          </h3>
          <p className="text-sm text-[#4d5156] mt-1 leading-normal line-clamp-2">
            {formData.description || "Sayfa açıklaması buraya gelecek. Bu alan kullanıcıların arama sonuçlarında gördüğü gri metindir ve tıklama oranını doğrudan etkiler."}
          </p>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800">
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isNew ? 'Yeni Sayfa SEO Ayarı' : 'SEO Düzenle'}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa Yolu (Route)</label>
              <input
                type="text"
                name="pageRoute"
                value={formData.pageRoute}
                onChange={handleChange}
                placeholder="/hakkimizda"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ana sayfa için "/" kullanın.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık (Title)
                <span className={`ml-2 text-xs ${formData.title.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.title.length}/60
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                Google'da görünen mavi başlık. En önemli anahtar kelimenizi (örn: Uşak Kız Yurdu) en başa yazın.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama (Description)
                <span className={`ml-2 text-xs ${formData.description.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.description.length}/160
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                Başlığın altında çıkan gri metin. Kullanıcıyı tıklamaya ikna edecek, ilgi çekici bir özet yazın.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</label>
              <textarea
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                rows={2}
                placeholder="virgül, ile, ayırın"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                İçeriğinizi tanımlayan kelimeleri virgülle ayırarak yazın. Örn: uşak yurt, kız öğrenci yurdu, güvenli yurt
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="noIndex"
                name="noIndex"
                checked={formData.noIndex}
                onChange={handleChange}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="noIndex" className="text-sm text-gray-700">
                Bu sayfayı Google indekslemesin (noindex)
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview & Tips */}
        <div className="space-y-6">
          <GooglePreview />
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <i className="fas fa-lightbulb"></i> SEO İpuçları
            </h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Başlıkta anahtar kelimenizi en başa yakın kullanın.</li>
              <li>• Açıklama kısmında kullanıcıyı tıklamaya teşvik edecek bir dil kullanın.</li>
              <li>• Her sayfa için benzersiz başlık ve açıklama girin.</li>
              <li>• Başlık 60, açıklama 160 karakteri geçmemelidir (Google kesebilir).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}