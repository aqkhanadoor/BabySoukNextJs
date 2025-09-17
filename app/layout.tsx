import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
    title: 'Baby Souk - Premium Baby Products & Toys | Safe & Quality',
    description: 'Discover the best baby products, toys, clothing, and care essentials at Baby Souk. Trusted by 1000+ happy parents. Fast delivery, quality guaranteed.',
    keywords: 'baby products, baby toys, baby clothes, baby care, infant products, toddler toys, safe baby products, quality baby items',
    authors: [{ name: 'Baby Souk' }],
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
    themeColor: '#ff4081',
    colorScheme: 'light',
    robots: 'index, follow',
    openGraph: {
        title: 'Baby Souk - Premium Baby Products & Toys',
        description: 'Discover the best baby products, toys, and essentials. Trusted by 1000+ happy parents.',
        type: 'website',
        locale: 'en_IN',
        siteName: 'Baby Souk',
        images: [
            {
                url: '/assets/hero-banner.jpg',
                width: 1200,
                height: 630,
                alt: 'Baby Souk - Premium Baby Products'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Baby Souk - Premium Baby Products & Toys',
        description: 'Discover the best baby products, toys, and essentials. Trusted by 1000+ happy parents.',
        images: ['/assets/hero-banner.jpg']
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
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
                <meta name="theme-color" content="#ff4081" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
