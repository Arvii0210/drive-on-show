import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategoryById } from "@/data/productsData";
import { ChevronRight, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ProductList = () => {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId || "");

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out"
    });
  }, []);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold mb-4">Category Not Found</h1>
            <Link to="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumbs */}
      <section className="bg-secondary/30 py-4" data-aos="fade-down">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{category.name}</span>
          </nav>
        </div>
      </section>

      {/* Category Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">{category.description}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product, index) => (
              <Link
                key={product.id}
                to={`/categories/${categoryId}/products/${product.id}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-4 flex-1 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>{product.sparePartsCount} Parts</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-primary/90">
                        View Spares
                      </Button>
                    </div>
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

export default ProductList;
