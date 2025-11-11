import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categoriesData } from "@/data/productsData";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Categories = () => {
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

      {/* Hero */}
      <section className="relative py-32 overflow-hidden" data-aos="fade-up">
        <div className="absolute inset-0 bg-gradient-premium opacity-20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Product Categories
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our premium collection of precision-engineered circular loom spare parts
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 flex-1 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesData.map((category, index) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-3 h-full border border-border/50">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-3xl font-bold text-white mb-2 transform group-hover:translate-x-2 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 text-sm">
                        <Package className="h-4 w-4" />
                        <span>{category.productsCount} Product Series</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 relative bg-gradient-to-b from-card to-card/50">
                    <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{category.description}</p>
                    <Button className="w-full group-hover:bg-primary group-hover:shadow-glow transition-all duration-300" variant="default">
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">View Products</span>
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Categories;
