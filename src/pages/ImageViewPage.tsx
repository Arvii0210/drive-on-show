import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowLeft, Share2, Heart, Eye, Calendar, User, Maximize2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Sample image data - replace with actual data fetching
const sampleImages = [
  {
    id: '1',
    src: '/placeholder.svg',
    title: 'Beautiful Sunset Landscape',
    description: 'A stunning view of the sunset over rolling hills with vibrant colors painting the sky.',
    author: { name: 'John Photographer', avatar: '/placeholder.svg' },
    isPremium: false,
    category: 'landscape',
    size: '1920x1080',
    views: 1250,
    downloads: 89,
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    src: '/placeholder.svg',
    title: 'Modern Architecture',
    description: 'Clean lines and geometric patterns in contemporary building design.',
    author: { name: 'Jane Designer', avatar: '/placeholder.svg' },
    isPremium: true,
    category: 'architecture',
    size: '2560x1440',
    views: 890,
    downloads: 45,
    uploadDate: '2024-01-10'
  },
  // Add more sample images for related section
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `related-${i + 1}`,
    src: '/placeholder.svg',
    title: `Related Image ${i + 1}`,
    description: 'Related image description',
    author: { name: 'Artist Name', avatar: '/placeholder.svg' },
    isPremium: i % 3 === 0,
    category: 'landscape',
    size: '1920x1080',
    views: Math.floor(Math.random() * 1000) + 100,
    downloads: Math.floor(Math.random() * 100) + 10,
    uploadDate: '2024-01-01'
  }))
];

const ImageViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  // Find the current image
  const currentImage = sampleImages.find(img => img.id === id) || sampleImages[0];
  
  // Get related images (excluding current)
  const relatedImages = sampleImages
    .filter(img => img.id !== currentImage.id && img.category === currentImage.category)
    .slice(0, 8);

  const handleDownload = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (currentImage.isPremium) {
      alert('Premium download requires subscription');
    } else {
      alert('Starting download...');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleImageClick = (imageId: string) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Image Display Section */}
        <div className="relative bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-8 mb-8">
          {/* Top Action Bar */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowZoom(true)}
              className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              {currentImage.isPremium ? 'Premium' : 'Free'} Download
            </Button>
          </div>

          {/* Main Image */}
          <div className="flex justify-center">
            <img
              src={currentImage.src}
              alt={currentImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg cursor-pointer"
              onClick={() => setShowZoom(true)}
            />
          </div>
        </div>

        {/* Image Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Title & Description */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{currentImage.title}</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {currentImage.description}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {currentImage.views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {currentImage.downloads} downloads
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(currentImage.uploadDate).toLocaleDateString()}
              </div>
              <div className="text-sm">
                Size: {currentImage.size}
              </div>
            </div>
          </div>

          
        </div>

        {/* Related Images */}
        {relatedImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => handleImageClick(image.id)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden relative">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {image.isPremium && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Pro
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-medium mt-2 truncate">
                    {image.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to Download</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in to download this image.
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" onClick={() => setShowLoginModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Zoom Modal */}
      <Dialog open={showZoom} onOpenChange={setShowZoom}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
          <img
            src={currentImage.src}
            alt={currentImage.title}
            className="w-full h-full object-contain"
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ImageViewPage;