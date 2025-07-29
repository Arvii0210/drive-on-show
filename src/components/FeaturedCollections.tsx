
import React from 'react';
import { Download, Heart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const featuredItems = [
  {
    id: "1",
    src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop',
    title: 'Modern Workspace Collection',
    description: 'Professional workspace images perfect for business presentations and corporate websites',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '2.3K',
    likes: '891',
    views: '12.5K',
    isPremium: true,
    category: 'business'
  },
  {
    id: "2",
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    title: 'Code & Development Pack',
    description: 'High-quality programming and development themed images for tech projects',
    author: {
      name: 'Sarah Tech',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '1.8K',
    likes: '654',
    views: '9.2K',
    isPremium: false,
    category: 'technology'
  },
  {
    id: "3",
    src: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop',
    title: 'Nature Photography Set',
    description: 'Stunning nature and landscape photography for environmental and travel content',
    author: {
      name: 'Nature Mike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '3.1K',
    likes: '1.2K',
    views: '18.7K',
    isPremium: true,
    category: 'nature'
  },
  {
    id: "4",
    src: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    title: 'Golden Hour Collection',
    description: 'Beautiful golden hour photography with warm, cinematic lighting',
    author: {
      name: 'Golden Light',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '2.7K',
    likes: '987',
    views: '15.3K',
    isPremium: false,
    category: 'photography'
  },
  {
    id: "5",
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop',
    title: 'Lifestyle & Portraits',
    description: 'Professional lifestyle and portrait photography for personal and commercial use',
    author: {
      name: 'Portrait Pro',
      avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '1.9K',
    likes: '743',
    views: '11.8K',
    isPremium: true,
    category: 'lifestyle'
  },
  {
    id: "6",
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop',
    title: 'Landscape Masterpieces',
    description: 'Epic landscape photography showcasing the beauty of natural environments',
    author: {
      name: 'Landscape Art',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    downloads: '2.5K',
    likes: '856',
    views: '14.1K',
    isPremium: false,
    category: 'nature'
  }
];

const relatedImages = [
  {
    id: "r1",
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
    title: "MacBook Pro Setup",
    author: { name: "John Doe" },
    isPremium: false,
    category: "technology"
  },
  {
    id: "r2", 
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
    title: "Circuit Board",
    author: { name: "Jane Smith" },
    isPremium: true,
    category: "technology"
  },
  {
    id: "r3",
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop",
    title: "Laptop Computer",
    author: { name: "Mike Wilson" },
    isPremium: false,
    category: "technology"
  },
  {
    id: "r4",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
    title: "Forest Path",
    author: { name: "Nature Sam" },
    isPremium: false,
    category: "nature"
  }
];

const FeaturedCollections = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Popular Downloads
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what's trending in our community. These assets are loved by creators worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <Link 
              key={item.id}
              to="/category"
              className="group relative bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 border border-border block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                
                {/* Premium Badge */}
                {item.isPremium && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star size={12} className="mr-1" />
                    PREMIUM
                  </div>
                )}
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex gap-3">
                    <Button className="bg-white text-black hover:bg-gray-100 rounded-full p-3 shadow-lg transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      <Download size={18} />
                    </Button>
                    <Button variant="outline" className="bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70 rounded-full p-3 shadow-lg transform -translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-200">
                      <Heart size={18} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download size={14} />
                    <span>{item.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={14} />
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/category">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
