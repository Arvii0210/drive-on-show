import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const WoodenGlassRailing = () => {
  const features = [
    {
      title: "Premium Wood Selection",
      description: "High-quality teak, oak, and engineered wood options with weather-resistant treatments."
    },
    {
      title: "Tempered Glass Panels",
      description: "Safety-grade tempered glass with various transparency and tinting options."
    },
    {
      title: "Custom Design Options",
      description: "Tailored designs to match your architectural style and personal preferences."
    },
    {
      title: "Professional Installation",
      description: "Expert installation ensuring perfect fit and long-lasting performance."
    }
  ];

  const benefits = [
    "Perfect blend of natural warmth and modern elegance",
    "Enhanced privacy while maintaining views",
    "Weather-resistant and durable construction",
    "Low maintenance requirements",
    "Customizable wood finishes and glass types",
    "Eco-friendly material options available"
  ];

  const gallery = [
    "/photos/wood-railing-1.avif",
    "/photos/wood-railing-2.avif", 
    "/photos/wood-railing-3.jpg",
    "/photos/Woods-railing.jpg"
  ];

  return (
    <ServicePageLayout
      title="Wooden with Glass Railing"
      description="Perfect blend of natural wood warmth and modern glass elegance for your railings. Our wooden glass railing systems combine timeless appeal with contemporary design."
      heroImage="/photos/Woods-railing.jpg"
      features={features}
      benefits={benefits}
      gallery={gallery}
      breadcrumbTitle="Wooden with Glass Railing"
    />
  );
};

export default WoodenGlassRailing;