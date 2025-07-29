import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const plans = [
  
  'Standard Plan',
  'Lite Plan',
  'Premium Plan'
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' }
];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* 📍 Address Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Pextee
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your ultimate destination for high-quality creative assets.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail size={16} className="mr-3 text-teal-400" />
                <span>hello@pextee.com</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-3 text-teal-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-3 text-teal-400" />
                <span>Tamil Nadu</span>
              </div>
            </div>
          </div>

          {/* 📝 Plans Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Plans</h4>
            <ul className="space-y-3">
              {plans.map((plan) => (
                <li key={plan}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 text-sm"
                  >
                    {plan}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 📲 Follow Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <p className="text-gray-400 mb-4">
              Stay connected with us for the latest updates.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="bg-gray-800 hover:bg-teal-600 p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 🔻 Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2024 Pextee. All rights reserved.</p>
            <p>
              Designed & Developed by{" "}
              <span className="text-teal-300">Technovuz</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
