import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";
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
import { products, categories } from "@/data/products";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Initialize search term from URL parameters
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

  // Update URL when search term changes
  const updateSearchParams = (newSearchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSearchTerm) {
      newParams.set("q", newSearchTerm);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams);
  };

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const category = categories.find(cat => cat.name === selectedCategory);
    return category?.subcategories || [];
  }, [selectedCategory]);

  // Filter and sort products based on search
  const searchResults = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter - check name, description, category, subcategory
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.subcategory.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
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
      case "relevance":
      default:
        // Simple relevance scoring based on search term matches in name vs description
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return filtered.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().includes(searchLower) ? 2 : 0;
            const aCategoryMatch = a.category.toLowerCase().includes(searchLower) ? 1 : 0;
            const bNameMatch = b.name.toLowerCase().includes(searchLower) ? 2 : 0;
            const bCategoryMatch = b.category.toLowerCase().includes(searchLower) ? 1 : 0;
            
            return (bNameMatch + bCategoryMatch) - (aNameMatch + aCategoryMatch);
          });
        }
        return filtered;
    }
  }, [searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setPriceRange("all");
    setSortBy("relevance");
  };

  const activeFiltersCount = [
    selectedCategory !== "all" ? selectedCategory : null,
    selectedSubcategory !== "all" ? selectedSubcategory : null,
    priceRange !== "all" ? priceRange : null
  ].filter(Boolean).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams(searchTerm);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {searchTerm ? `Search results for "${searchTerm}"` : "Search Products"}
                </h1>
                <p className="text-muted-foreground">
                  {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              
              {/* Mobile Filter Toggle */}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for toys, clothes, baby care..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-base"
                />
                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Filters Section */}
          <div className={`bg-card rounded-lg p-6 shadow-card mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Filter Results</span>
              </div>

              {/* Filter Row */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex flex-wrap gap-4 flex-1">
                  {/* Category Filter */}
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
                      <SelectItem value="relevance">Most Relevant</SelectItem>
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
                <div className="flex flex-wrap gap-2 pt-2 border-t">
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

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {searchTerm ? "No results found" : "Start searching"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}". Try different keywords or adjust your filters.`
                  : "Enter a search term to find products"
                }
              </p>
              {activeFiltersCount > 0 && (
                <Button onClick={clearFilters} variant="outline" className="mb-4">
                  Clear All Filters
                </Button>
              )}
              {searchTerm && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["toys", "clothing", "baby care", "feeding", "diapers"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm(suggestion);
                          updateSearchParams(suggestion);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Load More Button */}
          {searchResults.length > 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Results
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;