"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Shirt, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const toysImage = { src: "/assets/toys-category.jpg" };
const clothingImage = { src: "/assets/clothing-category.jpg" };
const careImage = { src: "/assets/care-category.jpg" };

const categories = [
  {
    id: 1,
    title: "Toys & Games",
    description: "Fun toys for every age!",
    image: toysImage,
    icon: Baby,
    category: "Toys",
    bgColor: "bg-playful-primary",
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Comfy and stylish wear.",
    image: clothingImage,
    icon: Shirt,
    category: "Clothing",
    bgColor: "bg-playful-secondary",
  },
  {
    id: 3,
    title: "Baby Care",
    description: "Gentle care for your baby.",
    image: careImage,
    icon: Heart,
    category: "Care",
    bgColor: "bg-playful-accent",
  },
];

const Collections = () => {
  return (
    <div className="min-h-screen bg-playful-base font-fredoka">
      <Header />

      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-playful-primary animate-jump">
              Our Fun Collections
            </h1>
            <p className="text-playful-dark text-lg md:text-xl max-w-2xl mx-auto mt-4">
              Explore our happy collections, picked with love for your little star!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.category)}`}
                className="group bg-white rounded-2xl border-2 border-black shadow-2d hover:shadow-2d-hover transform hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative h-56">
                  <Image
                    src={category.image.src}
                    alt={`${category.title} - ${category.description}`}
                    width={400}
                    height={224}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 p-3 rounded-full text-white ${category.bgColor} animate-wiggle`}>
                    <category.icon className="h-7 w-7" />
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-playful-primary mb-2">
                      {category.title}
                    </h3>
                    <p className="text-playful-dark mb-4">
                      {category.description}
                    </p>
                  </div>
                  <Button variant="playful" size="lg" className="w-full mt-4">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 md:mt-24 bg-gradient-to-br from-playful-secondary to-playful-accent rounded-2xl border-2 border-black shadow-2d p-8 md:p-12 text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <h2 className="text-4xl font-bold mb-4">New Parent Essentials!</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Everything you need for your baby's first year, from sleepy time to playtime. Made by parents, for parents!
            </p>
            <Link href="/products">
              <Button variant="playful" size="xl" className="bg-white text-playful-primary hover:bg-gray-100">
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;