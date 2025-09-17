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
    <section className="relative min-h-[500px] md:min-h-[600px] bg-playful-secondary/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-50">
        <Sparkles className="absolute top-10 left-10 h-12 w-12 text-playful-primary/50 animate-ping" />
        <Star className="absolute top-20 right-20 h-16 w-16 text-playful-accent/50 animate-spin-slow" />
        <Gift className="absolute bottom-20 left-20 h-14 w-14 text-playful-primary/50 animate-bounce-gentle" />
        <Sparkles className="absolute bottom-10 right-10 h-12 w-12 text-playful-accent/50 animate-ping" />
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
                  {/* Text content */}
                  <div className="text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold text-playful-foreground mb-6 leading-tight drop-shadow-lg">
                      {slide.title}
                      <span className="block text-playful-primary animate-jump">
                        {slide.highlight}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-playful-foreground/80 mb-8 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex justify-center md:justify-start">
                      <Link href={slide.buttonLink}>
                        <Button size="xl" className="group text-lg shadow-2d hover:shadow-none transition-all transform hover:-translate-y-1">
                          {slide.buttonText}
                          <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative animate-float">
                    <div className="relative rounded-3xl overflow-hidden border-4 border-playful-foreground shadow-2d transform hover:scale-105 transition-transform duration-300 bg-playful-accent">
                      <img
                        src="/assets/hero-banner.jpg"
                        alt="Baby products and toys"
                        className="w-full h-auto object-cover rounded-2xl"
                      />
                    </div>
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