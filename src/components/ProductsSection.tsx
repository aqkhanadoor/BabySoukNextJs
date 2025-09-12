import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { products as fallbackProducts, type Product } from "@/data/products";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";

type FBProductRecord = {
  name: string;
  price: number;
  discountRate?: number | null;
  category?: string;
  subcategory?: string | null;
  description?: string;
  images?: string[];
  createdAt?: number | Record<string, unknown>;
  stock?: number;
};

const ProductsSection = () => {
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ref = dbRef(db, "products");
    const unsub = onValue(ref, (snap) => {
      const val = snap.val() as Record<string, FBProductRecord> | null;
      if (!val) {
        setRemoteProducts([]);
        setLoaded(true);
        return;
      }
      const mapped = Object.entries(val)
        .map(([key, p]) => {
          const price = Number(p.price ?? 0);
          const dr = typeof p.discountRate === "number" ? p.discountRate : 0;
          const mrp = price;
          const specialPrice = dr ? Math.round(price * (100 - dr) / 100) : price;
          const image = Array.isArray(p.images) && p.images[0] ? p.images[0] : "/placeholder.svg";
          const createdAtNum = typeof p.createdAt === "number" ? p.createdAt : 0;
          const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
          const prod: Product & { _createdAt?: number } = {
            id: key,
            name: p.name,
            mrp,
            specialPrice,
            image,
            description: p.description || "",
            category: p.category || "Misc",
            subcategory: p.subcategory || "",
            inStock: typeof p.stock === "number" ? p.stock > 0 : true,
            dateAdded: dateStr,
            _createdAt: createdAtNum,
          } as any;
          return prod;
        })
        .sort((a: any, b: any) => (b._createdAt || 0) - (a._createdAt || 0))
        .map(({ _createdAt, ...rest }) => rest)
        .slice(0, 8);
      setRemoteProducts(mapped);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  const displayProducts = useMemo(() => {
    return remoteProducts.length > 0 ? remoteProducts : fallbackProducts.slice(0, 8);
  }, [remoteProducts]);

  return (
    <section className="py-16 px-4 bg-playful-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-playful-foreground mb-4 animate-wiggle">
            Our Favorite Finds
          </h2>
          <p className="text-lg text-playful-foreground/80 max-w-2xl mx-auto">
            Check out these super fun and safe products, picked just for you!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button size="lg" className="group text-lg shadow-2d hover:shadow-none transition-all transform hover:-translate-y-1">
              See More Stuff
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;