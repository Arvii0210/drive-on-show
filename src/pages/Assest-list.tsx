import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import { assetService, Asset, SearchParams, AssetResponse } from "@/services/assetService";
import { categoryService, Category } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Download } from "lucide-react";
import Header from "@/components/Header";
import Pagination from "@/components/ui/pagination";

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

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        console.log('Fetched categories:', cats);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Update filters when URL changes (for navigation between categories)
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
      console.log('Fetched assets:', data);
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
    console.log('handleSearch called with filters:', filters);
    
    // If no search criteria, fetch all assets
    if (!filters.q.trim() && !filters.categoryId && !filters.isPremium) {
      console.log('No filters, fetching all assets');
      await fetchAssets();
      return;
    }

    // If there's only premium filter but no search query, fetch all assets and filter client-side
    if (!filters.q.trim() && !filters.categoryId && filters.isPremium) {
      console.log('Only premium filter, fetching all assets and filtering client-side');
      setSearchLoading(true);
      setLoading(false); // Set main loading to false since we're using searchLoading
      try {
        const data = await assetService.getAssets();
        let filteredAssets = Array.isArray(data) ? data : [];
        
        // Apply premium filter client-side
        if (filters.isPremium === "true") {
          filteredAssets = filteredAssets.filter(asset => asset.isPremium);
        } else if (filters.isPremium === "false") {
          filteredAssets = filteredAssets.filter(asset => !asset.isPremium);
        }
        
        console.log('Premium filtered assets:', filteredAssets);
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

    // If there's only category filter but no search query, fetch assets by category
    if (!filters.q.trim() && filters.categoryId) {
      console.log('Fetching assets for category:', filters.categoryId);
      setSearchLoading(true);
      setLoading(false); // Set main loading to false since we're using searchLoading
      try {
        const response = await assetService.getAssetsByCategory(filters.categoryId);
        console.log('Category response:', response);
        let filteredAssets = response.assets || [];
        
        // Apply premium filter client-side if needed
        if (filters.isPremium === "true") {
          filteredAssets = filteredAssets.filter(asset => asset.isPremium);
        } else if (filters.isPremium === "false") {
          filteredAssets = filteredAssets.filter(asset => !asset.isPremium);
        }
        
        console.log('Final filtered assets:', filteredAssets);
        console.log('Setting assets state with:', filteredAssets.length, 'assets');
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
        setPagination({
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        });
      } finally {
        setSearchLoading(false);
      }
      return;
    }

    // If there's a search query, use search API
    if (filters.q.trim()) {
      console.log('Using search API with query:', filters.q);
      setSearchLoading(true);
      setLoading(false); // Set main loading to false since we're using searchLoading
      try {
        const searchParams: SearchParams = {
          q: filters.q.trim() || undefined,
          category: filters.categoryId || undefined,
          isPremium:
            filters.isPremium === "true"
              ? true
              : filters.isPremium === "false"
              ? false
              : undefined,
        };
        
        const response = await assetService.searchAssets(searchParams);
        console.log('Search response:', response);
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

    // Fallback: fetch all assets
    console.log('Fallback: fetching all assets');
    await fetchAssets();
  }, [filters, fetchAssets, toast]);

  // Update URL when filters change (for shareable URLs)
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
        // You can implement actual file download here
        // window.open(result.downloadUrl, "_blank");
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading assets...</span>
          </div>
        </div>
      </div>
    );
  }

  const safeAssets = Array.isArray(assets) ? assets : [];
  console.log('Current assets state:', assets);
  console.log('Safe assets for rendering:', safeAssets);
  console.log('Safe assets length:', safeAssets.length);
  console.log('Safe assets type:', typeof safeAssets);
  console.log('Loading state:', loading);
  console.log('Search loading state:', searchLoading);
  console.log('Current filters:', filters);
  console.log('Should show loading screen:', loading);
  console.log('Should show search loading:', searchLoading);
  console.log('Should show assets:', !loading && !searchLoading && safeAssets.length > 0);
  
  // Debug: Log the first asset structure if available
  if (safeAssets.length > 0) {
    console.log('First asset structure:', safeAssets[0]);
    console.log('First asset keys:', Object.keys(safeAssets[0]));
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Category Title */}
      {categoryName && (
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {categoryName}
            </h1>
            <p className="text-muted-foreground">
              Browse {safeAssets.length} asset{safeAssets.length !== 1 ? 's' : ''} in this category
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 pb-6 pt-16">
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assets..."
                  value={filters.q}
                  onChange={(e) => handleFilterChange("q", e.target.value)}
                  className="pl-10"
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>

            {/* Premium Filter */}
            <select
              value={filters.isPremium}
              onChange={(e) => handleFilterChange("isPremium", e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">All Assets</option>
              <option value="true">Premium Only</option>
              <option value="false">Free Only</option>
            </select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              className="flex items-center space-x-2"
            >
              {searchLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Search</span>
            </Button>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center space-x-2"
              disabled={searchLoading}
            >
              <Filter className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {searchLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading assets...</span>
              </span>
            ) : (
              `${safeAssets.length} asset${safeAssets.length !== 1 ? "s" : ""} found`
            )}
          </p>
          {searchLoading && (
            <div className="text-sm text-muted-foreground">
              Please wait...
            </div>
          )}
        </div>
      </div>

             {/* Masonry Grid Section */}
       <div className="max-w-7xl mx-auto px-6 pb-10">
         {searchLoading ? (
           <div className="text-center py-12">
             <div className="flex items-center justify-center space-x-2">
               <Loader2 className="h-6 w-6 animate-spin" />
               <span>Loading assets...</span>
             </div>
           </div>
         ) : safeAssets.length === 0 ? (
           <div className="text-center py-12">
             <p className="text-muted-foreground">
               No assets found. Try adjusting your search criteria.
             </p>
           </div>
         ) : (
                     <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
             {safeAssets.map((item, idx) => (
              <div
                key={item.id}
                className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-card cursor-pointer group"
                onClick={() => handleImageClick(item)}
              >
                                 <div className="relative">
                   <img
                     src={item.src || item.thumbnail || '/placeholder.svg'}
                     alt={item.title}
                     className="w-full object-cover rounded-2xl hover:scale-105 transition duration-300"
                     style={{ height: `${200 + (idx % 3) * 50}px` }}
                     onError={(e) => {
                       console.log('Image failed to load for asset:', item.title, 'URL:', item.src || item.thumbnail);
                       const target = e.target as HTMLImageElement;
                       target.src = '/placeholder.svg';
                     }}
                     onLoad={(e) => {
                       console.log('Image loaded successfully for asset:', item.title);
                     }}
                   />

                  {/* Premium Badge */}
                  {(item.isPremium || item.assetCategory === 'PREMIUM') && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                      Premium
                    </Badge>
                  )}

                  {/* Download Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      onClick={(e) => handleDownload(item.id, e)}
                      className="bg-white text-black hover:bg-gray-100"
                      disabled={searchLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-sm font-semibold text-foreground text-center mb-1">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground text-center mb-2">
                      {item.description}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {item.author?.name ?? "Unknown"}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.assetCategory || (typeof item.category === 'string' ? item.category : item.category?.name) || 'Unknown'}
                    </Badge>
                  </div>
                                  </div>
                </div>
              ))}
          </div>
                 )}
       </div>
       
       {/* Pagination */}
       <Pagination
         currentPage={pagination.page}
         totalPages={pagination.totalPages}
         total={pagination.total}
         limit={pagination.limit}
         onPageChange={handlePageChange}
         hasNext={pagination.hasNext}
         hasPrev={pagination.hasPrev}
       />
       
       <Footer />
     </div>
   );
 };

export default AssetList;

