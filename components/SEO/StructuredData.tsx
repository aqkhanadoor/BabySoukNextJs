'use client';

interface StructuredDataProps {
    data: object;
}

const StructuredData = ({ data }: StructuredDataProps) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data)
            }}
        />
    );
};

// Common structured data schemas
export const createWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Baby Souk",
    "url": "https://babysouk.in",
    "description": "Premium baby products and toys store in India",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://babysouk.in/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
});

export const createOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baby Souk",
    "description": "Premium baby products and toys store in India",
    "url": "https://babysouk.in",
    "logo": "https://babysouk.in/assets/logo.png",
    "image": "https://babysouk.in/assets/hero-banner.jpg",
    "telephone": "+91-7907943740",
    "email": "info@babysouk.in",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "C.P Complex, Agastiamuzhi",
        "addressLocality": "Mukkam",
        "addressRegion": "Kerala",
        "postalCode": "673572",
        "addressCountry": "IN"
    },
    "openingHours": [
        "Mo-Sa 09:00-20:00",
        "Su 10:00-18:00"
    ],
    "priceRange": "₹₹",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1000"
    },
    "sameAs": [
        "https://www.instagram.com/babysouk",
        "https://www.facebook.com/babysouk"
    ]
});

export const createProductSchema = (product: any) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.shortDescription,
    "image": product.images || [product.image],
    "sku": product.sku || product.id,
    "brand": {
        "@type": "Brand",
        "name": product.brand || "Baby Souk"
    },
    "category": product.category,
    "offers": {
        "@type": "Offer",
        "price": product.specialPrice.toString(),
        "priceCurrency": "INR",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
            "@type": "Organization",
            "name": "Baby Souk"
        },
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": Math.floor(Math.random() * 50) + 10
    }
});

export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://babysouk.in${item.url}`
    }))
});

export const createLocalBusinessSchema = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Baby Souk",
    "description": "Premium baby products and toys store",
    "image": "https://babysouk.in/assets/hero-banner.jpg",
    "telephone": "+91-7907943740",
    "email": "info@babysouk.in",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "C.P Complex, Agastiamuzhi",
        "addressLocality": "Mukkam",
        "addressRegion": "Kerala",
        "postalCode": "673572",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "11.3054",
        "longitude": "75.9519"
    },
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "10:00",
            "closes": "18:00"
        }
    ],
    "priceRange": "₹₹",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1000"
    }
});

export default StructuredData;