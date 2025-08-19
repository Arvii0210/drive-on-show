import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const MainGates = () => {
  const features = [
    {
      title: "Grand Entrance Design",
      description: "Impressive main gates that create a strong first impression and enhance property value."
    },
    {
      title: "Security Features",
      description: "Advanced locking mechanisms and sturdy construction for maximum security."
    },
    {
      title: "Motorization Options",
      description: "Automated opening systems with remote control and sensor integration."
    },
    {
      title: "Weather Protection",
      description: "Durable materials and finishes that withstand all weather conditions."
    }
  ];

  const benefits = [
    "Enhanced property security and privacy",
    "Impressive curb appeal and aesthetics",
    "Durable construction for long-term use",
    "Automated operation options available",
    "Customizable designs and sizes",
    "Professional installation and maintenance"
  ];

  const gallery = [
    "/photos/S.S. Main Gate-1.jpg",
    "/photos/S.S. Main Gate-3jpg.jpg",
    "/photos/S.S. Main Gate-4.webp",
    "/photos/Motorised Gates-main.jpeg"
  ];

  return (
    <ServicePageLayout
      title="Main Gates"
      description="Grand entrance gates that combine security, functionality, and impressive aesthetics for your property. Create a lasting first impression with our custom-designed main gates."
      heroImage="/photos/S.S. Main Gate-1.jpg"
      features={features}
      benefits={benefits}
      breadcrumbTitle="Main Gates"
    />
  );
};

export default MainGates;