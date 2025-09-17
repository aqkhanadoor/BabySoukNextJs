import { realtimeDb } from '@/lib/firebase';
import { onValue, ref as dbRef } from 'firebase/database';
import { type ProductRecord } from '@/types/product';

export default function sitemap() {
    return new Promise((resolve) => {
        const ref = dbRef(realtimeDb, "products");
        
        onValue(ref, (snap) => {
            const val = snap.val() as Record<string, ProductRecord> | null;
            const baseUrl = 'https://babysouk.in';
            
            // Static pages
            const staticPages = [
                {
                    url: baseUrl,
                    lastModified: new Date(),
                    changeFrequency: 'daily' as const,
                    priority: 1.0,
                },
                {
                    url: `${baseUrl}/products`,
                    lastModified: new Date(),
                    changeFrequency: 'daily' as const,
                    priority: 0.9,
                },
                {
                    url: `${baseUrl}/categories`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                },
                {
                    url: `${baseUrl}/contact`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.6,
                },
                {
                    url: `${baseUrl}/faq`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.5,
                },
                {
                    url: `${baseUrl}/shipping`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.5,
                },
                {
                    url: `${baseUrl}/returns`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.5,
                },
                {
                    url: `${baseUrl}/terms`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.4,
                },
                {
                    url: `${baseUrl}/privacy`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.4,
                },
            ];

            // Dynamic product pages
            const productPages = [];
            if (val) {
                Object.entries(val).forEach(([key, product]) => {
                    const slug = product.slug || key;
                    const category = product.category?.toLowerCase() || 'product';
                    const lastModified = typeof product.updatedAt === 'number'
                        ? new Date(product.updatedAt)
                        : typeof product.createdAt === 'number'
                        ? new Date(product.createdAt)
                        : new Date();

                    productPages.push({
                        url: `${baseUrl}/${category}/${slug}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7,
                    });
                });
            }

            // Category pages
            const categories = new Set<string>();
            if (val) {
                Object.values(val).forEach(product => {
                    if (product.category) {
                        categories.add(product.category.toLowerCase());
                    }
                });
            }

            const categoryPages = Array.from(categories).map(category => ({
                url: `${baseUrl}/products?category=${category}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

            resolve([...staticPages, ...productPages, ...categoryPages]);
        });
    });
}

export const revalidate = 3600; // Revalidate every hour