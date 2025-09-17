"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
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

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group bg-white rounded-3xl border-4 border-playful-foreground shadow-2d hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <CardContent className="p-4 flex-grow">
        {/* Product Image */}
        <Link href={productHref}>
          <div className="relative mb-4 overflow-hidden rounded-2xl border-2 border-playful-foreground bg-playful-accent/20 cursor-pointer">
            <img
              src={(product as any).image || (product.images && product.images[0]) || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300 p-4"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-playful-primary text-white font-bold border-2 border-playful-foreground shadow-2d">
                {discountPercentage}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-2 right-2 border-2 border-playful-foreground shadow-2d">
                Out of Stock
              </Badge>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2 flex-grow flex flex-col">
          <Link href={productHref} className="flex-grow">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 text-playful-foreground hover:text-playful-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-3xl font-bold text-playful-primary">
              ₹{product.specialPrice}
            </span>
            {product.mrp > product.specialPrice && (
              <span className="text-md text-playful-foreground/50 line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Action Button */}
        <Button
          className="w-full text-md shadow-2d hover:shadow-none transition-all transform hover:-translate-y-1"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;