import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategoryById, getProductById } from "@/data/productsData";
import { ChevronRight, Home, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageModal from "@/components/ImageModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AOS from "aos";
import "aos/dist/aos.css";

const ITEMS_PER_PAGE = 10;

const SparePartsList = () => {
  const { categoryId, productId } = useParams();
  const category = getCategoryById(categoryId || "");
  const product = getProductById(categoryId || "", productId || "");

  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out"
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (!category || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <Link to="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalPages = Math.ceil(product.spareParts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParts = product.spareParts.slice(startIndex, endIndex);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(startIndex + index);
    setModalOpen(true);
  };

  const availabilityColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "Made to Order":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "Limited Stock":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Breadcrumbs */}
      <section className="bg-secondary/30 py-4" data-aos="fade-down">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link to={`/categories/${categoryId}`} className="text-muted-foreground hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 mb-4">
            <Package className="h-10 w-10 text-primary flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="text-sm">Total Parts: {product.spareParts.length}</span>
            <span>•</span>
            <span className="text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, product.spareParts.length)} of {product.spareParts.length}
            </span>
          </div>
        </div>
      </section>

      {/* Spare Parts List */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentParts.map((part, index) => (
              <div
                key={part.id}
                data-aos="fade-down"
                data-aos-delay={index * 50}
                className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Badge className={`absolute top-3 right-3 ${availabilityColor(part.availability)}`}>
                    {part.availability}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                      {part.partNo}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{part.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{part.description}</p>
                  {part.category && (
                    <p className="text-xs text-muted-foreground">Cat: {part.category}</p>
                  )}
                  <Button
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => handleImageClick(index)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Image
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12" data-aos="fade-up">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {modalOpen && (
        <ImageModal
          images={product.spareParts.map(part => ({ image: part.image, name: part.name }))}
          currentIndex={selectedImageIndex}
          onClose={() => setModalOpen(false)}
          onNavigate={setSelectedImageIndex}
        />
      )}

      <Footer />
    </div>
  );
};

export default SparePartsList;
