import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import HowWeWork from '@/components/HowWeWork';
import LatestProjects from '@/components/LatestProjects';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesGrid />
        <HowWeWork />
        <LatestProjects />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
