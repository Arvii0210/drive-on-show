import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { downloadService } from "@/services/downloadService";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { assetService } from "@/services/assetService";

export const useDownload = (refreshSubscription?: () => void) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { userSubscription } = useSubscription();

  const downloadAsset = async (assetId: string, type: "standard" | "premium" = "standard") => {
    console.log('=== DOWNLOAD START ===');
    console.log('Asset ID:', assetId);
    console.log('User ID:', user?.id);
    console.log('Download type:', type);

    if (!user) {
      console.log('No user found - showing login required toast');
      toast({ 
        title: "Login Required", 
        description: "Please login to download assets", 
        variant: "destructive" 
      });
      return false;
    }

    setDownloading(true);
    
    try {
      console.log('Step 1: Checking eligibility...');
      const eligibility = await downloadService.checkEligibility(
        user.id, 
        assetId, 
        userSubscription?.id
      );
      console.log('Step 1 complete - Eligibility result:', eligibility);

      if (!eligibility || !eligibility.canDownload) {
        console.log('Download not eligible. Reason:', eligibility?.reason);
        
        let title = "Download Failed";
        let description = eligibility?.reason || "Unable to download this asset";
        
        // Handle specific quota and subscription scenarios
        if (eligibility?.reason?.includes("quota") || eligibility?.reason?.includes("limit")) {
          title = "Credit Exceeded";
          if (eligibility.quotaInfo) {
            const resetTime = new Date(eligibility.quotaInfo.resetTime).toLocaleTimeString();
            description = `Daily limit reached. Credit resets at ${resetTime}. Try again tomorrow.`;
          } else {
            description = "You've reached your daily download limit. Try again tomorrow.";
          }
        } else if (eligibility?.reason?.includes("premium") || eligibility?.reason?.includes("upgrade")) {
          title = "Upgrade Required";
          description = "Upgrade to a premium plan to download premium assets.";
        } else if (eligibility?.reason?.includes("subscription")) {
          title = "Subscription Required";
          description = "A valid subscription is required to download this asset.";
        }
        
        toast({ title, description, variant: "destructive" });
        return false;
      }

      // Show quota information for successful eligibility
      if (eligibility.quotaInfo) {
        console.log('Quota info:', eligibility.quotaInfo);
        const { remainingToday, dailyLimit } = eligibility.quotaInfo;
        if (remainingToday <= 3) {
          toast({
            title: "Credit Warning",
            description: `You have ${remainingToday} downloads remaining today.`,
            variant: "default"
          });
        }
      }

      console.log('Step 2: Recording download...');
      
      // Determine if this is a free download based on the download type
      // Standard downloads should be free, premium downloads require subscription
      const isFreeDownload = type === "standard";
      
      // Validate that we have subscriptionId when isFree is false
      const subscriptionId = eligibility.subscriptionId || userSubscription?.id;
      if (!isFreeDownload && !subscriptionId) {
        console.error('No subscription ID available for paid download');
        toast({ 
          title: "Download Failed", 
          description: "Subscription required for this download", 
          variant: "destructive" 
        });
        return false;
      }
      
      const downloadResult = await downloadService.recordDownload(
        user.id,
        assetId,
        subscriptionId,
        isFreeDownload
      );
      console.log('Step 2 complete - Download result:', downloadResult);

      const fileUrl =
  downloadResult.fileUrl ||
  downloadResult?.download?.asset?.mainFile;

if (!downloadResult || !fileUrl) {
  console.error('No file URL in download result');
  toast({ 
    title: "Download Failed", 
    description: "File URL not available", 
    variant: "destructive" 
  });
  return false;
}


      console.log('Step 3: Starting file download...');
      console.log('File URL:', downloadResult.fileUrl);
      
      // Get the asset data to access the full-resolution image URL
      console.log('Step 3a: Fetching asset data for full-resolution URL...');
      const assetData = await assetService.getAssetById(assetId);
      
      if (!assetData) {
        console.error('Failed to fetch asset data');
        toast({ 
          title: "Download Failed", 
          description: "Unable to get asset information", 
          variant: "destructive" 
        });
        return false;
      }
      
      // Use the full-resolution image URL from asset data
      const downloadUrl = assetData.src || assetData.mainFile || assetData.fileUrl || downloadResult.fileUrl;
      console.log('Full-resolution URL:', downloadUrl);
      
      if (!downloadUrl) {
        console.error('No download URL available');
        toast({ 
          title: "Download Failed", 
          description: "Download URL not available", 
          variant: "destructive" 
        });
        return false;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = assetData.title || downloadResult.download?.asset?.title || `asset-${assetId}`;
      link.target = '_blank'; // Add this for better compatibility
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Step 3 complete - File download initiated');

      toast({ 
        title: "Download Started", 
        description: "Your download has started successfully." 
      });
      
      if (refreshSubscription) {
        console.log('Refreshing subscription data...');
        refreshSubscription();
      }
      
      console.log('=== DOWNLOAD SUCCESS ===');
      return true;

    } catch (error) {
      console.error('=== DOWNLOAD ERROR ===');
      console.error('Error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        assetId,
        userId: user.id
      });
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: "Download Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
      return false;
    } finally {
      setDownloading(false);
      console.log('=== DOWNLOAD END ===');
    }
  };

  return { downloadAsset, downloading };
};
