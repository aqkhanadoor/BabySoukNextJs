import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'wishlist';

export const useWishlist = (productId: string) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    try {
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      setIsInWishlist(wishlist.includes(productId));
    } catch (error) {
      console.error("Failed to read wishlist from localStorage", error);
      setIsInWishlist(false);
    }
  }, [productId]);

  const toggleWishlist = useCallback(() => {
    try {
      const wishlist: string[] = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      const newWishlist = isInWishlist
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId];
      
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(newWishlist));
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Failed to update wishlist in localStorage", error);
    }
  }, [isInWishlist, productId]);

  return { isInWishlist, toggleWishlist };
};
