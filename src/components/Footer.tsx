import React from "react";
import { Link } from "react-router-dom";
import aeLogo from "@/assets/ae-logo.png";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const productCategories = [
    { name: "Lohia LSL 4", path: "/products/lohia" },
    { name: "Lohia LSL 6", path: "/products/lohia" },
    { name: "GCL 6", path: "/products/gcl" },
    { name: "GCL 6S", path: "/products/gcl" },
    { name: "Leno 4", path: "/products/leno4" },
    { name: "Starlinger SL 4", path: "/products/starlinger" },
    { name: "Starlinger SL 6", path: "/products/starlinger" },
  ];

  return (
    <footer className="bg-brand-footer text-gray-100 border-t border-primary/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={aeLogo} alt="Aadarsh Enterprise logo" className="h-12 w-12 object-contain" />
              <div>
                <h3 className="text-lg font-semibold">Aadarsh Enterprise</h3>
                <p className="text-sm text-gray-300 italic">As Good as Original</p>
              </div>
            </div>

            <p className="text-sm text-gray-300/90 max-w-sm">
              Precision engineered spare parts and accessories for circular looms and industrial systems built for performance and long service life.
            </p>

            <div className="flex items-center space-x-3">
              <a href="https://wa.me/919363101958" aria-label="WhatsApp" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <FaWhatsapp className="w-5 h-5 text-gray-100" />
              </a>
              <a href="https://www.facebook.com/#" aria-label="Facebook" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <FaFacebook className="w-5 h-5 text-gray-100" />

              </a>
              <a href="https://www.instagram.com/#" aria-label="Instagram" className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
                <FaInstagram className="w-5 h-5 text-gray-100" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-md font-semibold mb-4">Product Categories</h4>
            <ul className="space-y-2">
              {productCategories.map((category, index) => (
                <li key={index}>
                  <Link to={category.path} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-md font-semibold mb-4">Contact</h4>

            <address className="not-italic text-sm text-gray-300 space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <div className="font-medium">Aadarsh Enterprise</div>
                  <div className="text-gray-400"> Coimbatore, Tamil Nadu, India</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="tel:+919363101958" className="hover:text-white">
                  +91 93631 01958
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex flex-col">
                  <a href="mailto:mukesh_4@satyam.net.in" className="hover:text-white">
                    mukesh_4@satyam.net.in
                  </a>
                  <a href="mailto:mukesh@loomspares.com" className="hover:text-white">
                    mukesh@loomspares.com
                  </a>
                </div>
              </div>
            </address>

            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-md bg-white/5 placeholder:text-gray-400 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-400">© {currentYear} Aadarsh Enterprise. All rights reserved.</p>

             <div className="flex space-x-6 text-sm">
              <p className="tracking-widest flex items-center gap-1">
  Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
  <a
    href="https://www.technovuz.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="text-red-600 font-semibold"
  >
    Technovuz
  </a>
</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
