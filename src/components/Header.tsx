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
              <h1 className="text-3xl font-bold bg-gradient-rainbow bg-clip-text text-transparent animate-pulse-soft hover:scale-105 transition-transform cursor-pointer">
                Baby Souk
              </h1>
            </Link>
            <div className="ml-2 text-xs text-muted-foreground">
              Your Little One's Paradise
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search for toys, clothes, baby care..."
                className="w-full pl-10 pr-4 py-3 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-card"
              />
            </div>
          </div>

          {/* Action buttons */}
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

        {/* Navigation menu */}
        <nav className="hidden md:flex mt-4 space-x-8">
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
          <Link to="/collections">
            <Button variant="ghost" className="text-base font-medium hover:text-primary transition-colors">
              Collections
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;