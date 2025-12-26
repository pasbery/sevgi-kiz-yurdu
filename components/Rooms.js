"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Rooms() {
  const roomTypes = [
    { key: '1-kisilik', label: '1 Kişilik', color: 'bg-amber-500', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop' },
    { key: '2-kisilik', label: '2 Kişilik', color: 'bg-purple-500', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop' },
    { key: '3-kisilik', label: '3 Kişilik', color: 'bg-green-500', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&h=300&fit=crop' },
    { key: '4-kisilik', label: '4 Kişilik', color: 'bg-blue-500', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop' },
    { key: '5-6-kisilik', label: '5-6 Kişilik', color: 'bg-cyan-500', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&h=300&fit=crop' }
  ];

  return (
    <>
      <section id="odalar" className="py-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
            {roomTypes.map((type) => (
              <div key={type.key} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative overflow-hidden">
                  <Image 
                      src={type.img} 
                      alt={type.label} 
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className={`${type.color} text-white text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium`}>{type.label}</span>
                  </div>
                </div>
                <div className="p-2 sm:p-3 lg:p-4">
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-1">{type.label} Oda</h3>
                  <p className="text-primary font-semibold mb-2 text-[10px] sm:text-xs">Maksimum konfor ve özel alan.</p>
                  <Link href={`/odalar/${type.key}`} className="block w-full text-center bg-gray-900 text-white py-1.5 sm:py-2 rounded-lg font-semibold hover:bg-primary transition-colors group-hover:bg-primary text-[10px] sm:text-xs">
                    <i className="fas fa-door-open mr-1"></i>İncele
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
