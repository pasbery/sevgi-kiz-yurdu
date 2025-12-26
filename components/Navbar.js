"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSite } from '@/context/SiteContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { siteData } = useSite();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'Odalar', href: '/odalar' },
    { name: 'Özellikler', href: '/ozellikler' },
    { name: 'Galeri', href: '/galeri' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'p-0' : 'p-2 xs:p-2.5 sm:p-3 md:p-4'}`}>
      <nav className={`mx-auto bg-white md:bg-white/95 backdrop-blur-xl border border-white/50 transition-all duration-500 ease-out 
        ${isScrolled ? 'max-w-full rounded-none shadow-md' : 'max-w-6xl rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg shadow-black/5'}`}>
        
        <div className={`transition-all duration-500 ease-out ${isScrolled ? 'px-4 py-2' : 'px-3 xs:px-4 sm:px-5 md:px-6 py-2.5 xs:py-3 sm:py-3.5 md:py-4'}`}>
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <i className="fas fa-sun text-white text-sm sm:text-base"></i>
              </div>
              <div className="relative h-6 sm:h-7 overflow-hidden group">
                <span className="text-base sm:text-lg font-bold text-gray-800 block group-hover:-translate-y-full transition-transform duration-300">{siteData?.brand?.name}</span>
                <span className="text-base sm:text-lg font-bold text-primary absolute top-full left-0 group-hover:top-0 transition-all duration-300">{siteData?.brand?.name}</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center bg-gray-100/80 rounded-full p-1.5 gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="nav-link group relative px-5 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-white transition-all duration-300 overflow-hidden">
                  <span className="relative z-10">{link.name}</span>
                  <span className="absolute inset-0 bg-primary scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full origin-center"></span>
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Scroll Badge - Only visible when scrolled */}
              <Link href="/#iletisim" className={`hidden md:flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r from-primary to-pink-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 hover:shadow-lg animate-badge ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-90 hidden'}`}>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                <span className="text-[9px] sm:text-[10px] font-bold text-white whitespace-nowrap">{siteData?.registration?.shortText || 'Kayıtlar Açık'}</span>
              </Link>

              <a href={`tel:${siteData?.contact?.phoneRaw || '03121234567'}`} className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-primary transition-all text-sm">
                <i className="fas fa-phone text-xs"></i>
                <span className="font-medium">{siteData?.contact?.phone || '0312 123 45 67'}</span>
              </a>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-all"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-4 pt-2 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary hover:text-white transition-all"
                >
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link href="/#iletisim" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary to-pink-500 text-white py-3 rounded-xl font-semibold">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {siteData?.registration?.badge || '2024-2025 Kayıtları Açık'}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
