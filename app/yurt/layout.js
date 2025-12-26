import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SiteProvider } from "@/context/SiteContext";
import { RoomsProvider } from "@/context/RoomsContext";

export default function YurtLayout({ children }) {
  return (
    <SiteProvider>
      <RoomsProvider>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </RoomsProvider>
    </SiteProvider>
  );
}
