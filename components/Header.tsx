"use client";

import AnimatedLogo from "./AnimatedLogo";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { categories } from "@/config/categories";
import { cn } from "@/lib/utils";
import React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Safe cart usage - always call hooks at the top level
  const defaultCartState = { items: [], total: 0, itemCount: 0 };

  // Always call useCart hook, but handle potential errors in the component
  const cartContext = useCart();
  const cartState = cartContext?.state || defaultCartState;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-playful-background border-b-4 border-playful-foreground shadow-2d sticky top-0 z-50 overflow-x-hidden">
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-3 w-full max-w-full">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between">
          {/* Mobile Menu Button - Left */}
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-playful-accent/20">
            <Menu className="h-6 w-6 text-playful-foreground animate-jump" />
          </Button>

          {/* Logo - Center */}
          <Link href="/">
            <AnimatedLogo />
          </Link>

          {/* Enhanced Mobile Cart - Right */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-playful-accent/20 group">
              <ShoppingCart className="h-6 w-6 text-playful-foreground animate-float group-hover:text-playful-primary transition-colors" />
              {isClient && cartState.itemCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-playful-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-playful-background animate-bounce font-bold">
                    {cartState.itemCount > 9 ? "9+" : cartState.itemCount}
                  </span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-playful-primary/20 rounded-full animate-ping"></span>
                </>
              )}
            </Button>
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <AnimatedLogo />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/">
                    <Button variant="ghost" className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl">
                      Home
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/products">
                    <Button variant="ghost" className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl">
                      Products
                    </Button>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl bg-transparent focus:bg-playful-accent/20 data-[state=open]:bg-playful-accent/20">
                    <Link href="/categories" className="w-full h-full flex items-center">Collections</Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[90vw] max-w-[600px] grid-cols-1 md:grid-cols-2">
                      {categories.map((category) => (
                        <ListItem
                          key={category.name}
                          title={category.name}
                          href={`/products?category=${category.name}`}
                        >
                          {category.subcategories.slice(0, 3).join(", ")}{category.subcategories.length > 3 ? "..." : ""}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${isSearchFocused ? "text-playful-primary" : "text-playful-foreground/50"
                }`} />
              <input
                type="text"
                placeholder="Search toys, clothes, care products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full pl-12 pr-16 py-3 border-2 rounded-full bg-white shadow-2d transition-all duration-300 focus:outline-none ${isSearchFocused
                  ? "border-playful-primary focus:ring-4 focus:ring-playful-primary/30 focus:shadow-lg transform scale-105"
                  : "border-playful-foreground hover:border-playful-primary/50 focus:shadow-none"
                  }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 hover:text-playful-primary transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-playful-primary text-white p-2 rounded-full hover:bg-playful-primary/90 transition-all hover:scale-110 shadow-sm"
                disabled={!searchTerm.trim()}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Enhanced Cart Icon */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-playful-accent/20 group transition-all hover:scale-110">
              <ShoppingCart className="h-7 w-7 text-playful-foreground animate-float group-hover:text-playful-primary transition-colors" />
              {isClient && cartState.itemCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-playful-primary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-playful-background animate-bounce font-bold shadow-lg">
                    {cartState.itemCount > 99 ? "99+" : cartState.itemCount}
                  </span>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-playful-primary/20 rounded-full animate-ping"></span>
                </>
              )}
              {isClient && cartState.itemCount === 0 && (
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-playful-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Cart is empty
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden" onClick={toggleMobileMenu}>
          <div
            className="fixed left-0 top-0 h-full w-[80vw] max-w-sm bg-playful-background border-r-4 border-playful-foreground shadow-2xl animate-slide-in-right overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-playful-foreground">
              <Link href="/" onClick={toggleMobileMenu}>
                <AnimatedLogo />
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-playful-accent/20">
                <X className="h-6 w-6 text-playful-foreground" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col p-4 space-y-2">
              <Link href="/" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Home
                </Button>
              </Link>
              <Link href="/products" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Products
                </Button>
              </Link>
              <Link href="/categories" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Collections
                </Button>
              </Link>

              {/* Enhanced Mobile Search */}
              <form onSubmit={handleMobileSearch} className="pt-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search toys, clothes, care..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-16 py-3 border-2 border-playful-foreground rounded-full focus:outline-none focus:ring-4 focus:ring-playful-primary/30 bg-white shadow-2d focus:border-playful-primary"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 hover:text-playful-primary transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-playful-primary text-white p-2 rounded-full hover:bg-playful-primary/90 transition-all disabled:opacity-50"
                    disabled={!searchTerm.trim()}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;