import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/asset'; // Make sure this matches your backend route

// Asset interface based on the expected API response
export interface Asset {
  id: string;
  src?: string;
  title: string;
  description?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPremium?: boolean;
  isFree?: boolean;
  category?: {
    id: string;
    name: string;
    slug?: string;
  } | string; // Handle both object and string formats
  categoryId?: string; // Direct category ID from API
  assetCategory?: 'STANDARD' | 'PREMIUM'; // Asset category type
  fileType?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  tags?: string[];
  downloadCount?: number;
  viewCount?: number;
  thumbnail?: string;
  previewUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    colorPalette?: string[];
    dominantColors?: string[];
    keywords?: string[];
  };
}

export interface AssetStats {
  total: number;
  premium: number;
  free: number;
  categories: Record<string, number>;
}

export interface SearchParams {
  q?: string;
  category?: string;
  categoryId?: string;
  categoryName?: string;
  isPremium?: boolean;
  isFree?: boolean;
  assetType?: 'STANDARD' | 'PREMIUM';
  fileType?: string;
  tags?: string;
  sortBy?: 'createdAt' | 'title' | 'downloadCount' | 'category' | 'isPremium';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface AssetResponse {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    applied: SearchParams;
    available: {
      categories: Array<{ id: string; name: string; count: number }>;
      fileTypes: Array<{ type: string; count: number }>;
      tags: Array<{ tag: string; count: number }>;
    };
  };
}

// Create axios instance with auth interceptor
const assetApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
assetApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
assetApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to extract assets from different response structures
const extractAssets = (response: any): Asset[] => {
  console.log('Extracting assets from response:', response);
  
  // Handle different possible response structures
  if (Array.isArray(response)) {
    return response;
  }
  
  // Handle the actual API response structure: { success, status, message: { data: [...] } }
  if (response && response.message && Array.isArray(response.message.data)) {
    console.log('Found assets in response.message.data:', response.message.data);
    // Log the first asset to see its structure
    if (response.message.data.length > 0) {
      console.log('Sample asset structure:', response.message.data[0]);
    }
    return response.message.data;
  }
  
  if (response && Array.isArray(response.data)) {
    return response.data;
  }
  
  if (response && Array.isArray(response.assets)) {
    return response.assets;
  }
  
  if (response && Array.isArray(response.results)) {
    return response.results;
  }
  
  // If none of the above, return empty array
  console.warn('Unexpected API response structure:', response);
  return [];
};

