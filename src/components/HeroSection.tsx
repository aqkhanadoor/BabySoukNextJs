import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Gift, Percent, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const heroSlides = [
    // Slide 1 - Main Hero
    {
      id: 1,
      title: "Welcome to",
      highlight: "Baby Souk",
      description: "Discover the magical world of baby essentials! From adorable toys to comfortable clothing and essential care products - everything your little one needs is right here.",
      buttonText: "Shop Now",
      buttonLink: "/products",
      badge1: { text: "New Arrivals!", bg: "bg-baby-pink", position: "-top-4 -right-4" },
      badge2: { text: "Best Prices!", bg: "bg-baby-yellow", position: "-bottom-4 -left-4" },
      features: [
        { text: "Safe & Certified Products", color: "bg-baby-yellow" },
        { text: "Free Home Delivery", color: "bg-baby-blue" },
        { text: "Easy Returns", color: "bg-baby-green" }
      ]
    },
    // Slide 2 - Special Offers
    {
      id: 2,
      title: "Special",
      highlight: "Offers",
      description: "Get amazing discounts on premium baby products! Up to 50% off on selected items. Limited time offer - don't miss out on these incredible deals!",
      buttonText: "View Offers",
      buttonLink: "/products",
      badge1: { text: "50% OFF", bg: "bg-baby-green", position: "-top-4 -right-4" },
      badge2: { text: "Limited Time!", bg: "bg-baby-pink", position: "-bottom-4 -left-4" },
      features: [
        { text: "Up to 50% Discount", color: "bg-baby-pink" },
        { text: "Premium Quality", color: "bg-baby-green" },
        { text: "Limited Stock", color: "bg-baby-yellow" }
      ]
    },
    // Slide 3 - Flash Sale
    {
      id: 3,
      title: "Flash",
      highlight: "Sale",
      description: "24-hour flash sale on baby essentials! Huge savings on toys, clothing, and care products. Grab your favorites before they're gone!",
      buttonText: "Shop Sale",
      buttonLink: "/products",
      badge1: { text: "24H Only!", bg: "bg-baby-blue", position: "-top-4 -right-4" },
      badge2: { text: "Huge Savings!", bg: "bg-baby-green", position: "-bottom-4 -left-4" },
      features: [
        { text: "24 Hour Sale", color: "bg-baby-blue" },
        { text: "Huge Discounts", color: "bg-baby-pink" },
        { text: "Fast Checkout", color: "bg-baby-green" }
      ]
    }
  ];

  // Auto-swipe functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

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
        <Carousel 
          className="w-full" 
          opts={{ loop: true }}
          setApi={setApi}
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Text content */}
                  <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                      {slide.title}
                      <span className="block text-baby-yellow animate-pulse-soft">
                        {slide.highlight}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link to={slide.buttonLink}>
                        <Button variant="hero" size="xl" className="group">
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Features */}
                    <div className="mt-8 flex flex-wrap gap-6 justify-center md:justify-start text-sm text-primary-foreground/80">
                      {slide.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                          <span>{feature.text}</span>
                        </div>
                      ))}
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
                    <div className={`absolute ${slide.badge1.position} ${slide.badge1.bg} text-white px-4 py-2 rounded-full shadow-button animate-bounce-gentle`}>
                      <span className="text-sm font-bold">{slide.badge1.text}</span>
                    </div>
                    <div className={`absolute ${slide.badge2.position} ${slide.badge2.bg} text-foreground px-4 py-2 rounded-full shadow-button animate-pulse-soft`}>
                      <span className="text-sm font-bold">{slide.badge2.text}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index
                  ? "bg-baby-yellow shadow-lg scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;