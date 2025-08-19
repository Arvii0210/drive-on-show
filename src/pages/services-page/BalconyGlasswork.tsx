import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const BalconyGlasswork = () => {
  const features = [
    {
      title: "Tempered Glass Railings",
      description: "High-strength tempered glass panels with stainless steel fittings for modern balconies."
    },
    {
      title: "Frameless Glass Systems",
      description: "Sleek frameless designs that maximize views and create an illusion of space."
    },
    {
      title: "Custom Glass Designs",
      description: "Bespoke glass solutions tailored to your specific architectural requirements."
    },
    {
      title: "Safety Compliance",
      description: "All installations meet international safety standards and building codes."
    }
  ];

  const benefits = [
    "Unobstructed panoramic views",
    "Enhanced natural light penetration",
    "Weather-resistant and low maintenance",
    "Increases property value",
    "Modern, sophisticated appearance",
    "Easy to clean and maintain"
  ];

  const gallery = [
    "/photos/balcony-with-glass-railings.jpg",
    "/photos/terrace-with-glass-railings.jpg",
    "/photos/full-shot-friends-balcony.jpg",
    "/photos/balcony1.jpg"
  ];

  return (
    <ServicePageLayout
      title="Balcony Glasswork"
      description="Premium glass solutions for modern balconies with safety, aesthetics, and durability at the forefront. Transform your outdoor space with our expert glass installations."
      heroImage="/photos/balcony-with-glass-railings.jpg"
      features={features}
      benefits={benefits}
      breadcrumbTitle="Balcony Glasswork"
    />
  );
};

export default BalconyGlasswork;