"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/LoadingSpinner";
import Breadcrumbs from "@/components/SEO/Breadcrumbs";
import StructuredData from "@/components/SEO/StructuredData";
import { categories } from "@/config/categories";
import { type Product, type ProductRecord } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { realtimeDb as db } from "@/lib/firebase";
import { onValue, ref as dbRef } from "firebase/database";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState("all");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [remoteProducts, setRemoteProducts] = useState<Product[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Initialize filters from URL parameters
    useEffect(() => {
        const categoryFromUrl = searchParams?.get("category");
        if (categoryFromUrl) {
            const matched = categories.find(c => c.name.toLowerCase() === categoryFromUrl.toLowerCase());
            if (matched) {
                setSelectedCategory(matched.name);
            }
        }
    }, [searchParams]);

    // Get subcategories for selected category
    const availableSubcategories = useMemo(() => {
        if (selectedCategory === "all") return [];
        const category = categories.find(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase());
        return category?.subcategories || [];
    }, [selectedCategory]);

    // Load products from Firebase
    useEffect(() => {
        const ref = dbRef(db, "products");
        const unsub = onValue(ref, (snap) => {
            const val = snap.val() as Record<string, ProductRecord> | null;
            if (!val) {
                setRemoteProducts([]);
                setLoaded(true);
                return;
            }
            const mapped: Product[] = Object.entries(val).map(([key, p]) => {
                const price = Number(p.price ?? 0);
                const dr = typeof p.discountRate === "number" ? p.discountRate : 0;
                const mrp = price;
                const specialPrice = dr && dr > 0 ? Math.round(price * (100 - dr) / 100) : price;
                const image = Array.isArray(p.images) && p.images[0] ? p.images[0] : "/placeholder.svg";
                const createdAtNum = typeof p.createdAt === "number" ? p.createdAt : 0;
                const dateStr = createdAtNum ? new Date(createdAtNum).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
                return {
                    id: key,
                    name: p.name || "Untitled Product",
                    mrp,
                    specialPrice,
                    images: Array.isArray(p.images) && p.images.length ? p.images : [image],
                    description: p.description || "",
                    category: p.category || "Misc",
                    subcategory: p.subcategory || "",
                    inStock: typeof p.stock === "number" ? p.stock > 0 : true,
                    dateAdded: dateStr,
                    colors: p.colors || [],
                    sizes: p.sizes || [],
                    tags: p.tags || [],
                    shortDescription: p.shortDescription || "",
                    brand: p.brand || null,
                    sku: p.sku || null,
                    seo: p.seo || undefined,
                    slug: p.slug || key
                };
            });
            mapped.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
            setRemoteProducts(mapped);
            setLoaded(true);
        });
        return () => unsub();
    }, []);

    const filteredProducts = useMemo(() => {
        let filtered = remoteProducts.filter(product => {
            if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                return false;
            }
            if (selectedCategory !== "all" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
                return false;
            }
            if (selectedSubcategory !== "all" && product.subcategory?.toLowerCase() !== selectedSubcategory.toLowerCase()) {
                return false;
            }
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
    }, [remoteProducts, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);

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

    // Generate structured data for products
    const productsSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Baby Products & Toys Collection",
        "description": "Browse premium baby products, toys, clothing, and care essentials at Baby Souk",
        "url": "https://babysouk.in/products",
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filteredProducts.length,
            "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "url": `https://babysouk.in/${product.category}/${product.slug || product.id}`,
                    "image": product.images?.[0] || '/placeholder.svg',
                    "offers": {
                        "@type": "Offer",
                        "price": product.specialPrice.toString(),
                        "priceCurrency": "INR"
                    }
                }
            }))
        }
    };

    const breadcrumbItems = [
        { name: 'Products', url: '/products', current: selectedCategory === 'all' }
    ];

    if (selectedCategory !== 'all') {
        breadcrumbItems.push({
            name: selectedCategory,
            url: `/products?category=${selectedCategory.toLowerCase()}`,
            current: selectedSubcategory === 'all'
        });
    }

    if (selectedSubcategory !== 'all') {
        breadcrumbItems.push({
            name: selectedSubcategory,
            url: `/products?category=${selectedCategory.toLowerCase()}&subcategory=${selectedSubcategory.toLowerCase()}`,
            current: true
        });
    }

    return (
        <>
            <StructuredData data={productsSchema} />

            <div className="min-h-screen bg-playful-background font-sans">
                <Header />
                <main className="py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Breadcrumbs */}
                        <Breadcrumbs items={breadcrumbItems} />

                        <div className="mb-8 text-center">
                            <h1 className="text-5xl md:text-6xl font-bold text-playful-foreground mb-4 animate-jump">
                                {selectedCategory !== 'all' ? `${selectedCategory} Collection` : 'All Our Treasures'}
                            </h1>
                            <p className="text-lg text-playful-foreground/80">
                                {loaded ? `Find everything your little one needs! (${filteredProducts.length} goodies found)` : 'Loading magical goodies…'}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border-2 border-playful-foreground shadow-2d p-6 mb-8">
                            <div className="flex flex-col gap-4">
                                <div className="relative max-w-md mx-auto w-full">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 h-5 w-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search for fun stuff..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 w-full"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    <div className="flex flex-wrap gap-4 flex-1 justify-center">
                                        <Select value={selectedCategory} onValueChange={(value) => {
                                            setSelectedCategory(value);
                                            setSelectedSubcategory("all");
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

                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="destructive"
                                            onClick={clearFilters}
                                            className="whitespace-nowrap w-full md:w-auto animate-shake"
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Clear Filters ({activeFiltersCount})
                                        </Button>
                                    )}
                                </div>

                                {activeFiltersCount > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-dashed border-playful-foreground/20">
                                        {searchTerm && (
                                            <Badge variant="playful" className="gap-1">
                                                Search: "{searchTerm}"
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:scale-125 transition-transform"
                                                    onClick={() => setSearchTerm("")}
                                                />
                                            </Badge>
                                        )}
                                        {selectedCategory !== "all" && (
                                            <Badge variant="playful" className="gap-1">
                                                Category: {selectedCategory}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:scale-125 transition-transform"
                                                    onClick={() => setSelectedCategory("all")}
                                                />
                                            </Badge>
                                        )}
                                        {selectedSubcategory !== "all" && (
                                            <Badge variant="playful" className="gap-1">
                                                Subcategory: {selectedSubcategory}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:scale-125 transition-transform"
                                                    onClick={() => setSelectedSubcategory("all")}
                                                />
                                            </Badge>
                                        )}
                                        {priceRange !== "all" && (
                                            <Badge variant="playful" className="gap-1">
                                                Price: ₹{priceRange.replace("-", " - ₹")}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:scale-125 transition-transform"
                                                    onClick={() => setPriceRange("all")}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {loaded && filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : loaded ? (
                            <div className="text-center py-16 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d">
                                <div className="text-6xl mb-4 animate-bounce">🧸</div>
                                <h3 className="text-3xl font-semibold text-playful-primary mb-2">Oops! No Treasures Here</h3>
                                <p className="text-playful-foreground/80 mb-6">
                                    Try changing your magical filters to find some!
                                </p>
                                <Button onClick={clearFilters} variant="default" size="lg">
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" aria-label="Loading products">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {loaded && filteredProducts.length > 0 && filteredProducts.length >= 12 && (
                            <div className="text-center mt-12">
                                <Button variant="outline" size="lg" className="animate-pulse">
                                    Load More Goodies
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
