import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Shirt, Heart } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    title: "Toys & Games",
    description: "Fun toys for every age",
    image: "/assets/toys-category.jpg",
    icon: Baby,
    color: "bg-playful-primary",
    category: "Toys"
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Soft & stylish wear",
    image: "/assets/clothing-category.jpg",
    icon: Shirt,
    color: "bg-playful-secondary",
    category: "Clothing"
  },
  {
    id: 3,
    title: "Baby Care",
    description: "Essentials for your baby",
    image: "/assets/care-category.jpg",
    icon: Heart,
    color: "bg-playful-accent",
    category: "Care"
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-playful-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-playful-foreground mb-4 animate-jump">
            Shop by Category
          </h2>
          <p className="text-playful-foreground/80 text-lg max-w-2xl mx-auto">
            Discover our fun collections for all your baby's needs!
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.category)}`}
              className="group bg-white rounded-3xl border-4 border-playful-foreground shadow-2d hover:-translate-y-2 transition-transform duration-300 block"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl border-b-4 border-playful-foreground">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Category icon */}
                <div className={`absolute top-4 right-4 p-3 rounded-full shadow-2d border-2 border-playful-foreground ${category.color}`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-playful-foreground mb-2 group-hover:text-playful-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-playful-foreground/70 mb-4">
                  {category.description}
                </p>
                <Button variant="link" className="p-0 h-auto text-playful-primary hover:text-playful-accent font-bold group/btn">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Link>
          ))}
        </div>

        {/* View all categories button */}
        <div className="text-center mt-16">
          <Link href="/products">
            <Button size="lg" className="text-lg shadow-2d hover:shadow-none transition-all transform hover:-translate-y-1">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;