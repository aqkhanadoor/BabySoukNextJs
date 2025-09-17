"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Product } from "@/types/product";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  const slug = (product as any).slug ? (product as any).slug : slugify(product.name);
  const categorySegment = product.category ? slugify(product.category) : "product";
  const productHref = `/${categorySegment}/${slug}`;
  const { addToCart } = useCart();
  const { toast } = useToast();
  const discountPercentage = Math.round(((product.mrp - product.specialPrice) / product.mrp) * 100);
  const randomRating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addToCart(product);
      toast({
        title: "🎉 Added to cart!",
        description: `${product.name} is ready for checkout.`,
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist!",
      description: isWishlisted
        ? `${product.name} removed from your wishlist.`
        : `${product.name} saved for later.`,
    });
  };

  return (
    <Card
      className="group bg-white rounded-3xl border-4 border-playful-foreground shadow-2d hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 flex-grow">
        {/* Product Image */}
        <Link href={productHref}>
          <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-playful-foreground bg-playful-accent/20 cursor-pointer group/image">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-playful-accent/10 animate-pulse rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-playful-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={(product as any).image || (product.images && product.images[0]) || '/placeholder.svg'}
              alt={product.name}
              className={`w-full h-48 object-contain transition-all duration-500 p-4 ${imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
                }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Badges */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white font-bold border-2 border-white shadow-lg animate-pulse">
                {discountPercentage}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2 border-2 border-white shadow-lg">
                Out of Stock
              </Badge>
            )}

            {/* Quick Action Buttons - Enhanced for mobile */}
            <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${isHovered && product.inStock ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 md:opacity-100 md:translate-x-0'
              }`}>
              <Button
                size="sm"
                variant="outline"
                className="p-2 bg-white/90 hover:bg-white border-2 shadow-lg touch-manipulation active:scale-95 transition-transform"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist();
                }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-playful-foreground'
                    }`}
                />
              </Button>
              <Link href={productHref}>
                <Button
                  size="sm"
                  variant="outline"
                  className="p-2 bg-white/90 hover:bg-white border-2 shadow-lg touch-manipulation active:scale-95 transition-transform"
                >
                  <Eye className="h-4 w-4 text-playful-foreground" />
                </Button>
              </Link>
            </div>

            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-playful-primary/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`} />
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-3 flex-grow flex flex-col">
          <Link href={productHref} className="flex-grow">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 text-playful-foreground hover:text-playful-primary transition-colors cursor-pointer min-h-[3.5rem] flex items-start">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < randomRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <span className="text-sm text-playful-foreground/70">
              ({Math.floor(Math.random() * 50) + 10})
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-playful-primary">
                ₹{product.specialPrice.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.specialPrice && (
                <span className="text-sm text-playful-foreground/50 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Save ₹{(product.mrp - product.specialPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {product.category}
            </Badge>
            {product.subcategory && (
              <Badge variant="outline" className="text-xs px-2 py-1">
                {product.subcategory}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button
            className={`w-full text-md shadow-2d hover:shadow-lg transition-all transform hover:-translate-y-1 touch-manipulation active:scale-95 min-h-[44px] ${isAddingToCart ? 'bg-green-500 hover:bg-green-600' : ''
              }`}
            disabled={!product.inStock || isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? (
              <>
                <div className="h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
                <span className="sm:hidden">Adding</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                <span className="sm:hidden">{product.inStock ? 'Add' : 'Unavailable'}</span>
              </>
            )}
          </Button>

          {/* Quick View Button */}
          <div className="flex gap-2">
            <Link href={productHref} className="flex-1">
              <Button
                variant="outline"
                className="w-full text-sm border-2 border-playful-foreground hover:bg-playful-accent/20 transition-all touch-manipulation active:scale-95 min-h-[40px]"
              >
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Quick View</span>
                <span className="sm:hidden">View</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="border-2 border-playful-foreground hover:bg-playful-accent/20 transition-all touch-manipulation active:scale-95 min-h-[40px] min-w-[40px]"
              onClick={toggleWishlist}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-playful-foreground'
                  }`}
              />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;