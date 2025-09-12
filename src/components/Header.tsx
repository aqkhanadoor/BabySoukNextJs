import AnimatedLogo from "./AnimatedLogo";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const Header = () => {
  const { state } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-playful-background border-b-4 border-playful-foreground shadow-2d sticky top-0 z-50">
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between">
          {/* Mobile Menu Button - Left */}
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-playful-accent/20">
            <Menu className="h-6 w-6 text-playful-foreground animate-jump" />
          </Button>

          {/* Logo - Center */}
          <Link to="/">
            <AnimatedLogo />
          </Link>

          {/* Cart - Right */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-playful-accent/20">
              <ShoppingCart className="h-6 w-6 text-playful-foreground animate-float" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-playful-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-playful-background animate-pulse-soft">
                  {state.itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <AnimatedLogo />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl">
                Home
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl">
                Products
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="ghost" className="text-lg font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-xl">
                Collections
              </Button>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for fun stuff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-playful-foreground rounded-full focus:outline-none focus:ring-4 focus:ring-playful-accent/50 bg-white shadow-2d transition-all focus:shadow-none"
              />
            </div>
          </form>

          {/* Cart Icon */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative hover:bg-playful-accent/20">
              <ShoppingCart className="h-7 w-7 text-playful-foreground animate-float" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-playful-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-playful-background animate-pulse-soft">
                  {state.itemCount}
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
            className="fixed left-0 top-0 h-full w-3/4 max-w-sm bg-playful-background border-r-4 border-playful-foreground shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b-4 border-playful-foreground">
              <Link to="/" onClick={toggleMobileMenu}>
                <AnimatedLogo />
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="hover:bg-playful-accent/20">
                <X className="h-6 w-6 text-playful-foreground" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col p-4 space-y-2">
              <Link to="/" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Home
                </Button>
              </Link>
              <Link to="/products" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Products
                </Button>
              </Link>
              <Link to="/categories" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-xl font-medium hover:bg-playful-accent/20 hover:text-playful-primary transition-colors rounded-lg py-6">
                  Collections
                </Button>
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="pt-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-playful-foreground/50 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-playful-foreground rounded-full focus:outline-none focus:ring-4 focus:ring-playful-accent/50 bg-white shadow-2d"
                  />
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