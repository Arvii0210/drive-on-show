// Enhanced download button with full functionality
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Lock, Crown, Loader2 } from "lucide-react";
import { useDownload } from "@/hooks/useDownload";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface DownloadButtonProps {
  assetId: string;
  type?: "standard" | "premium";
  className?: string;
  variant?: "default" | "outline" | "secondary";
  showCreditsInfo?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  assetId,
  type = "standard",
  className = "",
  variant = "default",
  showCreditsInfo = false
}) => {
  const [eligibility, setEligibility] = useState<any>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const { downloadAsset, checkEligibility, downloading, checking } = useDownload();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkEligibilityOnHover = async () => {
    if (!hasChecked && user) {
      setHasChecked(true);
      const result = await checkEligibility(assetId);
      setEligibility(result);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const success = await downloadAsset(assetId, type);
    if (success) {
      setHasChecked(false);
      setEligibility(null);
    }
  };

  useEffect(() => {
    if (user && !hasChecked) {
      checkEligibilityOnHover();
    }
  }, [user]);

  if (!user) {
    return (
      <Button onClick={() => navigate("/login")} className={className} variant={variant}>
        <Lock className="h-4 w-4 mr-2" />
        Login to Download
      </Button>
    );
  }

  if (checking) {
    return (
      <Button disabled className={className} variant={variant}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (downloading) {
    return (
      <Button disabled className={className} variant={variant}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Downloading...
      </Button>
    );
  }

  if (eligibility && !eligibility.canDownload) {
    return (
      <Button onClick={() => navigate("/plans")} className={className} variant="outline">
        <Crown className="h-4 w-4 mr-2" />
        Upgrade Plan
      </Button>
    );
  }

  return (
    <Button onClick={handleDownload} className={className} variant={variant}>
      <Download className="h-4 w-4 mr-2" />
      {type === "premium" ? "Premium Download" : "Download"}
    </Button>
  );
};

export default DownloadButton;