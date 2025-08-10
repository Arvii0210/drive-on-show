import axios from 'axios';
import { apiConfig } from '@/config/api';

export interface DownloadEligibility {
  canDownload: boolean;
  dailyFreeDownloads: number;
  lastFreeDownloadDate: string | null;
  planType: 'FREE' | 'PREMIUM';
  remainingDownloads: number;
  message?: string;
}

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export const DownloadService = {
  async initiateDownload(assetId: number): Promise<{ success: boolean; message: string; }> {
    try {
      const response = await axios.post(`${apiConfig.baseURL}/downloads/initiate`, {
        assetId
      }, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
        return { 
          message: (response.data as any).message || 'Download successful', 
          success: true 
        };
      } else {
        return { 
          message: (response.data as any)?.message || 'Download failed', 
          success: false 
        };
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Download failed';
        
        if (status === 403 && message.includes('Daily free download limit exceeded')) {
          throw new Error('Daily free download limit exceeded. Try again tomorrow.');
        }
        
        throw new Error(message);
      }
      
      throw new Error('Network error occurred');
    }
  },

  async checkEligibility(assetId: number): Promise<DownloadEligibility> {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/downloads/eligibility/${assetId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
        return (response.data as any).data || {};
      } else {
        throw new Error((response.data as any)?.message || 'Failed to check eligibility');
      }
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to check download eligibility');
      }
      throw new Error('Network error occurred');
    }
  },

  async getDownloadHistory(): Promise<any[]> {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/downloads/history`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.data && typeof response.data === 'object' && 'success' in response.data && response.data.success) {
        return (response.data as any).data || [];
      } else {
        throw new Error((response.data as any)?.message || 'Failed to get download history');
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch download history');
    }
  },
};