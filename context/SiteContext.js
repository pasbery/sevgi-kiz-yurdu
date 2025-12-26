"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext();

// Initial state (loading durumu için - tüm veriler veritabanından gelecek)
const initialSiteData = {
  site: { domain: '', url: '', protocol: 'https' },
  brand: { name: '', fullName: '', subtitle: '', description: '', slogan: '', keywords: '' },
  registration: { badge: '', shortText: '', description: '' },
  stats: { students: '', studentsLabel: '', experience: '', experienceLabel: '', rating: '', ratingLabel: '', reviewCount: '' },
  contact: { phone: '', phoneRaw: '', email: '', address: '', workingHours: '', whatsapp: '' },
  socialMedia: [],
  map: { embedUrl: '' }
};

export function SiteProvider({ children }) {
  const [isEditable, setIsEditableState] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Admin authentication kontrolü
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('adminAuth');
    if (!token) {
      setIsAdmin(false);
      setIsEditableState(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const result = await response.json();
      setIsAdmin(result.valid);
      if (!result.valid) {
        setIsEditableState(false);
      }
    } catch {
      setIsAdmin(false);
      setIsEditableState(false);
    }
  };

  // Düzenleme modunu sadece admin açabilir
  const setIsEditable = (value) => {
    if (value && !isAdmin) {
      // Admin değilse login sayfasına yönlendir
      window.location.href = '/admin/login';
      return;
    }
    setIsEditableState(value);
  };

  // Shared Site Data - Used across multiple components
  const [siteData, setSiteData] = useState(initialSiteData);

  // Fetch site data from API on mount
  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await fetch('/api/site-config');
        const result = await response.json();
        if (result.success && result.data) {
          setSiteData(result.data);
        }
      } catch (error) {
        console.error('Error fetching site config:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSiteData();
  }, []);

  // Save site data to database
  const saveSiteData = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      const result = await response.json();
      if (result.success) {
        return { success: true, message: 'Site ayarları kaydedildi!' };
      } else {
        return { success: false, message: 'Kaydetme başarısız oldu.' };
      }
    } catch (error) {
      console.error('Error saving site config:', error);
      return { success: false, message: 'Bir hata oluştu.' };
    } finally {
      setIsSaving(false);
    }
  };

  // Update nested site data
  const updateSiteData = (section, key, value) => {
    setSiteData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' && !Array.isArray(prev[section])
        ? { ...prev[section], [key]: value }
        : value
    }));
  };

  // Update social media item
  const updateSocialMedia = (index, field, value) => {
    setSiteData(prev => {
      const newSocials = [...prev.socialMedia];
      newSocials[index] = { ...newSocials[index], [field]: value };
      return { ...prev, socialMedia: newSocials };
    });
  };

  // Legacy footerData for backward compatibility
  const footerData = {
    brand: siteData.brand,
    contact: siteData.contact,
    socials: siteData.socialMedia.map(s => s.icon)
  };

  const updateFooter = (section, key, value) => {
    updateSiteData(section, key, value);
  };

  return (
    <SiteContext.Provider value={{ 
      isEditable, setIsEditable, 
      isAdmin, checkAdminAuth,
      isLoading, isSaving,
      siteData, setSiteData, updateSiteData, updateSocialMedia,
      saveSiteData,
      footerData, updateFooter 
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
