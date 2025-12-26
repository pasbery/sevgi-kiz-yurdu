"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminAuthGuard({ children }) {
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Login sayfasında kontrol yapma
    if (pathname === '/admin/login') {
      setAuthState('authenticated'); // Login sayfasını göster
      return;
    }

    const checkAuth = async () => {
      const token = localStorage.getItem('adminAuth');
      
      if (!token) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const result = await response.json();
        setAuthState(result.valid ? 'authenticated' : 'unauthenticated');
      } catch {
        setAuthState('unauthenticated');
      }
    };

    checkAuth();
  }, [pathname]);

  // Yükleniyor
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Giriş yapılmamış ve login sayfasında değil
  if (authState === 'unauthenticated' && pathname !== '/admin/login') {
    // Client-side redirect
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return null;
  }

  return children;
}
