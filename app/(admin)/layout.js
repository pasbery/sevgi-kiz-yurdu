import Link from 'next/link';
import { SiteProvider } from "@/context/SiteContext";
import { AuthProvider } from "@/context/AuthContext";
import AdminAuthGuard from "@/components/AdminAuthGuard";
import AdminLayoutContent from "@/components/AdminLayoutContent";

export const metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  title: 'Admin Panel',
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <SiteProvider>
        <AdminAuthGuard>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminAuthGuard>
      </SiteProvider>
    </AuthProvider>
  );
}
