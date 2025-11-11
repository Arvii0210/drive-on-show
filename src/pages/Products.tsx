import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";


const Products = () => {
  const categories = [
    {
      title: "Lohia Loom Spare Parts",
      description: "Designed for precision and durability, our Lohia spares ensure optimal loom performance.",
      image: "/content/lohia.jpg",
      link: "/products/lohia",
    },
    {
      title: "GCL Accessories",
      description: "Comprehensive accessories for GCL looms including pulleys, rollers & grommets.",
      image: "/content/gcl.jpg",
      link: "/products/gcl",
    },
    {
      title: "Starlinger Spares",
      description: "Starlinger replacement parts and wear components for consistent uptime.",
      image: "/content/starlinger.jpg",
      link: "/products/starlinger",
    },
    {
      title: "Leno-4 Spare Parts",
      description: "Reliable spare parts for Leno-4 looms ensuring smooth operation.",
      image: "/content/leno-4.jpg",
      link: "/products/leno4",
    },
    {
      title: "Ls-Fil-23",
      description: "High-performance spare parts for Ls-Fil-23 looms.",
      image: "/content/ls-fil-23.jpeg",
      link: "/products/lsfil23",
    },
    {
      title: "LSH-200 Spare Parts",
      description: "Durable spare parts for LSH-200 looms.",
      image: "/content/lsh-200.jpg",
      link: "/products/lsh200",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Products</h1>
          <p className="text-center text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our product categories. Click a category to view images and descriptions.
          </p>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <ProductCard
                key={index}
                title={category.title}
                image={category.image}
                description={category.description}
                link={category.link}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;
