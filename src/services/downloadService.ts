import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/download';

// Download API interfaces
export interface DownloadEligibility {
  canDownload: boolean;
  reason?: string;
  isFree: boolean;
  subscriptionId?: string;
  remainingCredits?: {
    standard: number;
    premium: number;
  };
}

export interface DownloadRecord {
  id: string;
  userId: string;
  assetId: string;
  subscriptionId?: string;
  category: string;
  isFree: boolean;
  downloadedAt: string;
  asset: {
    title: string;
    thumbnailUrl?: string;
    category: string;
  };
}

export interface DownloadHistory {
  downloads: DownloadRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Create axios instance
const downloadApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
downloadApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
downloadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Download API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const downloadService = {
  // Check download eligibility
  async checkEligibility(userId: string, assetId: string, subscriptionId?: string): Promise<DownloadEligibility> {
    try {
      const params: any = { userId, assetId };
      if (subscriptionId) params.subscriptionId = subscriptionId;
      
      const response = await downloadApi.get('/check-eligibility', { params });
      return response.data.message || response.data;
    } catch (error) {
      console.error('Failed to check download eligibility:', error);
      throw new Error('Failed to check download eligibility');
    }
  },

  // Record a download
  async recordDownload(userId: string, assetId: string, subscriptionId?: string, isFree: boolean = false): Promise<{
    download: DownloadRecord;
    fileUrl: string;
    fileType: string;
  }> {
    try {
      const response = await downloadApi.post('/record', {
        userId,
        assetId,
        subscriptionId,
        isFree
      });
      return response.data.message || response.data;
    } catch (error) {
      console.error('Failed to record download:', error);
      throw new Error('Failed to record download');
    }
  },

  // Get user download history
  async getUserDownloads(userId: string, page: number = 1, limit: number = 10, category?: string): Promise<DownloadHistory> {
    try {
      const params: any = { page, limit };
      if (category) params.category = category;
      
      const response = await downloadApi.get(`/user/${userId}`, { params });
      return response.data.message || response.data;
    } catch (error) {
      console.error('Failed to get user downloads:', error);
      return {
        downloads: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }
};