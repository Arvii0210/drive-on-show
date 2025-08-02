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
  Star,
  Crown,
  TrendingUp,
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
  badge,
}) => {
  const isFree = type === "FREE";

  const renderButtonText = () => {
    if (isActive) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Check className="h-5 w-5" />
          {isFree ? "Activated" : "Active Plan"}
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2">
        {isFree ? "Start for Free" : `Choose Plan`}
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

  // Card style: clean, white, subtle shadow, border, rounded
  const cardSize = large ? "w-full min-h-[480px] p-8" : "w-full p-6";
  const cardClasses = `relative rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-md flex flex-col items-center transition-all duration-200 ${cardSize} ${isActive ? 'ring-2 ring-blue-500' : ''}`;

  // Static badge (not floating/animated)
  const staticBadge = badge ? (
    <Badge
      variant="primary"
      className="absolute top-5 right-5 px-3 py-1 text-xs font-bold bg-yellow-400 text-white border-0"
    >
      {badge === "BEST VALUE" ? (
        <Crown className="inline-block w-4 h-4 mr-1 -mt-1" />
      ) : badge === "POPULAR" ? (
        <TrendingUp className="inline-block w-4 h-4 mr-1 -mt-1" />
      ) : null}
      {badge}
    </Badge>
  ) : null;

  // Plan icon
  const planIcon = isFree ? (
    <Sparkles className="w-8 h-8 text-blue-400" />
  ) : (
    <Star className="w-8 h-8 text-yellow-400" />
  );

  return (
    <motion.div
      className={cardClasses}
      whileHover={{ scale: isActive ? 1 : 1.03, boxShadow: isActive ? undefined : "0 8px 32px 0 rgba(99,102,241,0.10)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Static Badge */}
      {staticBadge}

      {/* Plan Icon */}
      <div className="flex justify-center items-center mb-4 mt-2">
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-full p-3 shadow-sm">
          {planIcon}
        </div>
      </div>

      {/* Plan Name & Price */}
      <h3 className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-white">
        {displayName}
      </h3>
      <div className="text-center mb-2">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
          {isFree ? "Free" : `₹${price}`}
        </span>
      </div>
      <p className="text-center text-gray-500 dark:text-gray-300 mb-4 text-base">
        {duration} {isFree ? "Days Free Access" : "Days Validity"}
      </p>

      {/* Features List */}
      <ul className="w-full mb-6 space-y-2">
        {premiumDownloads > 0 && (
          <li className="flex items-center gap-2 text-blue-700 font-medium">
            <Sparkles size={18} />
            {premiumDownloads} Premium Downloads
          </li>
        )}
        {standardDownloads > 0 && (
          <li className="flex items-center gap-2 text-green-700 font-medium">
            <CheckCircle2 size={18} />
            {standardDownloads} Standard Downloads
          </li>
        )}
        <li className="flex items-center gap-2 text-purple-700 font-medium">
          <Calendar size={18} />
          {duration} Days Validity
        </li>
        {description?.includes("🎁") && (
          <li className="flex items-center gap-2 text-pink-700 font-medium">
            <Gift size={18} />
            {description}
          </li>
        )}
      </ul>

      {/* Action Button */}
      <Button
        onClick={handleClick}
        disabled={isActive}
        className={`w-full py-3 text-base font-semibold rounded-xl shadow-sm transition-all duration-200 ${
          isActive
            ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        variant={isActive ? "outline" : "default"}
      >
        {renderButtonText()}
      </Button>
    </motion.div>
  );
};

export default PlanCard;
