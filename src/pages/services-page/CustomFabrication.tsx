import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '@/components/ServicePageLayout';

const features = [
  {
    title: "Tailored Metalwork",
    description: "We create custom metal structures, railings, gates, and more, precisely to your specifications and style."
  },
  {
    title: "Advanced Fabrication",
    description: "Our workshop is equipped with modern machinery for cutting, welding, bending, and finishing all types of metals."
  },
  {
    title: "Material Versatility",
    description: "We work with stainless steel, mild steel, aluminum, brass, and more for both residential and industrial needs."
  },
  {
    title: "Design Collaboration",
    description: "Bring your sketches or ideas—our team will help you turn them into reality with 3D modeling and expert advice."
  }
];

const benefits = [
  "Truly custom solutions for any project size",
  "Expert craftsmanship and attention to detail",
  "Durable, long-lasting finishes",
  "On-time delivery and installation",
  "Competitive pricing for bespoke work",
  "Full support from design to installation"
];

const CustomFabrication = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    
    <ServicePageLayout
      title="Custom Fabrication"
      description="Bespoke metal fabrication solutions tailored to your specific requirements and designs. From concept to installation, we deliver unique, high-quality metalwork for homes, businesses, and industry."
      heroImage="/photos/"
      features={features}
      benefits={benefits}
      breadcrumbTitle="Custom Fabrication"
    />

    <Footer />
  </div>
);

export default CustomFabrication;