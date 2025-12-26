import HomeClient from '@/components/HomeClient';
import prisma from '@/lib/prisma';

async function getHomepageData() {
  try {
    const pageContent = await prisma.pageContent.findUnique({
      where: { id: 'homepage' }
    });
    
    if (pageContent?.content) {
      return JSON.parse(pageContent.content);
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error);
  }
  return null;
}

export default async function Home() {
  const initialData = await getHomepageData();

  return (
    <>
      <HomeClient initialData={initialData} />
      
      {/* Back to Top Button */}
      <a href="#anasayfa" className="fixed bottom-8 right-24 w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 hover:scale-110 hover:shadow-xl transition-all duration-300 group z-40">
        <i className="fas fa-arrow-up group-hover:-translate-y-1 transition-transform"></i>
      </a>
    </>
  );
}
