import { Shield, Truck, RotateCcw, Heart, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Certified",
    description: "All products are safety tested and certified for your peace of mind",
    color: "baby-pink"
  },
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free home delivery on orders above ₹999 across Kerala",
    color: "baby-blue"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days if you're not satisfied",
    color: "baby-green"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every product is chosen with care and love for your little one",
    color: "baby-purple"
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Premium quality products from trusted brands worldwide",
    color: "baby-orange"
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Fast processing and same-day delivery available in Mukkam",
    color: "baby-yellow"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Baby Souk?
          </h2>
          <p className="text-muted-foreground text-lg">
            We're committed to providing the best for your little ones
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl bg-card hover:bg-gradient-hero hover:text-primary-foreground transition-all duration-300 shadow-card hover:shadow-playful transform hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${feature.color} rounded-full mb-4 group-hover:bg-white/20 transition-colors duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary-foreground transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-primary-foreground/90 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;