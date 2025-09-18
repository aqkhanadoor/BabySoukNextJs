import { unstable_cache } from 'next/cache'
import { type Product, type ProductRecord } from "@/types/product";

// Firebase Admin SDK for server-side data fetching
async function fetchProductsFromFirebase(): Promise<Product[]> {
  try {
    // For now, we'll use a placeholder implementation
    // In a production environment, you would use Firebase Admin SDK here
    // Example: const snapshot = await admin.database().ref('products').once('value')
    
    // This is a placeholder - replace with actual Firebase Admin implementation
    const response = await fetch(`${process.env.FIREBASE_DATABASE_URL}/products.json`, {
      next: { tags: ['products'] }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json() as Record<string, ProductRecord> | null;
    
    if (!data) {
      return [];
    }
    
    const products: Product[] = Object.entries(data).map(([key, p]) => {
      const price = Number(p.price ?? 0);
      const dr = typeof p.discountRate === "number" ? p.discountRate : 0;
      const mrp = price;
      const specialPrice = dr && dr > 0 ? Math.round(price * (100 - dr) / 100) : price;
      const image = Array.isArray(p.images) && p.images[0] ? p.images[0] : "/placeholder.svg";
      const createdAtNum = typeof p.createdAt === "number" ? p.createdAt : 0;
      const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      
      return {
        id: key,
        name: p.name || "Untitled Product",
        mrp,
        specialPrice,
        images: Array.isArray(p.images) && p.images.length ? p.images : [image],
        description: p.description || "",
        category: p.category || "Misc",
        subcategory: p.subcategory || "",
        inStock: typeof p.stock === "number" ? p.stock > 0 : true,
        dateAdded: dateStr,
        colors: p.colors || [],
        sizes: p.sizes || [],
        tags: p.tags || [],
        shortDescription: p.shortDescription || "",
        brand: p.brand || null,
        sku: p.sku || null,
        seo: p.seo || undefined,
        slug: p.slug || key
      };
    });
    
    // Sort by newest first
    products.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Cache the products data for ISR
export const getProducts = unstable_cache(
  fetchProductsFromFirebase,
  ['products'],
  {
    tags: ['products'],
    revalidate: 3600, // 1 hour
  }
);

// Fetch hero content (for homepage)
async function fetchHeroContentFromFirebase() {
  try {
    // Placeholder for hero content fetching
    // Replace with actual Firebase implementation
    return {
      heroSections: [],
      categories: [],
      featuredProducts: []
    };
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return {
      heroSections: [],
      categories: [],
      featuredProducts: []
    };
  }
}

export const getHeroContent = unstable_cache(
  fetchHeroContentFromFirebase,
  ['hero-content'],
  {
    tags: ['hero'],
    revalidate: 3600, // 1 hour
  }
);

// Helper function to get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

// Helper function to get a single product
export async function getProduct(categorySlug: string, productSlug: string): Promise<Product | null> {
  const allProducts = await getProducts();
  return allProducts.find(product => 
    product.category.toLowerCase().replace(/\s+/g, '-') === categorySlug &&
    (product.slug === productSlug || product.id === productSlug)
  ) || null;
}