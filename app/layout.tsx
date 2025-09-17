import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';
import ScrollToTop from '@/components/ScrollToTop';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#ff4081',
    colorScheme: 'light'
};

export const metadata: Metadata = {
    title: {
        default: 'Baby Souk - Premium Baby Products & Toys | Safe & Quality',
        template: '%s | Baby Souk - Premium Baby Products'
    },
    description: 'Discover the best baby products, toys, clothing, and care essentials at Baby Souk. Trusted by 1000+ happy parents across India. Fast delivery, quality guaranteed, safe products.',
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
        'newborn essentials'
    ],
    authors: [{ name: 'Baby Souk', url: 'https://babysouk.in' }],
    creator: 'Baby Souk',
    publisher: 'Baby Souk',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL('https://babysouk.in'),
    alternates: {
        canonical: '/',
        languages: {
            'en-IN': '/en-IN',
            'hi-IN': '/hi-IN',
        },
    },
    category: 'shopping',
    openGraph: {
        title: 'Baby Souk - Premium Baby Products & Toys | Safe & Quality',
        description: 'Discover the best baby products, toys, clothing, and care essentials at Baby Souk. Trusted by 1000+ happy parents across India. Fast delivery, quality guaranteed.',
        type: 'website',
        locale: 'en_IN',
        url: 'https://babysouk.in',
        siteName: 'Baby Souk',
        images: [
            {
                url: '/assets/hero-banner.jpg',
                width: 1200,
                height: 630,
                alt: 'Baby Souk - Premium Baby Products and Toys Store',
                type: 'image/jpeg',
            },
            {
                url: '/assets/og-logo.png',
                width: 800,
                height: 600,
                alt: 'Baby Souk Logo',
                type: 'image/png',
            }
        ],
        emails: ['info@babysouk.in'],
        phoneNumbers: ['+91-7907943740'],
        countryName: 'India',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@babysouk',
        creator: '@babysouk',
        title: 'Baby Souk - Premium Baby Products & Toys | Safe & Quality',
        description: 'Discover the best baby products, toys, and essentials. Trusted by 1000+ happy parents across India. Shop now for quality assured products.',
        images: {
            url: '/assets/hero-banner.jpg',
            alt: 'Baby Souk - Premium Baby Products Store',
        },
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        apple: '/assets/apple-touch-icon.png'
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            "name": "Baby Souk",
                            "description": "Premium baby products and toys store in India",
                            "url": "https://babysouk.in",
                            "logo": "https://babysouk.in/assets/logo.png",
                            "contactPoint": [
                                {
                                    "@type": "ContactPoint",
                                    "telephone": "+91-7907943740",
                                    "contactType": "customer service",
                                    "availableLanguage": ["English", "Hindi"],
                                    "areaServed": "IN"
                                }
                            ],
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "C.P Complex, Agastiamuzhi",
                                "addressLocality": "Mukkam",
                                "addressRegion": "Kerala",
                                "postalCode": "673572",
                                "addressCountry": "IN"
                            },
                            "sameAs": [
                                "https://www.instagram.com/babysouk",
                                "https://www.facebook.com/babysouk"
                            ]
                        })
                    }}
                />
            </head>
            <body className="scroll-smooth antialiased">
                <Providers>
                    {children}
                    <ScrollToTop />
                </Providers>
            </body>
        </html>
    );
}
