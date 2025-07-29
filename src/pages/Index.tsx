
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryBrowser from '@/components/CategoryBrowser';
import FeaturedCollections from '@/components/FeaturedCollections';

import UserStats from '@/components/UserStats';
import WhyChooseUs from '@/components/WhyChooseUs';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <CategoryBrowser />
      <FeaturedCollections />
      
      <UserStats />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
