import { Poppins } from "next/font/google";
import "./globals.css";
import prisma from '@/lib/prisma';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { generateKeywords, generateTitle, generateDescription } from '@/lib/seoKeywords';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateMetadata() {
  // 1. Fetch Global Config
  const config = await prisma.siteConfig.findUnique({
    where: { id: 'main' }
  });

  // 2. Fetch Homepage Specific SEO (if exists)
  const homeSeo = await prisma.sEOMetadata.findUnique({
    where: { pageRoute: '/' }
  });

  // 3. Fetch Dynamic Content for Schema (Hero, Features, Rooms)
  const heroContent = await prisma.pageContent.findUnique({ where: { id: 'hero' } });
  const featuresContent = await prisma.pageContent.findUnique({ where: { id: 'features' } });
  const roomTypes = await prisma.roomType.findMany({ orderBy: { order: 'asc' } });

  // Priority: Specific Page SEO > Auto Generated
  const title = homeSeo?.title || generateTitle('home', {}, config.brandFull);
  const description = homeSeo?.description || generateDescription('home');
  const keywords = homeSeo?.keywords || generateKeywords('home');
  const noIndex = homeSeo?.noIndex || false;
  
  // Parse JSON content safely
  const featuresData = featuresContent ? JSON.parse(featuresContent.content) : null;
  
  // Generate Amenities List from Features
  const amenities = featuresData?.items?.map(item => ({
    "@type": "LocationFeatureSpecification",
    "name": item.title,
    "value": true
  })) || [];

  // Generate Room Types Schema
  const roomsSchema = roomTypes.map(room => ({
    "@type": "HotelRoom",
    "name": room.label,
    "description": room.description,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": parseInt(room.slug.split('-')[0]) || 1,
      "unitCode": "C62" // Person
    }
  }));

  const siteUrl = config.siteUrl;
  
  // Fetch testimonials for aggregate rating and reviews
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  const reviewCount = testimonials.length || 1;
  
  // Calculate average rating dynamically
  const totalRating = testimonials.reduce((sum, t) => sum + (t.rating || 5), 0);
  const avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : "5.0";

  // Generate individual review schemas
  const reviewsSchema = testimonials.slice(0, 10).map(t => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": t.name
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": (t.rating || 5).toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "reviewBody": t.text
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hostel",
    "name": config.brandFull,
    "image": `${siteUrl}/og-image.svg`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": config?.phone || "05xx xxx xx xx",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config?.address || "Adres bilgisi",
      "addressLocality": "Merkez",
      "addressRegion": "Uşak",
      "postalCode": "64100",
      "addressCountry": "TR"
    },
    "priceRange": "₺5000 - ₺12000",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.6823,
      "longitude": 29.4082
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
      "reviewCount": reviewCount.toString()
    },
    "review": reviewsSchema,
    "amenityFeature": amenities,
    "containsPlace": roomsSchema
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${config.brandFull}`
    },
    description: description,
    keywords: keywords,
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
        { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.svg',
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: title,
      description: description,
      url: siteUrl,
      siteName: config.brandName,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: config.brandFull,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${siteUrl}/og-image.svg`],
    },
  };
}

async function getJsonLd() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 'main' } });
  const featuresContent = await prisma.pageContent.findUnique({ where: { id: 'features' } });
  const roomTypes = await prisma.roomType.findMany({ orderBy: { order: 'asc' } });
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  
  const siteUrl = config?.siteUrl;
  // Parse JSON content safely
  const featuresData = featuresContent?.content ? JSON.parse(featuresContent.content) : null;
  const reviewCount = testimonials?.length || 1;
  
  // Generate Amenities List from Features
  const amenities = featuresData?.items?.map(item => ({
    "@type": "LocationFeatureSpecification",
    "name": item.title,
    "value": true
  })) || [];

  // Generate Room Types Schema
  const roomsSchema = roomTypes?.map(room => ({
    "@type": "HotelRoom",
    "name": room.label,
    "description": room.description,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": parseInt(room.slug.split('-')[0]) || 1,
      "unitCode": "C62" // Person
    }
  })) || [];

  return {
    "@context": "https://schema.org",
    "@type": "Hostel",
    "name": config?.brandFull || "Doruk Kız Öğrenci Yurdu",
    "image": `${siteUrl}/og-image.svg`,
    "@id": siteUrl,
    "url": siteUrl,
    "telephone": config?.phone || "05xx xxx xx xx",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": config?.address || "Ünalan Mahallesi 3.Ural Sokak No:9 (Medikal Park Hastane Karşı Çaprazı)",
      "addressLocality": "Merkez",
      "addressRegion": "Uşak",
      "postalCode": "64100",
      "addressCountry": "TR"
    },
    "priceRange": "₺5000 - ₺12000",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 38.6823,
      "longitude": 29.4082
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
      "reviewCount": reviewCount.toString()
    },
    "amenityFeature": amenities,
    "containsPlace": roomsSchema
  };
}

export default async function RootLayout({ children }) {
  const jsonLd = await getJsonLd();

  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins text-gray-800 bg-gray-50`}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        {children}
      </body>
    </html>
  );
}
