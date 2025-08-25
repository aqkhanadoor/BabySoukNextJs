import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercentage = Math.round(((product.mrp - product.specialPrice) / product.mrp) * 100);

  return (
    <Card className="group hover:shadow-playful transition-all duration-300 hover:-translate-y-1 bg-card border border-border/50">
      <CardContent className="p-4">
        {/* Product Image */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-subtle">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-baby-orange text-foreground font-bold">
              {discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground">
            {product.name}
          </h3>
          
          {/* Price Section */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              ₹{product.specialPrice}
            </span>
            {product.mrp > product.specialPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1 group-hover:border-primary transition-colors"
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button 
            variant="default" 
            className="flex-1"
            disabled={!product.inStock}
          >
            <Zap className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;