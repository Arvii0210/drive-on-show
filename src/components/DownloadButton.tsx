// src/components/DownloadButton.tsx
import React from "react";
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
  isPremium?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  assetId,
  type = "standard",
  className = "",
  variant = "default",
  isPremium = false
}) => {
  const { downloadAsset, downloading } = useDownload();
  const { user } = useAuth();

  const handleDownload = async () => {
    if (!user) {
      return;
    }

    // Determine actual download type based on asset
    const downloadType = isPremium ? "premium" : "standard";
    await downloadAsset(assetId, downloadType);
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

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleDownload}
      disabled={downloading}
    >
      <Download className="w-4 h-4 mr-2" />
      {downloading ? "Downloading..." : `Download ${isPremium ? "HD" : "Free"}`}
    </Button>
  );
};

export default DownloadButton;