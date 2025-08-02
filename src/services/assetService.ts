import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/asset'; // Make sure this matches your backend route

// Asset interface based on the expected API response
export interface Asset {
  id: string;
  src: string;
  title: string;
  description?: string;
  author: {
    name: string;
    avatar?: string;
  };
  isPremium: boolean;
  category: string;
  createdAt?: string;
  updatedAt?: string;
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
  isPremium?: boolean;
  page?: number;
  limit?: number;
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
  // Handle different possible response structures
  if (Array.isArray(response)) {
    return response;
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

  // Search assets
  async searchAssets(params: SearchParams): Promise<Asset[]> {
    try {
      const response = await assetApi.get('/search', { params });
      return extractAssets(response.data);
    } catch (error) {
      console.error('Failed to search assets:', error);
      return [];
    }
  },

  // Get assets by category
  async getAssetsByCategory(categoryId: string): Promise<Asset[]> {
    try {
      // Try using search endpoint with just category parameter
      const response = await assetApi.get('/search', { 
        params: { 
          category: categoryId 
        } 
      });
      return extractAssets(response.data);
    } catch (error) {
      console.error(`Failed to fetch assets for category ${categoryId}:`, error);
      // Fallback: fetch all assets and filter client-side
      try {
        const allAssets = await this.getAssets();
        return allAssets.filter(asset => asset.category === categoryId);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
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
};
