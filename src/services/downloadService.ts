import { supabase } from "@/integrations/supabase/client";

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

export const downloadService = {
  // Check download eligibility
  async checkEligibility(userId: string, assetId: string, subscriptionId?: string): Promise<DownloadEligibility> {
    try {
      console.log('Checking eligibility for:', { userId, assetId, subscriptionId });
      
      const { data, error } = await supabase.functions.invoke('check-download-eligibility', {
        body: JSON.stringify({
          userId,
          assetId,
          subscriptionId
        })
      });

      if (error) {
        console.error('Eligibility check error:', error);
        throw new Error('Failed to check download eligibility');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to check download eligibility');
      }

      console.log('Eligibility response:', data.message);
      return data.message;
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
      console.log('Recording download for:', { userId, assetId, subscriptionId, isFree });
      
      const { data, error } = await supabase.functions.invoke('record-download', {
        body: JSON.stringify({
          userId,
          assetId,
          subscriptionId,
          isFree
        })
      });

      if (error) {
        console.error('Download record error:', error);
        throw new Error('Failed to record download');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to record download');
      }

      console.log('Download recorded:', data.message);
      return data.message;
    } catch (error) {
      console.error('Failed to record download:', error);
      throw new Error('Failed to record download');
    }
  },

  // Get user download history
  async getUserDownloads(userId: string, page: number = 1, limit: number = 10, category?: string): Promise<DownloadHistory> {
    try {
      console.log('Fetching user downloads for:', { userId, page, limit, category });
      
      const { data, error } = await supabase.functions.invoke('get-user-downloads', {
        body: JSON.stringify({
          userId,
          page,
          limit,
          category
        })
      });

      if (error) {
        console.error('Get downloads error:', error);
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

      if (!data.success) {
        console.error('Get downloads failed:', data.message);
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

      console.log('Downloads fetched:', data.message);
      return data.message;
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