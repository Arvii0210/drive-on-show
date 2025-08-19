import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const SSRailing = () => {
  const features = [
    {
      title: "Premium Grade Steel",
      description: "High-grade 304 and 316 stainless steel for superior corrosion resistance and longevity."
    },
    {
      title: "Modern Designs",
      description: "Contemporary and sleek designs that complement modern architectural styles."
    },
    {
      title: "Weather Resistant",
      description: "Outstanding resistance to weather conditions, perfect for outdoor installations."
    },
    {
      title: "Low Maintenance",
      description: "Minimal upkeep required with easy cleaning and no painting or coating needed."
    }
  ];

  const benefits = [
    "Superior durability and strength",
    "Corrosion and rust resistance",
    "Hygienic and easy to clean",
    "Modern, sophisticated appearance",
    "Cost-effective long-term solution",
    "Environmentally friendly and recyclable"
  ];

  const gallery = [
    "/photos/ss-handrail-4.jpg",
    "/photos/ss-gate-1.jpg",
    "/photos/ss-gate-2.jpg",
    "/photos/SS Gate-main.jpg"
  ];

  return (
    <ServicePageLayout
      title="SS Railing"
      description="Premium stainless steel railings offering superior durability, corrosion resistance, and modern aesthetics. Perfect for both indoor and outdoor applications."
      heroImage="/photos/ss-handrail-4.jpg"
      features={features}
      benefits={benefits}
      breadcrumbTitle="SS Railing"
    />
  );
};

export default SSRailing;