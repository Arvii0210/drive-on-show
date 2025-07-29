// src/components/DownloadButton.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Lock, Crown } from "lucide-react";
import { useDownload } from "@/hooks/useDownload";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface DownloadButtonProps {
  assetId: string;
  type?: "standard" | "premium";
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  assetId,
  type = "standard",
  className = "",
  variant = "default"
}) => {
  const { downloadAsset, downloading } = useDownload(() => {});
  const { user } = useAuth();
  const [eligibility, setEligibility] = useState<any>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const handleDownload = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return;
    }

    const success = await downloadAsset(assetId, type);
    if (success) {
      // Optional: trigger actual file download here
      // window.open(`/api/assets/${assetId}/download`, '_blank');
    }
  };

  const checkEligibilityOnHover = async () => {
    if (!user || eligibility !== null || checkingEligibility) return;
    
    setCheckingEligibility(true);
    try {
      const response = await fetch(`/api/subscription/can-download/${assetId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEligibility(data);
      }
    } catch (err) {
      console.error("Failed to check eligibility:", err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  if (!user) {
    return (
      <Link to="/login">
        <Button variant={variant} className={className}>
          <Lock className="w-4 h-4 mr-2" />
          Login to Download
        </Button>
      </Link>
    );
  }

  if (eligibility && !eligibility.canDownload) {
    return (
      <Link to="/plans">
        <Button variant="outline" className={className}>
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Download
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleDownload}
      onMouseEnter={checkEligibilityOnHover}
      disabled={downloading || checkingEligibility}
    >
      <Download className="w-4 h-4 mr-2" />
      {downloading ? "Downloading..." : checkingEligibility ? "Checking..." : `Download ${type === "premium" ? "HD" : ""}`}
    </Button>
  );
};

export default DownloadButton;