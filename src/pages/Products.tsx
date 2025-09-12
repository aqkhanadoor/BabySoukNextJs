import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts, categories, type Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
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

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  // Load products from Firebase
  useEffect(() => {
    const ref = dbRef(db, "products");
    const unsub = onValue(ref, (snap) => {
      const val = snap.val() as Record<string, FBProductRecord> | null;
      if (!val) {
        setRemoteProducts([]);
        setLoaded(true);
        return;
      }
      const mapped: Product[] = Object.entries(val).map(([key, p]) => {
        const price = Number(p.price ?? 0);
        const dr = typeof p.discountRate === "number" ? p.discountRate : 0;
        const mrp = price;
        const specialPrice = dr ? Math.round(price * (100 - dr) / 100) : price;
        const image = Array.isArray(p.images) && p.images[0] ? p.images[0] : "/placeholder.svg";
        const createdAtNum = typeof p.createdAt === "number" ? p.createdAt : 0;
        const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        return {
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
        };
      });
      // Sort newest first by createdAt (derived via dateAdded)
      mapped.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      setRemoteProducts(mapped);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  // Filter and sort products
  const dataSource: Product[] = remoteProducts.length > 0 ? remoteProducts : staticProducts;

  const filteredProducts = useMemo(() => {
    let filtered = dataSource.filter(product => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== "all" && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Price filter
      if (priceRange !== "all") {
        const price = product.specialPrice;
        switch (priceRange) {
          case "0-500":
            return price <= 500;
          case "500-1000":
            return price > 500 && price <= 1000;
          case "1000-2000":
            return price > 1000 && price <= 2000;
          case "2000+":
            return price > 2000;
          default:
            return true;
        }
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.specialPrice - b.specialPrice);
      case "price-high":
        return filtered.sort((a, b) => b.specialPrice - a.specialPrice);
      case "newest":
        return filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      case "featured":
      default:
        return filtered;
    }
  }, [dataSource, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setPriceRange("all");
    setSortBy("featured");
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedSubcategory !== "all" ? selectedSubcategory : null,
    priceRange !== "all" ? priceRange : null
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">All Products</h1>
            <p className="text-lg text-muted-foreground">
              Discover our complete collection of baby products ({filteredProducts.length} products)
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-card rounded-lg p-6 shadow-card mb-8">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Row */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex flex-wrap gap-4 flex-1">
                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedSubcategory("all"); // Reset subcategory when category changes
                  }}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Subcategory Filter */}
                  {availableSubcategories.length > 0 && (
                    <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subcategories</SelectItem>
                        {availableSubcategories.map(subcategory => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* Price Filter */}
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                      <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                      <SelectItem value="2000+">₹2000+</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort By */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="whitespace-nowrap"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters ({activeFiltersCount})
                  </Button>
                )}
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: "{searchTerm}"
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchTerm("")}
                      />
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {selectedCategory}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedCategory("all")}
                      />
                    </Badge>
                  )}
                  {selectedSubcategory !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Subcategory: {selectedSubcategory}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedSubcategory("all")}
                      />
                    </Badge>
                  )}
                  {priceRange !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Price: ₹{priceRange.replace("-", " - ₹")}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setPriceRange("all")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Load More Button - Show only if we have products and could potentially have more */}
          {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;