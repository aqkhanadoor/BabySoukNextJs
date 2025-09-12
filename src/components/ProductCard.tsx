import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { Link } from "react-router-dom";
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
    <Card className="group hover:shadow-playful transition-all duration-300 hover:-translate-y-1 bg-card border border-border/50">
      <CardContent className="p-4">
        {/* Product Image */}
        <Link to={productHref}>
          <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-subtle cursor-pointer">
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
        </Link>

        {/* Product Info */}
        <div className="space-y-2">
          <Link to={productHref}>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

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

          {/* Category */}
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.subcategory}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Action Button */}
        <Button
          variant="default"
          className="w-full group-hover:shadow-button transition-all"
          disabled={!product.inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;