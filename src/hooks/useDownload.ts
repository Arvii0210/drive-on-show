// src/hooks/useDownload.ts
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DownloadEligibility {
  canDownload: boolean;
  reason?: string;
  requiredPlan?: string;
}

export const useDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const checkEligibility = async (assetId: string): Promise<DownloadEligibility> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/subscription/can-download/${assetId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      
      return { canDownload: false, reason: "Unable to check eligibility" };
    } catch (err) {
      console.error("Failed to check download eligibility:", err);
      return { canDownload: false, reason: "Network error" };
    }
  };

  const recordDownload = async (assetId: string, type: "standard" | "premium"): Promise<boolean> => {
    setDownloading(true);
    
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/download/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ assetId, type })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Download Complete!",
          description: `You have ${data.remainingCredits} ${type} credits left.`,
        });
        return true;
      }
      
      const errorData = await response.json();
      toast({
        title: "Download Failed",
        description: errorData.message || "Unable to download asset",
        variant: "destructive"
      });
      return false;
    } catch (err) {
      console.error("Failed to record download:", err);
      toast({
        title: "Download Error",
        description: "Network error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsset = async (assetId: string, type: "standard" | "premium" = "standard") => {
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
    return await recordDownload(assetId, type);
  };

  return {
    downloadAsset,
    checkEligibility,
    downloading
  };
};