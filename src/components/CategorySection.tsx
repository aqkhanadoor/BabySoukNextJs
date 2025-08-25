import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Shirt, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import toysImage from "@/assets/toys-category.jpg";
import clothingImage from "@/assets/clothing-category.jpg";
import careImage from "@/assets/care-category.jpg";

const categories = [
  {
    id: 1,
    title: "Toys & Games",
    description: "Educational and fun toys for every age",
    image: toysImage,
    icon: Baby,
    color: "baby-pink",
    items: "500+ Products",
    category: "Toys"
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Soft, comfortable and stylish wear",
    image: clothingImage,
    icon: Shirt,
    color: "baby-blue",
    items: "300+ Products",
    category: "Clothing"
  },
  {
    id: 3,
    title: "Baby Care",
    description: "Essential care products for your baby",
    image: careImage,
    icon: Heart,
    color: "baby-green",
    items: "200+ Products",
    category: "Care"
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our carefully curated collections designed to meet all your baby's needs
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.category)}`}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-playful transition-all duration-300 transform hover:-translate-y-2 block"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category icon */}
                <div className={`absolute top-4 right-4 bg-${category.color} p-3 rounded-full shadow-button`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>

                {/* Items count */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-foreground">{category.items}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <Button variant="ghost" className="group/btn p-0 h-auto text-primary hover:text-primary">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

        {/* View all categories button */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;