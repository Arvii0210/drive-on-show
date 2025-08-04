import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import { assetService, Asset, SearchParams, AssetResponse } from "@/services/assetService";
import { categoryService, Category } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Filter, 
  Download, 
  Grid3X3, 
  List,
  SlidersHorizontal,
  Sparkles,
  Eye,
  Heart,
  Star,
  TrendingUp,
  Zap,
  Crown,
  ChevronDown,
  X,
  Lock,
  AlertCircle
} from "lucide-react";
import Header from "@/components/Header";
import Pagination from "@/components/ui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useDownload } from "@/hooks/useDownload";
import DownloadButton from "@/components/DownloadButton";

// Hook to parse URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const AssetList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const { toast } = useToast();
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  
  const [availableFilters, setAvailableFilters] = useState({
    categories: [],
    fileTypes: [],
    tags: [],
  });
  
  // Initialize filters with URL params
  const [filters, setFilters] = useState<{
    q: string;
    categoryId: string;
    isPremium: string;
    page: string;
  }>({
    q: query.get("q") || "",
    categoryId: query.get("categoryId") || "",
    isPremium: query.get("isPremium") || "",
    page: query.get("page") || "1",
  });

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
    hidden: { y: 20, opacity: 0 },
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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = {
      q: query.get("q") || "",
      categoryId: query.get("categoryId") || "",
      isPremium: query.get("isPremium") || "",
      page: query.get("page") || "1",
    };
    setFilters(newFilters);
  }, [location.search]);

  // Set category name when filters change
  useEffect(() => {
    if (filters.categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === filters.categoryId);
      setCategoryName(selectedCategory?.categoryName || "");
    } else {
      setCategoryName("");
    }
  }, [filters.categoryId, categories]);

  // Fetch assets when component mounts or filters change
  useEffect(() => {
    handleSearch();
  }, [filters]);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await assetService.getAssets();
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets. Please try again.",
        variant: "destructive",
      });
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSearch = useCallback(async () => {
    if (!filters.q.trim() && !filters.categoryId && !filters.isPremium) {
      await fetchAssets();
      return;
    }

    if (!filters.q.trim() && !filters.categoryId && filters.isPremium) {
      setSearchLoading(true);
      setLoading(false);
      try {
        const data = await assetService.getAssets();
        let filteredAssets = Array.isArray(data) ? data : [];
        
        if (filters.isPremium === "true") {
          filteredAssets = filteredAssets.filter(asset => asset.isPremium);
        } else if (filters.isPremium === "false") {
          filteredAssets = filteredAssets.filter(asset => !asset.isPremium);
        }
        
        setAssets(filteredAssets);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load assets. Please try again.",
          variant: "destructive",
        });
        setAssets([]);
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    if (!filters.q.trim() && filters.categoryId) {
      setSearchLoading(true);
      setLoading(false);
      try {
        const response = await assetService.getAssetsByCategory(filters.categoryId);
        let filteredAssets = response.assets || [];
        
        if (filters.isPremium === "true") {
          filteredAssets = filteredAssets.filter(asset => asset.isPremium);
        } else if (filters.isPremium === "false") {
          filteredAssets = filteredAssets.filter(asset => !asset.isPremium);
        }
        
        setAssets(filteredAssets);
        setPagination(response.pagination || {
          page: 1,
          limit: filteredAssets.length,
          total: filteredAssets.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        });
        setAvailableFilters(response.filters?.available || {
          categories: [],
          fileTypes: [],
          tags: [],
        });
      } catch (error) {
        console.error("Category filtering failed:", error);
        toast({
          title: "Error",
          description: "Failed to load category assets. Please try again.",
          variant: "destructive",
        });
        setAssets([]);
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    if (filters.q.trim()) {
      setSearchLoading(true);
      setLoading(false);
      try {
        const searchParams: SearchParams = {
          q: filters.q.trim() || undefined,
          category: filters.categoryId || undefined,
          isPremium: filters.isPremium === "true" ? true : filters.isPremium === "false" ? false : undefined,
        };
        
        const response = await assetService.searchAssets(searchParams);
        setAssets(response.assets || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
        setAvailableFilters(response.filters?.available || {
          categories: [],
          fileTypes: [],
          tags: [],
        });
      } catch (error) {
        console.error('Search failed:', error);
        toast({
          title: "Error",
          description: "Failed to search assets. Please try again.",
          variant: "destructive",
        });
        setAssets([]);
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    await fetchAssets();
  }, [filters, fetchAssets, toast]);

  const updateURL = useCallback((newFilters: typeof filters) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.categoryId) params.set("categoryId", newFilters.categoryId);
    if (newFilters.isPremium) params.set("isPremium", newFilters.isPremium);
    if (newFilters.page && newFilters.page !== "1") params.set("page", newFilters.page);
    
    const newURL = params.toString() ? `${location.pathname}?${params.toString()}` : location.pathname;
    navigate(newURL, { replace: true });
  }, [navigate, location.pathname]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleImageClick = (asset: Asset) => {
    navigate(`/image/${asset.id}`);
  };

  const handleDownload = async (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const result = await assetService.downloadAsset(assetId);
      if (result) {
        toast({
          title: "Download Started",
          description: `Downloading ${result.filename}`,
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Failed to download asset. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(assetId)) {
      newFavorites.delete(assetId);
    } else {
      newFavorites.add(assetId);
    }
    setFavorites(newFavorites);
  };

  const clearFilters = () => {
    const newFilters = { q: "", categoryId: "", isPremium: "", page: "1" };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page: page.toString() };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Loading Assets</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Preparing your creative journey...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const safeAssets = Array.isArray(assets) ? assets : [];
  const hasActiveFilters = filters.q || filters.categoryId || filters.isPremium;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Header />

      {/* Hero Section with Category Title */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-12">
          {categoryName ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Category Collection
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent mb-4">
                {categoryName}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover {safeAssets.length} premium {categoryName.toLowerCase()} assets crafted by talented creators
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending Assets
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-4">
                Creative Assets
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Explore thousands of high-quality assets to fuel your creativity
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Advanced Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-slate-700/50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search for amazing assets..."
                  value={filters.q}
                  onChange={(e) => handleFilterChange("q", e.target.value)}
                  className="pl-12 pr-4 py-3 text-base bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onKeyDown={handleKeyDown}
                />
                {filters.q && (
                  <button
                    onClick={() => handleFilterChange("q", "")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filters.categoryId}
                  onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* Premium Filter */}
              <div className="relative">
                <select
                  value={filters.isPremium}
                  onChange={(e) => handleFilterChange("isPremium", e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm font-medium min-w-[120px]"
                >
                  <option value="">All Types</option>
                  <option value="true">Premium</option>
                  <option value="false">Free</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'masonry' 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={searchLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {searchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="px-4 py-3 border-slate-200 dark:border-slate-700 rounded-xl font-medium transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  disabled={searchLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {searchLoading ? (
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">Searching assets...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {safeAssets.length.toLocaleString()} Assets
                  </span>
                </div>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    Filtered Results
                  </Badge>
                )}
              </div>
            )}
          </motion.div>
          
          {!searchLoading && safeAssets.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-slate-500 dark:text-slate-400"
            >
              Updated just now
            </motion.div>
          )}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">
          {searchLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="inline-flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Finding Perfect Assets
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Curating the best results for you...
                  </p>
                </div>
              </div>
            </motion.div>
          ) : safeAssets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="inline-flex flex-col items-center space-y-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    No Assets Found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search criteria or explore different categories
                  </p>
                </div>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === 'masonry'
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              }
            >
              {safeAssets.map((item, idx) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`${viewMode === 'masonry' ? 'break-inside-avoid' : ''} group cursor-pointer`}
                  onMouseEnter={() => setHoveredAsset(item.id)}
                  onMouseLeave={() => setHoveredAsset(null)}
                  onClick={() => handleImageClick(item)}
                >
                  <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50">
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <img
                        src={item.src || item.thumbnail || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        style={{ 
                          height: viewMode === 'masonry' 
                            ? `${200 + (idx % 4) * 40}px` 
                            : '250px' 
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />

                      {/* Premium Badge */}
                      {(item.isPremium || item.assetCategory === 'PREMIUM') && (
                        <div className="absolute top-3 right-3 z-20">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-lg backdrop-blur-sm">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        </div>
                      )}

                      {/* Quality Indicator */}
                      <div className="absolute top-3 left-3 z-20">
                        <Badge variant="secondary" className="bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-0 backdrop-blur-sm">
                          <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                          HD
                        </Badge>
                      </div>

                      {/* Action Buttons Overlay */}
                      <div className={`absolute inset-0 z-20 flex items-center justify-center space-x-3 transition-all duration-300 ${
                        hoveredAsset === item.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <DownloadButton
                            assetId={item.id}
                            isPremium={item.isPremium || item.assetCategory === 'PREMIUM'}
                            variant="secondary"
                            className="bg-white/95 hover:bg-white text-slate-900 shadow-lg backdrop-blur-sm border-0 transition-all duration-200 hover:scale-105"
                          />
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Preview functionality
                          }}
                          className="bg-white/95 hover:bg-white text-slate-900 border-slate-200 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className={`shadow-lg backdrop-blur-sm border-0 transition-all duration-200 hover:scale-105 ${
                            favorites.has(item.id)
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-white/95 hover:bg-white text-slate-900'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(item.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                          {item.title}
                        </h3>
                        
                        {/* Description */}
                        {item.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {item.author?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {item.author?.name || "Unknown"}
                            </span>
                          </div>
                          
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-0"
                          >
                            {item.assetCategory || 
                             (typeof item.category === 'string' ? item.category : item.category?.name) || 
                             'Asset'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
       
      {/* Enhanced Pagination */}
      {!searchLoading && safeAssets.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </div>
      )}
       
      <Footer />
    </div>
  );
};

export default AssetList;
