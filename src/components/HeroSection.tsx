import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] bg-gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-bounce-gentle">
          <Star className="h-8 w-8 text-baby-yellow" />
        </div>
        <div className="absolute top-20 right-20 animate-pulse-soft">
          <Gift className="h-10 w-10 text-baby-pink" />
        </div>
        <div className="absolute bottom-20 left-20 animate-wiggle">
          <Star className="h-6 w-6 text-baby-blue" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Welcome to
              <span className="block text-baby-yellow animate-pulse-soft">
                Baby Souk
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Discover the magical world of baby essentials! From adorable toys to 
              comfortable clothing and essential care products - everything your little 
              one needs is right here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/products">
                <Button variant="hero" size="xl" className="group">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center md:justify-start text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-baby-yellow rounded-full"></div>
                <span>Safe & Certified Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-baby-blue rounded-full"></div>
                <span>Free Home Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-baby-green rounded-full"></div>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-playful transform hover:scale-105 transition-transform duration-300">
              <img
                src={heroBanner}
                alt="Baby products and toys"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-baby-pink text-white px-4 py-2 rounded-full shadow-button animate-bounce-gentle">
              <span className="text-sm font-bold">New Arrivals!</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-baby-yellow text-foreground px-4 py-2 rounded-full shadow-button animate-pulse-soft">
              <span className="text-sm font-bold">Best Prices!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;