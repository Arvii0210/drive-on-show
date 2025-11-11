import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProcessSection from "@/components/ProcessSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categoriesData } from "@/data/productsData";
import { Package, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out"
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Carousel with fade-up */}
      <div data-aos="fade-up">
        <HeroCarousel />
      </div>

      {/* Welcome Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Welcome to Aadarsh Enterprise
          </h2>
          <div className="max-w-4xl mx-auto text-center space-y-6 text-lg">
            <p className="leading-relaxed">
              We are proud pioneers among Indian manufacturers and exporters of "Aadarsh" brand Grommet Bands, 
              Heald Belts, and Loom Spares for GCL, Starlinger, and Lohia HDPE/PP woven sack circular looms.
            </p>
            <p className="font-semibold italic text-2xl text-primary bg-primary/5 py-4 px-6 rounded-lg">
              Our focus is on precision, innovation, and long-lasting performance — As Good as Original.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section with fade-down */}
      <ProcessSection />

      {/* Categories Section with fade-in */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div data-aos="fade-in" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Product Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive range of spare parts organized by manufacturer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categoriesData.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                data-aos="fade-in"
                data-aos-delay={index * 100}
              >
                <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Package className="h-4 w-4" />
                        <span>{category.productsCount} Product Series</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
                    <Button className="w-full group-hover:bg-primary/90" size="lg">
                      View Products
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-in" data-aos-delay="400">
            <Link to="/categories">
              <Button size="lg" variant="outline" className="group">
                View All Categories
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Band with fade-up */}
      <section className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground py-20" data-aos="fade-up">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for high-quality loom spares?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Get in touch with us today for premium circular loom components and expert guidance
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="group">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/categories">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <div data-aos="fade-down">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
