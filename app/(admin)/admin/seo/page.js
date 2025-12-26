"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Sitedeki tüm sayfaların listesi
const ALL_SITE_PAGES = [
  { route: '/', name: 'Ana Sayfa' },
  { route: '/hakkimizda', name: 'Hakkımızda' },
  { route: '/odalar', name: 'Odalar' },
  { route: '/odalar/1-kisilik', name: '1 Kişilik Oda' },
  { route: '/odalar/2-kisilik', name: '2 Kişilik Oda' },
  { route: '/odalar/3-kisilik', name: '3 Kişilik Oda' },
  { route: '/odalar/4-kisilik', name: '4 Kişilik Oda' },
  { route: '/ozellikler', name: 'Özellikler' },
  { route: '/galeri', name: 'Galeri' },
  { route: '/iletisim', name: 'İletişim' },
  { route: '/sss', name: 'Sıkça Sorulan Sorular' },
];

export default function SeoCockpit() {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      const res = await fetch('/api/seo');
      const data = await res.json();
      if (data.success) {
        setSeoData(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tüm sayfaları SEO verileriyle birleştir
  const mergedPages = ALL_SITE_PAGES.map(page => {
    const seo = seoData.find(s => s.pageRoute === page.route);
    return {
      ...page,
      id: seo?.id || null,
      title: seo?.title || null,
      description: seo?.description || null,
      keywords: seo?.keywords || null,
      noIndex: seo?.noIndex || false,
      hasCustomSeo: !!seo
    };
  });

  const handleDelete = async (id, pageRoute) => {
    if (!confirm(`"${pageRoute}" sayfasının SEO ayarlarını silmek istediğinize emin misiniz?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/seo?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSeoData(seoData.filter(p => p.id !== id));
      } else {
        alert('Silme işlemi başarısız!');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const getScore = (page) => {
    let score = 0;
    if (page.title) score += 40;
    if (page.description) score += 40;
    if (page.keywords) score += 20;
    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500 bg-green-50';
    if (score >= 50) return 'text-yellow-500 bg-yellow-50';
    return 'text-red-500 bg-red-50';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">SEO Kokpiti</h1>
          <p className="text-gray-600">Sitenizin arama motoru görünürlüğünü yönetin.</p>
        </div>
        <Link 
          href="/admin/seo/new" 
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <i className="fas fa-plus"></i>
          Yeni Sayfa Ekle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Sayfa Yolu</th>
                <th className="p-4 font-semibold text-gray-600">Başlık (Title)</th>
                <th className="p-4 font-semibold text-gray-600">Durum</th>
                <th className="p-4 font-semibold text-gray-600 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Yükleniyor...
                  </td>
                </tr>
              ) : (
                mergedPages.map((page) => (
                  <tr key={page.route} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm text-blue-600">{page.route}</span>
                        <span className="text-xs text-gray-400">{page.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-800 max-w-xs truncate">
                      {page.title || <span className="text-gray-400 italic">Otomatik</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getScoreColor(getScore(page))}`}>
                          {getScore(page)}%
                        </span>
                        {page.hasCustomSeo ? (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Özel</span>
                        ) : (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Varsayılan</span>
                        )}
                        {page.noIndex && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">noindex</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={page.id ? `/admin/seo/${page.id}` : `/admin/seo/new?route=${encodeURIComponent(page.route)}`}
                        className="text-gray-400 hover:text-primary transition px-2"
                        title={page.hasCustomSeo ? "Düzenle" : "SEO Ekle"}
                      >
                        <i className={`fas ${page.hasCustomSeo ? 'fa-edit' : 'fa-plus'}`}></i>
                      </Link>
                      {page.hasCustomSeo && (
                        <button
                          onClick={() => handleDelete(page.id, page.route)}
                          disabled={deleting === page.id}
                          className="text-gray-400 hover:text-red-500 transition px-2 disabled:opacity-50"
                          title="Sil"
                        >
                          {deleting === page.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}