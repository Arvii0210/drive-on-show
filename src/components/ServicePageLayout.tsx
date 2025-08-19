import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Home, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServicePageLayoutProps {
  title: string;
  description: string;
  heroImage: string;
  features: Array<{
    title: string;
    description: string;
  }>;
  benefits: string[];
  breadcrumbTitle: string;
}

const ServicePageLayout: React.FC<ServicePageLayoutProps> = ({
  title,
  description,
  heroImage,
  features,
  benefits,
  breadcrumbTitle
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar always above hero image */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 flex items-center min-h-[420px] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-primary/70 to-black/40" />
        {/* Content */}
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8">
            <Link to="/" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Services</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{breadcrumbTitle}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
                {title}
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/request-quote"
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Get Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm font-semibold shadow"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Sidebar */}
      <section className="py-16 bg-background flex-1">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our {title} Solutions</h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {description}
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="space-y-4 bg-white/80 rounded-xl p-6 shadow-md border border-border">
                      <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Benefits */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Key Benefits</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-white/90 p-6 rounded-xl border border-border shadow-xl">
                <h3 className="text-xl font-semibold text-primary mb-4">Request Quote</h3>
                <p className="text-muted-foreground mb-4">
                  Get a personalized quote for your {title.toLowerCase()} project.
                </p>
                <Link
                  to="/request-quote"
                  className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
              <div className="bg-white/90 p-6 rounded-xl border border-border shadow-xl">
                <h3 className="text-xl font-semibold text-primary mb-4">Why Choose Us</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>40+ years of experience</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Premium quality materials</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Expert installation team</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Comprehensive warranty</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom design solutions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Competitive pricing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/90 p-6 rounded-xl border border-border shadow-xl">
                <h3 className="text-xl font-semibold text-primary mb-4">Need Help?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Our experts are ready to help you with your project requirements.
                </p>
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium shadow"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicePageLayout;