// src/components/PlanCard.tsx
import React from "react";
import { Badge } from "@/components/ui/badge2";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Check, Calendar, Gift } from "lucide-react";

interface PlanCardProps {
  id: string;
  displayName: string;
  type: string;
  price: number;
  premiumDownloads: number;
  standardDownloads: number;
  duration: number;
  description?: string;
  features?: string[];
  popular?: boolean;
  bestValue?: boolean;
  onBuy: () => void;
  isActive: boolean;
  isLoggedIn: boolean;
  loading?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  displayName,
  type,
  price,
  premiumDownloads,
  standardDownloads,
  duration,
  description,
  features = [],
  popular = false,
  bestValue = false,
  onBuy,
  isActive,
  isLoggedIn,
  loading = false
}) => {
  const isFree = type === "FREE";

  const renderButtonText = () => {
    if (isActive) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Check className="h-4 w-4" /> Active
        </div>
      );
    }
    return isFree ? "Start for Free" : `Subscribe Now ₹${price}`;
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      onBuy();
    }
  };

  const isDisabled = isActive;

  const getCardStyle = () => {
    if (bestValue) return "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg";
    if (popular) return "border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg";
    if (isFree) return "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50";
    return "border-border bg-card hover:shadow-md";
  };

  const getBadge = () => {
    if (bestValue) return "BEST VALUE";
    if (popular) return "POPULAR";
    if (isFree) return "FREE";
    return null;
  };

  const badgeText = getBadge();

  return (
    <motion.div
      className={`relative rounded-2xl p-6 transition-all duration-300 ${getCardStyle()}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {badgeText && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant={bestValue ? "primary" : popular ? "secondary" : "success"}>
            {badgeText}
          </Badge>
        </div>
      )}

      <div className="w-full flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-1">{displayName}</h3>
        <div className="text-4xl font-extrabold text-indigo-700 mb-2">
          ₹{isFree ? 0 : price}
        </div>
        <p className="text-gray-500 mb-4">{duration} {isFree ? "Days Free Access" : "Days Validity"}</p>

        <div className="w-full text-left gap-2 mb-6">
          {premiumDownloads > 0 && (
            <div className="flex items-center gap-2 text-green-700">
              <Sparkles size={18} /> {premiumDownloads} Premium Downloads
            </div>
          )}
          {standardDownloads > 0 && (
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 size={18} /> {standardDownloads} Standard Downloads
            </div>
          )}
          <div className="flex items-center gap-2 text-purple-700">
            <Calendar size={18} /> {duration} Days Validity
          </div>
          {description?.includes("🎁") && (
            <div className="flex items-center gap-2 text-red-700">
              <Gift size={18} /> {description}
            </div>
          )}
        </div>

        <Button
          className={`w-full py-3 text-lg ${isActive ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
          onClick={handleClick}
          disabled={isDisabled}
          variant={isFree && !isActive ? "secondary" : isActive ? "outline" : "default"}
        >
          {renderButtonText()}
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanCard;