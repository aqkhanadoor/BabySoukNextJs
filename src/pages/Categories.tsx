"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ToyBrick, Shirt, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toysImage from "@/assets/toys-category.jpg";
import clothingImage from "@/assets/clothing-category.jpg";
import careImage from "@/assets/care-category.jpg";

const categories = [
  {
    id: 1,
    title: "Toys & Games",
    description: "Fun toys that spark imagination!",
    image: toysImage,
    icon: ToyBrick,
    color: "bg-playful-primary",
    items: "500+ Products",
    category: "Toys",
    subcategories: ["Educational", "Plushies", "Music", "Blocks"]
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Comfy and cute wear for your little one.",
    image: clothingImage,
    icon: Shirt,
    color: "bg-playful-secondary",
    items: "300+ Products",
    category: "Clothing",
    subcategories: ["Onesies", "Sleepwear", "Outfits", "Socks"]
  },
  {
    id: 3,
    title: "Baby Care",
    description: "Gentle products for happy babies.",
    image: careImage,
    icon: Heart,
    color: "bg-playful-accent",
    items: "200+ Products",
    category: "Care",
    subcategories: ["Bath Time", "Health", "Feeding", "Diapers"]
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-playful-base font-fredoka">
      <Header />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-playful-primary mb-6 animate-jump">
              What are you looking for?
            </h1>
            <p className="text-playful-dark text-lg max-w-2xl mx-auto">
              We've sorted all our goodies into these fun categories. Happy hunting!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group bg-white rounded-2xl border-2 border-black shadow-2d overflow-hidden transition-transform duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={category.image.src}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <div className={`absolute top-4 right-4 p-3 rounded-xl shadow-2d border-2 border-black ${category.color} group-hover:animate-shake`}>
                    <category.icon className="h-7 w-7 text-white" />
                  </div>

                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-4xl font-bold text-white">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-playful-dark mb-4">{category.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs font-bold bg-playful-base border-2 border-black/20 px-3 py-1 rounded-full text-playful-dark"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link href={`/products?category=${encodeURIComponent(category.category)}`}>
                      <Button
                        variant="playful"
                        size="lg"
                        className="w-full group/btn"
                      >
                        Explore {category.title}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-playful-secondary to-playful-accent rounded-2xl border-2 border-black shadow-2d p-8 md:p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4 animate-bounce">Can't Decide?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              No worries! Just jump into our full treasure chest of products and find your new favorite thing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="playful" size="lg" className="bg-white text-playful-primary hover:bg-gray-100 hover:animate-wiggle">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-playful-primary">
                  Browse Collections
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;