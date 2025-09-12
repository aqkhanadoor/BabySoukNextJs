import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import SecondaryHero from "@/components/SecondaryHero";
import ThirdHero from "@/components/ThirdHero";

const Index = () => {
  return (
    <div className="min-h-screen bg-playful-background overflow-hidden">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <SecondaryHero />
        <ProductsSection />
        <ThirdHero />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
