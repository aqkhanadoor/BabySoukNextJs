"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Gift, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { HeroImage } from "@/components/SEO/OptimizedImage";

const HeroSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const heroSlides = [
    // Slide 1 - Main Hero
    {
      id: 1,
      title: "Welcome to",
      highlight: "Baby Souk",
      description: "A magical world of fun! Discover adorable toys, comfy clothes, and all the essentials your little one needs to play and grow.",
      buttonText: "Explore Now",
      buttonLink: "/products",
    },
    // Slide 2 - Special Offers
    {
      id: 2,
      title: "Super",
      highlight: "Deals",
      description: "Get amazing discounts on premium baby products! Up to 50% off on selected items. Limited time offer - don't miss out!",
      buttonText: "View Offers",
      buttonLink: "/products",
    },
    // Slide 3 - Flash Sale
    {
      id: 3,
      title: "Toy",
      highlight: "Parade",
      description: "Our biggest toy sale of the year! Find the perfect playmate for your child, from cuddly bears to creative building blocks.",
      buttonText: "Find a Friend",
      buttonLink: "/products?category=toys",
    }
  ];

  // Auto-swipe functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

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
    <section className="relative min-h-[600px] md:min-h-[700px] bg-gradient-to-br from-playful-secondary/30 via-playful-accent/20 to-playful-primary/10 overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 opacity-60">
        <Sparkles className="absolute top-10 left-10 h-12 w-12 text-playful-primary/60 animate-ping" />
        <Star className="absolute top-20 right-20 h-16 w-16 text-playful-accent/60 animate-spin-slow" />
        <Gift className="absolute bottom-20 left-20 h-14 w-14 text-playful-primary/60 animate-bounce-gentle" />
        <Sparkles className="absolute bottom-10 right-10 h-12 w-12 text-playful-accent/60 animate-ping" />

        {/* Additional floating elements */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-playful-primary/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-playful-accent/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-playful-secondary/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <Carousel
          className="w-full"
          opts={{ loop: true }}
          setApi={setApi}
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Enhanced Text content */}
                  <div className="text-center md:text-left space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-playful-primary/20 shadow-lg">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold text-playful-foreground">Trusted by 1000+ Happy Families</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-playful-foreground mb-6 leading-tight">
                      <span className="drop-shadow-lg">{slide.title}</span>
                      <span className="block text-playful-primary animate-jump drop-shadow-xl bg-gradient-to-r from-playful-primary via-playful-accent to-playful-primary bg-clip-text text-transparent">
                        {slide.highlight}
                      </span>
                    </h1>

                    <p className="text-lg md:text-xl text-playful-foreground/80 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                      {slide.description}
                    </p>

                    {/* Enhanced CTA section */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                      <Link href={slide.buttonLink}>
                        <Button size="xl" className="group text-lg shadow-2d hover:shadow-xl transition-all transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-r from-playful-primary to-playful-accent">
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>

                      {/* Secondary CTA */}
                      <div className="flex items-center gap-2 text-playful-foreground/70">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 border-2 border-white"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-white"></div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 border-2 border-white"></div>
                        </div>
                        <span className="text-sm font-medium">Join happy parents!</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-playful-primary">500+</div>
                        <div className="text-sm text-playful-foreground/70">Products</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-playful-primary">1000+</div>
                        <div className="text-sm text-playful-foreground/70">Happy Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-playful-primary">4.8★</div>
                        <div className="text-sm text-playful-foreground/70">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Image */}
                  <div className="relative animate-float">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-playful-primary/20 via-playful-accent/20 to-playful-secondary/20 rounded-3xl blur-xl transform scale-110"></div>

                    <div className="relative rounded-3xl overflow-hidden border-4 border-playful-foreground shadow-2xl transform hover:scale-105 transition-all duration-500 bg-gradient-to-br from-playful-accent/20 to-playful-primary/10">
                      <HeroImage
                        src="/assets/hero-banner.jpg"
                        alt="Happy babies playing with premium toys and baby products at Baby Souk - your trusted online baby store"
                        className="w-full h-auto object-cover rounded-2xl"
                      />

                      {/* Overlay with floating elements */}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-bounce">
                          <Gift className="h-6 w-6 text-playful-primary" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-pulse">
                          <Sparkles className="h-6 w-6 text-playful-accent" />
                        </div>
                      </div>
                    </div>

                    {/* Floating elements around image */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-playful-primary rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-playful-accent rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dot Indicators */}
        <div className="flex justify-center mt-12 gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 border-2 border-playful-foreground ${current === index
                ? "bg-playful-primary scale-125 shadow-2d"
                : "bg-white/50 hover:bg-playful-accent/50"
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