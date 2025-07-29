import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge2";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Check,
  Calendar,
  Gift,
} from "lucide-react";

interface PlanCardProps {
  id: string;
  displayName: string;
  type: string;
  price: number;
  premiumDownloads: number;
  standardDownloads: number;
  duration: number;
  description?: string;
  onBuy: () => void;
  isActive: boolean;
  isLoggedIn: boolean;
  large?: boolean;
  accent?: "green" | "purple" | "yellow" | "orange" | "blue";
  badge?: string;
}

const accentClasses: Record<string, string> = {
  green: "bg-green-50 border-green-500",
  purple: "bg-purple-50 border-purple-500",
  yellow: "bg-yellow-50 border-yellow-500",
  orange: "bg-orange-50 border-orange-500",
  blue: "bg-blue-50 border-blue-500",
};

const PlanCard: React.FC<PlanCardProps> = ({
  displayName,
  type,
  price,
  premiumDownloads,
  standardDownloads,
  duration,
  description,
  onBuy,
  isActive,
  isLoggedIn,
  large = false,
  accent,
  badge,
}) => {
  const isFree = type === "FREE";

  const renderButtonText = () => {
    if (isActive) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Check className="h-4 w-4" />
          Active Plan
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2">
        {isFree ? "Start for Free" : `Switch to this Plan ₹${price}`}
      </div>
    );
  };

  const handleClick = () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
    } else {
      onBuy();
    }
  };

  const cardBaseClasses = `
    relative border-2 rounded-3xl shadow-md transition-all duration-300 ease-in-out
    flex flex-col justify-between items-center text-center
  `;
  const cardSize = large ? "w-full min-h-[460px] p-8" : "w-full p-5";
  const cardAccent = accent ? accentClasses[accent] : "bg-white border-gray-200";
  const cardClasses = `${cardBaseClasses} ${cardSize} ${cardAccent}`;

  return (
    <motion.div className={cardClasses} whileHover={{ scale: isActive ? 1 : 1.03 }}>
      {(badge || isFree) && (
        <div className="absolute top-5 left-5">
          <Badge variant={badge ? "primary" : "success"}>
            {badge || "FREE"}
          </Badge>
        </div>
      )}

      <div className="w-full flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-1">{displayName}</h3>
        <div className="text-4xl font-extrabold text-indigo-700 mb-2">
          ₹{isFree ? 0 : price}
        </div>
        <p className="text-gray-500 mb-4">
          {duration} {isFree ? "Days Free Access" : "Days Validity"}
        </p>

        <div className="w-full text-left gap-2 mb-6">
          {premiumDownloads > 0 && (
            <div className="flex items-center gap-2 text-green-700">
              <Sparkles size={18} />
              {premiumDownloads} Premium Downloads
            </div>
          )}
          {standardDownloads > 0 && (
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 size={18} />
              {standardDownloads} Standard Downloads
            </div>
          )}
          <div className="flex items-center gap-2 text-purple-700">
            <Calendar size={18} />
            {duration} Days Validity
          </div>
          {description?.includes("🎁") && (
            <div className="flex items-center gap-2 text-red-700">
              <Gift size={18} />
              {description}
            </div>
          )}
        </div>

        <Button
          onClick={handleClick}
          disabled={isActive}
          className={`w-full py-3 text-lg ${
            isActive ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
          }`}
          variant={isActive ? "outline" : isFree ? "secondary" : "default"}
        >
          {renderButtonText()}
        </Button>
      </div>
    </motion.div>
  );
};

export default PlanCard;
