import { Metadata } from 'next';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    noIndex?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
}

export function generateSEOMetadata({
    title,
    description,
    keywords = [],
    canonical,
    ogImage = '/assets/hero-banner.jpg',
    ogType = 'website',
    noIndex = false,
    publishedTime,
    modifiedTime
}: SEOProps): Metadata {
    const metaTitle = title ? `${title} | Baby Souk - Premium Baby Products` : undefined;
    const metaDescription = description || 'Discover premium baby products and toys at Baby Souk. Quality guaranteed, trusted by 1000+ parents across India.';

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: keywords.length > 0 ? keywords : undefined,
        robots: noIndex ? 'noindex,nofollow' : 'index,follow',
        alternates: canonical ? { canonical } : undefined,
        openGraph: {
            title: metaTitle || 'Baby Souk - Premium Baby Products & Toys',
            description: metaDescription,
            type: ogType,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title || 'Baby Souk - Premium Baby Products',
                }
            ],
            publishedTime,
            modifiedTime,
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle || 'Baby Souk - Premium Baby Products & Toys',
            description: metaDescription,
            images: [ogImage],
        },
    };
}

// Helper functions for common SEO patterns
export const productSEOKeywords = (product: any) => [
    product.name.toLowerCase(),
    `${product.category.toLowerCase()} for baby`,
    `buy ${product.name.toLowerCase()} online`,
    `${product.brand || 'baby'} products`,
    'baby products India',
    'safe baby items',
    `${product.category.toLowerCase()} online shopping`
];

export const categorySEOKeywords = (category: string) => [
    `${category.toLowerCase()} for baby`,
    `buy ${category.toLowerCase()} online`,
    `${category.toLowerCase()} india`,
    `premium ${category.toLowerCase()}`,
    'baby products online',
    'safe baby items',
    'quality baby products'
];

export const generateProductTitle = (productName: string, category: string) => 
    `${productName} - Premium ${category} | Buy Online`;

export const generateProductDescription = (product: any) =>
    `Buy ${product.name} online at Baby Souk. Premium ${product.category.toLowerCase()} for babies. ` +
    `Special price ₹${product.specialPrice} (MRP ₹${product.mrp}). Safe, quality guaranteed. Free delivery above ₹999.`;

export const generateCategoryDescription = (category: string, productCount: number) =>
    `Explore ${productCount}+ premium ${category.toLowerCase()} for babies at Baby Souk. ` +
    `Safe, quality assured products. Fast delivery across India. Trusted by 1000+ happy parents.`;