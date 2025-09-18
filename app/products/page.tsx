import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";
import { getProducts } from "@/lib/data";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import { Metadata } from 'next';

// Enable ISR with long revalidation since admin panel triggers manual revalidation
export const revalidate = 86400 * 7; // 7 days (manual revalidation handles updates)

export const metadata: Metadata = {
    title: 'Baby Products & Toys - Premium Collection | Baby Souk',
    description: 'Browse our complete collection of premium baby products, toys, clothing, and care essentials. Safe, quality products trusted by 1000+ parents across India.',
    keywords: [
        'baby products online',
        'baby toys India',
        'premium baby collection',
        'safe baby products',
        'infant care products',
        'toddler toys online',
        'baby clothes',
        'baby essentials'
    ],
    openGraph: {
        title: 'Baby Products & Toys - Premium Collection | Baby Souk',
        description: 'Browse our complete collection of premium baby products, toys, and essentials. Quality guaranteed!',
        type: 'website',
    },
};

// Loading component for Suspense
function ProductsLoading() {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <div className="h-16 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default async function ProductsPage() {
    // Fetch initial products data at build time for ISR
    const initialProducts = await getProducts();

    return (
        <Suspense fallback={<ProductsLoading />}>
            <ProductsPageClient initialProducts={initialProducts} />
        </Suspense>
    );
}
