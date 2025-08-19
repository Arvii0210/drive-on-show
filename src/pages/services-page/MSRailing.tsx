import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const MSRailing = () => {
  const features = [
    {
      title: "Cost-Effective Solution",
      description: "Budget-friendly mild steel railings without compromising on quality and safety."
    },
    {
      title: "Custom Finishes",
      description: "Various powder coating and painting options to match your design preferences."
    },
    {
      title: "Versatile Designs",
      description: "Wide range of design options suitable for residential and commercial applications."
    },
    {
      title: "Quick Installation",
      description: "Efficient fabrication and installation process with minimal disruption."
    }
  ];

  const benefits = [
    "Budget-friendly pricing",
    "Strong and durable construction",
    "Customizable colors and finishes",
    "Wide variety of design patterns",
    "Quick turnaround time",
    "Easy maintenance with proper coating"
  ];

  const gallery = [
    "/photos/MS-Gate-1.jpg",
    "/photos/MS-Gate-2.jpg",
    "/photos/MS-Gate-3.webp",
    "/photos/ms-gate-3.jpg"
  ];

  return (
    <ServicePageLayout
      title="MS Railing"
      description="Cost-effective mild steel railings with custom finishes and designs for various applications. Perfect balance of affordability and functionality."
      heroImage="/photos/MS-Gate-1.jpg"
      features={features}
      benefits={benefits}
      gallery={gallery}
      breadcrumbTitle="MS Railing"
    />
  );
};

export default MSRailing;