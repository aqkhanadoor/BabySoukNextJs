import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products as staticProducts, type Product } from "@/data/products";
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";

const ProductDetail = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const ref = dbRef(db, "products");
    const unsub = onValue(ref, (snap) => {
      const val = snap.val() as Record<string, any> | null;
      if (!val) {
        setRemoteProduct(null);
        setLoaded(true);
        return;
      }
      // Match by slug field (preferred) or key fallback
      let foundKey: string | null = null;
      const bySlug = Object.entries(val).find(([, v]) => v?.slug === slug);
      if (bySlug) {
        foundKey = bySlug[0];
      }
      if (!foundKey) {
        setRemoteProduct(null);
        setLoaded(true);
        return;
      }
      const p = val[foundKey];
      const price = Number(p.price ?? 0);
      const dr = typeof p.discountRate === "number" ? p.discountRate : 0;
      const mrp = price;
      const specialPrice = dr ? Math.round(price * (100 - dr) / 100) : price;
      const image = Array.isArray(p.images) && p.images[0] ? p.images[0] : "/placeholder.svg";
      const createdAtNum = typeof p.createdAt === "number" ? p.createdAt : 0;
      const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
      const mapped: Product = {
        id: foundKey,
        name: p.name,
        mrp,
        specialPrice,
        image,
        description: p.description || "",
        category: p.category || "Misc",
        subcategory: p.subcategory || "",
        inStock: typeof p.stock === "number" ? p.stock > 0 : true,
        dateAdded: dateStr,
      };
      setRemoteProduct(mapped);
      setLoaded(true);
    });
    return () => unsub();
  }, [slug]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const product = useMemo(() => {
    if (remoteProduct) return remoteProduct;
    if (!slug) return null;
    const bySlug = staticProducts.find(p => slugify(p.name) === slug);
    return bySlug || null;
  }, [remoteProduct, slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products">
              <Button variant="hero" size="lg">
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = Math.round(((product.mrp - product.specialPrice) / product.mrp) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Back Button */}
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-gradient-subtle">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-baby-orange text-foreground font-bold text-lg px-3 py-1">
                    {discountPercentage}% OFF
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-3 py-1">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant="outline">{product.subcategory}</Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.8/5 • 156 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    ₹{product.specialPrice}
                  </span>
                  {product.mrp > product.specialPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.mrp}
                    </span>
                  )}
                  {discountPercentage > 0 && (
                    <span className="text-lg font-semibold text-green-600">
                      Save ₹{product.mrp - product.specialPrice}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium">In Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Safe & Tested</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    <span>Easy Returns</span>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Product Description
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">Category</span>
                  <span className="text-muted-foreground">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">Subcategory</span>
                  <span className="text-muted-foreground">{product.subcategory}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">Product ID</span>
                  <span className="text-muted-foreground">BS-{product.id.padStart(4, '0')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="font-medium">Availability</span>
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;