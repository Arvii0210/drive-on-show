import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProcessSection from "@/components/ProcessSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categoriesData } from "@/data/productsData";
import { Package, ArrowRight, Award, Globe, Zap } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const Index = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic"
    });
  }, []);

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "OEM-grade components manufactured to the highest standards"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers across 45+ countries worldwide"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Optimized logistics for quick turnaround times"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Carousel */}
      <div data-aos="fade">
        <HeroCarousel />
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group relative p-8 rounded-2xl bg-card hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-primary/20"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 bg-secondary" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8" data-aos="fade-up">
              Welcome to Aadarsh Enterprise
            </h2>
            <div className="space-y-6 text-lg leading-relaxed">
              <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground">
                We are proud pioneers among Indian manufacturers and exporters of "Aadarsh" brand Grommet Bands, 
                Heald Belts, and Loom Spares for GCL, Starlinger, and Lohia HDPE/PP woven sack circular looms.
              </p>
              <div 
                data-aos="fade-up" 
                data-aos-delay="200"
                className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
              >
                <p className="text-2xl font-semibold text-foreground italic">
                  Our focus is on precision, innovation, and long-lasting performance — As Good as Original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4">
          <div data-aos="fade-up" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Product Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our comprehensive range of precision-engineered spare parts organized by manufacturer
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {categoriesData.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group"
              >
                <div className="relative h-full rounded-3xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-primary/20 hover:-translate-y-2">
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Floating label */}
                    <div className="absolute top-4 right-4">
                      <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">{category.productsCount} Series</span>
                      </div>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <p className="text-muted-foreground mb-6 leading-relaxed">{category.description}</p>
                    <Button className="w-full rounded-xl group-hover:bg-primary/90 group-hover:shadow-lg transition-all duration-300" size="lg">
                      View Products
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
            <Link to="/categories">
              <Button size="lg" variant="outline" className="group rounded-full px-8 py-6 text-lg border-2">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-32 overflow-hidden" 
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-aos="fade-up">
              Looking for High-Quality Loom Spares?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
              Get in touch with us today for premium circular loom components and expert guidance
            </p>
            <div className="flex flex-wrap gap-6 justify-center" data-aos="fade-up" data-aos-delay="200">
              <Button 
                asChild 
                size="lg" 
                variant="secondary" 
                className="group rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="group rounded-full px-8 py-6 text-lg bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
              >
                <Link to="/categories">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div data-aos="fade-up">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
