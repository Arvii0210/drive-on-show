import { Car, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-automotive-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-automotive-blue p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">DreamCars</span>
            </div>
            <p className="text-gray-300 max-w-xs">
              Your trusted partner in finding the perfect vehicle. Quality cars, competitive prices, exceptional service.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 hover:text-automotive-blue cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-automotive-blue cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-automotive-blue cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-automotive-blue cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Inventory</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Financing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Trade-In</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Car Sales</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Auto Financing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Vehicle Inspection</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Extended Warranty</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Insurance</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <p>123 Auto Plaza Drive<br />Cityville, ST 12345</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@dreamcars.com</p>
              <div className="pt-4">
                <p className="font-semibold text-white">Business Hours</p>
                <p className="text-sm">Mon-Fri: 9AM-8PM</p>
                <p className="text-sm">Sat: 9AM-6PM</p>
                <p className="text-sm">Sun: 11AM-5PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 DreamCars. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;