import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useDownload = (refreshSubscription) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const downloadAsset = async (assetId, type = "standard") => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const eligibility = await fetch(`/api/subscription/can-download/${assetId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      if (!eligibility.canDownload) {
        toast({ title: "Not allowed", description: eligibility.reason || "", variant: "destructive" });
        return false;
      }

      const res = await fetch("/api/download/record", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ assetId, subscriptionId: eligibility.subscriptionId, isFree: eligibility.isFree })
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Download Complete!", description: `You have ${data.remainingCredits} ${type} credits left.` });
        refreshSubscription();
        return true;
      } else {
        toast({ title: "Failed", description: data.message || "", variant: "destructive" });
        return false;
      }
    } catch (err) {
      toast({ title: "Error", description: "Network error", variant: "destructive" });
      return false;
    } finally {
      setDownloading(false);
    }
  };

  return { downloadAsset, downloading };
};
