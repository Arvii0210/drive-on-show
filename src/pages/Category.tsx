import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Crown, 
  Star, 
  TrendingUp, 
  Zap, 
  Camera, 
  Palette, 
  Globe, 
  Shield,
  Play,
  Download,
  Eye,
  ChevronRight,
  Award,
  Layers,
  Image as ImageIcon,
  Heart
} from "lucide-react";

import { Category, categoryService } from '@/services/categoryService';

const faqData = [
  {
    id: 1,
    question: "What types of photos are available?",
    answer: "We offer a wide variety of high-quality stock photos including business, lifestyle, nature, technology, food, and many other categories.",
    icon: <ImageIcon className="w-5 h-5" />
  },
  {
    id: 2,
    question: "Can I use these photos for commercial purposes?",
    answer: "Yes, all our photos come with commercial licenses that allow you to use them in your business projects, marketing materials, websites, and more.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 3,
    question: "How do I download photos?",
    answer: "Simply browse our categories, click on the photo you like, and choose your preferred resolution. Free users can download standard resolution.",
    icon: <Download className="w-5 h-5" />
  },
  {
    id: 4,
    question: "What's the difference between free and premium content?",
    answer: "Free content includes standard resolution photos. Premium content offers high-resolution images, extended licenses, and exclusive collections.",
    icon: <Crown className="w-5 h-5" />
  },
  {
    id: 5,
    question: "Do I need to give credit to photographers?",
    answer: "While not always required, we encourage giving credit. Some free photos may require attribution – this is marked on each photo's download page.",
    icon: <Award className="w-5 h-5" />
  },
];

const CategoryPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'standard' | 'premium'>('grid');
  const profileRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const cats = await categoryService.getCategories();
        setCategories(cats);
        setError(null);
      } catch (err) {
        setCategories([]);
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const standardCategories = categories.filter(cat => true);
  const premiumCategories = categories.filter(cat => true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Loading Categories
              </h3>
              <p className="text-slate-600 dark:text-slate-400">Discovering amazing collections...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
              }
            }}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Stock Photography
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                The Perfect Photo
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                For Every Story
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Discover millions of stunning, professional photos across every category imaginable. 
              From breathtaking landscapes to intimate portraits find your perfect visual story.
            </p>

            

           
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'grid', label: 'All Categories', icon: <Layers className="w-4 h-4" /> },
              { id: 'standard', label: 'Standard Collection', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'premium', label: 'Premium Collection', icon: <Crown className="w-4 h-4" /> }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeView === tab.id ? "default" : "outline"}
                onClick={() => setActiveView(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeView === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Category Grid */}
      <AnimatePresence mode="wait">
        {activeView === 'grid' && (
          <motion.section
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-6"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-100 dark:to-blue-100 bg-clip-text text-transparent">
                    Browse by Category
                  </span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Explore our carefully curated collections of professional photography
                </p>
              </motion.div>

              {error ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Oops! Something went wrong</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {categories.length > 0 ? categories.map((category, index) => (
                    <motion.div key={category.id} variants={itemVariants}>
                      <Link
                        to={`/photos?categoryId=${category.id}`}
                        className="group block"
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-200/50 dark:border-slate-700/50">
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <img
                              src={category.imageUrl || '/placeholder.svg'}
                              alt={category.categoryName}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />

                            {/* Overlay Content */}
                            <div className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-300 ${
                              hoveredCategory === category.id ? 'opacity-100' : 'opacity-0'
                            }`}>
                              <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl px-6 py-3 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                <div className="flex items-center space-x-2 text-slate-900 dark:text-slate-100">
                                  <Eye className="w-4 h-4" />
                                  <span className="font-medium">View Collection</span>
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>

                            {/* Category Number Badge */}
                            <div className="absolute top-4 left-4 z-30">
                              <div className="w-8 h-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-sm font-bold text-slate-900 dark:text-slate-100">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="space-y-3">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {category.categoryName}
                              </h3>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                  <Camera className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    {category._count?.assets?.toLocaleString() || 0} photos
                                  </span>
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    4.9
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar showing popularity */}
                              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.min((category._count?.assets || 0) / 100 * 10, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-20"
                    >
                      <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-12 h-12 text-slate-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">No Categories Found</h3>
                      <p className="text-slate-600 dark:text-slate-400">We're working on adding amazing categories for you!</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* Standard Categories Masonry */}
        {activeView === 'standard' && (
          <motion.section
            key="standard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Standard Collection
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Free & Premium Quality
                  </span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  High-quality photos available for everyone. Perfect for personal projects and commercial use.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              >
                {standardCategories.map((category, index) => (
                    <motion.div key={`standard-${category.id}`} variants={itemVariants}>
                    <Link
                      to={`/photos?categoryId=${category.id}&isPremium=false`}
                      className="group block break-inside-avoid"
                    >
                      <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="relative overflow-hidden">
                          <img
                            src={category.imageUrl || '/placeholder.svg'}
                            alt={category.categoryName}
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ height: `${200 + (index % 3) * 50}px` }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          
                          {/* Standard Badge */}
                          <div className="absolute top-3 right-3">
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>Standard</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {category.categoryName}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>{category._count?.assets?.toLocaleString() || 0} photos</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              <span>4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Premium Categories Masonry */}
        {activeView === 'premium' && (
          <motion.section
            key="premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20 px-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium mb-6">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Collection
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Exclusive Premium Content
                  </span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Access our most exclusive, high-resolution images with extended commercial licenses.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              >
                {premiumCategories.map((category, index) => (
                    <motion.div
                    key={`premium-${category.id}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={`/photos?categoryId=${category.id}&isPremium=true`}
                      className="group block break-inside-avoid"
                    >
                      <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-yellow-200/50 dark:border-yellow-700/30">
                        <div className="relative overflow-hidden">
                          <img
                            src={category.imageUrl || '/placeholder.svg'}
                            alt={category.categoryName}
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            style={{ height: `${220 + (index % 4) * 40}px` }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          
                          {/* Premium Badge */}
                          <div className="absolute top-3 right-3">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 shadow-lg">
                              <Crown className="w-3 h-3" />
                              <span>Premium</span>
                            </div>
                          </div>

                          {/* Premium Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="p-5 bg-gradient-to-br from-white to-yellow-50/30 dark:from-slate-900 dark:to-yellow-900/10">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                            {category.categoryName}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>{category._count?.assets?.toLocaleString() || 0} photos</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-current text-yellow-500" />
                              <span className="font-semibold">5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-100 dark:to-blue-100 bg-clip-text text-transparent">
                Why Choose Our Platform?
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Professional quality meets unbeatable convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Collection",
                description: "Photos from talented photographers worldwide"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Commercial License",
                description: "Use in all your commercial projects worry-free"
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "Instant Download",
                description: "Get your photos immediately in high resolution"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Curated Quality",
                description: "Every photo is reviewed by our expert team"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-blue-900 dark:from-slate-100 dark:to-blue-100 bg-clip-text text-transparent">
                Got Questions?
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              We've got the answers you're looking for
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${faq.id}`}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-0 overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors [&[data-state=open]]:text-blue-600 dark:[&[data-state=open]]:text-blue-400">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                          {faq.icon}
                        </div>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                      <div className="pl-13">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
