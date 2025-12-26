"use client";

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <i className="fas fa-chevron-right text-xs text-gray-400"></i>}
              {index === items.length - 1 ? (
                <span className="text-gray-800 font-medium">{item.name}</span>
              ) : (
                <a href={item.url} className="hover:text-primary transition-colors">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
