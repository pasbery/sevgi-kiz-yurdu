export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Kontrol Paneli</h1>
        <p className="text-gray-600">Yurt yönetim paneline hoş geldiniz.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Toplam Oda', value: '12', icon: 'fa-bed', color: 'bg-blue-500' },
          { label: 'Aktif Öğrenci', value: '45', icon: 'fa-users', color: 'bg-green-500' },
          { label: 'Doluluk Oranı', value: '%85', icon: 'fa-chart-pie', color: 'bg-purple-500' },
          { label: 'Okunmamış Mesaj', value: '3', icon: 'fa-envelope', color: 'bg-red-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-gray-200`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/20 transition text-left group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <i className="fas fa-plus text-primary"></i>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Yeni Oda Ekle</span>
            </button>
            <button className="p-4 rounded-lg bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/20 transition text-left group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <i className="fas fa-image text-primary"></i>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Galeriye Fotoğraf Ekle</span>
            </button>
            <a href="/admin/ayarlar" className="p-4 rounded-lg bg-gray-50 hover:bg-primary/5 border border-gray-200 hover:border-primary/20 transition text-left group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <i className="fas fa-cog text-primary"></i>
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-primary">Site Ayarları (SEO)</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Son Mesajlar</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition border-b last:border-0 border-gray-50">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <i className="fas fa-user"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">Ayşe Yılmaz</h4>
                  <p className="text-xs text-gray-500 truncate">Fiyatlarınız hakkında bilgi almak istiyorum...</p>
                </div>
                <span className="text-xs text-gray-400">2s önce</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
