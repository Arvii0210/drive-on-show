import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Keerthi & Keerthi Stainless Steel Fabrications"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        

          {/* Main Heading */}
          <h1 className="heading-hero text-white animate-slide-up">
            Keerthi & Keerthi Fabs
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Transforming spaces with world-class stainless steel railings, custom fabrications, 
            and architectural metalwork. 40+ years of trusted craftsmanship in Coimbatore.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-scale-in">
            <Button className="btn-hero group">
              Get Free Quote
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">40+</div>
              <div className="text-gray-300 text-sm md:text-base">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">2500+</div>
              <div className="text-gray-300 text-sm md:text-base">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-300 text-sm md:text-base">Quality Assured</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;