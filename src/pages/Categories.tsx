import { Button } from "@/components/ui/button";
import { ArrowRight, Baby, Shirt, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import toysImage from "@/assets/toys-category.jpg";
import clothingImage from "@/assets/clothing-category.jpg";
import careImage from "@/assets/care-category.jpg";

const categories = [
  {
    id: 1,
    title: "Toys & Games",
    description: "Educational and fun toys that spark imagination and creativity",
    image: toysImage,
    icon: Baby,
    color: "baby-pink",
    items: "500+ Products",
    category: "Toys",
    subcategories: ["Educational Toys", "Plush Toys", "Musical Toys", "Building Blocks"]
  },
  {
    id: 2,
    title: "Baby Clothing",
    description: "Soft, comfortable and stylish wear for your little one",
    image: clothingImage,
    icon: Shirt,
    color: "baby-blue",
    items: "300+ Products",
    category: "Clothing",
    subcategories: ["Onesies", "Sleepwear", "Outerwear", "Accessories"]
  },
  {
    id: 3,
    title: "Baby Care",
    description: "Essential care products for your baby's health and hygiene",
    image: careImage,
    icon: Heart,
    color: "baby-green",
    items: "200+ Products",
    category: "Care",
    subcategories: ["Bath & Body", "Health Care", "Feeding", "Diapering"]
  },
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16 bg-gradient-to-br from-background to-baby-pink/5">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-baby-pink/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-baby-pink" />
              <span className="text-sm font-medium text-baby-pink">Shop by Category</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Browse Our Categories
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Discover our carefully organized collections of baby products. Each category is thoughtfully 
              curated to help you find exactly what your little one needs, from toys that inspire learning 
              to clothes that provide comfort.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-playful transition-all duration-500 transform hover:-translate-y-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Category icon */}
                  <div className={`absolute top-4 right-4 bg-${category.color} p-3 rounded-full shadow-button group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Items count */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-semibold text-foreground">{category.items}</span>
                  </div>

                  {/* Category title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Subcategories */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Popular in this category:</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link to={`/products?category=${encodeURIComponent(category.category)}`}>
                    <Button 
                      variant="outline" 
                      className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Explore {category.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Browse our complete product catalog with advanced filtering options to find 
              the perfect items for your baby.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button variant="secondary" size="lg" className="hover-scale">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
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