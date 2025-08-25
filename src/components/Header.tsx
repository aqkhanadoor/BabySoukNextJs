import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full bg-background shadow-card sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-gradient-hero text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>C.P Complex, Agastiamuzhi, Mukkam, Kerala 673572</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>7907943740</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Free Delivery on Orders Above ₹999</span>
          </div>
        </div>
      </div>

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
                <span className="absolute -top-1 -right-1 bg-baby-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
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
            <Button variant="ghost" className="text-base font-medium">
              Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="ghost" className="text-base font-medium">
              Products
            </Button>
          </Link>
          <Button variant="ghost" className="text-base font-medium">
            Toys
          </Button>
          <Button variant="ghost" className="text-base font-medium">
            Clothing
          </Button>
          <Button variant="ghost" className="text-base font-medium">
            Baby Care
          </Button>
          <Button variant="ghost" className="text-base font-medium">
            Feeding
          </Button>
          <Button variant="ghost" className="text-base font-medium">
            Furniture
          </Button>
          <Button variant="ghost" className="text-base font-medium">
            Sale
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;