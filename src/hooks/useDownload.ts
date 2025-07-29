// Download management hook with API integration
import { useState } from "react";
import { downloadAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DownloadEligibility {
  canDownload: boolean;
  reason?: string;
  requiredPlan?: string;
  hasCredits?: boolean;
  creditType?: "standard" | "premium";
}

interface DownloadResult {
  success: boolean;
  remainingCredits?: {
    standard: number;
    premium: number;
  };
  message?: string;
}

export const useDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const getUserId = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch {
      return null;
    }
  };

  const checkEligibility = async (assetId: string): Promise<DownloadEligibility> => {
    setChecking(true);
    
    try {
      const response = await downloadAPI.checkEligibility(assetId);
      const data = response.data?.data || response.data;
      
      return {
        canDownload: data.canDownload || false,
        reason: data.reason,
        requiredPlan: data.requiredPlan,
        hasCredits: data.hasCredits,
        creditType: data.creditType
      };
    } catch (err: any) {
      console.error("Failed to check download eligibility:", err);
      return { 
        canDownload: false, 
        reason: err.response?.data?.message || "Unable to check eligibility" 
      };
    } finally {
      setChecking(false);
    }
  };

  const recordDownload = async (
    assetId: string, 
    type: "standard" | "premium" = "standard"
  ): Promise<DownloadResult> => {
    setDownloading(true);
    
    try {
      const userId = getUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await downloadAPI.recordDownload({
        userId,
        assetId,
        type
      });

      const data = response.data?.data || response.data;
      
      toast({
        title: "Download Complete! 🎉",
        description: `You have ${data.remainingCredits?.standard || 0} standard and ${data.remainingCredits?.premium || 0} premium credits left.`,
      });

      return {
        success: true,
        remainingCredits: data.remainingCredits,
        message: data.message
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Download failed";
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsset = async (
    assetId: string, 
    type: "standard" | "premium" = "standard"
  ): Promise<boolean> => {
    // Check eligibility first
    const eligibility = await checkEligibility(assetId);
    
    if (!eligibility.canDownload) {
      toast({
        title: "Download Not Available",
        description: eligibility.reason || "You don't have permission to download this asset",
        variant: "destructive"
      });
      return false;
    }

    // Record the download
    const result = await recordDownload(assetId, type);
    return result.success;
  };

  const getUserDownloads = async () => {
    const userId = getUserId();
    if (!userId) return [];

    try {
      const response = await downloadAPI.getUserDownloads(userId);
      return response.data?.data || response.data || [];
    } catch (err: any) {
      console.error("Failed to fetch user downloads:", err);
      return [];
    }
  };

  return {
    downloadAsset,
    checkEligibility,
    recordDownload,
    getUserDownloads,
    downloading,
    checking
  };
};