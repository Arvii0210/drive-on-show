import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { X, ZoomIn, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simulated gallery data (will be replaced with API call later)
  const galleryImages = [
    {
      id: 1,
      title: 'Luxury Villa Balcony',
      category: 'balcony',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&h=400&fit=crop',
      description: 'Premium glass and stainless steel balcony railings'
    },
    {
      id: 2,
      title: 'Modern Main Gate',
      category: 'gates',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      description: 'Automated stainless steel security gate'
    },
    {
      id: 3,
      title: 'Restaurant Interior',
      category: 'fabrication',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      description: 'Custom kitchen equipment fabrication'
    },
    {
      id: 4,
      title: 'Spiral Staircase',
      category: 'railings',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
      description: 'Elegant curved staircase with SS railings'
    },
    {
      id: 5,
      title: 'Glass Partition',
      category: 'glass',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      description: 'Office glass partition with steel frame'
    },
    {
      id: 6,
      title: 'Industrial Equipment',
      category: 'fabrication',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
      description: 'Custom industrial machinery fabrication'
    },
    {
      id: 7,
      title: 'Residential Railing',
      category: 'railings',
      image: 'https://images.unsplash.com/photo-1600607688960-e095d5247d3c?w=600&h=400&fit=crop',
      description: 'Modern residential staircase railing'
    },
    {
      id: 8,
      title: 'Security Door',
      category: 'doors',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      description: 'Heavy-duty security door with steel frame'
    },
    {
      id: 9,
      title: 'Balcony Glass Work',
      category: 'balcony',
      image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=400&fit=crop',
      description: 'Frameless glass balcony installation'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'balcony', name: 'Balcony Work' },
    { id: 'railings', name: 'Railings' },
    { id: 'gates', name: 'Gates' },
    { id: 'doors', name: 'Doors' },
    { id: 'fabrication', name: 'Fabrication' },
    { id: 'glass', name: 'Glass Work' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (image: any) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Banner Background */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
        {/* Banner background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/photos/full-shot-friends-balcony.jpg')` }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-hero text-white mb-6">
              Project <span className="text-white">Gallery</span>
            </h1>
            <p className="text-xl text-white leading-relaxed">
              Explore our portfolio of completed projects showcasing precision engineering, 
              innovative design, and exceptional craftsmanship in stainless steel fabrication.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
            {/* heading */}
            <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Our Galleries
            </h2>
            <p className="text-muted-foreground">
              Browse through our collection of completed projects.
            </p>
            </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-glass hover:shadow-premium transition-all duration-500 hover-lift border border-border/50 cursor-pointer"
                onClick={() => openModal(image)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={image.image}
                    alt={image.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ZoomIn className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full capitalize">
                      {image.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-muted-foreground">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button className="btn-accent">
              Load More Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img 
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full capitalize">
                {selectedImage.category}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;