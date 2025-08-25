import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const { state } = useCart();

  return (
    <header className="w-full bg-background shadow-card sticky top-0 z-50">
      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold bg-gradient-rainbow bg-clip-text text-transparent hover:scale-105 transition-transform cursor-pointer">
                Baby Souk
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
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
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-card"
              />
            </div>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
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
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;