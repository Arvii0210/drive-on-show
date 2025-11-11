import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";
import hero4 from "@/assets/hero4.jpg";
import hero5 from "@/assets/hero5.jpg";
import aeLogo from "@/assets/ae-logo.png";
import { Link } from "react-router-dom";

const heroImages = [
  { src: hero1, alt: "High-resolution image of circular loom machinery - 1" },
  { src: hero2, alt: "High-resolution image of circular loom machinery - 2" },
  { src: hero3, alt: "High-resolution image of circular loom machinery - 3" },
  { src: hero4, alt: "High-resolution image of circular loom machinery - 4" },
  { src: hero5, alt: "High-resolution image of circular loom machinery - 5" },
];

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {/* Carousel Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <div className="flex items-center gap-4 mb-6">
              {/* <img src={aeLogo} alt="Aadarsh Enterprise Logo" className="h-16 w-16 invert" /> */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Aadarsh Enterprise</h1>
                <p className="text-lg italic text-white/90">As Good as Original</p>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Manufacturers & Exporters of Spares for Circular Looms
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Delivering precision-engineered components for GCL, Starlinger, and Lohia looms.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/contact">Product Enquiry</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-foreground hover:bg-primary/60 hover:text-white">
                <Link to="/categories">View Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
        aria-label="Next image"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Thumbnail Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-12 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-16" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
