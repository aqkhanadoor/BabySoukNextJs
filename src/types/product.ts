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
