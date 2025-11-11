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
    <nav className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Company Name */}
          <Link to="/" className="flex items-center gap-3">
            <img src={aeLogo} alt="Aadarsh Enterprise Logo" className="h-[60px] w-16" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium">
                Products
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-56 bg-[#3b2b24] text-[#e9d9c8] rounded-lg shadow-2xl py-2 border border-[#4a372f] z-50 divide-y divide-[#4a372f] overflow-hidden"
              >
                {productLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild className="p-0">
                    <Link
                      to={link.path}
                      className="block px-4 py-3 text-sm font-medium text-[#e9d9c8] hover:bg-[#4a352b] hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}

                <div className="py-2 px-3 text-xs text-[#c7b59f]">
                  <div className="mb-1">More</div>
                  <Link to="/products" className="block text-sm text-[#d7c4b7] hover:underline">
                    View all products
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contact"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>

            {/* Call Now Button */}
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href="tel:+919363101958" className="flex items-center gap-2">
                <Phone className="h-4 w-4 phone-shake" aria-hidden="true" />
                <span>Call Now</span>
              </a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <a href="tel:+919363101958" aria-label="Call Aadarsh Enterprise">
                <Phone className="h-4 w-4 phone-shake" />
              </a>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
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
