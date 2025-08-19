import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();

  // Reset mobile menu on route change and lock body scroll when open
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      category: 'Railings & Balcony',
      items: [
        { label: 'Balcony Glasswork', path: '/services/balcony-glasswork' },
        { label: 'Wooden & Glass Railing', path: '/services/wooden-with-glass-railing' },
        { label: 'SS Handrail Work', path: '/services/ss-handrail-work' },
        { label: 'MS Handrail Work', path: '/services/ms-handrail-work' },
        { label: 'Charupudi', path: '/services/charupudi' },
      ]
    },
    {
      category: 'Gates & Doors',
      items: [
        { label: 'MS Gate', path: '/services/ms-gate' },
        { label: 'SS Gate', path: '/services/ss-gate' },
        { label: 'Safety Door Work', path: '/services/safety-door-work' },
        { label: 'S.S. Main Gate', path: '/services/ss-main-gate' },
        { label: 'Open Type', path: '/services/open-type' },
        { label: 'Sliding Type', path: '/services/sliding-type' },
        { label: 'Motorised', path: '/services/motorised' },
      ]
    },
    {
      category: 'Fabrication Work',
      items: [
        { label: 'G Pipe with Glass', path: '/services/g-pipe-with-glass' },
        { label: 'G1 Steel Work', path: '/services/g1-steel-work' },
      ]
    },
    {
      category: 'Specialized Doors',
      items: [
        { label: 'Steel Doors', path: '/services/steel-doors' },
        { label: 'FRP Doors', path: '/services/frp-doors' },
        { label: 'UPVC Doors', path: '/services/upvc-doors' },
        { label: 'UPVC Partition', path: '/services/upvc-partition' },
        { label: 'SS Safety Door', path: '/services/ss-safety-door' },
      ]
    },
    {
      category: 'Windows',
      items: [
        { label: 'UPVC Windows', path: '/services/upvc-windows' },
        { label: 'Steel Window (Customised)', path: '/services/steel-window-customised' },
      ]
    },
    {
      category: 'Interior Glass',
      items: [
        { label: 'Glass Shower Cubicle', path: '/services/glass-shower-cubicle' },
      ]
    },
    {
      category: 'Exterior Structures',
      items: [
        { label: 'Pergola Glass Work', path: '/services/pergola-glass-work' },
      ]
    }
  ];

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services', hasDropdown: true },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' }
  ];

  const isNavLinkActive = (path) => location.pathname === path;
  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen
        ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/photos/keerthi-logo.png"
              alt="Keerthi & Keerthi Fabs Logo"
              className="w-12 h-12 rounded-lg object-contain bg-white p-1 shadow-md"
            />
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-gray-800' : 'text-white'
              }`}>Keerthi & Keerthi Fabs</h1>
              <p className={`text-sm transition-colors ${
                isScrolled || isMobileMenuOpen ? 'text-gray-500' : 'text-white/80'
              }`}>Since 1980</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsDesktopServicesOpen(true)}
                    onMouseLeave={() => setIsDesktopServicesOpen(false)}
                  >
                    <button 
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isServicesActive
                          ? 'text-red-600 bg-red-50'
                          : isScrolled
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                      }`}
                      aria-expanded={isDesktopServicesOpen}
                    >
                      <span>Services</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDesktopServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div 
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 transition-all duration-300 ease-in-out ${
                        isDesktopServicesOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                      }`}
                    >
                      <div className="w-[700px] bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
                        <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-6">
                          {services.slice(0, 3).map((service) => (
                            <div key={service.category} className="space-y-2">
                              <h3 className="font-bold text-gray-800 text-sm tracking-wide">
                                {service.category}
                              </h3>
                              <ul className="space-y-1">
                                {service.items.map((item) => (
                                  <li key={item.path}>
                                    <Link 
                                      to={item.path}
                                      className="block text-sm text-gray-500 hover:text-red-600 transition-colors py-1"
                                    >
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="bg-gray-50 p-6 border-t border-gray-200/80">
                           <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                            {services.slice(3).map((service) => (
                                <div key={service.category} className="space-y-2">
                                  <h3 className="font-bold text-gray-800 text-sm tracking-wide">
                                    {service.category}
                                  </h3>
                                  <ul className="space-y-1">
                                    {service.items.map((item) => (
                                      <li key={item.path}>
                                        <Link 
                                          to={item.path}
                                          className="block text-sm text-gray-500 hover:text-red-600 transition-colors py-1"
                                        >
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isNavLinkActive(item.path)
                        ? 'text-red-600 bg-red-50'
                        : isScrolled
                          ? 'text-gray-700 hover:bg-gray-100'
                          : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Link to="/request-quote" className="hidden md:block">
              <Button>Request Quote</Button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen 
                ? <X className="w-6 h-6 text-gray-700" /> 
                : <Menu className={`w-6 h-6 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* --- MOBILE MENU --- (with improved scrollable layout) */}
      {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 h-[calc(100vh-5rem)] bg-white flex flex-col z-40">
            {/* Scrollable links area */}
            <div className="flex-grow overflow-y-auto">
              <div className="px-6 pt-6 pb-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button 
                          className="w-full text-left py-3 font-semibold text-lg text-gray-800 flex items-center justify-between"
                          onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                          aria-expanded={isMobileServicesOpen}
                        >
                          <span>Services</span>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMobileServicesOpen && (
                          <div className="pt-2 pb-2 pl-4 border-l-2 border-red-500 ml-2 space-y-4">
                            {services.map((service) => (
                              <div key={service.category}>
                                <h4 className="font-semibold text-red-600 text-sm uppercase tracking-wider">
                                  {service.category}
                                </h4>
                                <div className="mt-2 space-y-2">
                                  {service.items.map((subItem) => (
                                    <Link
                                      key={subItem.path}
                                      to={subItem.path}
                                      className="block py-1 text-gray-600 hover:text-red-600"
                                    >
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className="block py-3 font-semibold text-lg text-gray-800"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Fixed button footer */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <Link to="/request-quote" className="w-full">
                <Button size="lg" className="w-full">Request Quote</Button>
              </Link>
            </div>
          </div>
        )}
    </nav>
  );
};

export default Navbar;
