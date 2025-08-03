import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { downloadService } from "@/services/downloadService";
import { useAuth } from "@/context/AuthContext";

export const useDownload = (refreshSubscription?: () => void) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const downloadAsset = async (assetId: string, type: "standard" | "premium" = "standard") => {
    if (!user) {
      toast({ 
        title: "Login Required", 
        description: "Please login to download assets", 
        variant: "destructive" 
      });
      return false;
    }

    setDownloading(true);
    try {
      // First check eligibility
      const eligibility = await downloadService.checkEligibility(
        user.id, 
        assetId
      );

      if (!eligibility.canDownload) {
        let title = "Download Failed";
        let description = eligibility.reason || "Unable to download this asset";
        
        // Provide specific toast messages based on conditions
        if (eligibility.reason?.includes("quota") || eligibility.reason?.includes("limit")) {
          title = "Quota Exceeded";
          description = "You've reached your download limit.";
        } else if (eligibility.reason?.includes("premium") || eligibility.reason?.includes("upgrade")) {
          title = "Upgrade Required";
          description = "Upgrade to download premium assets.";
        }
        
        toast({ title, description, variant: "destructive" });
        return false;
      }

      // Record the download
      const downloadResult = await downloadService.recordDownload(
        user.id,
        assetId,
        eligibility.subscriptionId,
        eligibility.isFree
      );

      // Start the actual file download
      if (downloadResult.fileUrl) {
        const link = document.createElement('a');
        link.href = downloadResult.fileUrl;
        link.download = downloadResult.download.asset.title || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({ 
        title: "Download Started", 
        description: "Your download has started successfully." 
      });
      
      // Refresh subscription data if callback provided
      if (refreshSubscription) {
        refreshSubscription();
      }
      
      return true;
    } catch (error) {
      console.error('Download error:', error);
      toast({ 
        title: "Download Failed", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
      return false;
    } finally {
      setDownloading(false);
    }
  };

  return { downloadAsset, downloading };
};
