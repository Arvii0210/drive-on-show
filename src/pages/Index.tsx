import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import ProcessSection from "@/components/ProcessSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categoriesData } from "@/data/productsData";
import { Package, ArrowRight, Award, Globe, Zap, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
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
      description: "OEM-grade components manufactured to the highest standards",
      gradient: "from-purple-500 to-blue-500"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving customers across 45+ countries worldwide",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Optimized logistics for quick turnaround times",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Cutting-edge technology and continuous improvement",
      gradient: "from-green-500 to-teal-500"
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-50 to-blue-50 dark:from-background dark:via-purple-950/20 dark:to-blue-950/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience excellence in every spare part we deliver
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br bg-gradient-premium rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500"></div>
                  <div className="relative glass-card p-8 rounded-3xl hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-purple-500/20">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <div className="w-full h-full bg-background dark:bg-card rounded-2xl flex items-center justify-center">
                        <Icon className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/10 dark:via-pink-950/10 dark:to-purple-950/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Aadarsh Enterprise
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6" data-aos="fade-right">
                <p className="text-xl leading-relaxed text-muted-foreground">
                  We are proud pioneers among Indian manufacturers and exporters of "Aadarsh" brand Grommet Bands, 
                  Heald Belts, and Loom Spares for GCL, Starlinger, and Lohia HDPE/PP woven sack circular looms.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Years Experience", value: "10+" },
                    { label: "Happy Clients", value: "500+" },
                    { label: "Products", value: "1000+" },
                    { label: "Countries", value: "45+" }
                  ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-2xl text-center hover:shadow-premium transition-all duration-300 group">
                      <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div data-aos="fade-left" data-aos-delay="200">
                <div className="relative glass-card p-10 rounded-3xl border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 shadow-premium hover:shadow-premium-hover group">
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Our Mission</h3>
                    </div>
                    <p className="text-2xl font-semibold text-foreground leading-relaxed mb-6">
                      Precision, innovation, and long-lasting performance — As Good as Original.
                    </p>
                    <div className="space-y-3">
                      {["Quality Assured", "Innovation Driven", "Customer Focused"].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <ProcessSection />

      {/* Categories Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/10 dark:via-blue-950/10 dark:to-indigo-950/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div data-aos="fade-up" className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Product Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our comprehensive range of precision-engineered spare parts organized by manufacturer
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 mx-auto mt-6 rounded-full"></div>
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
                <div className="relative h-full rounded-3xl overflow-hidden glass-card shadow-premium hover:shadow-premium-hover transition-all duration-500 border-2 border-transparent hover:border-purple-500/30 hover:-translate-y-3">
                  {/* Gradient overlay animation */}
                  <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  
                  {/* Image Section */}
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-125 group-hover:rotate-2 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20"></div>
                    
                    {/* Floating label with colorful gradient */}
                    <div className="absolute top-6 right-6 z-30">
                      <div className="px-5 py-2.5 rounded-full glass-card flex items-center gap-2 group-hover:scale-110 transition-transform duration-300 border border-purple-500/30">
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{category.productsCount} Series</span>
                      </div>
                    </div>

                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-30">
                      <h3 className="text-4xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:w-24 transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{category.description}</p>
                    <Button className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group-hover:shadow-glow transition-all duration-500 border-0 h-14 text-lg font-semibold" size="lg">
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">View Products</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-20" data-aos="fade-up" data-aos-delay="400">
            <Link to="/categories">
              <Button size="lg" className="group rounded-full px-10 py-7 text-lg font-semibold shadow-premium hover:shadow-premium-hover bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0">
                <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">View All Categories</span>
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="relative py-40 overflow-hidden" 
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-gradient-premium"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div data-aos="zoom-in" className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30">
              <span className="text-sm font-semibold uppercase tracking-wider">Get Started Today</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" data-aos="fade-up">
              Looking for High-Quality<br />
              <span className="bg-gradient-to-r from-orange-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Loom Spares?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-95 leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Get in touch with us today for premium circular loom components and expert guidance that drives your business forward
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center" data-aos="fade-up" data-aos-delay="200">
              <Button 
                asChild 
                size="lg" 
                className="group rounded-full px-10 py-7 text-lg font-semibold shadow-2xl hover:shadow-glow transition-all duration-500 bg-white text-purple-600 hover:bg-white/90 border-0 hover:scale-105"
              >
                <Link to="/contact">
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Contact Us Now</span>
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="group rounded-full px-10 py-7 text-lg font-semibold bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-500 hover:scale-105"
              >
                <Link to="/categories">
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">Browse Products</span>
                </Link>
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
