"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayoutContent({ children }) {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.location.href = '/';
  };

  // Login sayfasında sidebar gösterme
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <div className="text-2xl font-bold mb-8 text-center">Doruk Admin</div>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link href="/admin" className={`block py-2 px-4 rounded hover:bg-gray-800 transition ${pathname === '/admin' ? 'bg-gray-800' : ''}`}>
                <i className="fas fa-home mr-2"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-800 transition">
                <i className="fas fa-globe mr-2"></i> Site Üzerinde Düzenle
              </Link>
            </li>
            <li>
              <Link href="/admin/ayarlar" className={`block py-2 px-4 rounded hover:bg-gray-800 transition ${pathname === '/admin/ayarlar' ? 'bg-gray-800' : ''}`}>
                <i className="fas fa-cog mr-2"></i> Genel Ayarlar
              </Link>
            </li>
            <li>
              <Link href="/admin/seo" className={`block py-2 px-4 rounded hover:bg-gray-800 transition text-blue-300 ${pathname.startsWith('/admin/seo') ? 'bg-gray-800' : ''}`}>
                <i className="fas fa-search mr-2"></i> SEO Kokpiti
              </Link>
            </li>
            <li>
              <Link href="/admin/sss" className={`block py-2 px-4 rounded hover:bg-gray-800 transition text-green-300 ${pathname === '/admin/sss' ? 'bg-gray-800' : ''}`}>
                <i className="fas fa-question-circle mr-2"></i> SSS Yönetimi
              </Link>
            </li>
            <li className="pt-4 border-t border-gray-700 mt-4">
              <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-800 transition text-yellow-400">
                <i className="fas fa-external-link-alt mr-2"></i> Siteye Dön
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="w-full text-left py-2 px-4 rounded hover:bg-red-600 transition text-red-400 hover:text-white"
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Çıkış Yap
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
