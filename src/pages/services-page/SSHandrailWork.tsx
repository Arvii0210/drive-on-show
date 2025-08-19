import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

const features = [
  {
    title: "Stainless Steel Handrails",
    description: "Corrosion-resistant and modern handrails for stairs and balconies."
  },
  {
    title: "Precision Engineering",
    description: "Smooth finish and robust installation."
  }
];

const benefits = [
  "Long-lasting",
  "Low maintenance",
  "Sleek look",
  "Safe grip"
];

const gallery = [
  "/photos/ss-handrail1.jpg",
  "/photos/ss-handrail2.jpg"
];

const SSHandrailWork = () => (
  <ServicePageLayout
    title="SS Handrail Work"
    description="Premium stainless steel handrails for stairs and balconies."
    heroImage="/photos/ss-handrail1.jpg"
    features={features}
    benefits={benefits}
    breadcrumbTitle="SS Handrail Work"
    // gallery={gallery}
  />
);

export default SSHandrailWork;