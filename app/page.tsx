import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import SecondaryHero from "@/components/SecondaryHero";
import ThirdHero from "@/components/ThirdHero";
import TestimonialsSection from "@/components/TestimonialsSection";
import StructuredData from "@/components/SEO/StructuredData";
import { structuredDataTemplates } from "@/lib/seo-config";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Baby Souk - Premium Baby Products & Toys Store in India',
    description: 'Discover the best baby products, toys, clothing, and care essentials at Baby Souk. Trusted by 1000+ happy parents across India. Premium quality, safe products, fast delivery. Shop now!',
    keywords: [
        'baby products India',
        'baby toys online',
        'premium baby store',
        'safe baby products',
        'infant care essentials',
        'toddler toys',
        'baby clothes online',
        'newborn products',
        'baby shopping India',
        'quality baby items'
    ],
    openGraph: {
        title: 'Baby Souk - Premium Baby Products & Toys Store in India',
        description: 'Discover premium baby products trusted by 1000+ parents. Safe toys, clothes, and care essentials with fast delivery across India.',
        type: 'website',
        images: [
            {
                url: '/assets/hero-banner.jpg',
                width: 1200,
                height: 630,
                alt: 'Baby Souk - Premium Baby Products and Toys Collection',
            }
        ],
    },
};

export default function HomePage() {
    return (
        <>
            <StructuredData data={structuredDataTemplates.website} />
            <StructuredData data={structuredDataTemplates.localBusiness} />

            <div className="min-h-screen bg-playful-background overflow-hidden">
                <Header />
                <main>
                    <HeroSection />
                    <CategorySection />
                    <SecondaryHero />
                    <ProductsSection />
                    <ThirdHero />
                    <TestimonialsSection />
                    <FeaturesSection />
                </main>
                <Footer />
            </div>
        </>
    );
}
