"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Zaten giriş yapmışsa /admin'e yönlendir
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('adminAuth');
      if (token) {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          });
          const result = await response.json();
          if (result.valid) {
            window.location.href = '/admin';
            return;
          }
        } catch {}
      }
      setCheckingAuth(false);
    };
    checkExistingAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('adminAuth', result.token);
        window.location.href = '/admin';
      } else {
        setError(result.message || 'Yanlış şifre!');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Auth kontrolü yapılırken loading göster
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Girişi</h1>
          <p className="text-gray-400 text-sm mt-2">Yönetim paneline erişmek için şifrenizi girin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-400 hover:text-white text-sm transition">
            <i className="fas fa-arrow-left mr-2"></i>Siteye Dön
          </a>
        </div>
      </div>
    </div>
  );
}
