// SEO Configuration for Baby Souk
export const seoConfig = {
    siteName: 'Baby Souk',
    siteUrl: 'https://babysouk.in',
    description: 'Discover premium baby products, toys, clothing, and care essentials at Baby Souk. Trusted by 1000+ happy parents across India. Quality guaranteed, safe products, fast delivery.',
    keywords: [
        'baby products India',
        'baby toys online',
        'infant care products',
        'toddler clothes',
        'safe baby products',
        'premium baby items',
        'baby souk',
        'online baby store',
        'baby shopping India',
        'newborn essentials',
        'baby accessories',
        'children products',
        'baby gear online'
    ],
    author: 'Baby Souk',
    email: 'info@babysouk.in',
    phone: '+91-7907943740',
    address: {
        street: 'C.P Complex, Agastiamuzhi',
        city: 'Mukkam',
        state: 'Kerala',
        zipCode: '673572',
        country: 'India'
    },
    socialMedia: {
        instagram: 'https://www.instagram.com/babysouk',
        facebook: 'https://www.facebook.com/babysouk',
        twitter: '@babysouk'
    },
    businessHours: {
        weekdays: 'Mon-Sat: 9:00 AM - 8:00 PM',
        weekend: 'Sun: 10:00 AM - 6:00 PM'
    },
    rating: {
        value: 4.8,
        count: 1000
    },
    defaultImages: {
        og: '/assets/hero-banner.jpg',
        logo: '/assets/logo.png',
        favicon: '/favicon.ico'
    }
};

// Common meta tags for all pages
export const defaultMetaTags = {
    robots: 'index,follow',
    googlebot: 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1',
    viewport: 'width=device-width,initial-scale=1',
    charset: 'utf-8',
    language: 'English',
    revisitAfter: '7 days',
    distribution: 'global',
    rating: 'general'
};

// Structured Data Templates
export const structuredDataTemplates = {
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}${seoConfig.defaultImages.logo}`,
        description: seoConfig.description,
        email: seoConfig.email,
        telephone: seoConfig.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: seoConfig.address.street,
            addressLocality: seoConfig.address.city,
            addressRegion: seoConfig.address.state,
            postalCode: seoConfig.address.zipCode,
            addressCountry: seoConfig.address.country
        },
        sameAs: [
            seoConfig.socialMedia.instagram,
            seoConfig.socialMedia.facebook
        ]
    },
    
    website: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description: seoConfig.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${seoConfig.siteUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    },

    localBusiness: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: seoConfig.siteName,
        description: seoConfig.description,
        url: seoConfig.siteUrl,
        telephone: seoConfig.phone,
        email: seoConfig.email,
        image: `${seoConfig.siteUrl}${seoConfig.defaultImages.og}`,
        address: {
            '@type': 'PostalAddress',
            streetAddress: seoConfig.address.street,
            addressLocality: seoConfig.address.city,
            addressRegion: seoConfig.address.state,
            postalCode: seoConfig.address.zipCode,
            addressCountry: seoConfig.address.country
        },
        priceRange: '₹₹',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: seoConfig.rating.value.toString(),
            reviewCount: seoConfig.rating.count.toString()
        }
    }
};

// SEO functions
export const generatePageTitle = (title: string, includeCategory?: string) => {
    if (includeCategory) {
        return `${title} - ${includeCategory} | ${seoConfig.siteName} - Premium Baby Products`;
    }
    return `${title} | ${seoConfig.siteName} - Premium Baby Products`;
};

export const generatePageDescription = (description: string, category?: string) => {
    const base = category 
        ? `${description} Browse premium ${category.toLowerCase()} for babies at Baby Souk.`
        : description;
    return `${base} Quality guaranteed, trusted by 1000+ parents across India. Fast delivery.`;
};

export const generateProductKeywords = (product: any) => [
    product.name.toLowerCase(),
    `${product.category.toLowerCase()} for baby`,
    `buy ${product.name.toLowerCase()} online`,
    `${product.brand || 'baby'} products India`,
    'baby products online India',
    'safe baby items',
    `premium ${product.category.toLowerCase()}`,
    'baby shopping online',
    'quality baby products',
    'infant essentials'
];

export const generateCategoryKeywords = (category: string) => [
    `${category.toLowerCase()} for baby`,
    `buy ${category.toLowerCase()} online India`,
    `premium ${category.toLowerCase()}`,
    `baby ${category.toLowerCase()} online`,
    'baby products India',
    'safe baby items',
    'quality baby products',
    'infant essentials',
    'toddler products',
    'newborn essentials'
];