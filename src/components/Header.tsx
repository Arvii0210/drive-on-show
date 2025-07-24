import { Button } from "@/components/ui/button";
import { Car, Phone, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-automotive-blue p-2 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-automotive-dark">DreamCars</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium hover:text-automotive-blue transition-colors">
              Home
            </a>
            <a href="#inventory" className="text-sm font-medium hover:text-automotive-blue transition-colors">
              Inventory
            </a>
            <a href="#financing" className="text-sm font-medium hover:text-automotive-blue transition-colors">
              Financing
            </a>
            <a href="#about" className="text-sm font-medium hover:text-automotive-blue transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-automotive-blue transition-colors">
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>(555) 123-4567</span>
            </div>
            <Button variant="hero" size="sm" className="hidden md:flex">
              Get Quote
            </Button>
            <Button variant="outline" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;