export const assetService = {
  // Get all assets
  async getAssets(): Promise<Asset[]> {
    try {
      const response = await assetApi.get('/');
      console.log('Get assets response:', response.data);
      return extractAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      return [];
    }
  },

  // Get asset by ID
  async getAssetById(id: string): Promise<Asset | null> {
    try {
      const response = await assetApi.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch asset ${id}:`, error);
      return null;
    }
  },

  // Search assets with advanced filtering and pagination
  async searchAssets(params: SearchParams): Promise<AssetResponse> {
    try {
      const response = await assetApi.get('/search', { params });
      console.log('Search response:', response.data);
      
      // Handle the actual API response structure
      if (response.data && response.data.message && Array.isArray(response.data.message.data)) {
        const assets = response.data.message.data;
        const meta = response.data.message.meta || {};
        
        return {
          assets: assets,
          pagination: {
            page: meta.page || 1,
            limit: meta.limit || assets.length,
            total: meta.total || assets.length,
            totalPages: meta.totalPages || 1,
            hasNext: false,
            hasPrev: false,
          },
          filters: {
            applied: params,
            available: {
              categories: [],
              fileTypes: [],
              tags: [],
            },
          },
        };
      }
      
      // Handle both old format (array) and new format (structured response)
      if (Array.isArray(response.data)) {
        return {
          assets: response.data,
          pagination: {
            page: 1,
            limit: response.data.length,
            total: response.data.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
          filters: {
            applied: params,
            available: {
              categories: [],
              fileTypes: [],
              tags: [],
            },
          },
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to search assets:', error);
      return {
        assets: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          applied: params,
          available: {
            categories: [],
            fileTypes: [],
            tags: [],
          },
        },
      };
    }
  },

  // Get assets by category with advanced filtering
  async getAssetsByCategory(categoryId: string, params?: Partial<SearchParams>): Promise<AssetResponse> {
    try {
      // Since the search API requires a query, we'll fetch all assets and filter by category
      const allAssets = await this.getAssets();
      console.log('All assets:', allAssets);
      console.log('Filtering by categoryId:', categoryId);
      
      const filteredAssets = allAssets.filter(asset => {
        // Check for different possible category field names and structures
        const category = asset.category || asset.categoryId || (asset as any).categoryName;
        console.log('Asset:', asset.title, 'Category field:', category, 'CategoryId:', asset.categoryId);
        
        if (!category && !asset.categoryId) {
          console.log('No category for asset:', asset.title);
          return false;
        }
        
        // Handle string category (direct category name or ID)
        if (typeof category === "string") {
          const matches = category === categoryId || category.toLowerCase() === categoryId.toLowerCase();
          console.log('String category match:', category, '===', categoryId, '=', matches);
          return matches;
        }
        
        // Handle category object with different possible field names
        if (typeof category === "object" && category !== null) {
          const assetCategoryId = category.id || category.categoryId || category._id;
          const assetCategoryName = category.name || category.categoryName || category.title;
          
          const matches = assetCategoryId === categoryId || 
                         assetCategoryName === categoryId ||
                         assetCategoryName?.toLowerCase() === categoryId.toLowerCase();
          
          console.log('Object category match:', {
            assetCategoryId,
            assetCategoryName,
            categoryId,
            matches
          });
          return matches;
        }
        
        // Handle direct categoryId field
        if (asset.categoryId) {
          const matches = asset.categoryId === categoryId;
          console.log('Direct categoryId match:', asset.categoryId, '===', categoryId, '=', matches);
          return matches;
        }
        
        return false;
      });
      
      console.log('Filtered assets count:', filteredAssets.length);
      console.log('Filtered assets:', filteredAssets);
      
      // Apply additional filters if provided
      let finalAssets = filteredAssets;
      if (params?.isPremium !== undefined) {
        finalAssets = finalAssets.filter(asset => {
          const isPremium = asset.isPremium || asset.assetCategory === 'PREMIUM';
          return isPremium === params.isPremium;
        });
        console.log('After premium filter:', finalAssets.length, 'assets');
      }
      
      return {
        assets: finalAssets,
        pagination: {
          page: 1,
          limit: finalAssets.length,
          total: finalAssets.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          applied: { categoryId, ...params },
          available: {
            categories: [],
            fileTypes: [],
            tags: [],
          },
        },
      };
    } catch (error) {
      console.error(`Failed to fetch assets for category ${categoryId}:`, error);
      return {
        assets: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          applied: { categoryId, ...params },
          available: {
            categories: [],
            fileTypes: [],
            tags: [],
          },
        },
      };
    }
  },

  // Get asset statistics
  async getAssetStats(): Promise<AssetStats | null> {
    try {
      const response = await assetApi.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch asset stats:', error);
      return null;
    }
  },

  // Download asset
  async downloadAsset(id: string): Promise<{ downloadUrl: string; filename: string } | null> {
    try {
      const response = await assetApi.get(`/${id}/download`);
      return response.data;
    } catch (error) {
      console.error(`Failed to download asset ${id}:`, error);
      return null;
    }
  },

  // Get asset analytics
  async getAssetAnalytics(id: string): Promise<{
    downloadCount: number;
    viewCount: number;
    rating?: number;
    reviews?: number;
  } | null> {
    try {
      const response = await assetApi.get(`/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch analytics for asset ${id}:`, error);
      return null;
    }
  },

  // Get related assets
  async getRelatedAssets(id: string, limit: number = 10): Promise<Asset[]> {
    try {
      const response = await assetApi.get(`/${id}/related`, { params: { limit } });
      return extractAssets(response.data);
    } catch (error) {
      console.error(`Failed to fetch related assets for ${id}:`, error);
      return [];
    }
  },

  // Get trending assets
  async getTrendingAssets(limit: number = 20): Promise<Asset[]> {
    try {
      const response = await assetApi.get('/trending', { params: { limit } });
      return extractAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch trending assets:', error);
      return [];
    }
  },

  // Get assets by tags
  async getAssetsByTags(tags: string[], params?: Partial<SearchParams>): Promise<AssetResponse> {
    try {
      const searchParams: SearchParams = {
        tags: tags.join(','),
        page: 1,
        limit: 50,
        ...params,
      };
      
      return await this.searchAssets(searchParams);
    } catch (error) {
      console.error('Failed to fetch assets by tags:', error);
      return {
        assets: [],
        pagination: {
          page: 1,
          limit: 0,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          applied: { tags: tags.join(','), ...params },
          available: {
            categories: [],
            fileTypes: [],
            tags: [],
          },
        },
      };
    }
  },
};
