import { Button } from "@/components/ui/button";
import { Search, Star, Award, Shield } from "lucide-react";
import heroCarImage from "@/assets/hero-car.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background to-muted overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Find Your
                <span className="bg-gradient-to-r from-automotive-blue to-automotive-accent bg-clip-text text-transparent">
                  {" "}Dream Car
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover premium vehicles with unbeatable prices, certified quality, and exceptional service. Your perfect car awaits.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-automotive-blue" />
                <span className="font-semibold">1000+ Cars</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Certified</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                <Search className="h-5 w-5 mr-2" />
                Browse Cars
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Schedule Test Drive
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="pt-8 border-t border-border">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-bold text-automotive-blue">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-automotive-blue">15+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-automotive-blue">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroCarImage}
                alt="Premium luxury car"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Price Card */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="text-sm text-muted-foreground">Starting from</div>
                <div className="text-2xl font-bold text-automotive-blue">$25,999</div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-automotive-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-automotive-blue/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;