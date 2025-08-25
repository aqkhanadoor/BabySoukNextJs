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
    <header className="w-full bg-background shadow-card sticky top-0 z-50">
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between">
          {/* Mobile Menu Button - Left */}
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo - Center */}
          <Link to="/">
            <h1 className="text-xl font-bold bg-gradient-rainbow bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
              Baby Souk
            </h1>
          </Link>

          {/* Cart - Right */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-baby-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              <h1 className="text-2xl font-bold bg-gradient-rainbow bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                Baby Souk
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link to="/">
              <Button variant="ghost" className="text-base font-medium hover:text-primary transition-colors">
                Home
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="ghost" className="text-base font-medium hover:text-primary transition-colors">
                Products
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="ghost" className="text-base font-medium hover:text-primary transition-colors">
                Collections
              </Button>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-card"
              />
            </div>
          </form>

          {/* Cart Icon */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {state.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-baby-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={toggleMobileMenu}>
          <div 
            className="fixed left-0 top-0 h-full w-full bg-background shadow-2xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" onClick={toggleMobileMenu}>
                <h1 className="text-2xl font-bold bg-gradient-rainbow bg-clip-text text-transparent">
                  Baby Souk
                </h1>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Button>
              </Link>
              <Link to="/products" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-lg font-medium hover:text-primary transition-colors">
                  Products
                </Button>
              </Link>
              <Link to="/categories" onClick={toggleMobileMenu}>
                <Button variant="ghost" className="w-full justify-start text-lg font-medium hover:text-primary transition-colors">
                  Collections
                </Button>
              </Link>
              
              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="pt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
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