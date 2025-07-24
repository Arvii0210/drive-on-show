import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchSection from "@/components/SearchSection";
import FeaturedCars from "@/components/FeaturedCars";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <SearchSection />
      <FeaturedCars />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
