import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sayfa Bulunamadı</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-dark transition-all shadow-lg hover:shadow-primary/30"
        >
          <i className="fas fa-home mr-2"></i> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
