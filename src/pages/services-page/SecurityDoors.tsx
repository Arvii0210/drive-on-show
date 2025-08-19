import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecurityDoors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-secondary via-secondary/50 to-background">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Security Doors</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Security Doors
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                High-security steel doors designed to protect your property while maintaining aesthetic appeal.
              </p>
              <Link 
                to="/request-quote"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SecurityDoors;