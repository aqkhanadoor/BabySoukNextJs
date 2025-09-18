// Utility functions for triggering ISR revalidation from admin panel

const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'baby-souk-revalidate-secret';

export interface RevalidateOptions {
  type?: 'products' | 'categories' | 'hero-content' | 'full-site';
  paths?: string[];
  tags?: string[];
}

/**
 * Trigger ISR revalidation from admin panel
 * @param options - Revalidation options
 * @returns Promise with success/error result
 */
export async function triggerRevalidation(options: RevalidateOptions = {}): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${REVALIDATE_SECRET}`,
      },
      body: JSON.stringify({
        secret: REVALIDATE_SECRET,
        ...options,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to revalidate');
    }

    return {
      success: true,
      message: data.message || 'Revalidation triggered successfully',
    };
  } catch (error) {
    console.error('Revalidation error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Revalidate products-related pages
 */
export async function revalidateProducts(): Promise<{ success: boolean; message: string }> {
  return triggerRevalidation({
    type: 'products',
    paths: ['/', '/products'],
    tags: ['products']
  });
}

/**
 * Revalidate categories and homepage
 */
export async function revalidateCategories(): Promise<{ success: boolean; message: string }> {
  return triggerRevalidation({
    type: 'categories',
    paths: ['/', '/categories'],
    tags: ['categories']
  });
}

/**
 * Revalidate homepage hero content
 */
export async function revalidateHeroContent(): Promise<{ success: boolean; message: string }> {
  return triggerRevalidation({
    type: 'hero-content',
    paths: ['/'],
    tags: ['hero']
  });
}

/**
 * Revalidate specific product page
 */
export async function revalidateProductPage(category: string, slug: string): Promise<{ success: boolean; message: string }> {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  return triggerRevalidation({
    paths: [`/${categorySlug}/${slug}`],
  });
}

/**
 * Full site revalidation (use sparingly)
 */
export async function revalidateFullSite(): Promise<{ success: boolean; message: string }> {
  return triggerRevalidation({
    type: 'full-site'
  });
}

/**
 * Auto-revalidation hook for product operations
 * Call this after adding/updating/deleting products
 */
export async function autoRevalidateAfterProductChange(
  operation: 'create' | 'update' | 'delete',
  productData?: { category?: string; slug?: string }
): Promise<void> {
  try {
    // Always revalidate products listing and homepage
    await revalidateProducts();

    // If specific product data is provided, also revalidate that product page
    if (productData?.category && productData?.slug) {
      await revalidateProductPage(productData.category, productData.slug);
    }

    console.log(`Auto-revalidation completed after ${operation} operation`);
  } catch (error) {
    console.error('Auto-revalidation failed:', error);
    // Don't throw error as this shouldn't break the main operation
  }
}

/**
 * Hook for manual revalidation with loading state
 */
export function useRevalidation() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastRevalidation, setLastRevalidation] = useState<Date | null>(null);

  const revalidate = async (options: RevalidateOptions = {}) => {
    setIsLoading(true);
    try {
      const result = await triggerRevalidation(options);
      if (result.success) {
        setLastRevalidation(new Date());
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    revalidate,
    isLoading,
    lastRevalidation,
  };
}

// React hook import (add this at the top of files that use useRevalidation)
import { useState } from 'react';