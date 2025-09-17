"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, SlidersHorizontal, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/config/categories";
import { type Product } from "@/types/product";
import { db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ref = dbRef(db, "products");
    const unsub = onValue(ref, (snap) => {
      const val = snap.val() as Record<string, any> | null;
      if (!val) {
        setRemoteProducts([]);
        setLoaded(true);
        return;
      }
      const mapped: Product[] = Object.entries(val).map(([key, p]) => {
        const price = Number(p.price ?? 0);
        const dr = typeof p.discountRate === 'number' ? p.discountRate : 0;
        const mrp = price;
        const specialPrice = dr ? Math.round(price * (100 - dr) / 100) : price;
        const images = Array.isArray(p.images) && p.images.length ? p.images : ["/placeholder.svg"];
        const createdAtNum = typeof p.createdAt === 'number' ? p.createdAt : 0;
        const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        return {
          id: key,
          slug: p.slug,
          name: p.name,
          mrp,
          specialPrice,
          images,
          description: p.description || '',
          category: p.category || 'Misc',
          subcategory: p.subcategory || '',
          inStock: typeof p.stock === 'number' ? p.stock > 0 : true,
          dateAdded: dateStr,
          colors: p.colors,
          sizes: p.sizes,
          tags: p.tags,
        } as Product;
      });
      setRemoteProducts(mapped);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const queryFromUrl = searchParams.get("q");
    const categoryFromUrl = searchParams.get("category");
    if (queryFromUrl) {
      setSearchTerm(queryFromUrl);
    }
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const updateSearchParams = (newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSearchTerm) {
      newParams.set("q", newSearchTerm);
    } else {
      newParams.delete("q");
    }
    router.push(`/search?${newParams.toString()}`);
  };

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  const searchResults = useMemo(() => {
    let filtered = remoteProducts.filter(product => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.subcategory.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (selectedSubcategory !== "all" && product.subcategory !== selectedSubcategory) return false;

      if (priceRange !== "all") {
        const price = product.specialPrice;
        switch (priceRange) {
          case "0-500": return price <= 500;
          case "500-1000": return price > 500 && price <= 1000;
          case "1000-2000": return price > 1000 && price <= 2000;
          case "2000+": return price > 2000;
          default: return true;
        }
      }
      return true;
    });

    switch (sortBy) {
      case "price-low": return filtered.sort((a, b) => a.specialPrice - b.specialPrice);
      case "price-high": return filtered.sort((a, b) => b.specialPrice - a.specialPrice);
      case "newest": return filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      default:
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return filtered.sort((a, b) => {
            const aScore = (a.name.toLowerCase().includes(searchLower) ? 2 : 0) + (a.category.toLowerCase().includes(searchLower) ? 1 : 0);
            const bScore = (b.name.toLowerCase().includes(searchLower) ? 2 : 0) + (b.category.toLowerCase().includes(searchLower) ? 1 : 0);
            return bScore - aScore;
          });
        }
        return filtered;
    }
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy, remoteProducts]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setPriceRange("all");
    setSortBy("relevance");
  };

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedSubcategory !== "all",
    priceRange !== "all"
  ].filter(Boolean).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams(searchTerm);
  };

  return (
    <div className="min-h-screen bg-playful-base font-fredoka">
      <Header />

      <main className="py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-playful-primary animate-jump">
                  {searchTerm ? `Results for "${searchTerm}"` : "Search Our Toys!"}
                </h1>
                <p className="text-playful-dark mt-2">
                  {loaded ? `${searchResults.length} happy product${searchResults.length !== 1 ? 's' : ''} found!` : 'Loading results...'}
                </p>
              </div>

              <Button
                variant="playful"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-playful-primary h-6 w-6" />
                <Input
                  type="text"
                  placeholder="Search for fun things..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-28 py-3 text-lg h-14 rounded-xl border-2 border-black shadow-2d focus:shadow-2d-hover"
                />
                <Button type="submit" size="lg" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>
          </div>

          <div className={`bg-white rounded-2xl border-2 border-black shadow-2d p-6 mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-5 w-5 text-playful-primary" />
                <span className="font-bold text-xl text-playful-primary">Filter Results</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); setSelectedSubcategory("all"); }}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="All Categories" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                {availableSubcategories.length > 0 && (
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger className="h-12 text-base"><SelectValue placeholder="All Subcategories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {availableSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Price Range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                    <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                    <SelectItem value="1000-2000">₹1000 - ₹2000</SelectItem>
                    <SelectItem value="2000+">₹2000+</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Sort By" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-dashed mt-4">
                  <div className="flex items-center gap-4 w-full">
                    <span className="font-bold">Active Filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== "all" && <Badge variant="playful" className="gap-1">Category: {selectedCategory} <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedCategory("all")} /></Badge>}
                      {selectedSubcategory !== "all" && <Badge variant="playful" className="gap-1">Sub: {selectedSubcategory} <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedSubcategory("all")} /></Badge>}
                      {priceRange !== "all" && <Badge variant="playful" className="gap-1">Price: ₹{priceRange.replace("-", "-₹")} <X className="h-4 w-4 cursor-pointer" onClick={() => setPriceRange("all")} /></Badge>}
                    </div>
                    <Button variant="ghost" onClick={clearFilters} className="ml-auto whitespace-nowrap text-sm">
                      <X className="h-4 w-4 mr-1" /> Clear All
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {loaded && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {searchResults.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : loaded ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-black shadow-2d">
              <Frown className="w-24 h-24 mx-auto text-playful-secondary animate-bounce" />
              <h3 className="text-3xl font-bold text-playful-primary mt-6">
                Oh no! No results found.
              </h3>
              <p className="text-playful-dark mt-2 mb-6">
                Try a different search word or change your filters!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["toys", "clothes", "diapers", "stroller"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="lg"
                    onClick={() => { setSearchTerm(suggestion); updateSearchParams(suggestion); }}
                  >
                    Search "{suggestion}"
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" aria-label="Loading search results">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl border-2 border-black shadow-2d animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;