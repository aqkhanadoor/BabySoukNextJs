import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products as staticProducts, type Product } from "@/data/products";
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Wand2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";
import { memoryCache } from "@/lib/cache";
import { useWishlist } from "@/hooks/use-wishlist";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [remoteProduct, setRemoteProduct] = useState<Product | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { isInWishlist, toggleWishlist } = useWishlist(slug || '');

  useEffect(() => {
    if (!slug) return;

    const cacheKey = `product-${slug}`;
    const cached = memoryCache.get(cacheKey);
    if (cached) {
      setRemoteProduct(cached);
      setLoaded(true);
      return;
    }

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
        slug: p.slug,
        name: p.name,
        mrp,
        specialPrice,
        image,
        description: p.description || "",
        category: p.category || "Misc",
        subcategory: p.subcategory || "",
        inStock: typeof p.stock === "number" ? p.stock > 0 : true,
        dateAdded: dateStr,
        colors: p.colors,
        sizes: p.sizes,
      };
      setRemoteProduct(mapped);
      setLoaded(true);
      memoryCache.set(cacheKey, mapped);
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

  useEffect(() => {
    if (product) {
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        toast({
          title: "Please select a color",
          description: "You need to choose a color before adding to the cart.",
          variant: "destructive",
        });
        return;
      }
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        toast({
          title: "Please select a size",
          description: "You need to choose a size before adding to the cart.",
          variant: "destructive",
        });
        return;
      }
      addToCart(product, 1, selectedColor, selectedSize);
      toast({
        title: "Added to your treasure chest!",
        description: `${product.name} is now in your cart.`,
      });
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const shareText = `Check out this amazing product: ${product.name} for just ₹${product.specialPrice}!`;
    const shareData = {
      title: product.name,
      text: shareText,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing the love.",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing failed",
        description: "Could not share the product at this time.",
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-playful-background font-sans">
        <Header />
        <main className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-6 animate-bounce">🤔</div>
            <h1 className="text-4xl font-bold text-playful-foreground mb-4">Hmm, Nothing Here...</h1>
            <p className="text-lg text-playful-foreground/80 mb-8">
              The treasure you're looking for seems to have vanished!
            </p>
            <Link to="/products">
              <Button variant="default" size="lg">
                Back to All Treasures
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
    <div className="min-h-screen bg-playful-background font-sans">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-playful-foreground/80 mb-6">
            <Link to="/" className="hover:text-playful-primary font-semibold">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-playful-primary font-semibold">Products</Link>
            <span>/</span>
            <span className="text-playful-foreground font-bold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border-2 border-playful-foreground shadow-2d bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-contain"
                />
                {discountPercentage > 0 && (
                  <Badge className="absolute top-4 left-4 bg-playful-accent text-playful-accent-foreground font-bold text-lg px-3 py-1 animate-shake">
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
                  <Badge variant="playful">{product.category}</Badge>
                  <Badge variant="outline">{product.subcategory}</Badge>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-playful-foreground mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-sm text-playful-foreground/80">(4.8/5 • 156 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-5xl font-bold text-playful-primary">
                    ₹{product.specialPrice}
                  </span>
                  {product.mrp > product.specialPrice && (
                    <span className="text-2xl text-playful-foreground/50 line-through">
                      ₹{product.mrp}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span>In Stock & Ready to Ship!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 font-bold">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-playful-foreground mb-3">Available Colors</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <Button
                          key={color}
                          variant={selectedColor === color ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-playful-foreground mb-3">Available Sizes</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1 animate-wiggle"
                    disabled={!product.inStock}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="lg" className="hover:animate-shake" onClick={toggleWishlist}>
                    <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="lg" className="hover:animate-shake" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                  <div className="flex flex-col items-center gap-2 p-3 bg-playful-background rounded-lg border-2 border-dashed border-playful-foreground/20">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                    <span className="text-sm font-semibold">100% Safe & Tested</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-playful-background rounded-lg border-2 border-dashed border-playful-foreground/20">
                    <Truck className="h-8 w-8 text-blue-500" />
                    <span className="text-sm font-semibold">Fast & Free Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-3 bg-playful-background rounded-lg border-2 border-dashed border-playful-foreground/20">
                    <RotateCcw className="h-8 w-8 text-orange-500" />
                    <span className="text-sm font-semibold">Easy Peasy Returns</span>
                  </div>
                </div>

                <Separator className="border-2 border-dashed border-playful-foreground/20" />

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-playful-foreground mb-4 flex items-center gap-2">
                    <Wand2 className="text-playful-secondary" />
                    About this Treasure
                  </h3>
                  <p className="text-playful-foreground/80 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <Card className="mt-12">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-playful-foreground mb-4">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between py-2 border-b-2 border-dashed border-playful-foreground/20">
                  <span className="font-semibold">Category</span>
                  <span className="text-playful-foreground/80">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-dashed border-playful-foreground/20">
                  <span className="font-semibold">Subcategory</span>
                  <span className="text-playful-foreground/80">{product.subcategory}</span>
                </div>
                <div className="flex justify-between py-2 border-b-2 border-dashed border-playful-foreground/20">
                  <span className="font-semibold">Availability</span>
                  <span className={product.inStock ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
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