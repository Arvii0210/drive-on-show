import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Download, ArrowLeft, Share2, Heart, Eye, Calendar, User, Maximize2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDownload } from '@/hooks/useDownload';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { assetService, Asset } from '@/services/assetService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ImageViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const { downloadAsset, downloading } = useDownload(refreshSubscription);
  
  const [currentImage, setCurrentImage] = useState<Asset | null>(null);
  const [relatedImages, setRelatedImages] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  // Fetch asset data
  useEffect(() => {
    const fetchAssetData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetch current asset
        const asset = await assetService.getAssetById(id);
        if (asset) {
          setCurrentImage(asset);
          
          // Fetch related assets
          const related = await assetService.getRelatedAssets(id, 8);
          setRelatedImages(related);
        }
      } catch (error) {
        console.error('Failed to fetch asset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
  }, [id]);

  const handleDownload = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (!currentImage) return;
    
    const assetType = currentImage.isPremium || currentImage.assetCategory === 'PREMIUM' ? 'premium' : 'standard';
    await downloadAsset(currentImage.id, assetType);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleImageClick = (imageId: string) => {
    navigate(`/image/${imageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading image...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Image Not Found</h1>
            <p className="text-muted-foreground mb-6">The image you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/photos')}>
              Browse All Images
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const imageSrc = currentImage.thumbnail || currentImage.previewUrl || currentImage.src || '/placeholder.svg';
  const isPremium = currentImage.isPremium || currentImage.assetCategory === 'PREMIUM';

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
              disabled={downloading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Downloading...' : `${isPremium ? 'Premium' : 'Free'} Download`}
            </Button>
          </div>

          {/* Main Image */}
          <div className="flex justify-center">
            <img
              src={imageSrc}
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
              {currentImage.description || 'No description available.'}
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {(currentImage.viewCount || 0).toLocaleString()} views
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {(currentImage.downloadCount || 0)} downloads
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {currentImage.createdAt ? new Date(currentImage.createdAt).toLocaleDateString() : 'Unknown date'}
              </div>
              <div className="text-sm">
                {currentImage.dimensions ? 
                  `Size: ${currentImage.dimensions.width}x${currentImage.dimensions.height}` : 
                  'Size: Unknown'
                }
              </div>
              {currentImage.fileType && (
                <div className="text-sm">
                  Type: {currentImage.fileType.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Images */}
        {relatedImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedImages.map((image) => {
                const relatedImageSrc = image.thumbnail || image.previewUrl || image.src || '/placeholder.svg';
                const isRelatedPremium = image.isPremium || image.assetCategory === 'PREMIUM';
                
                return (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(image.id)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden relative">
                      <img
                        src={relatedImageSrc}
                        alt={image.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isRelatedPremium && (
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
                );
              })}
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
            src={imageSrc}
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