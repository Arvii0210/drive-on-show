import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/downloads';

// TypeScript interfaces
export interface DownloadEligibility {
  canDownload: boolean;
  reason?: string;
  remainingDownloads?: number;
  subscriptionStatus?: string;
  subscriptionId?: string;
  isFree?: boolean;
  quotaInfo?: {
    dailyLimit: number;
    dailyUsed: number;
    remainingToday: number;
    resetTime: string;
  };
}

export interface DownloadRecord {
  id: string;
  userId: string;
  assetId: string;
  subscriptionId?: string;
  downloadedAt: string;
  isFree: boolean;
  asset?: {
    title: string;
    fileType?: string;
    assetCategory?: 'STANDARD' | 'PREMIUM'; // Asset category type
    imageUrl?: string;
    [key: string]: any;
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

// Enhanced response interceptor
downloadApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('Download API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const downloadService = {
  // Check download eligibility
  async checkEligibility(userId: string, assetId: string, subscriptionId?: string): Promise<DownloadEligibility> {
    try {
      console.log('Checking eligibility for:', { userId, assetId, subscriptionId });
      
      const params: any = { userId, assetId };
      if (subscriptionId) params.subscriptionId = subscriptionId;
      
      const response = await downloadApi.get('/check-eligibility', { params });
      
      console.log('Raw eligibility response:', response.data);
      
      // Handle different response structures
      let eligibilityData;
      if (response.data.success && response.data.data) {
        eligibilityData = response.data.data;
      } else if (response.data.message) {
        eligibilityData = response.data.message;
      } else {
        eligibilityData = response.data;
      }
      
      console.log('Processed eligibility data:', eligibilityData);
      
      // Validate the response structure
      if (typeof eligibilityData.canDownload === 'undefined') {
        throw new Error('Invalid eligibility response structure');
      }
      
      return eligibilityData;
    } catch (error) {
      console.error('Failed to check download eligibility:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (error.response?.status === 403) {
          throw new Error('You don\'t have permission to access this asset.');
        } else if (error.response?.status === 404) {
          throw new Error('Asset not found.');
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      
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
      const requestData: any = {
        userId,
        assetId,
        isFree
      };
      
      // Only include subscriptionId if it's defined
      if (subscriptionId) {
        requestData.subscriptionId = subscriptionId;
      }
      
      console.log('Recording download for:', requestData);
      console.log('Request payload:', JSON.stringify(requestData, null, 2));
      
      const response = await downloadApi.post('/record', requestData);
      
      console.log('Raw record download response:', response.data);
      
      // Handle different response structures
      let downloadData;
      if (response.data.success && response.data.data) {
        downloadData = response.data.data;
      } else if (response.data.message) {
        downloadData = response.data.message;
      } else {
        downloadData = response.data;
      }
      
      console.log('Processed download data:', downloadData);
      
      // Validate the response structure
      if (!downloadData.mainFile) {
        throw new Error('No file URL provided in response');
      }
      
      if (!downloadData.download) {
        throw new Error('No download record in response');
      }
      
      return downloadData;
    } catch (error) {
      console.error('Failed to record download:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Server error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.response?.data?.message || error.response?.data?.error || error.message
        });
        
        if (error.response?.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (error.response?.status === 403) {
          throw new Error('You don\'t have permission to download this asset.');
        } else if (error.response?.status === 404) {
          throw new Error('Asset not found.');
        } else if (error.response?.status === 500) {
          const serverMessage = error.response?.data?.message || error.response?.data?.error || 'Server error occurred';
          throw new Error(`Server error: ${serverMessage}`);
        } else if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Failed to record download');
    }
  },

  async getUserDownloads(userId: string, page: number = 1, limit: number = 10, category?: string): Promise<DownloadHistory> {
    try {
      const params: any = { page, limit };
      if (category) params.category = category;
      
      const response = await downloadApi.get(`/user/${userId}`, { params });
      
      console.log('Raw getUserDownloads response:', response.data);
      
      // Handle different response structures
      let downloadData;
      if (response.data.success && response.data.data) {
        downloadData = response.data.data;
      } else if (response.data.message) {
        downloadData = response.data.message;
      } else {
        downloadData = response.data;
      }
      
      console.log('Processed getUserDownloads data:', downloadData);
      
      // Ensure we have the expected structure
      if (!downloadData.downloads) {
        downloadData.downloads = [];
      }
      if (!downloadData.pagination) {
        downloadData.pagination = {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        };
      }
      
      return downloadData;
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
