import { apiConfig } from '@/config/api';

export interface Asset {
  id: number;
  name: string;
  description?: string;
  category: string;
  type: string;
  isPremium: boolean;
  downloadCount: number;
  viewCount: number;
  imageUrl: string;
  fileUrl: string;
  fileSize: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetFilters {
  category?: string;
  type?: string;
  isPremium?: boolean;
  search?: string;
  tags?: string[];
  sortBy?: 'name' | 'downloadCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AssetResponse {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    categories: string[];
    priceRanges: string[];
  };
}

export interface AssetStats {
  total: number;
  premium: number;
  free: number;
  categories: Array<{
    name: string;
    count: number;
  }>;
}

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  return fetch(url, options);
}

export const AssetService = {
  async getAssets(
    page: number = 1,
    limit: number = 12,
    filters?: AssetFilters
  ): Promise<AssetResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.isPremium !== undefined && { isPremium: filters.isPremium.toString() }),
        ...(filters?.search && { search: filters.search }),
        ...(filters?.sortBy && { sortBy: filters.sortBy }),
        ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
      });

      if (filters?.tags?.length) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching assets:', error);
      return {
        assets: [],
        pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
        filters: { categories: [], priceRanges: [] }
      };
    }
  },

  async getAssetById(id: number): Promise<Asset | null> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.asset || null;
    } catch (error) {
      console.error('Error fetching asset:', error);
      return null;
    }
  },

  async searchAssets(query: string, filters?: AssetFilters): Promise<AssetResponse> {
    return this.getAssets(1, 12, { ...filters, search: query });
  },

  async getAssetsByCategory(category: string, page: number = 1): Promise<AssetResponse> {
    return this.getAssets(page, 12, { category });
  },

  async getFeaturedAssets(limit: number = 8): Promise<Asset[]> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets/featured?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.assets || [];
    } catch (error) {
      console.error('Error fetching featured assets:', error);
      return [];
    }
  },

  async getAssetStats(): Promise<AssetStats> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching asset stats:', error);
      return {
        total: 0,
        premium: 0,
        free: 0,
        categories: []
      };
    }
  },

  async downloadAsset(assetId: number): Promise<{ downloadUrl: string; filename: string; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets/${assetId}/download`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        downloadUrl: data.downloadUrl || '',
        filename: data.filename || 'download'
      };
    } catch (error) {
      console.error('Error downloading asset:', error);
      return {
        downloadUrl: '',
        filename: 'download'
      };
    }
  },

  async getAssetAnalytics(assetId: number): Promise<{ downloadCount: number; viewCount: number; rating?: number; reviews?: number; }> {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseURL}/assets/${assetId}/analytics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        downloadCount: data.downloadCount || 0,
        viewCount: data.viewCount || 0,
        rating: data.rating,
        reviews: data.reviews
      };
    } catch (error) {
      console.error('Error fetching asset analytics:', error);
      return {
        downloadCount: 0,
        viewCount: 0,
        rating: 0,
        reviews: 0
      };
    }
  },

  async incrementView(assetId: number): Promise<void> {
    try {
      await fetchWithAuth(`${apiConfig.baseURL}/assets/${assetId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  },
};