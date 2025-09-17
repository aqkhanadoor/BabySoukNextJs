import { Shield, Truck, RotateCcw, Heart, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Super Safe",
    description: "All our products are tested to be super safe for your baby.",
    color: "bg-playful-primary"
  },
  {
    icon: Truck,
    title: "Speedy Delivery",
    description: "We'll get your goodies to you in a flash!",
    color: "bg-playful-secondary"
  },
  {
    icon: RotateCcw,
    title: "Easy Peasy Returns",
    description: "Not quite right? No worries! Returns are simple.",
    color: "bg-playful-accent"
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every item is chosen with a whole lot of love.",
    color: "bg-playful-primary"
  },
  {
    icon: Award,
    title: "Top-Notch Quality",
    description: "Only the best and most trusted brands make the cut.",
    color: "bg-playful-secondary"
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Need help? We're here for you, quick as a bunny!",
    color: "bg-playful-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-playful-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-playful-foreground mb-4 animate-bounce-gentle">
            Why We're Awesome!
          </h2>
          <p className="text-playful-foreground/80 text-lg">
            Here’s why shopping with us is always a fun adventure!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-3xl bg-white border-4 border-playful-foreground shadow-2d hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 ${feature.color} rounded-full mb-4 border-4 border-playful-foreground group-hover:animate-wiggle`}>
                <feature.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-playful-foreground">
                {feature.title}
              </h3>
              <p className="text-playful-foreground/70">
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