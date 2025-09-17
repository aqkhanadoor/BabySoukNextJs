// Product Form interface for admin form management
export interface ProductForm {
  name: string;
  price: string; // keep as string for input control
  salePrice?: string; // absolute sale price in ₹ as string
  category: string;
  subcategory?: string;
  description: string; // limit 1000 chars
  colors: string[];
  sizes: string[];
  imagesFiles: File[];
  imagesUrls: string[]; // picked from existing
  slug: string;
  shortDescription: string;
  tags: string[];
  brand?: string;
  sku?: string;
  stock: string; // string for input control, convert to number
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
  };
}

// Product Record interface for Firebase database storage
export interface ProductRecord {
  name: string;
  price: number;
  discountRate: number | null; // percentage discount (0-100)
  category: string;
  subcategory: string | null;
  description: string;
  colors: string[];
  sizes: string[];
  images: string[];
  createdAt?: number | { [k: string]: any }; // Firebase timestamp
  updatedAt?: number | { [k: string]: any }; // Firebase timestamp
  slug?: string;
  shortDescription?: string;
  tags?: string[];
  brand?: string | null;
  sku?: string | null;
  stock?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

// Legacy Product interface for backward compatibility
export interface Product {
  id: string;
  slug?: string;
  name: string;
  mrp: number; // original price
  specialPrice: number; // discounted/current price
  images: string[]; // product gallery images
  image?: string; // optional primary image convenience field (for legacy components)
  description: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  dateAdded: string; // ISO date (yyyy-mm-dd)
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  // Extended/optional fields (for future use)
  shortDescription?: string;
  brand?: string | null;
  sku?: string | null;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

// Utility type for converting ProductRecord to Product for frontend display
export interface ProductDisplay extends Omit<ProductRecord, 'price' | 'discountRate' | 'createdAt' | 'updatedAt' | 'stock'> {
  id: string;
  mrp: number; // original price
  specialPrice: number; // calculated from price and discountRate
  inStock: boolean; // derived from stock > 0
  dateAdded: string; // formatted date
}
