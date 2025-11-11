import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import aeLogo from "@/assets/0.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const productLinks = [
    { name: "View All Categories", path: "/categories" },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={aeLogo} 
              alt="Aadarsh Enterprise Logo" 
              className="h-16 w-20 transition-transform duration-300 group-hover:scale-105" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors font-medium relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium group">
                Products
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 duration-300" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={12}
                className="w-64 rounded-2xl shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl p-2"
              >
                {productLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild className="rounded-xl">
                    <Link
                      to={link.path}
                      className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <div className="mt-2 pt-2 border-t border-border/50">
                  <Link 
                    to="/products" 
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    View all products →
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-colors font-medium relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Call Button */}
            <Button 
              asChild 
              className="bg-primary hover:bg-primary/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a href="tel:+919363101958" className="flex items-center gap-2">
                <Phone className="h-4 w-4 phone-shake" aria-hidden="true" />
                <span>Call Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 rounded-full">
              <a href="tel:+919363101958" aria-label="Call Aadarsh Enterprise">
                <Phone className="h-4 w-4 phone-shake" />
              </a>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-card">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}

                  <div className="space-y-2">
                    <div className="text-lg font-medium text-foreground">Products</div>
                    <div className="pl-4 space-y-3">
                      {productLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className="block text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
